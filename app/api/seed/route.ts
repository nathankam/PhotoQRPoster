import { NextResponse } from 'next/server';
import { initializeTestData } from '@/lib/kv';

export async function POST() {
  try {
    console.log('🌱 Initialisation de la base de données Vercel KV...');
    
    await initializeTestData();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Base de données Vercel KV initialisée avec succès',
      users: [
        { uuid: 'test-alice', email: 'alice@example.com', password: 'alice123' },
        { uuid: 'test-bob', email: 'bob@example.com', password: 'bob123' },
        { uuid: 'test-charlie', email: 'charlie@example.com', password: 'charlie123' }
      ]
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de l\'initialisation de la base de données',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Utilisez POST pour initialiser la base de données',
    method: 'POST'
  });
} 