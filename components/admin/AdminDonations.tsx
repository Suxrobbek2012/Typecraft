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

const FILTERS = ['pending', 'confirmed', 'rejected', 'all']

export default function AdminDonations() {
  const [donations,   setDonations]   = useState<Donation[]>([])
  const [filter,      setFilter]      = useState('pending')
  const [loading,     setLoading]     = useState(true)
  const [modal,       setModal]       = useState<GrantModal | null>(null)
  const [grantEmail,  setGrantEmail]  = useState('')
  const [grantPlan,   setGrantPlan]   = useState<'basic' | 'ultra'>('basic')
  const [granting,    setGranting]    = useState(false)

  async function load() {
    setLoading(true)
    const res  = await fetch(`/api/admin?action=donations&status=${filter}`)
    const data = await res.json()
    setDonations(data.donations || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  function openModal(d: Donation) {
    setGrantEmail(d.donorEmail || '')
    setGrantPlan(d.plan || 'basic')
    setModal({ donationId: d._id, donorEmail: d.donorEmail || '', plan: d.plan || 'basic' })
  }

  async function handleGrant() {
    if (!grantEmail.trim()) { toast.error('Email kiriting'); return }
    setGranting(true)
    try {
      const res  = await fetch('/api/admin?action=grant-by-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: grantEmail.trim(), plan: grantPlan, donationId: modal?.donationId }),
      })
      const data = await res.json()
      if (data.success) { toast.success(data.message); setModal(null); load() }
      else toast.error(data.error || 'Xato')
    } catch { toast.error('Tarmoq xatosi') }
    finally { setGranting(false) }
  }

  async function reject(id: string) {
    const res = await fetch('/api/admin?action=reject-donation', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ donationId: id }),
    })
    if ((await res.json()).success) { toast.success('Rad etildi'); load() }
  }

  const statusColor: Record<string, string> = {
    confirmed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    rejected:  'bg-red-500/15 text-red-400 border-red-500/20',
    pending:   'bg-[#E8B84B]/10 text-[#E8B84B] border-[#E8B84B]/20',
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono tracking-tight">Donations</h1>
          <p className="text-gray-500 text-sm font-mono mt-0.5">To'lovlarni tasdiqlash va PRO berish</p>
        </div>
        <div className="flex gap-1.5">
          {FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono capitalize transition-all border ${
                filter === s
                  ? 'border-[#E8B84B]/40 text-[#E8B84B] bg-[#E8B84B]/10'
                  : 'border-white/8 text-gray-500 hover:text-white hover:border-white/15'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-4">
        <p className="text-blue-300 font-mono text-xs font-semibold mb-2 uppercase tracking-widest">Qanday ishlaydi</p>
        <p className="text-gray-400 text-xs font-mono leading-relaxed">
          1. Foydalanuvchi donat formasini to'ldiradi · 2. <span className="text-emerald-400">✓ Berish</span> bosilganda modal chiqadi · 3. Email va plan tekshiriladi · 4. Tasdiqlangach PRO beriladi
        </p>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-[#111113] border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : donations.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#111113] py-16 text-center text-gray-600 font-mono text-sm">
          {filter} statusli donatlar yo'q
        </div>
      ) : (
        <div className="space-y-3">
          {donations.map(d => (
            <div key={d._id} className="rounded-2xl border border-white/8 bg-[#111113] p-5 hover:border-white/12 transition-colors">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-[#0E0E10] border border-white/5 flex items-center justify-center shrink-0">
                  <User size={15} className="text-gray-500" />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name + badges */}
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="font-semibold text-white text-sm">{d.donorName}</span>
                    {d.plan === 'ultra' ? (
                      <span className="flex items-center gap-1 text-[10px] bg-purple-500/15 text-purple-400 px-2 py-0.5 rounded-lg font-mono border border-purple-500/20">
                        <Star size={8} /> Ultra PRO
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] bg-[#E8B84B]/10 text-[#E8B84B] px-2 py-0.5 rounded-lg font-mono border border-[#E8B84B]/20">
                        <Crown size={8} /> Basic PRO
                      </span>
                    )}
                    <span className={`text-[10px] px-2 py-0.5 rounded-lg font-mono border ${statusColor[d.status] || statusColor.pending}`}>
                      {d.status}
                    </span>
                    {d.proGranted && (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-lg font-mono border border-emerald-500/20">
                        PRO berilgan
                      </span>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 flex-wrap text-xs font-mono">
                    {d.donorEmail && <span className="text-gray-400">{d.donorEmail}</span>}
                    <span className="text-[#E8B84B] font-bold">{d.amount.toLocaleString()} {d.currency}</span>
                    {d.message && <span className="text-gray-600 italic truncate max-w-[180px]">"{d.message}"</span>}
                    <span className="text-gray-600 ml-auto">{new Date(d.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions */}
                {d.status === 'pending' && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => openModal(d)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all text-xs font-mono"
                    >
                      <Check size={12} /> Berish
                    </button>
                    <button
                      onClick={() => reject(d._id)}
                      className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
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

      {/* Grant Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111113] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#E8B84B]/10 border border-[#E8B84B]/20 flex items-center justify-center">
                <Zap size={16} className="text-[#E8B84B]" />
              </div>
              <div>
                <h2 className="font-mono text-white font-bold text-base">PRO Berish</h2>
                <p className="text-gray-500 text-xs font-mono">Email orqali plan tayinlash</p>
              </div>
            </div>

            {/* Plan selector */}
            <div className="mb-4">
              <label className="text-[11px] text-gray-500 font-mono uppercase tracking-widest block mb-2">Plan tanlang</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setGrantPlan('basic')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border font-mono text-sm font-semibold transition-all ${
                    grantPlan === 'basic'
                      ? 'bg-[#E8B84B]/15 border-[#E8B84B]/40 text-[#E8B84B]'
                      : 'border-white/8 text-gray-500 hover:text-[#E8B84B]'
                  }`}
                >
                  <Crown size={13} /> Basic PRO
                </button>
                <button
                  onClick={() => setGrantPlan('ultra')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border font-mono text-sm font-semibold transition-all ${
                    grantPlan === 'ultra'
                      ? 'bg-purple-500/15 border-purple-500/40 text-purple-400'
                      : 'border-white/8 text-gray-500 hover:text-purple-400'
                  }`}
                >
                  <Star size={13} /> Ultra PRO
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="text-[11px] text-gray-500 font-mono uppercase tracking-widest block mb-2">Foydalanuvchi emaili</label>
              <input
                type="email"
                value={grantEmail}
                onChange={e => setGrantEmail(e.target.value)}
                placeholder="user@email.com"
                className="w-full bg-[#0E0E10] border border-white/8 focus:border-[#E8B84B]/40 rounded-xl px-4 py-3 font-mono text-sm text-white outline-none transition-colors placeholder:text-gray-600"
              />
              <p className="text-xs text-gray-600 font-mono mt-1.5">
                ⚠ Email ro'yxatdan o'tgan email bilan bir xil bo'lishi shart
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2.5">
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/8 text-gray-500 hover:text-white font-mono text-sm transition-all"
              >
                Bekor
              </button>
              <button
                onClick={handleGrant}
                disabled={granting}
                className={`flex-1 py-2.5 rounded-xl font-mono text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                  grantPlan === 'ultra'
                    ? 'bg-purple-500 hover:bg-purple-400 text-white'
                    : 'bg-[#E8B84B] hover:bg-[#f0c65a] text-black'
                }`}
              >
                {granting
                  ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  : <><Check size={13} /> {grantPlan === 'ultra' ? 'Ultra PRO Berish' : 'Basic PRO Berish'}</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}