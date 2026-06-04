'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon, User, Settings, Heart, LogOut, Crown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { TypeCraftLogo } from '@/components/svg/Logo'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { useLocale } from '@/components/layout/LocaleProvider'

interface Me {
  username: string
  role: string
  isPro: boolean
  avatar?: string
}

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { t } = useLocale()
  const [mounted,  setMounted]  = useState(false)
  const [me,       setMe]       = useState<Me | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetch('/api/auth?action=me')
      .then(r => r.json())
      .then(d => { if (d.user) setMe(d.user) })
      .catch(() => {})
  }, [])

  async function logout() {
    await fetch('/api/auth?action=logout', { method: 'POST' })
    setMe(null)
    setMenuOpen(false)
    window.location.href = '/'
  }

  const navLinks = [
    { href: '/', label: t.nav.type },
    { href: '/practice', label: t.nav.practice },
    { href: '/leaderboard', label: t.nav.leaderboard },
    { href: '/donate', label: t.nav.donate, icon: Heart },
  ]

  return (
    <nav className="w-full border-b border-custom bg-surface/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" aria-label="TypeCraft">
          <TypeCraftLogo size={32} />
          <span className="font-display font-bold text-xl tracking-tight group-hover:text-accent transition-colors">
            Type<span className="text-accent">Craft</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-sub hover:text-accent hover:bg-card transition-all"
            >
              {Icon && <Icon size={12} />}
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-md text-sub hover:text-accent hover:bg-card transition-all"
              aria-label={t.nav.toggleTheme}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}

          <Link href="/settings" className="p-2 rounded-md text-sub hover:text-accent hover:bg-card transition-all" aria-label={t.nav.settings}>
            <Settings size={16} />
          </Link>

          {me ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-card transition-all border border-transparent hover:border-custom"
              >
                <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs overflow-hidden">
                  {me.avatar
                    ? <img src={me.avatar} alt={me.username} className="w-full h-full object-cover rounded-full" />
                    : me.username[0].toUpperCase()
                  }
                </div>
                <span className="text-sm font-mono font-medium hidden sm:block max-w-[80px] truncate">
                  {me.username}
                </span>
                {me.isPro && <Crown size={11} className="text-accent" />}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-custom rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                  <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-surface hover:text-accent transition-colors">
                    <User size={13} /> {t.nav.profile}
                  </Link>
                  <Link href="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-surface hover:text-accent transition-colors">
                    <Settings size={13} /> {t.nav.settings}
                  </Link>
                  {me.role === 'admin' && (
                    <Link href={`/${process.env.NEXT_PUBLIC_ADMIN_PATH || 'admin-dashboard'}/dashboard`} onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-accent hover:bg-surface transition-colors border-t border-custom">
                      <Crown size={13} /> {t.nav.admin}
                    </Link>
                  )}
                  <button onClick={logout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-sub hover:text-wrong hover:bg-surface transition-colors border-t border-custom">
                    <LogOut size={13} /> {t.nav.logout}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm bg-accent text-dark-bg font-medium hover:bg-accent-light transition-all">
              <User size={13} />
              {t.nav.login}
            </Link>
          )}
        </div>
      </div>

      {menuOpen && <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />}
    </nav>
  )
}