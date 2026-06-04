'use client'

import { useEffect, useRef, useState } from 'react'
import { UltraIcon } from '@/components/svg/TypingAnimations'
import { useLocale } from '@/components/layout/LocaleProvider'

export type UltraTheme = 'default' | 'neon' | 'aurora' | 'matrix'

const WPM_MILESTONES = [50, 80, 100, 120, 150] as const

export function loadUltraTheme(): UltraTheme {
  if (typeof window === 'undefined') return 'default'
  const v = localStorage.getItem('tc-ultra-theme')
  if (v === 'neon' || v === 'aurora' || v === 'matrix') return v
  return 'default'
}

export function loadPersonalBest(): number {
  if (typeof window === 'undefined') return 0
  return parseInt(localStorage.getItem('tc-best-wpm') || '0', 10) || 0
}

export function savePersonalBest(wpm: number): boolean {
  const prev = loadPersonalBest()
  if (wpm > prev) {
    localStorage.setItem('tc-best-wpm', String(wpm))
    return true
  }
  return false
}

export function UltraThemePicker({
  theme,
  onChange,
}: {
  theme: UltraTheme
  onChange: (t: UltraTheme) => void
}) {
  const { t: tr } = useLocale()
  const themes = Object.keys(tr.ultra.themes) as UltraTheme[]
  return (
    <div className="flex items-center gap-1 rounded-lg border border-purple-400/25 overflow-hidden text-[10px] font-mono">
      {themes.map(key => (
        <button
          key={key}
          type="button"
          title={tr.ultra.themeDescriptions?.[key] ?? undefined}
          onClick={() => {
            onChange(key)
            localStorage.setItem('tc-ultra-theme', key)
          }}
          className={`px-2 py-1 transition-all ${
            theme === key
              ? 'bg-purple-500/20 text-purple-300'
              : 'text-sub hover:text-purple-300'
          }`}
        >
          {tr.ultra.themes[key]}
        </button>
      ))}
    </div>
  )
}

export function ComboDisplay({ combo }: { combo: number }) {
  const { t: tr } = useLocale()
  if (combo < 5) return null
  const tier = combo >= 50 ? 3 : combo >= 25 ? 2 : combo >= 10 ? 1 : 0
  const colors = ['text-cyan-400', 'text-purple-400', 'text-orange-400']
  const labels = [tr.combo.nice, tr.combo.fire, tr.combo.godMode]

  return (
    <div className={`flex items-center gap-1 font-mono text-xs animate-combo-pop ${colors[tier]}`} aria-live="polite">
      <span className="font-bold tabular-nums">{combo}x</span>
      <span className="opacity-80 uppercase tracking-wider">{labels[tier]}</span>
    </div>
  )
}

export function MilestoneToast({ wpm, show }: { wpm: number; show: boolean }) {
  const { format, t: tr } = useLocale()
  if (!show) return null
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-milestone">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-accent/40 bg-card/95 backdrop-blur-md shadow-lg">
        <UltraIcon size={14} />
        <span className="font-mono text-sm font-bold text-accent">
          {format(tr.ultra.milestone, { wpm })}
        </span>
      </div>
    </div>
  )
}

export function useWpmMilestones(liveWpm: number, enabled: boolean) {
  const [toast, setToast] = useState<number | null>(null)
  const hitRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    if (!enabled || liveWpm <= 0) return
    for (const m of WPM_MILESTONES) {
      if (liveWpm >= m && !hitRef.current.has(m)) {
        hitRef.current.add(m)
        setToast(m)
        const t = setTimeout(() => setToast(null), 2200)
        return () => clearTimeout(t)
      }
    }
  }, [liveWpm, enabled])

  return toast
}

export function ScreenShake({ active, children }: { active: boolean; children: React.ReactNode }) {
  return <div className={active ? 'tc-screen-shake' : undefined}>{children}</div>
}

export function UltraThemeOverlay({ theme }: { theme: UltraTheme }) {
  if (theme === 'default') return null

  const styles: Record<Exclude<UltraTheme, 'default'>, string> = {
    neon: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(168,85,247,0.12) 0%, rgba(34,211,238,0.06) 40%, transparent 70%)',
    aurora: 'radial-gradient(ellipse 90% 60% at 30% 30%, rgba(52,211,153,0.1) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 70% 60%, rgba(167,139,250,0.12) 0%, transparent 55%)',
    matrix: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(74,222,128,0.03) 2px, rgba(74,222,128,0.03) 4px)',
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-500"
      style={{ background: styles[theme] }}
      aria-hidden
    />
  )
}

export function PersonalBestBadge({ wpm, best }: { wpm: number; best: number }) {
  const { t: tr } = useLocale()
  const display = Math.max(best, 0)
  if (display <= 0 && wpm <= 0) return null
  const beating = wpm > best && wpm > 0
  return (
    <span
      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
        beating ? 'border-accent text-accent bg-accent/10' : 'border-custom text-sub'
      }`}
    >
      {tr.ultra.pb} {beating ? wpm : display}
    </span>
  )
}
