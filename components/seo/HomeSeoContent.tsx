'use client'

import Link from 'next/link'
import { useLocale } from '@/components/layout/LocaleProvider'

export function HomeSeoContent() {
  const { t } = useLocale()
  const cards = [
    { title: t.home.cardTyping, desc: t.home.cardTypingDesc, href: '/typing-test' },
    { title: t.home.cardWpm, desc: t.home.cardWpmDesc, href: '/wpm-test' },
    { title: t.home.cardPractice, desc: t.home.cardPracticeDesc, href: '/practice' },
  ]

  return (
    <section className="w-full max-w-4xl mx-auto px-4 pb-16 pt-4 border-t border-custom mt-8" aria-labelledby="seo-about">
      <h2 id="seo-about" className="font-display text-2xl font-bold mb-2 text-center">
        {t.home.seoTitle}
      </h2>
      <p className="text-sub text-sm text-center max-w-2xl mx-auto mb-10 leading-relaxed">
        {t.home.seoIntro}
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {cards.map(({ title, desc, href }) => (
          <Link
            key={href}
            href={href}
            className="block p-4 rounded-xl border border-custom bg-card hover:border-accent/50 hover:bg-accent/5 transition-all group"
          >
            <h3 className="font-display font-semibold text-accent group-hover:underline">{title}</h3>
            <p className="text-sub text-xs mt-1">{desc}</p>
          </Link>
        ))}
      </div>

      <h3 className="font-display text-lg font-semibold mb-4">{t.home.faqTitle}</h3>
      <dl className="space-y-4">
        {t.home.faq.map(({ q, a }) => (
          <div key={q}>
            <dt className="font-mono text-sm font-medium text-accent mb-1">{q}</dt>
            <dd className="text-sub text-sm leading-relaxed">{a}</dd>
          </div>
        ))}
      </dl>

      <p className="text-center text-sub/70 text-xs font-mono mt-10">
        {t.home.alsoTry}{' '}
        <Link href="/typing-speed-test" className="text-accent hover:underline">{t.home.speedTest}</Link>
        {' · '}
        <Link href="/leaderboard" className="text-accent hover:underline">{t.nav.leaderboard}</Link>
      </p>
    </section>
  )
}
