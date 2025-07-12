import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  /* config options here */
  async rewrites() {
    return {
      afterFiles: [
        {
          source: '/v1/:path*',
          destination: 'http://94.74.86.174:8080/api/:path*',
        },
      ],
      beforeFiles: [
        {
          source: '/v1/:path*',
          destination: 'http://94.74.86.174:8080/api/:path*',
        },
      ],
      fallback: [
        {
          source: '/v1/:path*',
          destination: 'http://94.74.86.174:8080/api/:path*',
        },
      ],
    }
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        has: [
          {
            type: 'header',
            key: 'x-redirect-me',
          },
        ],
        permanent: true,
      },
    ]
  },
  poweredByHeader: false,
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        },
      ],
    },
  ],
}

export default nextConfig
