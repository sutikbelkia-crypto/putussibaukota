import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  // Content table (Hero text, stats, etc)
  db.run(`CREATE TABLE IF NOT EXISTS content (
    key TEXT PRIMARY KEY,
    value TEXT
  )`);

  // Articles table (News)
  db.run(`CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    date TEXT,
    category TEXT,
    image TEXT,
    content TEXT
  )`);

  // Services table
  db.run(`CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    desc TEXT,
    icon TEXT,
    color TEXT
  )`);

  // Menu items table
  db.run(`CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT,
    link TEXT,
    "order" INTEGER
  )`);

  // Sub Menu table
  db.run(`CREATE TABLE IF NOT EXISTS sub_menu (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id INTEGER,
    label TEXT,
    link TEXT,
    "order" INTEGER,
    FOREIGN KEY(parent_id) REFERENCES menu_items(id)
  )`);

  // Static Pages table
  db.run(`CREATE TABLE IF NOT EXISTS static_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    slug TEXT UNIQUE,
    content TEXT,
    image TEXT
  )`);

  // Gallery Photos table
  db.run(`CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    image TEXT,
    album_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Gallery Albums table
  db.run(`CREATE TABLE IF NOT EXISTS albums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    cover_image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Gallery Videos table
  db.run(`CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    video_url TEXT,
    thumbnail TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Downloads table
  db.run(`CREATE TABLE IF NOT EXISTS downloads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    file_path TEXT,
    category TEXT
  )`);

  // Related Links table
  db.run(`CREATE TABLE IF NOT EXISTS related_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT,
    link TEXT
  )`);

  // OPD Links table
  db.run(`CREATE TABLE IF NOT EXISTS opd_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT,
    link TEXT
  )`);

  // Create default admin if not exists
  const username = 'admin';
  const salt = bcrypt.genSaltSync(10);
  const password = bcrypt.hashSync('admin123', salt);
  
  db.run("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)", [username, password]);

  // Insert default content
  const defaultContent = [
    ['hero_title', 'Sistem Informasi Kelurahan Putussibau Kota'],
    ['hero_subtitle', 'Pelayanan Cepat, Transparan, dan Profesional'],
    ['stats_villages', '12'],
    ['stats_population', '15.4k'],
    ['stats_digital', '100%'],
    ['stats_response', '24h'],
    ['site_name', 'Kelurahan Putussibau Kota'],
    ['site_address', 'Jl. Kom Yos Sudarso, Putussibau Kota'],
    ['site_email', 'putussibaukota@kapuashulukab.go.id'],
    ['site_phone', '+62 812-3456-7890'],
    ['footer_description', 'Portal informasi resmi Kelurahan Putussibau Kota, Kabupaten Kapuas Hulu. Melayani dengan sepenuh hati demi kemajuan daerah.'],
    ['footer_address', 'Jl. Kom Yos Sudarso, Kelurahan Putussibau Kota, Kabupaten Kapuas Hulu, Kalimantan Barat'],
    ['footer_phone', '(0561) 123-4567'],
    ['footer_email', 'putussibaukota@kapuashulukab.go.id'],
    ['footer_facebook', '#'],
    ['footer_twitter', '#'],
    ['footer_instagram', '#'],
    ['footer_copyright', '© 2026 Pemerintah Kelurahan Putussibau Kota. All Rights Reserved.'],
    ['footer_shortcut_1_label', 'Profil Kelurahan'],
    ['footer_shortcut_1_link', '#'],
    ['footer_shortcut_2_label', 'Struktur Organisasi'],
    ['footer_shortcut_2_link', '#'],
    ['footer_shortcut_3_label', 'Daftar Lingkungan'],
    ['footer_shortcut_3_link', '#'],
    ['footer_shortcut_4_label', 'Transparansi Anggaran'],
    ['footer_shortcut_4_link', '#'],
    ['footer_shortcut_5_label', 'Galeri Foto'],
    ['footer_shortcut_5_link', '#'],
    ['footer_service_1_label', 'E-KTP & KK'],
    ['footer_service_1_link', '#'],
    ['footer_service_2_label', 'Surat Keterangan'],
    ['footer_service_2_link', '#'],
    ['footer_service_3_label', 'Izin Mendirikan Bangunan'],
    ['footer_service_3_link', '#'],
    ['footer_service_4_label', 'Pengaduan Masyarakat'],
    ['footer_service_4_link', '#'],
    ['footer_logo_text', 'PK'],
    ['footer_logo_image', ''],
    ['footer_title', 'PUTUSSIBAU KOTA'],
    ['footer_subtitle', 'Kelurahan Putussibau Kota']
  ];

  const stmt = db.prepare("INSERT OR IGNORE INTO content (key, value) VALUES (?, ?)");
  defaultContent.forEach(item => stmt.run(item));
  stmt.finalize();

  // Insert default menu items
  const defaultMenu = [
    ['Beranda', '/', 1],
    ['Profil', '/profil', 2],
    ['Layanan', '/layanan', 3],
    ['Informasi', '#', 4]
  ];
  const menuStmt = db.prepare("INSERT OR IGNORE INTO menu_items (label, link, \"order\") SELECT ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM menu_items)");
  defaultMenu.forEach(item => menuStmt.run(item));
  menuStmt.finalize();
});

export default db;
