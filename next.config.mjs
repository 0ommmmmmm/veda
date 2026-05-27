/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  allowedDevOrigins: ["10.27.95.2"],

  // Pin Turbopack root to this app
  turbopack: {
    root: import.meta.dirname,
  },
}

export default nextConfig