import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'photoposter.db');

export interface User {
  uuid: string;
  email: string;
  password: string;
}

export interface Image {
  id: number;
  user_uuid: string;
  url: string;
  created_at: string;
}

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

export async function getUserByUuid(uuid: string): Promise<User | null> {
  return new Promise((resolve, reject) => {
    getDb().then(db => {
      db.get('SELECT * FROM users WHERE uuid = ?', [uuid], (err, row) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve(row as User | null);
      });
    }).catch(reject);
  });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return new Promise((resolve, reject) => {
    getDb().then(db => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve(row as User | null);
      });
    }).catch(reject);
  });
}

export async function getImagesByUserUuid(userUuid: string): Promise<Image[]> {
  return new Promise((resolve, reject) => {
    getDb().then(db => {
      db.all('SELECT * FROM images WHERE user_uuid = ? ORDER BY created_at DESC', [userUuid], (err, rows) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve(rows as Image[]);
      });
    }).catch(reject);
  });
}

export async function addImage(userUuid: string, url: string): Promise<{ id: number; changes: number }> {
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

export async function createUser(uuid: string, email: string, password: string): Promise<{ id: string; changes: number }> {
  return new Promise((resolve, reject) => {
    getDb().then(db => {
      // Vérifier si l'email existe déjà
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
          db.close();
          reject(err);
          return;
        }
        
        if (row) {
          db.close();
          reject(new Error('Un utilisateur avec cet email existe déjà'));
          return;
        }
        
        // Créer l'utilisateur
        db.run('INSERT INTO users (uuid, email, password) VALUES (?, ?, ?)', [uuid, email, password], function(err) {
          db.close();
          if (err) {
            reject(err);
            return;
          }
          resolve({ id: uuid, changes: this.changes });
        });
      });
    }).catch(reject);
  });
}

export async function verifyUserPassword(uuid: string, password: string): Promise<User | null> {
  return new Promise((resolve, reject) => {
    getDb().then(db => {
      db.get('SELECT * FROM users WHERE uuid = ? AND password = ?', [uuid, password], (err, row) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve(row as User | null);
      });
    }).catch(reject);
  });
}

// Fonction pour initialiser la base de données avec des données de test
export async function initializeTestData() {
  try {
    // Vérifier si des données existent déjà
    const existingUsers = await getUserByUuid('test-alice');
    if (existingUsers) {
      console.log('Base de données déjà initialisée');
      return;
    }

    console.log('Initialisation de la base de données SQLite avec des données de test...');
    
    // Créer des utilisateurs de test
    const testUsers = [
      { uuid: 'test-alice', email: 'alice@example.com', password: 'alice123' },
      { uuid: 'test-bob', email: 'bob@example.com', password: 'bob123' },
      { uuid: 'test-charlie', email: 'charlie@example.com', password: 'charlie123' }
    ];

    for (const user of testUsers) {
      await createUser(user.uuid, user.email, user.password);
      
      // Ajouter quelques images de test
      const testImages = [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ];

      for (const imageUrl of testImages) {
        await addImage(user.uuid, imageUrl);
      }
    }

    console.log('Base de données SQLite initialisée avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
  }
} 