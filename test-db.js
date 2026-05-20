import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

// Tampilkan URL koneksi dengan menyembunyikan password demi keamanan
const maskedUrl = connectionString 
  ? connectionString.replace(/:([^:@]+)@/, ':******@') 
  : 'KOSONG / TIDAK DITEMUKAN';

console.log('----------------------------------------------------');
console.log('⚙️  MEMULAI DIAGNOSIS KONEKSI SUPABASE...');
console.log('URL Koneksi:', maskedUrl);
console.log('----------------------------------------------------');

if (!connectionString || connectionString.includes('YOUR_PASSWORD') || connectionString.includes('YOUR_PROJECT_ID')) {
  console.error('❌ ERROR: Anda belum memperbarui DATABASE_URL di file .env dengan password dan project ID Supabase Anda!');
  console.log('Silakan buka file .env dan isi dengan benar terlebih dahulu.');
  console.log('----------------------------------------------------');
  process.exit(1);
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 8000 // 8 detik timeout untuk pengujian
});

async function testConnection() {
  try {
    console.log('⏳ Menghubungkan ke Supabase (silakan tunggu)...');
    const client = await pool.connect();
    console.log('\n🚀 KONEKSI BERHASIL!');
    console.log('Aplikasi sukses terhubung ke PostgreSQL Supabase!');
    
    // Cek database aktif saat ini
    const dbNameRes = await client.query('SELECT current_database()');
    console.log('Nama database aktif:', dbNameRes.rows[0].current_database);
    
    const timeRes = await client.query('SELECT NOW()');
    console.log('Waktu server database:', timeRes.rows[0].now);
    
    client.release();
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ KONEKSI GAGAL!');
    console.error('====================================================');
    console.error('PESAN ERROR UTAMA:', err.message);
    console.error('====================================================');
    
    if (err.message.includes('timeout')) {
      console.log('Analisis: Koneksi mengalami timeout. Ini biasanya disebabkan oleh:');
      console.log('1. Host database di URL salah atau project ID Supabase tidak valid.');
      console.log('2. Jaringan internet Anda memblokir port 5432.');
      console.log('3. Password database Anda memiliki karakter khusus (seperti @, :, /, #) yang BELUM di-URL-encode.');
    } else if (err.message.includes('database "db_websiteptskota" does not exist')) {
      console.log('Analisis: Database bernama "db_websiteptskota" belum dibuat di server PostgreSQL Supabase Anda.');
      console.log('Solusi: Anda harus masuk ke SQL Editor Supabase Anda dan jalankan perintah:');
      console.log('   CREATE DATABASE db_websiteptskota;');
      console.log('Atau Anda bisa menggunakan database default Supabase yaitu "postgres" terlebih dahulu.');
    } else if (err.message.includes('password authentication failed')) {
      console.log('Analisis: Password yang Anda masukkan di file .env salah.');
    } else {
      console.log('Analisis: Terjadi kendala konfigurasi pada server Supabase atau URL koneksi.');
    }
    console.log('----------------------------------------------------');
    process.exit(1);
  }
}

testConnection();
