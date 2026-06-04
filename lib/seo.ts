import type { Metadata } from 'next'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://typecraft.uz'

export interface SeoPageConfig {
  path: string
  title: string
  description: string
  keywords: string[]
  h1: string
  intro: string
}

export const SEO_PAGES: Record<string, SeoPageConfig> = {
  'typing-test': {
    path: '/typing-test',
    title: 'TypeCraft — Free Typing Test Online | WPM Test & Speed Test',
    description:
      'Take a free online typing test on TypeCraft. Measure your typing speed in WPM, accuracy and consistency with live results. Practice touch typing in English, Uzbek, Russian and more languages.',
    keywords: [
      'typing test', 'free typing test online', 'online typing test', 'typing speed test',
      'wpm test', 'typing practice', 'touch typing test', 'keyboard typing test',
      'typecraft typing test', 'test typing speed', 'typing speed checker',
    ],
    h1: 'Free Online Typing Test on TypeCraft',
    intro:
      'Improve your touch typing with a free online typing test on TypeCraft. Track WPM, accuracy, and consistency in real time — no signup required, with English, Uzbek, Russian and 10+ languages.',
  },
  'wpm-test': {
    path: '/wpm-test',
    title: 'TypeCraft WPM Test — Check Your Words Per Minute',
    description:
      'Use TypeCraft to run a free online WPM test. Measure words per minute, accuracy and CPM in real time, then improve your typing speed with daily practice.',
    keywords: [
      'wpm test', 'words per minute test', 'online wpm test', 'typing wpm',
      'wpm calculator', 'wpm counter', 'check wpm', 'typing speed wpm',
      'words per minute typing test', 'typecraft wpm test', 'speed typing test',
    ],
    h1: 'TypeCraft WPM Test — Check Your Words Per Minute',
    intro:
      'A WPM test measures how many words you type per minute. TypeCraft calculates WPM from correct keystrokes in real time, so you can see your true words-per-minute score and improve faster.',
  },
  'typing-speed-test': {
    path: '/typing-speed-test',
    title: 'TypeCraft Typing Speed Test — How Fast Can You Type?',
    description:
      'Take a free typing speed test on TypeCraft. Get instant WPM results, track your accuracy, and improve your typing speed with timed practice sessions.',
    keywords: [
      'typing speed test', 'free typing speed test', 'speed typing test', 'how fast can i type',
      'typing speed checker', 'online typing speed test', 'improve typing speed',
      'typing practice', 'typecraft typing speed test', 'test typing speed',
    ],
    h1: 'TypeCraft Typing Speed Test',
    intro:
      'Find out how fast you can type with a timed typing speed test on TypeCraft. Choose 15, 30, 60, or 120 seconds, pick your language, and get an accurate WPM score when time runs out.',
  },
}

export function buildSeoMetadata(config: SeoPageConfig): Metadata {
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    alternates: { canonical: config.path },
    openGraph: {
      title: `${config.title} | TypeCraft`,
      description: config.description,
      url: `${APP_URL}${config.path}`,
    },
  }
}
