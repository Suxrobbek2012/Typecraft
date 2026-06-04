import type { Locale } from './types'
import { en } from './en'
import { uz } from './uz'
import { ru } from './ru'

export type { Dictionary } from './dictionary-type'
import type { Dictionary } from './dictionary-type'

export * from './types'

const dictionaries: Record<Locale, Dictionary> = { en, uz, ru }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? en
}

/** Replace {key} placeholders in translation strings */
export function formatT(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''))
}

export function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return 'en'
  const lang = (navigator.language || 'en').toLowerCase()
  if (lang.startsWith('uz')) return 'uz'
  if (lang.startsWith('ru')) return 'ru'
  return 'en'
}

export function parseLocale(value: string | null | undefined): Locale {
  if (value === 'uz' || value === 'ru' || value === 'en') return value
  return 'en'
}
