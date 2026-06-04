'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, Heart, Zap, Shield, BarChart2, Crown, Star, Lock } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import toast from 'react-hot-toast'
import { useLocale } from '@/components/layout/LocaleProvider'

interface CardInfo {
  currency: string
  number: string
  holder: string
  bank: string
}

type Plan = 'basic' | 'ultra'
type Currency = 'UZS' | 'USD'

interface DiscountInfo {
  active: boolean
  percent: number
  expiresAt?: string | null
}

const PLANS = {
  basic: {
    name: 'Basic PRO',
    price: { USD: '$0.39', UZS: '5 000 so\'m' },
    amount: { USD: 0.39, UZS: 5000 },
    color: 'from-yellow-500/20 to-yellow-600/10',
    border: 'border-yellow-500/40',
    accent: 'text-yellow-400',
    badge: 'bg-yellow-500/20 text-yellow-400',
    icon: Crown,
    features: [] as string[],
  },
  ultra: {
    name: 'Ultra PRO',
    price: { USD: '$0.89', UZS: '11 000 so\'m' },
    amount: { USD: 0.89, UZS: 11000 },
    color: 'from-purple-500/20 to-pink-600/10',
    border: 'border-purple-500/40',
    accent: 'text-purple-400',
    badge: 'bg-purple-500/20 text-purple-400',
    icon: Star,
    features: [] as string[],
  },
}

export function DonatePage() {
  const { t: tr } = useLocale()
  const plansWithFeatures = {
    basic: { ...PLANS.basic, name: tr.donate.basic, features: tr.donate.features.basic },
    ultra: { ...PLANS.ultra, name: tr.donate.ultra, features: tr.donate.features.ultra },
  }
  const [cards,     setCards]     = useState<CardInfo[]>([])
  const [copied,    setCopied]    = useState<string | null>(null)
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [step,      setStep]      = useState<'plan' | 'pay' | 'form'>('plan')
  const [selPlan,   setSelPlan]   = useState<Plan | null>(null)
  const [selCur,    setSelCur]    = useState<Currency>('UZS')

  const [currentUser, setCurrentUser] = useState<{id: string; email: string; username: string} | null>(null)
  const [discount, setDiscount] = useState<DiscountInfo | null>(null)

  const [form, setForm] = useState({
    donorName:  '',
    donorEmail: '',
    message:    '',
  })

  useEffect(() => {
    fetch('/api/donate')
      .then(r => r.json())
      .then(d => {
        setCards(d.cards || [])
        if (d.discount) {
          setDiscount({
            active: Boolean(d.discount.active),
            percent: Number(d.discount.percent ?? 50),
            expiresAt: d.discount.expiresAt || null,
          })
        }
      })

    // Fetch current user to auto-fill and link donation
    fetch('/api/auth?action=me')
      .then(r => r.json())
      .then(d => {
        if (d.user) {
          setCurrentUser({ id: d.user.id, email: d.user.email, username: d.user.username })
          setForm(f => ({ ...f, donorEmail: d.user.email, donorName: d.user.username }))
        }
      })
      .catch(() => {})
  }, [])

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    toast.success(tr.donate.toasts.copied)
    setTimeout(() => setCopied(null), 2000)
  }

  function choosePlan(plan: Plan) {
    setSelPlan(plan)
    setStep('pay')
  }

  function goToForm() {
    setStep('form')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.donorName) {
      toast.error(tr.donate.toasts.nameRequired)
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/donate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          ...form,
          plan:     selPlan,
          currency: selCur,
          userId:   currentUser?.id || undefined,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
        toast.success(tr.donate.toasts.success)
      } else {
        toast.error(data.error || tr.donate.toasts.error)
      }
    } catch {
      toast.error(tr.donate.toasts.network)
    } finally {
      setLoading(false)
    }
  }

  const plan = selPlan ? plansWithFeatures[selPlan] : null
  const activeCard = cards.find(c => c.currency === selCur)
  const discountActive = discount?.active && (!discount.expiresAt || new Date(discount.expiresAt).getTime() > Date.now())
  const lockedAmount = plan ? plan.amount[selCur] : 0
  const discountedAmount = discountActive
    ? selCur === 'UZS'
      ? Math.round(lockedAmount * (100 - discount.percent) / 100)
      : Number((lockedAmount * (100 - discount.percent) / 100).toFixed(2))
    : lockedAmount
  const displayPrice = selCur === 'UZS'
    ? `${discountActive ? discountedAmount.toLocaleString() : lockedAmount.toLocaleString()} so'm`
    : `$${discountActive ? discountedAmount.toFixed(2) : lockedAmount.toFixed(2)}`
  const discountLabel = discountActive ? `${discount.percent}% chegirma!` : ''

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-16 w-full">

        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 mb-5">
            <Heart className="text-accent" size={24} />
          </div>
          <h1 className="font-display text-4xl font-bold mb-3">{tr.donate.title}</h1>
          <p className="text-sub max-w-md mx-auto leading-relaxed">{tr.donate.subtitle}</p>
        </div>

        {/* STEP 1 — Plan selection */}
        {step === 'plan' && (
          <div className="animate-slide-up">
            <h2 className="font-display text-lg font-bold mb-5 text-center">{tr.donate.pickPlan}</h2>
            <div className="grid md:grid-cols-2 gap-5 mb-6">
              {(Object.entries(plansWithFeatures) as [Plan, typeof plansWithFeatures.basic][]).map(([key, p]) => {
                const Icon = p.icon
                return (
                  <button
                    key={key}
                    onClick={() => choosePlan(key)}
                    className={`bg-gradient-to-br ${p.color} border ${p.border} rounded-2xl p-6 text-left hover:scale-[1.02] transition-all duration-200 group`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-mono px-2 py-1 rounded-full font-semibold ${p.badge}`}>{p.name}</span>
                      <Icon size={20} className={p.accent} />
                    </div>
                    <div className="mb-4">
                      <span className={`text-3xl font-bold font-mono ${p.accent}`}>{p.price.USD}</span>
                      <span className="text-sub text-sm ml-2 font-mono">/ {p.price.UZS}</span>
                      {discountActive && (
                        <p className="text-[11px] mt-2 text-green-300">{discountLabel}</p>
                      )}
                    </div>
                    <ul className="space-y-1.5 mb-5">
                      {p.features.map((f: string) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-sub">
                          <Check size={13} className={`${p.accent} mt-0.5 shrink-0`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className={`w-full py-2.5 rounded-xl font-mono font-semibold text-sm text-center border ${p.border} ${p.accent} group-hover:bg-white/5 transition-all`}>
                      {p.name} {tr.donate.getPlan} →
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Free comparison */}
            <div className="bg-card border border-custom rounded-xl p-4 text-center">
              <p className="text-sub text-sm font-mono">
                {tr.donate.freeCompare}
              </p>
            </div>
          </div>
        )}

        {/* STEP 2 — Payment details */}
        {step === 'pay' && plan && (
          <div className="animate-slide-up">
            <button onClick={() => setStep('plan')} className="text-sub text-sm font-mono mb-6 hover:text-accent transition-colors flex items-center gap-1">
              ← {tr.donate.back}
            </button>

            <div className={`bg-gradient-to-br ${plan.color} border ${plan.border} rounded-2xl p-5 mb-6`}>
              <div className="flex items-center gap-2 mb-2">
                <plan.icon size={16} className={plan.accent} />
                <span className={`font-mono font-bold ${plan.accent}`}>{plan.name}</span>
              </div>
              <p className="text-sub text-sm font-mono">{tr.donate.payInstruction}</p>
            </div>

            {/* Currency switcher */}
            <div className="flex rounded-lg overflow-hidden border border-custom mb-4 w-fit">
              {(['UZS', 'USD'] as Currency[]).map(c => (
                <button
                  key={c}
                  onClick={() => setSelCur(c)}
                  className={`px-4 py-2 text-sm font-mono transition-all ${selCur === c ? 'bg-accent text-dark-bg font-bold' : 'text-sub hover:text-accent'}`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Card */}
            {activeCard && (
              <div className="bg-card border border-custom rounded-xl p-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-sub">{activeCard.bank}</span>
                  <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">{activeCard.currency}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <code className="font-mono text-xl font-bold tracking-widest">{activeCard.number}</code>
                  <button
                    onClick={() => copy(activeCard.number.replace(/\s/g, ''), activeCard.currency)}
                    className="p-2 rounded-lg border border-custom hover:border-accent hover:text-accent transition-all"
                  >
                    {copied === activeCard.currency ? <Check size={14} className="text-correct" /> : <Copy size={14} />}
                  </button>
                </div>
                <p className="text-xs text-sub mt-2">{activeCard.holder}</p>
              </div>
            )}

            {/* Locked amount */}
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border ${plan.border} rounded-xl px-4 py-3 mb-6 bg-black/20`}>
              <div className="flex items-center gap-2">
                <Lock size={14} className={plan.accent} />
                <span className="text-sub text-sm font-mono">{tr.donate.amount}</span>
                <span className={`font-mono font-bold text-lg ${plan.accent}`}>
                  {displayPrice}
                </span>
              </div>
              <button
                onClick={goToForm}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-accent text-dark-bg font-bold font-mono hover:bg-accent-light transition-all text-center"
              >
                {tr.donate.continuePay}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Confirmation form */}
        {step === 'form' && plan && (
          <div className="animate-slide-up">
            <button onClick={() => setStep('pay')} className="text-sub text-sm font-mono mb-6 hover:text-accent transition-colors flex items-center gap-1">
              ← {tr.donate.back}
            </button>

            {submitted ? (
              <div className="text-center py-12 bg-card border border-correct/20 rounded-2xl">
                <Check size={40} className="text-correct mx-auto mb-4" />
                <h3 className="font-display text-2xl font-bold mb-2">{tr.donate.success}</h3>
                <p className="text-sub text-sm max-w-sm mx-auto">
                  {tr.donate.submittedDesc.replace('{plan}', plan.name)}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card border border-custom rounded-2xl p-6 space-y-4">
                <div className={`flex items-center gap-2 pb-4 border-b border-custom`}>
                  <plan.icon size={16} className={plan.accent} />
                  <h2 className="font-display text-lg font-bold">{tr.donate.formTitle}</h2>
                  <span className={`ml-auto text-xs font-mono px-2 py-0.5 rounded-full ${plan.badge}`}>{plan.name}</span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-sub font-mono uppercase tracking-wider block mb-1.5">{tr.donate.name}</label>
                    <input
                      type="text"
                      value={form.donorName}
                      onChange={e => setForm(f => ({ ...f, donorName: e.target.value }))}
                      placeholder={tr.donate.namePh}
                      required
                      className="w-full bg-surface border border-custom rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent font-mono transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-sub font-mono uppercase tracking-wider block mb-1.5">{tr.donate.email}</label>
                    <input
                      type="email"
                      value={form.donorEmail}
                      onChange={e => setForm(f => ({ ...f, donorEmail: e.target.value }))}
                      placeholder={tr.donate.emailPh}
                      className="w-full bg-surface border border-custom rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent font-mono transition-colors"
                    />
                  </div>
                </div>

                <div className={`flex items-center gap-2 border ${plan.border} rounded-lg px-3 py-2.5 bg-black/10`}>
                  <Lock size={12} className={plan.accent} />
                  <span className="text-sub text-xs font-mono">{tr.donate.amount}</span>
                  <span className={`font-mono font-bold ${plan.accent}`}>
                    {displayPrice}
                  </span>
                  <span className="text-sub text-xs ml-1">({selCur})</span>
                </div>

                <div>
                  <label className="text-xs text-sub font-mono uppercase tracking-wider block mb-1.5">{tr.donate.message}</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder={tr.donate.messagePh}
                    rows={2}
                    maxLength={500}
                    className="w-full bg-surface border border-custom rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent font-mono transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-accent text-dark-bg font-bold hover:bg-accent-light disabled:opacity-50 transition-all font-mono flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="animate-spin w-4 h-4 border-2 border-dark-bg border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Heart size={14} />
                      Adminga xabar yuborish
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
