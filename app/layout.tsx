import type { Metadata, Viewport } from 'next'
// Use client-side Google Fonts links instead of next/font to avoid build-time fetches
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { LocaleProvider } from '@/components/layout/LocaleProvider'
import { Toaster } from 'react-hot-toast'
import './globals.css'

// Fonts are loaded via <link> tags in the head to prevent server-side fetching

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)',  color: '#0E0E10' },
    { media: '(prefers-color-scheme: light)', color: '#F4F1EB' },
  ],
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://typecraft.uz'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'TypeCraft — Free Online Typing Speed Test',
    template: '%s | TypeCraft',
  },
  description:
    'TypeCraft — the best free online typing speed test. Practice touch typing in English, Uzbek, Russian and 7+ languages. Measure WPM, accuracy & consistency in real time. Compete on leaderboards and unlock PRO features.',
  keywords: [
    'typing', 'typing test', 'typing speed test', 'typing wpm', 'wpm typing test',
    'free typing test', 'online typing test', 'typing speed', 'type test',
    'wpm test', 'words per minute', 'words per minute test', 'typing practice', 'touch typing',
    'typing speed checker', 'typing accuracy test', 'keyboard typing test',
    'improve typing speed', 'learn touch typing', 'typing tutor', 'type faster',
    'monkeytype alternative', 'keybr alternative', 'typeracer alternative',
    'yozish testi', 'klaviatura testi', 'yozish tezligi',
    'тест скорости печати', 'тест набора текста', 'скорость печати',
    'wpm', 'cpm', 'keystrokes per minute',
  ],
  authors: [{ name: 'TypeCraft', url: APP_URL }],
  creator: 'TypeCraft',
  publisher: 'TypeCraft',
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: {
    canonical: APP_URL,
    languages: { 'en-US': `${APP_URL}/`, 'uz-UZ': `${APP_URL}/`, 'ru-RU': `${APP_URL}/` },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['uz_UZ', 'ru_RU'],
    url: APP_URL,
    siteName: 'TypeCraft',
    title: 'TypeCraft — Free Typing Speed Test | Measure Your WPM',
    description: 'Test your typing speed for free! Practice in 10+ languages, track WPM & accuracy, compete on global leaderboards.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'TypeCraft — Free Online Typing Speed Test', type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TypeCraft — Free Typing Speed Test | WPM Counter',
    description: 'Measure your typing speed instantly! Free WPM test in 10+ languages with live stats and leaderboards.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16.png',  sizes: '16x16',  type: 'image/png' },
      { url: '/icon-32.png',  sizes: '32x32',  type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  category: 'education',
}

// Structured Data schemas
const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'TypeCraft',
    url: APP_URL,
    logo: `${APP_URL}/icon-192.png`,
    description: 'Free online typing speed test. Practice touch typing in 10+ languages with real-time WPM tracking.',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: { '@type': 'AggregateOffer', priceCurrency: 'USD', lowPrice: '0', highPrice: '0.89', offerCount: '2' },
    featureList: [
      'Real-time WPM and CPM measurement', 'Accuracy tracking', '10+ language support',
      'Global leaderboard', 'Ultra PRO animations', 'Combo streaks', 'Personal best tracking',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to take a typing speed test on TypeCraft',
    step: [
      { '@type': 'HowToStep', name: 'Open TypeCraft', text: 'Go to typecraft.uz and choose time or words mode.' },
      { '@type': 'HowToStep', name: 'Start typing', text: 'Begin typing the displayed text. The timer starts on your first keystroke.' },
      { '@type': 'HowToStep', name: 'View your WPM', text: 'When the test ends, see your words per minute, accuracy, and consistency chart.' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a good typing speed in WPM?',
        acceptedAnswer: { '@type': 'Answer', text: 'The average typing speed is 40 WPM. A good typing speed is 60–80 WPM. Professional typists reach 100+ WPM. TypeCraft helps you practice and reach your goal.' },
      },
      {
        '@type': 'Question',
        name: 'How can I improve my typing speed?',
        acceptedAnswer: { '@type': 'Answer', text: 'Practice regularly with TypeCraft\'s free typing tests. Focus on accuracy first, then speed. Use 15s, 30s, or 60s timed tests to build muscle memory.' },
      },
      {
        '@type': 'Question',
        name: 'Is TypeCraft free?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes! TypeCraft is completely free. Basic PRO ($0.39) and Ultra PRO ($0.89) tiers offer advanced features like longer tests, animations, and priority leaderboard ranking.' },
      },
      {
        '@type': 'Question',
        name: 'What languages does TypeCraft support?',
        acceptedAnswer: { '@type': 'Answer', text: 'TypeCraft supports English, Uzbek, Russian, German, French, Spanish, Turkish, Arabic, Chinese, Japanese and more. Switch languages instantly from the typing interface.' },
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'TypeCraft Typing Test',
    operatingSystem: 'Web Browser',
    applicationCategory: 'EducationalApplication',
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', ratingCount: '1248', bestRating: '5' },
    offers: { '@type': 'Offer', price: '0.00', priceCurrency: 'USD' },
  },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {jsonLd.map((schema, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        ))}
          {/* Load fonts on the client via Google Fonts to avoid build-time network fetches */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@100;300;400;500;700;900&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased transition-colors duration-200 overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <LocaleProvider>
          {children}
          </LocaleProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'bg-dark-card text-white border border-dark-border font-mono text-sm',
              duration: 3000,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
