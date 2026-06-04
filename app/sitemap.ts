import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://typecraft.uz'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,                  lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/typing-test`,       lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE}/wpm-test`,          lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE}/typing-speed-test`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE}/practice`,          lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/leaderboard`, lastModified: new Date(), changeFrequency: 'hourly',  priority: 0.8 },
    { url: `${BASE}/donate`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/settings`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/auth/login`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]
}
