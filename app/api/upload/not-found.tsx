import Link from 'next/link';

export default function UploadNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-6xl mb-4">📤</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Route d'upload non trouvée
          </h1>
          <p className="text-gray-600 mb-6">
            L'utilisateur pour lequel vous essayez d'uploader une image n'existe pas.
          </p>
          
          <div className="space-y-3 mb-6">
            <p className="text-sm text-gray-500">
              Vérifiez que l'UUID dans l'URL est correct.
            </p>
            <p className="text-sm text-gray-500">
              L'utilisateur doit exister avant de pouvoir recevoir des images.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retour à l'accueil
            </Link>
            
            <Link
              href="/create"
              className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Créer un nouvel utilisateur
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 