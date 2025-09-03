import { getDb } from '../lib/db';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  const db = await getDb();

  // Ajouter quelques utilisateurs fictifs
  const users = [
    { uuid: uuidv4(), email: 'alice@example.com', password: 'alice123' },
    { uuid: uuidv4(), email: 'bob@example.com', password: 'bob123' },
    { uuid: uuidv4(), email: 'charlie@example.com', password: 'charlie123' },
  ];

  console.log('🌱 Seeding database...');

  for (const user of users) {
    try {
      await db.run('INSERT OR REPLACE INTO users (uuid, email, password) VALUES (?, ?, ?)', [
        user.uuid,
        user.email,
        user.password,
      ]);
      console.log(`✅ Added user: ${user.email} (${user.uuid})`);
    } catch (error) {
      console.error(`❌ Error adding user ${user.email}:`, error);
    }
  }

  // Ajouter quelques images d'exemple
  const sampleImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  ];

  for (const user of users) {
    for (const imageUrl of sampleImages) {
      try {
        await db.run('INSERT INTO images (user_uuid, url) VALUES (?, ?)', [
          user.uuid,
          imageUrl,
        ]);
        console.log(`✅ Added image for ${user.email}`);
      } catch (error) {
        console.error(`❌ Error adding image for ${user.email}:`, error);
      }
    }
  }

  await db.close();
  console.log('🎉 Database seeded successfully!');
  console.log('\n📋 Sample UUIDs to test:');
  users.forEach(user => {
    console.log(`   ${user.email}: ${user.uuid}`);
  });
}

seed().catch(console.error); 