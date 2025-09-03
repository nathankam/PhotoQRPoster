export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        PhotoPoster 📸
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Partagez des images avec vos amis
      </p>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
        <p className="text-gray-700 mb-4">
          Pour voir les images d'un ami, utilisez l'URL :
        </p>
        <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono">
          /[uuid-de-lami]
        </code>
        <p className="text-gray-500 text-sm mt-4">
          Remplacez [uuid-de-lami] par l'UUID de votre ami
        </p>
      </div>
    </div>
  )
} 