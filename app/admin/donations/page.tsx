'use client'

import { useEffect, useState } from 'react'
import { Check, X, User, Crown, Star, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

interface Donation {
  _id: string
  donorName: string
  donorEmail?: string
  userId?: string
  amount: number
  currency: string
  plan?: 'basic' | 'ultra'
  message?: string
  status: string
  proGranted: boolean
  createdAt: string
}

interface GrantModal {
  donationId: string
  donorEmail: string
  plan: 'basic' | 'ultra'
}

export default function AdminDonations() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [filter,    setFilter]    = useState('pending')
  const [loading,   setLoading]   = useState(true)
  const [modal,     setModal]     = useState<GrantModal | null>(null)
  const [grantEmail, setGrantEmail] = useState('')
  const [grantPlan,  setGrantPlan]  = useState<'basic' | 'ultra'>('basic')
  const [granting,   setGranting]   = useState(false)

  async function load() {
    setLoading(true)
    const res = await fetch(`/api/admin?action=donations&status=${filter}`)
    const data = await res.json()
    setDonations(data.donations || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  // Open grant modal with pre-filled values from donation
  function openModal(d: Donation) {
    setGrantEmail(d.donorEmail || '')
    setGrantPlan(d.plan || 'basic')
    setModal({ donationId: d._id, donorEmail: d.donorEmail || '', plan: d.plan || 'basic' })
  }

  // Grant PRO by email — most reliable method
  async function handleGrant() {
    if (!grantEmail.trim()) {
      toast.error('Email kiriting')
      return
    }
    setGranting(true)
    try {
      const res = await fetch('/api/admin?action=grant-by-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:      grantEmail.trim(),
          plan:       grantPlan,
          donationId: modal?.donationId,
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.message)
        setModal(null)
        load()
      } else {
        toast.error(data.error || 'Xato')
      }
    } catch {
      toast.error('Tarmoq xatosi')
    } finally {
      setGranting(false)
    }
  }

  async function reject(id: string) {
    const res = await fetch('/api/admin?action=reject-donation', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ donationId: id }),
    })
    if ((await res.json()).success) {
      toast.success('Rad etildi')
      load()
    }
  }

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Donations</h1>
        <div className="flex gap-2">
          {['pending', 'confirmed', 'rejected', 'all'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all border ${
                filter === s ? 'border-accent text-accent bg-accent/10' : 'border-[#2A2A2E] text-gray-500 hover:text-accent'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── How it works banner ── */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-5 text-sm font-mono">
        <p className="text-blue-300 font-semibold mb-1">Qanday ishlaydi:</p>
        <p className="text-gray-400 text-xs leading-relaxed">
          1. Foydalanuvchi donat formasini to'ldiradi va yuboradi<br/>
          2. Siz <span className="text-green-400">✓</span> bosganda modal oyna chiqadi<br/>
          3. Modal ichida email va plan (Basic/Ultra) ko'rsatiladi — tekshiring<br/>
          4. "Berish" bosganda foydalanuvchiga PRO beriladi + donat confirmed bo'ladi
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-[#18181B] border border-[#2A2A2E] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : donations.length === 0 ? (
        <div className="text-center py-16 text-gray-500 font-mono">
          {filter} donations yo'q
        </div>
      ) : (
        <div className="space-y-3">
          {donations.map(d => (
            <div key={d._id} className="bg-[#18181B] border border-[#2A2A2E] rounded-xl p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#0E0E10] flex items-center justify-center shrink-0 mt-0.5">
                  <User size={16} className="text-gray-500" />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Row 1: name + badges */}
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-sm">{d.donorName}</span>

                    {/* Plan badge */}
                    {d.plan === 'ultra' ? (
                      <span className="flex items-center gap-1 text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-mono">
                        <Star size={8} /> Ultra PRO
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] bg-yellow-500/15 text-yellow-400 px-2 py-0.5 rounded-full font-mono">
                        <Crown size={8} /> Basic PRO
                      </span>
                    )}

                    {/* Status badge */}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      d.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                      d.status === 'rejected'  ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {d.status}
                    </span>
                    {d.proGranted && (
                      <span className="text-[10px] bg-accent/15 text-accent px-2 py-0.5 rounded-full font-mono">
                        PRO berilgan
                      </span>
                    )}
                  </div>

                  {/* Row 2: email + amount + date */}
                  <div className="flex items-center gap-3 flex-wrap text-xs">
                    {d.donorEmail && (
                      <span className="text-gray-400 font-mono">{d.donorEmail}</span>
                    )}
                    <span className="text-accent font-mono font-bold">
                      {d.amount.toLocaleString()} {d.currency}
                    </span>
                    {d.message && (
                      <span className="text-gray-600 italic truncate max-w-[200px]">"{d.message}"</span>
                    )}
                    <span className="text-gray-600 font-mono ml-auto">
                      {new Date(d.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {d.status === 'pending' && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => openModal(d)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all text-xs font-mono"
                      title="Tasdiqlash va PRO berish"
                    >
                      <Check size={13} /> Berish
                    </button>
                    <button
                      onClick={() => reject(d._id)}
                      className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                      title="Rad etish"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Grant Modal ── */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#18181B] border border-[#2A2A2E] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-2 mb-5">
              <Zap size={18} className="text-accent" />
              <h2 className="font-display text-lg font-bold">PRO Berish</h2>
            </div>

            {/* Plan selector */}
            <div className="mb-4">
              <label className="text-xs text-gray-500 font-mono uppercase tracking-wider block mb-2">Plan tanlang</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setGrantPlan('basic')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border font-mono text-sm font-semibold transition-all ${
                    grantPlan === 'basic'
                      ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                      : 'bg-transparent border-[#2A2A2E] text-gray-500 hover:text-yellow-400'
                  }`}
                >
                  <Crown size={14} /> Basic PRO
                </button>
                <button
                  onClick={() => setGrantPlan('ultra')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border font-mono text-sm font-semibold transition-all ${
                    grantPlan === 'ultra'
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                      : 'bg-transparent border-[#2A2A2E] text-gray-500 hover:text-purple-400'
                  }`}
                >
                  <Star size={14} /> Ultra PRO
                </button>
              </div>
            </div>

            {/* Email input */}
            <div className="mb-5">
              <label className="text-xs text-gray-500 font-mono uppercase tracking-wider block mb-2">
                Foydalanuvchi emaili *
              </label>
              <input
                type="email"
                value={grantEmail}
                onChange={e => setGrantEmail(e.target.value)}
                placeholder="user@email.com"
                className="w-full bg-[#0E0E10] border border-[#2A2A2E] focus:border-accent rounded-xl px-4 py-3 font-mono text-sm outline-none transition-colors"
              />
              <p className="text-xs text-gray-600 font-mono mt-1.5">
                ⚠️ Email aynan shu foydalanuvchi ro'yxatdan o'tgan email bilan bir xil bo'lishi kerak
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#2A2A2E] text-gray-500 hover:text-white font-mono text-sm transition-all"
              >
                Bekor
              </button>
              <button
                onClick={handleGrant}
                disabled={granting}
                className={`flex-1 py-2.5 rounded-xl font-mono text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  grantPlan === 'ultra'
                    ? 'bg-purple-500 hover:bg-purple-400 text-white'
                    : 'bg-accent hover:bg-accent-light text-black'
                } disabled:opacity-50`}
              >
                {granting ? (
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check size={14} />
                    {grantPlan === 'ultra' ? 'Ultra PRO Berish' : 'Basic PRO Berish'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
