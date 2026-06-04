import type { Metadata } from 'next'
import { SeoTypingPage } from '@/components/seo/SeoTypingPage'
import { SEO_PAGES, buildSeoMetadata } from '@/lib/seo'

export const metadata: Metadata = buildSeoMetadata(SEO_PAGES['typing-test'])

export default function TypingTestPage() {
  return <SeoTypingPage pageKey="typingTest" />
}
