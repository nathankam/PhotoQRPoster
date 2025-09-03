'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Erreur de l\'application:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-6xl mb-4">💥</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Oups ! Une erreur s'est produite
          </h1>
          <p className="text-gray-600 mb-6">
            Désolé, quelque chose s'est mal passé. Veuillez réessayer.
          </p>
          
          <div className="space-y-3 mb-6">
            <p className="text-sm text-gray-500">
              Si le problème persiste, contactez l'administrateur.
            </p>
            <p className="text-xs text-gray-400 font-mono">
              Erreur: {error.message || 'Erreur inconnue'}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={reset}
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Réessayer
            </button>
            
            <Link
              href="/"
              className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 