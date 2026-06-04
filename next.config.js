/** @type {import('next').NextConfig} */
const adminPath = process.env.ADMIN_SECRET_PATH || 'admin-dashboard'

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Security & Performance headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "connect-src 'self'",
            ].join('; '),
          },
        ],
      },
      // Block admin routes from being indexed
      {
        source: '/admin/(.*)',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: `/${adminPath}/(.*)`,
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ]
  },

  // Redirect old /admin to the configured secret admin path
  async redirects() {
    return [
      {
        source: '/admin',
        destination: `/${adminPath}`,
        permanent: true,
      },
      {
        source: '/admin/:path*',
        destination: `/${adminPath}/:path*`,
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
