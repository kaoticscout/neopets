/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enable static export for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  // Disable trailing slash for cleaner URLs
  trailingSlash: false,
}

export default nextConfig


