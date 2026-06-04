'use client'

import { useLocale } from '@/components/layout/LocaleProvider'

export function PracticeHeader() {
  const { t } = useLocale()
  return (
    <div className="text-center mb-10">
      <h1 className="font-display text-4xl font-bold mb-2">{t.practice.title}</h1>
      <p className="text-sub text-sm max-w-md mx-auto">{t.practice.desc}</p>
    </div>
  )
}
