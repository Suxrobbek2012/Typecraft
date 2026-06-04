'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Eye, EyeOff, Zap } from 'lucide-react'

const ADMIN_PATH = process.env.NEXT_PUBLIC_ADMIN_PATH || 'admin-dashboard'

export default function AdminLogin() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [show,     setShow]     = useState(false)
  const [code,     setCode]     = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res  = await fetch('/api/auth?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, code }),
    })
    const data = await res.json()
    if (data.success && data.user?.role === 'admin') {
      router.push(`/${ADMIN_PATH}/dashboard`)
      router.refresh()
    } else if (data.success && data.user?.role !== 'admin') {
      setError('Bu hisob admin emas')
      setLoading(false)
    } else {
      setError(data.error || 'Login xato')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E0E10] px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#E8B84B]/3 blur-[120px]" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Logo area */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-5">
            <div className="absolute inset-0 rounded-2xl bg-[#E8B84B]/20 blur-xl" />
            <div className="relative w-14 h-14 rounded-2xl bg-[#111113] border border-[#E8B84B]/30 flex items-center justify-center">
              <Shield size={22} className="text-[#E8B84B]" />
            </div>
          </div>
          <h1 className="text-white font-bold text-2xl font-mono tracking-tight">Administrator</h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">TypeCraft paneli</p>
        </div>

        {/* Card */}
        <div className="bg-[#111113] border border-white/8 rounded-2xl p-6 space-y-4 shadow-2xl">
          {error && (
            <div className="bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <p className="text-red-400 text-sm font-mono">{error}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] text-gray-500 font-mono uppercase tracking-widest">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="admin@typecraft.com"
              className="w-full bg-[#0E0E10] border border-white/8 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-[#E8B84B]/50 transition-colors placeholder:text-gray-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] text-gray-500 font-mono uppercase tracking-widest">Password</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#0E0E10] border border-white/8 rounded-xl px-4 py-3 pr-10 text-sm text-white font-mono focus:outline-none focus:border-[#E8B84B]/50 transition-colors placeholder:text-gray-600"
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#E8B84B] transition-colors"
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] text-gray-500 font-mono uppercase tracking-widest">
              2FA Code <span className="normal-case text-gray-600">(ixtiyoriy)</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="123456"
              className="w-full bg-[#0E0E10] border border-white/8 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-[#E8B84B]/50 transition-colors placeholder:text-gray-600"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit as any}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#E8B84B] text-black font-bold font-mono text-sm hover:bg-[#f0c65a] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <Zap size={15} />
                Kirish
              </>
            )}
          </button>
        </div>

        <p className="text-center text-xs text-gray-600 font-mono mt-4">
          TypeCraft · Faqat adminlar uchun
        </p>
      </div>
    </div>
  )
}