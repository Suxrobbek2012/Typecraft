import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://typecraft.uz'

export default function robots(): MetadataRoute.Robots {
  const adminPath = process.env.ADMIN_SECRET_PATH || 'admin-dashboard'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', `/${adminPath}/`, '/api/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
