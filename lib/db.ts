import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'photoposter.db');

export async function getDb() {
  return new Promise<sqlite3.Database>((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
        return;
      }
      
      // Créer les tables si elles n'existent pas
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          uuid TEXT PRIMARY KEY,
          email TEXT NOT NULL,
          password TEXT NOT NULL
        )
      `, (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        db.run(`
          CREATE TABLE IF NOT EXISTS images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_uuid TEXT NOT NULL,
            url TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_uuid) REFERENCES users (uuid)
          )
        `, (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(db);
        });
      });
    });
  });
}

export async function getUserByUuid(uuid: string) {
  return new Promise((resolve, reject) => {
    getDb().then(db => {
      db.get('SELECT * FROM users WHERE uuid = ?', [uuid], (err, row) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    }).catch(reject);
  });
}

export async function getImagesByUserUuid(userUuid: string) {
  return new Promise((resolve, reject) => {
    getDb().then(db => {
      db.all('SELECT * FROM images WHERE user_uuid = ? ORDER BY created_at DESC', [userUuid], (err, rows) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    }).catch(reject);
  });
}

export async function addImage(userUuid: string, url: string) {
  return new Promise((resolve, reject) => {
    getDb().then(db => {
      db.run('INSERT INTO images (user_uuid, url) VALUES (?, ?)', [userUuid, url], function(err) {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve({ id: this.lastID, changes: this.changes });
      });
    }).catch(reject);
  });
}

export async function createUser(uuid: string, email: string, password: string) {
  return new Promise((resolve, reject) => {
    getDb().then(db => {
      db.run('INSERT INTO users (uuid, email, password) VALUES (?, ?, ?)', [uuid, email, password], function(err) {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve({ id: this.lastID, changes: this.changes });
      });
    }).catch(reject);
  });
}

export async function verifyUserPassword(uuid: string, password: string) {
  return new Promise((resolve, reject) => {
    getDb().then(db => {
      db.get('SELECT * FROM users WHERE uuid = ? AND password = ?', [uuid, password], (err, row) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    }).catch(reject);
  });
} 