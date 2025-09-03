import { initializeTestData } from '../lib/db';

async function seed() {
  console.log('🌱 Initialisation de la base de données SQLite...');
  
  try {
    await initializeTestData();
    console.log('🎉 Base de données SQLite initialisée avec succès !');
    console.log('\n📋 Utilisateurs de test créés :');
    console.log('   alice@example.com (test-alice) - mot de passe: alice123');
    console.log('   bob@example.com (test-bob) - mot de passe: bob123');
    console.log('   charlie@example.com (test-charlie) - mot de passe: charlie123');
    console.log('\n🔗 URLs de test :');
    console.log('   Page publique Alice: /test-alice');
    console.log('   Page admin Alice: /admin/test-alice');
    console.log('   Page publique Bob: /test-bob');
    console.log('   Page admin Bob: /admin/test-bob');
    console.log('   Page publique Charlie: /test-charlie');
    console.log('   Page admin Charlie: /admin/test-charlie');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  }
}

seed().catch(console.error); 