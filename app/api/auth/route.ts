import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password, uuid } = await request.json();
    
    if (!password || !uuid) {
      return NextResponse.json(
        { message: 'Mot de passe et UUID requis' },
        { status: 400 }
      );
    }

    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD non configuré');
      return NextResponse.json(
        { message: 'Configuration serveur manquante' },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { message: 'Mot de passe incorrect' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 