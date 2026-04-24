import db from './database.js';

db.serialize(() => {
  // Check gallery columns
  db.all("PRAGMA table_info(gallery)", (err, rows) => {
    if (err) return console.error(err);
    const columns = rows.map(r => r.name);
    
    if (!columns.includes('album_id')) {
      db.run("ALTER TABLE gallery ADD COLUMN album_id INTEGER");
      console.log("Added album_id to gallery");
    }
    if (!columns.includes('created_at')) {
      db.run("ALTER TABLE gallery ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP");
      console.log("Added created_at to gallery");
    }
    
    // Ensure category column is removed or ignored if we're moving to album_id
    // But SQLite doesn't support DROP COLUMN easily before 3.35.0
    
    process.exit();
  });
});
