import type { Metadata } from 'next'
import { SeoTypingPage } from '@/components/seo/SeoTypingPage'
import { SEO_PAGES, buildSeoMetadata } from '@/lib/seo'

export const metadata: Metadata = buildSeoMetadata(SEO_PAGES['typing-speed-test'])

export default function TypingSpeedTestPage() {
  return <SeoTypingPage pageKey="speedTest" />
}
