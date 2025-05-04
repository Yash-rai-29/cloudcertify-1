/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'storage.googleapis.com'],
    unoptimized: true, // Disable image optimization for static export
  },
  output: 'export',
  poweredByHeader: false,
  generateEtags: false,
  distDir: 'out', // Use a different build directory
  trailingSlash: true,
  // Static exports require this to be true
  staticPageGenerationTimeout: 180,
  // Ensure proper asset prefixes for fonts and CSS
  assetPrefix: '',
  // We don't need to use exportPathMap as we'll handle this with Firebase rewrites
};

module.exports = nextConfig;
