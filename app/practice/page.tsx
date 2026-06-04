import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { TypingEngine } from '@/components/typing/TypingEngine'
import { PracticeHeader } from '@/components/practice/PracticeHeader'

export const metadata: Metadata = {
  title: 'Practice Mode — TypeCraft',
  description: 'Practice typing at your own pace. Choose language, difficulty and mode. Free typing practice with instant feedback.',
  keywords: ['typing practice', 'keyboard practice', 'typing drill', 'type faster', 'typing', 'wpm practice'],
  alternates: { canonical: '/practice' },
}

export default function PracticePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <PracticeHeader />
        <TypingEngine />
      </main>
      <Footer />
    </div>
  )
}
