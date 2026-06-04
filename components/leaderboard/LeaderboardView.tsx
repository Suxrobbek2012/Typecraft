'use client'

import { Trophy, Crown } from 'lucide-react'
import { useLocale } from '@/components/layout/LocaleProvider'

const MOCK_LEADERS = [
  { rank: 1,  username: 'speedking',    wpm: 198, accuracy: 99, isPro: true,  lang: '🇺🇸' },
  { rank: 2,  username: 'ultratype',    wpm: 187, accuracy: 98, isPro: true,  lang: '🇩🇪' },
  { rank: 3,  username: 'fingerflash',  wpm: 175, accuracy: 97, isPro: true,  lang: '🇺🇿' },
  { rank: 4,  username: 'keymaster',    wpm: 168, accuracy: 96, isPro: false, lang: '🇷🇺' },
  { rank: 5,  username: 'turbotype',    wpm: 162, accuracy: 97, isPro: true,  lang: '🇫🇷' },
  { rank: 6,  username: 'swiftkeys',    wpm: 155, accuracy: 95, isPro: false, lang: '🇺🇸' },
  { rank: 7,  username: 'blazefingers', wpm: 148, accuracy: 96, isPro: false, lang: '🇯🇵' },
  { rank: 8,  username: 'typemaster',   wpm: 142, accuracy: 94, isPro: true,  lang: '🇺🇿' },
  { rank: 9,  username: 'rapidkeys',    wpm: 138, accuracy: 95, isPro: false, lang: '🇷🇺' },
  { rank: 10, username: 'keystroke',    wpm: 134, accuracy: 93, isPro: false, lang: '🇰🇷' },
]

export function LeaderboardView() {
  const { t } = useLocale()
  const podiumLabels = [t.leaderboard.podium[1], t.leaderboard.podium[0], t.leaderboard.podium[2]]

  return (
    <main className="flex-1 max-w-3xl mx-auto px-4 py-16 w-full">
      <div className="text-center mb-10">
        <Trophy className="text-accent mx-auto mb-3" size={32} />
        <h1 className="font-display text-3xl font-bold">{t.leaderboard.title}</h1>
        <p className="text-sub mt-2 text-sm">{t.leaderboard.subtitle}</p>
      </div>

      <div className="flex items-end justify-center gap-4 mb-10">
        {[MOCK_LEADERS[1], MOCK_LEADERS[0], MOCK_LEADERS[2]].map((u, i) => {
          const heights = ['h-20', 'h-28', 'h-16']
          const colors  = ['bg-slate-400/20', 'bg-accent/20', 'bg-amber-700/20']
          return (
            <div key={u.username} className="flex flex-col items-center gap-2">
              <span className="font-mono text-sm font-bold">{u.wpm} wpm</span>
              <span className="text-xs text-sub">{u.username}</span>
              <div className={`w-20 ${heights[i]} ${colors[i]} border border-custom rounded-t-lg flex items-center justify-center`}>
                <span className="text-xs font-mono text-sub">{podiumLabels[i]}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-card border border-custom rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-custom text-sub font-mono text-xs uppercase">
              <th className="text-left px-4 py-3 w-12">#</th>
              <th className="text-left px-4 py-3">{t.leaderboard.player}</th>
              <th className="text-right px-4 py-3">WPM</th>
              <th className="text-right px-4 py-3">{t.leaderboard.accuracy}</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_LEADERS.map(u => (
              <tr key={u.rank} className="border-b border-custom hover:bg-surface transition-colors">
                <td className={`px-4 py-3 font-mono font-bold ${u.rank <= 3 ? 'text-accent' : 'text-sub'}`}>{u.rank}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span>{u.lang}</span>
                    <span className="font-semibold">{u.username}</span>
                    {u.isPro && <Crown size={12} className="text-accent" />}
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-accent">{u.wpm}</td>
                <td className="px-4 py-3 text-right font-mono text-sub">{u.accuracy}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
