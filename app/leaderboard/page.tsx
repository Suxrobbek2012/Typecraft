import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { LeaderboardView } from '@/components/leaderboard/LeaderboardView'

export const metadata: Metadata = {
  title: 'Leaderboard — Top Typists',
  description: 'See the fastest typists on TypeCraft. Global leaderboard with WPM rankings.',
}

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <LeaderboardView />
      <Footer />
    </div>
  )
}
