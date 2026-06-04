'use client'

import { useState } from 'react'
import { Sparkles, Music, Star, Zap, Volume2, ShieldCheck, Flame, ChevronRight, Lock } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useLocale } from '@/components/layout/LocaleProvider'
import Link from 'next/link'

export function UltraPage() {
  const { t: tr } = useLocale()
  const [activeTheme, setActiveTheme] = useState<'gold' | 'neon' | 'aurora' | 'matrix'>('gold')

  const themes = [
    {
      id: 'gold' as const,
      name: tr.ultra.themes.default || 'Gold Theme',
      desc: tr.ultra.themeDescriptions.default || 'Golden shimmer with lively rings and ambient particles.',
      previewBg: 'bg-gradient-to-br from-yellow-600/30 via-amber-800/20 to-black border-amber-500/50',
      textColor: 'text-amber-400',
      shadowColor: 'shadow-amber-500/10',
    },
    {
      id: 'neon' as const,
      name: tr.ultra.themes.neon || 'Electric Neon',
      desc: tr.ultra.themeDescriptions.neon || 'Electric neon glow with bright speed lines and pulsing color.',
      previewBg: 'bg-gradient-to-br from-cyan-600/30 via-blue-800/20 to-black border-cyan-500/50',
      textColor: 'text-cyan-400',
      shadowColor: 'shadow-cyan-500/10',
    },
    {
      id: 'aurora' as const,
      name: tr.ultra.themes.aurora || 'Soft Aurora',
      desc: tr.ultra.themeDescriptions.aurora || 'Soft aurora flows with glowing ribbons and pastel motion.',
      previewBg: 'bg-gradient-to-br from-emerald-600/30 via-teal-800/20 to-black border-emerald-500/50',
      textColor: 'text-emerald-400',
      shadowColor: 'shadow-emerald-500/10',
    },
    {
      id: 'matrix' as const,
      name: tr.ultra.themes.matrix || 'Digital Matrix',
      desc: tr.ultra.themeDescriptions.matrix || 'Digital rain and code streaks for a hacker-style effect.',
      previewBg: 'bg-gradient-to-br from-green-600/30 via-green-950/20 to-black border-green-500/50',
      textColor: 'text-green-400',
      shadowColor: 'shadow-green-500/10',
    },
  ]

  const selectedThemeInfo = themes.find((t) => t.id === activeTheme)!

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-white">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono font-bold tracking-wider uppercase mb-6 animate-pulse">
            <Sparkles size={14} />
            Ultimate Immersive Typing
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
            TypeCraft Ultra PRO
          </h1>
          <p className="text-sub text-lg sm:text-xl leading-relaxed mb-8">
            Experience typing like never before. Unlock beautiful high-fps animations, responsive key sound effects, and high-priority support queues.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/donate?plan=ultra"
              id="ultra-upgrade-hero-btn"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-bold font-mono text-base transition-all shadow-xl shadow-purple-500/20 hover:shadow-purple-500/45 flex items-center gap-2 group w-full sm:w-auto justify-center"
            >
              Get Ultra PRO
              <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/pricing"
              id="ultra-pricing-link"
              className="px-8 py-4 rounded-2xl border border-custom hover:border-white/30 font-bold font-mono text-base transition-all hover:bg-white/5 w-full sm:w-auto text-center"
            >
              Compare Plans
            </Link>
          </div>
        </div>

        {/* Features Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Card 1: Beautiful Themes (Interactive Showcase) */}
          <div className="bg-card border border-custom rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/25">
                  <Star size={20} />
                </div>
                <h3 className="font-display text-xl font-bold">4 Animated Themes</h3>
              </div>
              <p className="text-sub text-sm mb-6">
                Transform your typing field with high-performance CSS and Canvas particle systems. Choose a style that matches your aesthetic.
              </p>

              {/* Theme Buttons */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setActiveTheme(theme.id)}
                    id={`btn-theme-${theme.id}`}
                    className={`px-3 py-2.5 rounded-xl text-xs font-mono font-bold border transition-all text-left ${
                      activeTheme === theme.id
                        ? 'bg-white/10 text-white border-purple-500/50 shadow-md shadow-purple-500/5'
                        : 'border-custom text-sub hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Workspace Preview */}
            <div
              className={`h-40 rounded-2xl border flex flex-col items-center justify-center p-4 transition-all duration-500 relative overflow-hidden ${selectedThemeInfo.previewBg} ${selectedThemeInfo.shadowColor} shadow-inner`}
            >
              {/* Particle effects simulation text */}
              <div className="text-center z-10">
                <span className="font-mono text-xs text-white/50 block mb-2">Simulated Workspace</span>
                <span className={`font-mono text-lg font-bold tracking-widest ${selectedThemeInfo.textColor} drop-shadow-md`}>
                  TypeCraft
                </span>
                <div className="flex gap-1 justify-center mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-ping" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                </div>
              </div>
              {/* Theme Description */}
              <div className="absolute bottom-2 left-0 right-0 text-center px-4">
                <p className="text-[10px] text-sub font-mono">{selectedThemeInfo.desc}</p>
              </div>
            </div>
          </div>

          {/* Card 2: Immersive Sound & Combos */}
          <div className="bg-card border border-custom rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/25">
                  <Volume2 size={20} />
                </div>
                <h3 className="font-display text-xl font-bold">Sound Effects & Combo Bursts</h3>
              </div>
              <p className="text-sub text-sm mb-6">
                Hear the click-clack of realistic mechanical switches as you speed type. Chain perfect runs to activate satisfying combo multipliers, fire streaks, and combo alert callouts.
              </p>
            </div>

            {/* Sound features list */}
            <div className="bg-black/30 border border-custom rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Music size={16} className="text-pink-400 shrink-0" />
                <div className="text-sm">
                  <span className="font-semibold block">Realistic Mechanical Switch Sounds</span>
                  <span className="text-sub text-xs">Simulated linear, tactile, and clicky feedback</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Flame size={16} className="text-amber-400 shrink-0" />
                <div className="text-sm">
                  <span className="font-semibold block">Combo Leveling & Milestones</span>
                  <span className="text-sub text-xs">Unlock God Mode and Fire streak visuals at high speeds</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Priority Support Priority Response */}
          <div className="bg-card border border-custom rounded-3xl p-8 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="font-display text-xl font-bold">Priority Support Response Queue</h3>
              </div>
              <p className="text-sub text-sm leading-relaxed mb-4">
                Need account help, feature requests, or encountered an issue? Ultra PRO users gain immediate access to our VIP queue.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-sub">
                  <span className="w-2 h-2 rounded-full bg-sub" />
                  Free users: 7-day rate limit response
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Ultra PRO users: Priority queue (3-day response rate limit)
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 text-center">
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 block mb-2">Priority Queue Status</span>
              <div className="text-4xl font-extrabold text-white mb-2">3 Days</div>
              <p className="text-xs text-sub leading-normal">
                Submit support messages every 3 days instead of 7. Responses are prioritized by our root administrator.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Plan Details Banner */}
        <div className="relative bg-card border border-purple-500/40 rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl shadow-purple-500/5 bg-gradient-to-r from-purple-950/20 to-black">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h3 className="font-display text-2xl md:text-3xl font-extrabold mb-4">
              Get Lifetime Access to Ultra PRO
            </h3>
            <p className="text-sub text-sm md:text-base mb-8">
              No recurring monthly subscriptions. Pay once manually, confirm your donation, and enjoy lifetime premium typing feedback!
            </p>

            {/* Pricing details - absolute matching $0.89 / 11 000 UZS */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-8">
              <div className="bg-black/40 border border-custom px-6 py-4 rounded-2xl w-full sm:w-auto">
                <span className="text-xs font-mono text-sub uppercase tracking-wider block mb-1">UZS Price</span>
                <span className="text-2xl font-bold font-mono text-accent">11 000 UZS</span>
              </div>
              <div className="bg-black/40 border border-custom px-6 py-4 rounded-2xl w-full sm:w-auto">
                <span className="text-xs font-mono text-sub uppercase tracking-wider block mb-1">USD Price</span>
                <span className="text-2xl font-bold font-mono text-purple-400">$0.89</span>
              </div>
            </div>

            <Link
              href="/donate?plan=ultra"
              id="ultra-upgrade-banner-btn"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-bold font-mono text-base transition-all shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40"
            >
              <Zap size={16} />
              Upgrade to Ultra PRO Now
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
