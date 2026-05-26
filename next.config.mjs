/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Pin Turbopack root to this app (pnpm-lock.yaml lives here for v0; npm uses package-lock.json).
  turbopack: {
    root: import.meta.dirname,
  },
}

export default nextConfig
