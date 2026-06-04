'use client'

import { TypingEngine } from '@/components/typing/TypingEngine'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useLocale } from '@/components/layout/LocaleProvider'
import Link from 'next/link'

type SeoPageKey = 'typingTest' | 'wpmTest' | 'speedTest'

export function SeoTypingPage({ pageKey }: { pageKey: SeoPageKey }) {
  const { t } = useLocale()
  const content = t.seoPages[pageKey]
  const links = t.seoPages.links

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <header className="text-center px-4 pt-8 pb-2 max-w-2xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">{content.h1}</h1>
        <p className="text-sub text-sm leading-relaxed">{content.intro}</p>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <TypingEngine />
      </div>

      <aside className="max-w-4xl mx-auto px-4 pb-8 text-center">
        <p className="text-sub/60 text-xs font-mono">
          <Link href="/" className="text-accent hover:underline">{links.home}</Link>
          {' · '}
          <Link href="/wpm-test" className="text-accent hover:underline">{links.wpm}</Link>
          {' · '}
          <Link href="/typing-speed-test" className="text-accent hover:underline">{links.speed}</Link>
          {' · '}
          <Link href="/practice" className="text-accent hover:underline">{links.practice}</Link>
        </p>
      </aside>

      <Footer />
    </main>
  )
}
