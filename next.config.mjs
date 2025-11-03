/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enable static export for GitHub Pages
  // basePath: Set this to your repository name if deploying to GitHub Pages subdirectory
  // Example: if your site is at username.github.io/neopets, set basePath to '/neopets'
  // Leave empty or undefined if deploying to root domain (username.github.io)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    unoptimized: true, // Required for static export
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  // Disable trailing slash for cleaner URLs
  trailingSlash: false,
  webpack: (config, { isServer }) => {
    // Exclude Node.js modules from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      }
    }
    return config
  },
}

export default nextConfig


