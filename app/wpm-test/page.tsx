import type { Metadata } from 'next'
import { SeoTypingPage } from '@/components/seo/SeoTypingPage'
import { SEO_PAGES, buildSeoMetadata } from '@/lib/seo'

export const metadata: Metadata = buildSeoMetadata(SEO_PAGES['wpm-test'])

export default function WpmTestPage() {
  return <SeoTypingPage pageKey="wpmTest" />
}
