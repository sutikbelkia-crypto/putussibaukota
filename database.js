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
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000, // Max 5 detik untuk konek
  query_timeout: 5000           // Max 5 detik untuk satu query
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

    // Default Content
    const defaultContent = [
      ['hero_title', 'Sistem Informasi Kelurahan Putussibau Kota'],
      ['hero_subtitle', 'Pelayanan Cepat, Transparan, dan Profesional'],
      ['stats_villages', '12'],
      ['stats_population', '15.4k'],
      ['stats_digital', '100%'],
      ['stats_response', '24h'],
      ['site_name', 'Kelurahan Putussibau Kota'],
      ['footer_title', 'PUTUSSIBAU KOTA'],
      ['footer_subtitle', 'Kelurahan Putussibau Kota'],
      ['footer_copyright', '© 2026 Pemerintah Kelurahan Putussibau Kota. All Rights Reserved.']
    ];

    for (const [key, value] of defaultContent) {
      await client.query(`
        INSERT INTO content (key, value) 
        VALUES ($1, $2) 
        ON CONFLICT (key) DO NOTHING
      `, [key, value]);
    }

    // Default Menu Items
    const defaultMenu = [
      ['Beranda', '/', 1],
      ['Profil', '/profil', 2],
      ['Layanan', '/layanan', 3]
    ];

    for (const [label, link, order] of defaultMenu) {
      await client.query(`
        INSERT INTO menu_items (label, link, "order") 
        SELECT $1, $2, $3 
        WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE label = $1)
      `, [label, link, order]);
    }

    console.log('Database initialized and seeded successfully.');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    client.release();
  }
};

export default pool;
