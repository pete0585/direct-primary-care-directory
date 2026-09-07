import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  // Sitemap reads city page files at runtime; include them in the serverless trace.
  outputFileTracingIncludes: {
    '/sitemap.xml': ['./app/dpc-doctors/**/page.tsx'],
  },
}

export default nextConfig
