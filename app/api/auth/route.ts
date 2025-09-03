import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password, uuid, isAdmin } = await request.json();
    
    // Authentification admin (pour la création d'utilisateurs)
    if (isAdmin) {
      if (!password) {
        return NextResponse.json(
          { message: 'Mot de passe admin requis' },
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
          { message: 'Mot de passe admin incorrect' },
          { status: 401 }
        );
      }

      return NextResponse.json({ success: true, isAdmin: true });
    }

    // Authentification utilisateur (pour l'upload d'images)
    if (!password || !uuid) {
      return NextResponse.json(
        { message: 'Mot de passe et UUID requis' },
        { status: 400 }
      );
    }

    // Importer la fonction de vérification
    const { verifyUserPassword } = await import('@/lib/db');
    
    const user = await verifyUserPassword(uuid, password);
    
    if (!user) {
      return NextResponse.json(
        { 
          error: 'INVALID_CREDENTIALS',
          message: 'Identifiants incorrects',
          details: 'L\'UUID ou le mot de passe fourni est incorrect'
        },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 