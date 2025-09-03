import { createClient } from 'redis';

// Types pour la base de données
export interface User {
  uuid: string;
  email: string;
  password: string;
}

export interface Image {
  id: string;
  user_uuid: string;
  url: string;
  created_at: string;
}

// Client Redis global
let redisClient: ReturnType<typeof createClient> | null = null;

// Initialiser le client Redis
async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    redisClient.on('error', (err) => {
      console.error('Erreur Redis:', err);
    });

    await redisClient.connect();
  }
  return redisClient;
}

// Clés pour Redis
const USERS_KEY = 'users';
const IMAGES_KEY = 'images';
const USER_EMAILS_KEY = 'user_emails'; // Index pour rechercher par email

// Fonctions de base de données
export async function getDb() {
  return await getRedisClient();
}

export async function getUserByUuid(uuid: string): Promise<User | null> {
  try {
    const client = await getRedisClient();
    const user = await client.hGet(USERS_KEY, uuid);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const client = await getRedisClient();
    const uuid = await client.hGet(USER_EMAILS_KEY, email);
    if (!uuid) return null;
    
    return await getUserByUuid(uuid);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur par email:', error);
    return null;
  }
}

export async function getImagesByUserUuid(userUuid: string): Promise<Image[]> {
  try {
    const client = await getRedisClient();
    const images = await client.zRange(`${IMAGES_KEY}:${userUuid}`, 0, -1, { REV: true });
    
    // Convertir les données JSON en objets Image
    const imageList: Image[] = [];
    for (const imageData of images) {
      try {
        const image = JSON.parse(imageData);
        imageList.push(image);
      } catch (e) {
        console.warn('Image malformée ignorée:', imageData);
      }
    }
    
    return imageList;
  } catch (error) {
    console.error('Erreur lors de la récupération des images:', error);
    return [];
  }
}

export async function addImage(userUuid: string, url: string): Promise<{ id: string; changes: number }> {
  try {
    const client = await getRedisClient();
    const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const image: Image = {
      id: imageId,
      user_uuid: userUuid,
      url,
      created_at: new Date().toISOString()
    };

    // Ajouter l'image à la liste de l'utilisateur
    await client.zAdd(`${IMAGES_KEY}:${userUuid}`, {
      score: Date.now(),
      value: JSON.stringify(image)
    });

    return { id: imageId, changes: 1 };
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'image:', error);
    throw new Error('Impossible d\'ajouter l\'image');
  }
}

export async function createUser(uuid: string, email: string, password: string): Promise<{ id: string; changes: number }> {
  try {
    const client = await getRedisClient();
    
    // Vérifier si l'email existe déjà
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    const user: User = {
      uuid,
      email,
      password
    };

    // Ajouter l'utilisateur
    await client.hSet(USERS_KEY, { [uuid]: JSON.stringify(user) });
    
    // Créer l'index email -> uuid
    await client.hSet(USER_EMAILS_KEY, { [email]: uuid });

    return { id: uuid, changes: 1 };
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    throw error;
  }
}

export async function verifyUserPassword(uuid: string, password: string): Promise<User | null> {
  try {
    const user = await getUserByUuid(uuid);
    if (!user || user.password !== password) {
      return null;
    }
    return user;
  } catch (error) {
    console.error('Erreur lors de la vérification du mot de passe:', error);
    return null;
  }
}

// Fonction pour initialiser la base de données avec des données de test
export async function initializeTestData() {
  try {
    const client = await getRedisClient();
    
    // Vérifier si des données existent déjà
    const existingUsers = await client.hGetAll(USERS_KEY);
    if (existingUsers && Object.keys(existingUsers).length > 0) {
      console.log('Base de données déjà initialisée');
      return;
    }

    console.log('Initialisation de la base de données Redis avec des données de test...');
    
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

    console.log('Base de données Redis initialisée avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
  }
}

// Fonction pour fermer la connexion Redis (utile pour les tests)
export async function closeConnection() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
} 