import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Ignore TypeScript and ESLint errors during Vercel build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig