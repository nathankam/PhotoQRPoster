import { NextRequest, NextResponse } from 'next/server';
import { uploadToBlob } from '@/lib/blob';
import { addImage, getUserByUuid } from '@/lib/db';
import { sendImageNotification } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: { uuid: string } }
) {
  try {
    const { uuid } = params;
    
    // Vérifier que l'utilisateur existe
    const user = await getUserByUuid(uuid) as any;
    if (!user) {
      return NextResponse.json(
        { 
          error: 'USER_NOT_FOUND',
          message: 'Utilisateur non trouvé',
          details: 'L\'UUID fourni ne correspond à aucun utilisateur existant'
        },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    
    if (!imageFile) {
      return NextResponse.json(
        { message: 'Aucune image fournie' },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'Le fichier doit être une image' },
        { status: 400 }
      );
    }

    // Vérifier la taille (max 10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'L\'image doit faire moins de 10MB' },
        { status: 400 }
      );
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const extension = imageFile.name.split('.').pop();
    const filename = `${uuid}/${timestamp}.${extension}`;

    // Upload vers Vercel Blob
    const imageUrl = await uploadToBlob(imageFile, filename);

    // Sauvegarder dans la base de données
    await addImage(uuid, imageUrl);

    // Envoyer l'email de notification
    try {
      const siteUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'http://localhost:3000';
      
      await sendImageNotification(user.email, uuid, siteUrl);
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      // On continue même si l'email échoue
    }

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      message: 'Image uploadée avec succès' 
    });

  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    return NextResponse.json(
      { message: 'Erreur lors de l\'upload de l\'image' },
      { status: 500 }
    );
  }
} 