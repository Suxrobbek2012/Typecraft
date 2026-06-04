'use client'

import Link from 'next/link'
import { useLocale } from '@/components/layout/LocaleProvider'

export function Footer() {
  const { t } = useLocale()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-custom py-6 mt-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-sub">
        <div className="font-display font-bold text-base">
          Type<span className="text-accent">Craft</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link href="/typing-test" className="hover:text-accent transition-colors">{t.footer.typingTest}</Link>
          <Link href="/wpm-test" className="hover:text-accent transition-colors">{t.footer.wpmTest}</Link>
          <Link href="/practice" className="hover:text-accent transition-colors">{t.footer.practice}</Link>
          <Link href="/leaderboard" className="hover:text-accent transition-colors">{t.footer.leaderboard}</Link>
          <Link href="/donate" className="hover:text-accent transition-colors">{t.footer.donate}</Link>
          <Link href="/settings" className="hover:text-accent transition-colors">{t.footer.settings}</Link>
          <Link href="/auth/login" className="hover:text-accent transition-colors">{t.footer.login}</Link>
        </div>
        <p className="text-xs opacity-60">© {year} {t.footer.copyright}</p>
      </div>
    </footer>
  )
}
