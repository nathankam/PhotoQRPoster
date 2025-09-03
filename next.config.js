/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sqlite3'],
  },
  images: {
    domains: ['blob.vercel-storage.com', 'images.unsplash.com'],
  },
}

module.exports = nextConfig 