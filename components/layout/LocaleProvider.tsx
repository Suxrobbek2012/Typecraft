'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  type Locale,
  type Dictionary,
  LOCALE_COOKIE,
  LOCALE_HTML,
  getDictionary,
  detectBrowserLocale,
  parseLocale,
  formatT,
} from '@/lib/i18n'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Dictionary
  format: typeof formatT
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function readCookie(): Locale | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`))
  return match ? parseLocale(decodeURIComponent(match[1])) : null
}

function writeCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const saved = readCookie()
    const initial = saved ?? detectBrowserLocale()
    setLocaleState(initial)
    document.documentElement.lang = LOCALE_HTML[initial]
    setReady(true)
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    writeCookie(next)
    document.documentElement.lang = LOCALE_HTML[next]
  }, [])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: getDictionary(locale),
      format: formatT,
    }),
    [locale, setLocale],
  )

  if (!ready) {
    return <>{children}</>
  }

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    return {
      locale: 'en' as Locale,
      setLocale: () => {},
      t: getDictionary('en'),
      format: formatT,
    }
  }
  return ctx
}
