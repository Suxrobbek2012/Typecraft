'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Keyboard } from 'lucide-react'
import toast from 'react-hot-toast'
import { KeyboardSVG } from '@/components/svg/KeyboardSVG'
import { useLocale } from '@/components/layout/LocaleProvider'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function LoginForm() {
  const { t: tr } = useLocale()
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [mode,    setMode]    = useState<'login' | 'register'>('login')
  const [show,    setShow]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [gLoad,   setGLoad]   = useState(false)
  const [form, setForm] = useState({ email: '', username: '', password: '' })

  useEffect(() => {
    const err = searchParams.get('error')
    if (err === 'google_cancelled')    toast.error(tr.auth.errGoogleCancel)
    if (err === 'token_failed')        toast.error(tr.auth.errToken)
    if (err === 'server_error')        toast.error(tr.auth.errServer)
    if (err === 'email_not_verified')  toast.error(tr.auth.errEmail)
  }, [searchParams, tr.auth])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res  = await fetch(`/api/auth?action=${mode}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json()

      if (data.success) {
        toast.success(mode === 'login' ? tr.auth.welcomeLogin : tr.auth.welcomeRegister)
        // Admin bo'lsa admin panelga, aks holda profilga
        if (data.user?.role === 'admin') {
          router.push(`/${process.env.NEXT_PUBLIC_ADMIN_PATH || 'admin-dashboard'}/dashboard`)
        } else {
          router.push('/profile')
        }
        router.refresh()
      } else {
        toast.error(data.error || tr.donate.toasts.error)
      }
    } catch {
      toast.error(tr.donate.toasts.network)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-surface border-r border-custom p-16">
        <div className="max-w-md text-center space-y-8">
          <KeyboardSVG className="w-full max-w-xs mx-auto" />
          <div>
            <h2 className="font-display text-3xl font-bold leading-tight mb-3">
              {tr.auth.tagline1}<br />
              <span className="text-accent">{tr.auth.tagline2}</span>
            </h2>
            <p className="text-sub leading-relaxed text-sm">
              {tr.auth.taglineSub}
            </p>
          </div>
          <div className="flex justify-center gap-10">
            {[['10+', tr.auth.statLang], ['∞', tr.auth.statTexts], ['Free', tr.auth.statFree]].map(([val, lbl]) => (
              <div key={lbl} className="text-center">
                <p className="text-accent font-bold text-2xl font-display">{val}</p>
                <p className="text-sub text-xs font-mono mt-0.5">{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm animate-slide-up">
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <Keyboard size={20} className="text-accent" />
            <span className="font-display text-2xl font-bold">
              Type<span className="text-accent">Craft</span>
            </span>
          </Link>

          {/* Tabs */}
          <div className="flex rounded-xl overflow-hidden border border-custom mb-5">
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 text-sm capitalize transition-all font-mono ${
                  mode === m ? 'bg-accent text-dark-bg font-semibold' : 'text-sub hover:text-accent'
                }`}
              >
                {m === 'login' ? tr.auth.login : tr.auth.register}
              </button>
            ))}
          </div>

          {/* Google */}
          <button
            onClick={() => { setGLoad(true); window.location.href = '/api/auth/google' }}
            disabled={gLoad}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-custom bg-card hover:border-accent hover:bg-surface transition-all text-sm font-medium mb-4 disabled:opacity-60"
          >
            {gLoad
              ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              : <GoogleIcon />
            }
            {tr.auth.google}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 border-t border-custom" />
            <span className="text-xs text-sub font-mono">{tr.auth.or}</span>
            <div className="flex-1 border-t border-custom" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-card border border-custom rounded-xl p-5 space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-xs text-sub font-mono uppercase tracking-wider block mb-1.5">{tr.auth.username}</label>
                <input
                  type="text" value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  placeholder="speedtyper42" required minLength={3} maxLength={20}
                  className="w-full bg-surface border border-custom rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            )}
            <div>
              <label className="text-xs text-sub font-mono uppercase tracking-wider block mb-1.5">{tr.auth.email}</label>
              <input
                type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@email.com" required
                className="w-full bg-surface border border-custom rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-sub font-mono uppercase tracking-wider block mb-1.5">{tr.auth.password}</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••" required minLength={8}
                  className="w-full bg-surface border border-custom rounded-lg px-3 py-2.5 pr-9 text-sm font-mono focus:outline-none focus:border-accent transition-colors"
                />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sub hover:text-accent transition-colors">
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg bg-accent text-dark-bg font-semibold hover:bg-accent-light disabled:opacity-50 transition-all font-mono text-sm flex items-center justify-center gap-2"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-dark-bg border-t-transparent rounded-full animate-spin" />
                : mode === 'login' ? tr.auth.login : tr.auth.register
              }
            </button>
          </form>

          <p className="text-center text-xs text-sub mt-4 font-mono">
            <Link href="/" className="hover:text-accent transition-colors">← {tr.auth.backToType}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="text-sub font-mono text-sm">Yuklanmoqda...</span></div>}>
      <LoginForm />
    </Suspense>
  )
}
