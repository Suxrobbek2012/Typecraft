'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
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
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password, code }),
    })
    const data = await res.json()

    if (data.success && data.user?.role === 'admin') {
      router.push(`/${process.env.NEXT_PUBLIC_ADMIN_PATH || 'admin-dashboard'}/dashboard`)
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
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-4">
            <Shield className="text-yellow-400" size={24} />
          </div>
          <h1 className="text-white font-bold text-2xl font-mono">Administrator paneli</h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">TypeCraft</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#18181B] border border-[#2A2A2E] rounded-xl p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-red-400 text-sm font-mono">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs text-gray-500 font-mono uppercase tracking-wider block mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="admin@typecraft.com"
              className="w-full bg-[#0E0E10] border border-[#2A2A2E] rounded-lg px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-yellow-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-mono uppercase tracking-wider block mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#0E0E10] border border-[#2A2A2E] rounded-lg px-3 py-2.5 pr-9 text-sm text-white font-mono focus:outline-none focus:border-yellow-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-400 transition-colors"
              >
                {show ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-mono uppercase tracking-wider block mb-1.5">
              2FA Code (agar yoqilgan bo'lsa)
            </label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="123456"
              className="w-full bg-[#0E0E10] border border-[#2A2A2E] rounded-lg px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-yellow-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-yellow-500 text-black font-bold hover:bg-yellow-400 disabled:opacity-50 transition-all font-mono text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              'Kirish'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
