# 🚀 Panduan Deployment: GitHub + Vercel + Supabase

Panduan ini menjelaskan langkah-langkah untuk memindahkan database dari SQLite ke Supabase (PostgreSQL) dan mendeploy aplikasi Kelurahan Putussibau Kota ke Vercel agar data tetap tersimpan secara permanen.

## 1. Persiapan Supabase (Database Cloud)

Vercel tidak mendukung penyimpanan file SQLite secara permanen. Oleh karena itu, kita perlu menggunakan Supabase.

1.  **Buat Akun**: Daftar di [Supabase.com](https://supabase.com).
2.  **Buat Project**: Buat project baru, beri nama (misal: `putussibau-kota`).
3.  **Dapatkan Connection String**:
    *   Buka **Project Settings** > **Database**.
    *   Cari bagian **Connection String** dan pilih tab **URI**.
    *   Simpan URI tersebut (contoh: `postgresql://postgres:[PASSWORD]@db.[ID].supabase.co:5432/postgres`).
    *   *Catatan: Ganti [PASSWORD] dengan password database yang Anda buat.*

## 2. Migrasi Skema Database

Gunakan **SQL Editor** di dashboard Supabase untuk membuat tabel-tabel berikut:

```sql
-- Tabel Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT
);

-- Tabel Content
CREATE TABLE content (
    key TEXT PRIMARY KEY,
    value TEXT
);

-- Tabel Articles
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title TEXT,
    date TEXT,
    category TEXT,
    image TEXT,
    content TEXT
);

-- Tabel Services
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    title TEXT,
    "desc" TEXT,
    icon TEXT,
    color TEXT
);

-- Tabel Menu Items
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    label TEXT,
    link TEXT,
    "order" INTEGER
);

-- Tabel Sub Menu
CREATE TABLE sub_menu (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES menu_items(id),
    label TEXT,
    link TEXT,
    "order" INTEGER
);

-- Tabel Static Pages
CREATE TABLE static_pages (
    id SERIAL PRIMARY KEY,
    title TEXT,
    slug TEXT UNIQUE,
    content TEXT,
    image TEXT
);

-- Tabel Gallery
CREATE TABLE gallery (
    id SERIAL PRIMARY KEY,
    title TEXT,
    image TEXT,
    album_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tambahkan tabel lainnya (albums, videos, downloads, dll) sesuai kebutuhan.
```

## 3. Perubahan Kode di Local

Anda perlu mengganti library `sqlite3` dengan library PostgreSQL.

1.  **Install Library**:
    ```bash
    npm install pg
    ```

2.  **Update `database.js`**:
    Ubah koneksi agar menggunakan `pg.Pool` yang mengambil nilai dari `process.env.DATABASE_URL`.

3.  **Push ke GitHub**:
    Setelah kode diperbarui, push perubahan ke repositori GitHub Anda:
    ```bash
    git add .
    git commit -m "Update database to PostgreSQL/Supabase"
    git push origin main
    ```

## 4. Konfigurasi di Vercel

1.  **Hubungkan Repository**: Di Dashboard Vercel, pilih **New Project** dan hubungkan dengan repo GitHub Anda.
2.  **Environment Variables**: Di tab **Settings > Environment Variables**, tambahkan:
    *   `DATABASE_URL`: Masukkan Connection String Supabase Anda.
    *   `SECRET_KEY`: Masukkan kunci rahasia untuk JWT login.
    *   `NODE_ENV`: `production`.
3.  **Deploy**: Klik tombol **Deploy**.

## 5. Menangani File Upload (Penting!)

Folder `uploads/` di Vercel hanya bersifat sementara. Untuk solusi permanen:
*   Gunakan **Supabase Storage** untuk menyimpan gambar.
*   Update rute `/api/upload` di `server.js` agar mengunggah file ke Supabase Storage, bukan ke folder lokal.

---
*Dibuat oleh Antigravity AI - 2026*
