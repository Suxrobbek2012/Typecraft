'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import {
  Crown, BarChart2, Clock, Target, Zap, LogOut,
  Star, Calendar, ShieldCheck, Keyboard,
} from 'lucide-react'
import { useLocale } from '@/components/layout/LocaleProvider'

interface UserData {
  id: string
  email: string
  username: string
  role: string
  plan: 'free' | 'basic' | 'ultra'
  isPro: boolean
  proGrantedAt?: string
  proExpiresAt?: string
  avatar?: string
  stats: {
    testsCompleted: number
    averageWpm: number
    bestWpm: number
    averageAccuracy: number
    totalTimeTyped: number
    streak: number
  }
}

function daysLeft(expiresAt?: string): number | null {
  if (!expiresAt) return null
  const diff = new Date(expiresAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function formatDate(d?: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function ProfilePage() {
  const { t: tr } = useLocale()
  const router  = useRouter()
  const [user,    setUser]    = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth?action=me')
      .then(r => r.json())
      .then(d => {
        if (d.user) setUser(d.user)
        else router.push('/auth/login')
      })
      .catch(() => router.push('/auth/login'))
      .finally(() => setLoading(false))
  }, [router])

  async function logout() {
    await fetch('/api/auth?action=logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="text-sub font-mono text-sm animate-pulse">{tr.profile.loading}</span>
    </div>
  )
  if (!user) return null

  const days      = daysLeft(user.proExpiresAt)
  const isUltra   = user.plan === 'ultra'
  const isBasic   = user.plan === 'basic'
  const isPro     = user.isPro || isUltra || isBasic
  const pct       = days != null ? Math.round((days / 30) * 100) : 0

  const statCards = [
    { icon: Zap,       label: tr.profile.bestWpm,      value: user.stats.bestWpm || 0,           color: 'text-accent' },
    { icon: Target,    label: tr.profile.avgAccuracy, value: `${user.stats.averageAccuracy || 0}%`, color: 'text-green-400' },
    { icon: BarChart2, label: tr.profile.testsDone,   value: user.stats.testsCompleted || 0,     color: 'text-blue-400' },
    { icon: Clock,     label: tr.profile.timeTyped,   value: `${Math.round((user.stats.totalTimeTyped || 0) / 60)}m`, color: 'text-purple-400' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">

        {/* ── Avatar & name ── */}
        <div className="flex items-center gap-5 mb-8">
          <div className="relative">
            <div className="w-18 h-18 w-[72px] h-[72px] rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl font-bold text-accent font-mono overflow-hidden">
              {user.avatar
                ? <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                : user.username[0].toUpperCase()
              }
            </div>
            {isPro && (
              <div className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#0E0E10] ${isUltra ? 'bg-purple-500' : 'bg-yellow-500'}`}>
                {isUltra ? <Star size={11} className="text-white" /> : <Crown size={11} className="text-black" />}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-2xl font-bold">{user.username}</h1>
              {isPro && (
                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-mono font-semibold ${
                  isUltra ? 'bg-purple-500/20 text-purple-400' : 'bg-accent/20 text-accent'
                }`}>
                  {isUltra ? <Star size={9} /> : <Crown size={9} />}
                  {isUltra ? 'Ultra PRO' : 'Basic PRO'}
                </span>
              )}
            </div>
            <p className="text-sub text-sm font-mono mt-0.5 truncate">{user.email}</p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-custom text-sub hover:text-red-400 hover:border-red-400/40 transition-all text-sm font-mono shrink-0"
          >
            <LogOut size={13} />
            {tr.nav.logout}
          </button>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {statCards.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-card border border-custom rounded-xl p-4 text-center group hover:border-accent/30 transition-all">
              <Icon size={16} className={`${color} mx-auto mb-2`} />
              <p className={`font-mono text-xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-sub mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Average WPM bar ── */}
        <div className="bg-card border border-custom rounded-xl p-5 mb-6">
          <p className="text-xs text-sub font-mono uppercase tracking-wider mb-3">{tr.profile.avgWpm}</p>
          <div className="flex items-end gap-2 mb-3">
            <span className="font-mono text-5xl font-bold text-accent">{user.stats.averageWpm || 0}</span>
            <span className="text-sub font-mono mb-1">wpm</span>
          </div>
          <div className="h-2 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-700"
              style={{ width: `${Math.min((user.stats.averageWpm / 200) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-sub font-mono mt-1">
            <span>0</span><span>200 wpm</span>
          </div>
        </div>

        {/* ── PRO status card ── */}
        {isPro ? (
          <div className={`relative overflow-hidden rounded-2xl border p-6 mb-6 ${
            isUltra
              ? 'bg-gradient-to-br from-purple-500/15 to-pink-500/10 border-purple-500/30'
              : 'bg-gradient-to-br from-yellow-500/12 to-amber-500/8 border-yellow-500/25'
          }`}>
            {/* Glow blob */}
            <div className={`absolute -top-8 -right-8 w-40 h-40 rounded-full blur-3xl opacity-20 ${
              isUltra ? 'bg-purple-500' : 'bg-yellow-400'
            }`} />

            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck size={18} className={isUltra ? 'text-purple-400' : 'text-yellow-400'} />
                    <span className={`font-mono font-bold text-sm ${isUltra ? 'text-purple-400' : 'text-yellow-400'}`}>
                      {isUltra ? 'ULTRA PRO' : 'BASIC PRO'}
                    </span>
                  </div>
                  <p className="text-white font-semibold">{tr.profile.activeSub}</p>
                </div>

                {/* Days left badge */}
                {days != null && (
                  <div className={`text-center px-3 py-2 rounded-xl border ${
                    days <= 5
                      ? 'bg-red-500/15 border-red-500/30 text-red-400'
                      : days <= 10
                      ? 'bg-orange-500/15 border-orange-500/30 text-orange-400'
                      : isUltra
                      ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                      : 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300'
                  }`}>
                    <p className="font-mono font-bold text-2xl leading-none">{days}</p>
                    <p className="text-xs font-mono opacity-80 mt-0.5">{tr.profile.daysLeft}</p>
                  </div>
                )}
              </div>

              {/* Progress bar — days left */}
              {days != null && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-mono text-sub mb-1.5">
                    <span>Obuna muddati</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        days <= 5 ? 'bg-red-500' : days <= 10 ? 'bg-orange-400' : isUltra ? 'bg-purple-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`rounded-xl px-3 py-2.5 ${isUltra ? 'bg-purple-500/10' : 'bg-yellow-500/10'}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar size={11} className="text-sub" />
                    <span className="text-sub text-xs font-mono">{tr.profile.granted}</span>
                  </div>
                  <p className="font-mono font-semibold text-sm">{formatDate(user.proGrantedAt)}</p>
                </div>
                <div className={`rounded-xl px-3 py-2.5 ${isUltra ? 'bg-purple-500/10' : 'bg-yellow-500/10'}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar size={11} className="text-sub" />
                    <span className="text-sub text-xs font-mono">{tr.profile.expires}</span>
                  </div>
                  <p className={`font-mono font-semibold text-sm ${days != null && days <= 5 ? 'text-red-400' : ''}`}>
                    {formatDate(user.proExpiresAt)}
                  </p>
                </div>
              </div>

              {/* Renew link */}
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <p className="text-sub text-xs font-mono">
                  {isUltra ? 'Ultra: animatsiyalar, soundlar, barcha tillar' : 'Basic: 60s/120s testlar, barcha tillar'}
                </p>
                <a
                  href="/donate"
                  className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
                    isUltra
                      ? 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10'
                      : 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10'
                  }`}
                >
                  Yangilash →
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* ── PRO upsell for free users ── */
          <div className="relative overflow-hidden bg-gradient-to-br from-accent/8 to-transparent border border-accent/20 rounded-2xl p-6 mb-6">
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-accent/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Keyboard size={16} className="text-accent" />
                <span className="font-mono text-xs text-accent font-semibold uppercase tracking-wider">TypeCraft PRO</span>
              </div>
              <h3 className="font-display text-lg font-bold mb-1">{tr.profile.goPro}</h3>
              <p className="text-sub text-sm mb-4 leading-relaxed">
                Basic ($0.39) — 60s/120s, barcha tillar, statistika<br/>
                Ultra ($0.89) — animatsiyalar, sound, leaderboard ustunligi
              </p>
              <a
                href="/donate"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-dark-bg font-bold font-mono text-sm hover:bg-accent-light transition-all"
              >
                <Crown size={14} />
                PRO olish
              </a>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  )
}
