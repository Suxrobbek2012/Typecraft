'use client'

import { RotateCcw, Share2, Trophy } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Link from 'next/link'
import { useLocale } from '@/components/layout/LocaleProvider'

interface TestResultProps {
  wpm: number
  accuracy: number
  wpmHistory: number[]
  duration: number
  errors: number
  onRestart: () => void
  isUltra?: boolean
  cpm?: number
  maxCombo?: number
  isNewPb?: boolean
}

export function TestResult({
  wpm, accuracy, wpmHistory, duration, errors, onRestart,
  isUltra, cpm, maxCombo, isNewPb,
}: TestResultProps) {
  const { t, format } = useLocale()
  const consistency = calcConsistency(wpmHistory)
  const chartData = wpmHistory.map((w, i) => ({ second: i + 1, wpm: w }))

  const stats: { label: string; value: string | number; highlight?: boolean }[] = [
    { label: t.result.wpm, value: wpm, highlight: true },
    { label: t.result.accuracy, value: `${accuracy}%` },
    { label: t.result.consistency, value: `${consistency}%` },
    { label: t.result.errors, value: errors },
  ]
  if (isUltra && cpm !== undefined) stats.push({ label: t.result.cpm, value: cpm })
  if (isUltra && maxCombo !== undefined && maxCombo > 0) stats.push({ label: t.result.maxCombo, value: `${maxCombo}x` })

  async function handleShare() {
    const text = format(t.result.shareText, { wpm, accuracy })
    if (navigator.share) {
      await navigator.share({ title: t.result.shareTitle, text })
    } else {
      await navigator.clipboard.writeText(text)
    }
  }

  return (
    <div className={`w-full max-w-4xl mx-auto animate-slide-up ${isUltra ? 'relative' : ''}`}>
      {isNewPb && (
        <p className="text-center font-mono text-sm text-accent mb-4 animate-combo-pop">
          {t.typing.newPb}
        </p>
      )}
      <div className={`grid grid-cols-2 gap-6 mb-10 ${stats.length > 4 ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
        {stats.map(({ label, value, highlight }) => (
          <div key={label} className="result-stat">
            <span className={`result-stat__value ${highlight ? 'text-accent' : ''}`}>{value}</span>
            <span className="result-stat__label">{label}</span>
          </div>
        ))}
      </div>

      {/* WPM Chart */}
      {chartData.length > 2 && (
        <div className="bg-card border border-custom rounded-xl p-4 mb-8">
          <p className="text-sub text-xs font-mono uppercase tracking-wider mb-3">{t.result.chartTitle}</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData}>
              <XAxis
                dataKey="second"
                tick={{ fill: 'var(--text-sub)', fontSize: 10 }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--text-sub)', fontSize: 10 }}
                axisLine={false} tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text)',
                }}
                formatter={(v: number) => [`${v} wpm`, '']}
                labelFormatter={(l) => `${l}s`}
              />
              <Line
                type="monotone"
                dataKey="wpm"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: 'var(--accent)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-dark-bg font-semibold hover:bg-accent-light transition-all font-mono text-sm"
        >
          <RotateCcw size={14} />
          {t.result.tryAgain}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-custom text-sub hover:text-accent hover:border-accent transition-all font-mono text-sm"
        >
          <Share2 size={14} />
          {t.result.share}
        </button>

        <Link
          href="/leaderboard"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-custom text-sub hover:text-accent hover:border-accent transition-all font-mono text-sm"
        >
          <Trophy size={14} />
          {t.result.leaderboard}
        </Link>
      </div>

      {/* PRO nudge if good WPM */}
      {wpm >= 60 && (
        <p className="text-center text-sub text-xs mt-6 font-mono">
          🔥 {t.result.proNudgeBefore}{' '}
          <Link href="/donate" className="text-accent hover:underline">{t.result.support}</Link>{' '}
          {t.result.proNudgeAfter}
        </p>
      )}
    </div>
  )
}

function calcConsistency(wpmHistory: number[]): number {
  if (wpmHistory.length < 2) return 100
  const avg = wpmHistory.reduce((a, b) => a + b, 0) / wpmHistory.length
  const variance = wpmHistory.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / wpmHistory.length
  const stdDev = Math.sqrt(variance)
  return Math.max(0, Math.round(100 - (stdDev / avg) * 100))
}
