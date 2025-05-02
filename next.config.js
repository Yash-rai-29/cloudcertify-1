/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'storage.googleapis.com'],
  },
  // We need to bind to 0.0.0.0 and port 5000 for external access
  output: 'standalone',
};

module.exports = nextConfig;
