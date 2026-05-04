import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Gunakan DATABASE_URL dari environment variable (Supabase)
// Jika tidak ada, gunakan default (untuk mencegah error saat build)
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false // Diperlukan untuk koneksi ke Supabase/Heroku
  }
});

export const initDb = async () => {
  const client = await pool.connect();
  try {
    console.log('Initializing PostgreSQL database...');
    
    // Users table
    await client.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT
    )`);

    // Content table
    await client.query(`CREATE TABLE IF NOT EXISTS content (
      key TEXT PRIMARY KEY,
      value TEXT
    )`);

    // Articles table
    await client.query(`CREATE TABLE IF NOT EXISTS articles (
      id SERIAL PRIMARY KEY,
      title TEXT,
      date TEXT,
      category TEXT,
      image TEXT,
      content TEXT
    )`);

    // Services table
    await client.query(`CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      title TEXT,
      "desc" TEXT,
      icon TEXT,
      color TEXT
    )`);

    // Menu items table
    await client.query(`CREATE TABLE IF NOT EXISTS menu_items (
      id SERIAL PRIMARY KEY,
      label TEXT,
      link TEXT,
      "order" INTEGER
    )`);

    // Sub Menu table
    await client.query(`CREATE TABLE IF NOT EXISTS sub_menu (
      id SERIAL PRIMARY KEY,
      parent_id INTEGER REFERENCES menu_items(id),
      label TEXT,
      link TEXT,
      "order" INTEGER
    )`);

    // Static Pages table
    await client.query(`CREATE TABLE IF NOT EXISTS static_pages (
      id SERIAL PRIMARY KEY,
      title TEXT,
      slug TEXT UNIQUE,
      content TEXT,
      image TEXT
    )`);

    // Gallery table
    await client.query(`CREATE TABLE IF NOT EXISTS gallery (
      id SERIAL PRIMARY KEY,
      title TEXT,
      image TEXT,
      album_id INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Albums table
    await client.query(`CREATE TABLE IF NOT EXISTS albums (
      id SERIAL PRIMARY KEY,
      title TEXT,
      description TEXT,
      cover_image TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Videos table
    await client.query(`CREATE TABLE IF NOT EXISTS videos (
      id SERIAL PRIMARY KEY,
      title TEXT,
      video_url TEXT,
      thumbnail TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Default Admin
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('admin123', salt);
    await client.query(`
      INSERT INTO users (username, password) 
      VALUES ($1, $2) 
      ON CONFLICT (username) DO NOTHING
    `, ['admin', hashedPassword]);

    console.log('Database initialized successfully.');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    client.release();
  }
};

export default pool;
