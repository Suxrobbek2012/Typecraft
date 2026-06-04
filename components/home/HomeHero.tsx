'use client'

import { useLocale } from '@/components/layout/LocaleProvider'

export function HomeHero() {
  const { t } = useLocale()
  return (
    <h1 className="sr-only">{t.home.h1}</h1>
  )
}
