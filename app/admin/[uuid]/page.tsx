'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserByUuid } from '@/lib/db';

interface PageProps {
  params: {
    uuid: string;
  };
}

export default function AdminPage({ params }: PageProps) {
  const { uuid } = params;
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, uuid }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setMessage('');
      } else {
        setMessage('Mot de passe utilisateur incorrect');
      }
    } catch (error) {
      setMessage('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch(`/api/upload/${uuid}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('Image uploadée avec succès !');
        e.currentTarget.reset();
      } else {
        const error = await response.json();
        setMessage(error.message || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      setMessage('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Accès Utilisateur
          </h1>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe utilisateur
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Vérification...' : 'Se connecter'}
            </button>
          </form>
          {message && (
            <p className={`mt-4 text-sm ${message.includes('incorrect') ? 'text-red-600' : 'text-blue-600'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Upload d'image
        </h1>
        <form onSubmit={handleImageUpload} className="space-y-4">
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner une image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Upload en cours...' : 'Uploader l\'image'}
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-sm ${message.includes('succès') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
        <div className="mt-6 text-center">
          <a
            href={`/${uuid}`}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Voir le feed de l'utilisateur
          </a>
        </div>
      </div>
    </div>
  );
} 