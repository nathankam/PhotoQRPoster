import { getUserByUuid, getImagesByUserUuid } from '@/lib/kv';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { User, Image as ImageType } from '@/lib/kv';

interface PageProps {
  params: {
    uuid: string;
  };
}

export default async function UserPage({ params }: PageProps) {
  const { uuid } = params;
  
  const user = await getUserByUuid(uuid) as User | undefined;
  if (!user) {
    notFound();
  }

  const images = await getImagesByUserUuid(uuid) as ImageType[];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Photos de {user.email}
        </h1>
        <p className="text-gray-600">
          {images.length} image{images.length !== 1 ? 's' : ''} partagée{images.length !== 1 ? 's' : ''}
        </p>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Aucune image partagée pour le moment
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {images.map((image: ImageType) => (
            <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={image.url}
                  alt="Image partagée"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500">
                  Partagée le {new Date(image.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 