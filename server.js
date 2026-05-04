import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './database.js';
import dotenv from 'dotenv';
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

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
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

// --- AUTH ROUTES ---

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ token, username: user.username });
  });
});

// --- GENERIC CRUD HELPER (for simple tables) ---
const setupCrud = (tableName, path) => {
  app.get(`/api/${path}`, (req, res) => {
    // Add sorting by 'order' if it exists in the table, otherwise by id
    const orderBy = tableName === 'menu_items' || tableName === 'sub_menu' ? 'ORDER BY "order" ASC' : 'ORDER BY id DESC';
    db.all(`SELECT * FROM "${tableName}" ${orderBy}`, [], (err, rows) => {
      if (err) {
        console.error(`Error fetching from ${tableName}:`, err);
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });

  app.post(`/api/${path}`, authenticateToken, (req, res) => {
    // Filter out 'id' if it accidentally exists in req.body
    const { id, ...data } = req.body;
    const keys = Object.keys(data);
    const values = Object.values(data);
    
    if (keys.length === 0) return res.status(400).json({ message: 'No data provided' });

    const placeholders = keys.map(() => '?').join(',');
    const quotedKeys = keys.map(key => `"${key}"`).join(',');
    
    db.run(
      `INSERT INTO "${tableName}" (${quotedKeys}) VALUES (${placeholders})`,
      values,
      function(err) {
        if (err) {
          console.error(`Error inserting into ${tableName}:`, err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, message: 'Data created' });
      }
    );
  });

  app.put(`/api/${path}/:id`, authenticateToken, (req, res) => {
    // Filter out 'id' from req.body to avoid updating PK
    const { id, ...data } = req.body;
    const keys = Object.keys(data);
    const values = Object.values(data);
    
    if (keys.length === 0) return res.status(400).json({ message: 'No data provided' });

    const setClause = keys.map(key => `"${key}" = ?`).join(',');
    db.run(
      `UPDATE "${tableName}" SET ${setClause} WHERE id = ?`,
      [...values, req.params.id],
      function(err) {
        if (err) {
          console.error(`Error updating ${tableName}:`, err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Data updated' });
      }
    );
  });

  app.delete(`/api/${path}/:id`, authenticateToken, (req, res) => {
    db.run(`DELETE FROM "${tableName}" WHERE id = ?`, [req.params.id], function(err) {
      if (err) {
        console.error(`Error deleting from ${tableName}:`, err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Data deleted' });
    });
  });
};

// --- FILE UPLOAD ROUTE ---
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// --- CONTENT ROUTES ---

app.get('/api/content', (req, res) => {
  db.all("SELECT * FROM content", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const content = {};
    rows.forEach(row => content[row.key] = row.value);
    res.json(content);
  });
});

app.put('/api/content', authenticateToken, (req, res) => {
  const { content } = req.body;
  
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    const stmt = db.prepare("INSERT OR REPLACE INTO content (key, value) VALUES (?, ?)");
    
    Object.entries(content).forEach(([key, value]) => {
      stmt.run(key, value || '');
    });
    
    stmt.finalize();
    db.run("COMMIT", (err) => {
      if (err) {
        db.run("ROLLBACK");
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Content updated successfully' });
    });
  });
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
app.get('/api/users', authenticateToken, (req, res) => {
  db.all("SELECT id, username FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/users', authenticateToken, (req, res) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'User created' });
  });
});

app.put('/api/users/:id', authenticateToken, (req, res) => {
  const { username, password } = req.body;
  if (password) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    db.run("UPDATE users SET username = ?, password = ? WHERE id = ?", [username, hashedPassword, req.params.id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'User updated with new password' });
    });
  } else {
    db.run("UPDATE users SET username = ? WHERE id = ?", [username, req.params.id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'User updated' });
    });
  }
});

app.delete('/api/users/:id', authenticateToken, (req, res) => {
  db.run("DELETE FROM users WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User deleted' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
