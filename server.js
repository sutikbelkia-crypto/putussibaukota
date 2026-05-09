import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db, { initDb } from './database.js';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'bika_secret_key_2026';

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use('/uploads', express.static(uploadDir));

// Supabase Client Configuration
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
} else {
  console.warn('WARNING: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing. Supabase Storage features will be disabled.');
}

// Multer memory storage config (diperlukan untuk Vercel)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- HEALTH CHECK ROUTE ---
app.get('/api/db-check', async (req, res) => {
  console.log('Checking database connection...');
  try {
    // Jalankan initDb saat cek jika diperlukan
    await initDb();
    
    const result = await db.query('SELECT NOW()');
    const contentCount = await db.query('SELECT COUNT(*) FROM content');
    const menuCount = await db.query('SELECT COUNT(*) FROM menu_items');
    
    console.log('Database connected successfully');
    res.json({ 
      status: 'connected', 
      time: result.rows[0].now,
      data_stats: {
        content: contentCount.rows[0].count,
        menu_items: menuCount.rows[0].count
      },
      database: 'PostgreSQL/Supabase' 
    });
  } catch (err) {
    console.error('Database connection error:', err.message);
    res.status(500).json({ 
      status: 'error', 
      message: err.message,
      hint: 'Pastikan DATABASE_URL sudah diset dengan benar di Vercel'
    });
  }
});

// --- AUTH ROUTES ---

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- GENERIC CRUD HELPER ---
const setupCrud = (tableName, path) => {
  app.get(`/api/${path}`, async (req, res) => {
    const orderBy = tableName === 'menu_items' || tableName === 'sub_menu' ? 'ORDER BY "order" ASC' : 'ORDER BY id DESC';
    try {
      const result = await db.query(`SELECT * FROM "${tableName}" ${orderBy}`);
      res.json(result.rows);
    } catch (err) {
      console.error(`Error fetching from ${tableName}:`, err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post(`/api/${path}`, authenticateToken, async (req, res) => {
    const { id, ...data } = req.body;
    const keys = Object.keys(data);
    const values = Object.values(data);
    
    if (keys.length === 0) return res.status(400).json({ message: 'No data provided' });

    const placeholders = keys.map((_, i) => `$${i + 1}`).join(',');
    const quotedKeys = keys.map(key => `"${key}"`).join(',');
    
    try {
      const result = await db.query(
        `INSERT INTO "${tableName}" (${quotedKeys}) VALUES (${placeholders}) RETURNING id`,
        values
      );
      res.json({ id: result.rows[0].id, message: 'Data created' });
    } catch (err) {
      console.error(`Error inserting into ${tableName}:`, err);
      res.status(500).json({ error: err.message });
    }
  });

  app.put(`/api/${path}/:id`, authenticateToken, async (req, res) => {
    const { id, ...data } = req.body;
    const keys = Object.keys(data);
    const values = Object.values(data);
    
    if (keys.length === 0) return res.status(400).json({ message: 'No data provided' });

    const setClause = keys.map((key, i) => `"${key}" = $${i + 1}`).join(',');
    try {
      await db.query(
        `UPDATE "${tableName}" SET ${setClause} WHERE id = $${keys.length + 1}`,
        [...values, req.params.id]
      );
      res.json({ message: 'Data updated' });
    } catch (err) {
      console.error(`Error updating ${tableName}:`, err);
      res.status(500).json({ error: err.message });
    }
  });

  app.delete(`/api/${path}/:id`, authenticateToken, async (req, res) => {
    try {
      await db.query(`DELETE FROM "${tableName}" WHERE id = $1`, [req.params.id]);
      res.json({ message: 'Data deleted' });
    } catch (err) {
      console.error(`Error deleting from ${tableName}:`, err);
      res.status(500).json({ error: err.message });
    }
  });
};

// --- FILE UPLOAD ROUTE (SUPABASE STORAGE) ---
app.post('/api/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Supabase Storage is not configured' });
    }
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const fileName = `${Date.now()}-${req.file.originalname.replace(/\s/g, '_')}`;
    
    const { data, error } = await supabase.storage
      .from('images') // Pastikan bucket 'images' sudah dibuat di Supabase
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      });

    if (error) throw error;

    // Ambil URL publik file tersebut
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    res.json({ imageUrl: publicUrl });
  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ error: 'Gagal upload ke Supabase Storage', details: err.message });
  }
});

// --- CONTENT ROUTES ---

app.get('/api/content', async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM content");
    const content = {};
    result.rows.forEach(row => content[row.key] = row.value);
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/content', authenticateToken, async (req, res) => {
  const { content } = req.body;
  const client = await db.connect();
  
  try {
    await client.query("BEGIN");
    for (const [key, value] of Object.entries(content)) {
      await client.query(
        "INSERT INTO content (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
        [key, value || '']
      );
    }
    await client.query("COMMIT");
    res.json({ message: 'Content updated successfully' });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// --- SETUP CRUD FOR NEW TABLES ---
setupCrud('articles', 'articles');
setupCrud('services', 'services');
setupCrud('menu_items', 'menu');
setupCrud('sub_menu', 'submenu');
setupCrud('static_pages', 'static_pages');
setupCrud('gallery', 'gallery');
setupCrud('albums', 'albums');
setupCrud('videos', 'videos');
setupCrud('downloads', 'downloads');
setupCrud('related_links', 'related-links');
setupCrud('opd_links', 'opd-links');

// --- USERS MANAGEMENT ---
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const result = await db.query("SELECT id, username FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', authenticateToken, async (req, res) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  try {
    const result = await db.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
      [username, hashedPassword]
    );
    res.json({ id: result.rows[0].id, message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/users/:id', authenticateToken, async (req, res) => {
  const { username, password } = req.body;
  try {
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      await db.query(
        "UPDATE users SET username = $1, password = $2 WHERE id = $3",
        [username, hashedPassword, req.params.id]
      );
      res.json({ message: 'User updated with new password' });
    } else {
      await db.query(
        "UPDATE users SET username = $1 WHERE id = $2",
        [username, req.params.id]
      );
      res.json({ message: 'User updated' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    await db.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
