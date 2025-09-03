import { put } from '@vercel/blob';
import { NextRequest } from 'next/server';

export async function uploadToBlob(file: File, filename: string) {
  try {
    const blob = await put(filename, file, {
      access: 'public',
    });
    
    return blob.url;
  } catch (error) {
    console.error('Error uploading to blob:', error);
    throw new Error('Failed to upload image');
  }
} 