/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sqlite3'],
  },
  images: {
    domains: ['blob.vercel-storage.com'],
  },
}

module.exports = nextConfig 