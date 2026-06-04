export type Locale = 'en' | 'uz' | 'ru'

export const LOCALES: Locale[] = ['en', 'uz', 'ru']

export const LOCALE_COOKIE = 'tc-ui-locale'

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  uz: 'UZ',
  ru: 'RU',
}

export const LOCALE_HTML: Record<Locale, string> = {
  en: 'en',
  uz: 'uz',
  ru: 'ru',
}
