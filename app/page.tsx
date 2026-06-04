import type { Metadata } from 'next'
import { TypingEngine } from '@/components/typing/TypingEngine'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HomeSeoContent } from '@/components/seo/HomeSeoContent'
import { HomeHero } from '@/components/home/HomeHero'

export const metadata: Metadata = {
  title: 'TypeCraft — Free Typing Speed Test Online | WPM Counter',
  description:
    'Take a free typing speed test on TypeCraft. Measure your WPM (words per minute), accuracy and consistency in real time. Practice in English, Uzbek, Russian and 7+ languages. No signup required.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'TypeCraft — Free Typing Speed Test Online | WPM Counter',
    description: 'Measure your typing speed for free. Real-time WPM, accuracy & consistency tracker. 10+ languages. No signup required.',
    url: '/',
  },
}

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hidden H1 for SEO — screen readers and crawlers see it, visually hidden */}
      <HomeHero />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <TypingEngine />
      </div>

      <div className="px-4">
        <HomeSeoContent />
      </div>
      <Footer />
    </main>
  )
}
