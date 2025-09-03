'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function CreateUserPage() {
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Formulaire de création d'utilisateur
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [generatedUuid, setGeneratedUuid] = useState('');

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword, isAdmin: true }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setMessage('');
      } else {
        setMessage('Mot de passe admin incorrect');
      }
    } catch (error) {
      setMessage('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedUuid(data.uuid);
        setMessage('Utilisateur créé avec succès !');
        setEmail('');
        setPassword('');
      } else {
        const error = await response.json();
        setMessage(error.message || 'Erreur lors de la création');
      }
    } catch (error) {
      setMessage('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewUuid = () => {
    setGeneratedUuid(uuidv4());
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Création d'utilisateurs
          </h1>
          <p className="text-gray-600 mb-4 text-center">
            Accès réservé aux administrateurs
          </p>
          <form onSubmit={handleAdminAuth} className="space-y-4">
            <div>
              <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe administrateur
              </label>
              <input
                type="password"
                id="adminPassword"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
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
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Créer un nouvel utilisateur
        </h1>
        
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email de l'utilisateur
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe de l'utilisateur
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
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Création...' : 'Créer l\'utilisateur'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-sm ${message.includes('succès') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        {generatedUuid && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Utilisateur créé !</h3>
            <p className="text-blue-700 text-sm mb-3">
              Voici l'UUID généré pour cet utilisateur :
            </p>
            <div className="flex items-center space-x-2">
              <code className="bg-blue-100 px-3 py-2 rounded text-sm font-mono text-blue-800 flex-1">
                {generatedUuid}
              </code>
              <button
                onClick={generateNewUuid}
                className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
              >
                Nouveau UUID
              </button>
            </div>
            <div className="mt-3 text-xs text-blue-600">
              <p>• Page publique : <code className="bg-blue-100 px-1 rounded">/{generatedUuid}</code></p>
              <p>• Page admin : <code className="bg-blue-100 px-1 rounded">/admin/{generatedUuid}</code></p>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
} 