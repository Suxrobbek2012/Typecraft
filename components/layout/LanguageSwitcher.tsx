'use client'

import { useLocale } from '@/components/layout/LocaleProvider'
import { LOCALES, LOCALE_LABELS, type Locale } from '@/lib/i18n'

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale()

  return (
    <div
      className="flex items-center gap-0.5 rounded-lg border border-custom overflow-hidden font-mono text-[11px]"
      role="group"
      aria-label={t.langSwitcher.label}
    >
      {LOCALES.map((code: Locale) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={`px-2 py-1 transition-all ${
            locale === code
              ? 'bg-accent text-dark-bg font-semibold'
              : 'text-sub hover:text-accent hover:bg-card'
          }`}
          aria-pressed={locale === code}
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  )
}
