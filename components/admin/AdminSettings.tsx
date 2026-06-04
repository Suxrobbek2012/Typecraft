'use client'

import { useState, useEffect } from 'react'
import { Save, Eye, EyeOff, Percent, Shield, CreditCard, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

interface AdminConfig {
  cards: {
    uzsNumber: string; uzsHolder: string; uzsBank: string
    usdNumber: string; usdHolder: string; usdBank: string
  }
  discount: { active: boolean; percent: number; expiresAt: string | null }
}

const DEFAULT_CONFIG: AdminConfig = {
  cards: {
    uzsNumber: process.env.NEXT_PUBLIC_DONATE_CARD_UZS || '',
    uzsHolder: process.env.NEXT_PUBLIC_DONATE_CARD_HOLDER || '',
    uzsBank: 'Uzcard',
    usdNumber: process.env.NEXT_PUBLIC_DONATE_CARD_USD || '',
    usdHolder: process.env.NEXT_PUBLIC_DONATE_CARD_HOLDER || '',
    usdBank: 'Visa',
  },
  discount: { active: false, percent: 50, expiresAt: null },
}

function parseLocalDateTime(value: string | null | undefined) {
  if (!value) return null
  const date = new Date(value)
  if (isNaN(date.getTime())) return null
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

function InputField({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; placeholder?: string
}) {
  return (
    <label className="block">
      <span className="text-[11px] text-gray-500 font-mono uppercase tracking-widest block mb-1.5">{label}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0E0E10] border border-white/8 rounded-xl px-4 py-3 text-sm font-mono text-white outline-none focus:border-[#E8B84B]/40 transition-colors placeholder:text-gray-600"
      />
    </label>
  )
}

export default function AdminSettings() {
  const [config,        setConfig]        = useState<AdminConfig>(DEFAULT_CONFIG)
  const [showCards,     setShowCards]     = useState(false)
  const [savingCards,   setSavingCards]   = useState(false)
  const [savingDiscount, setSavingDiscount] = useState(false)
  const [loading,       setLoading]       = useState(true)

  useEffect(() => {
    fetch('/api/admin?action=settings')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.config) {
          const cards = data.config.cards || {}
          setConfig({
            cards: {
              uzsNumber: String(cards.uzsNumber || DEFAULT_CONFIG.cards.uzsNumber),
              uzsHolder: String(cards.uzsHolder || DEFAULT_CONFIG.cards.uzsHolder),
              uzsBank:   String(cards.uzsBank || DEFAULT_CONFIG.cards.uzsBank),
              usdNumber: String(cards.usdNumber || DEFAULT_CONFIG.cards.usdNumber),
              usdHolder: String(cards.usdHolder || DEFAULT_CONFIG.cards.usdHolder),
              usdBank:   String(cards.usdBank || DEFAULT_CONFIG.cards.usdBank),
            },
            discount: {
              active:    Boolean(data.config.discount?.active),
              percent:   Number(data.config.discount?.percent ?? 50),
              expiresAt: parseLocalDateTime(data.config.discount?.expiresAt) || null,
            },
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const expiresAt      = config.discount.expiresAt ? new Date(config.discount.expiresAt) : null
  const discountActive = config.discount.active && (!expiresAt || expiresAt.getTime() > Date.now())
  const expiresLabel   = expiresAt
    ? expiresAt.getTime() > Date.now()
      ? `${expiresAt.toLocaleString()} gacha`
      : 'Muddat tugagan'
    : 'Muddat belgilanmagan'

  async function saveCards(e: React.FormEvent) {
    e.preventDefault(); setSavingCards(true)
    const res = await fetch('/api/admin?action=update-settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cards: config.cards }) })
    const data = await res.json()
    data.success ? toast.success('Karta sozlamalari saqlandi') : toast.error(data.error || 'Xatolik')
    setSavingCards(false)
  }

  async function saveDiscount(e: React.FormEvent) {
    e.preventDefault(); setSavingDiscount(true)
    const res = await fetch('/api/admin?action=update-settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ discount: config.discount }) })
    const data = await res.json()
    data.success ? toast.success('Chegirma saqlandi') : toast.error(data.error || 'Xatolik')
    setSavingDiscount(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-mono tracking-tight">Settings</h1>
        <p className="text-gray-500 text-sm font-mono mt-0.5">To'lov kartalari va chegirma boshqaruvi</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Cards section */}
        <div className="rounded-2xl border border-white/8 bg-[#111113] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#E8B84B]/10 border border-[#E8B84B]/20 flex items-center justify-center">
                <CreditCard size={14} className="text-[#E8B84B]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white font-mono">Payment Cards</p>
                <p className="text-xs text-gray-500 font-mono mt-0.5">Uzcard va Visa ma'lumotlari</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowCards(s => !s)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/8 text-xs font-mono text-gray-500 hover:text-white hover:border-white/15 transition-all"
            >
              {showCards ? <EyeOff size={12} /> : <Eye size={12} />}
              {showCards ? 'Yashirish' : "Ko'rsatish"}
            </button>
          </div>

          <form onSubmit={saveCards} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              {/* UZS */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E8B84B] animate-pulse" />
                  <span className="text-[11px] font-mono font-bold text-[#E8B84B] uppercase tracking-widest">UZS Card</span>
                </div>
                <InputField label="Karta raqami" value={config.cards.uzsNumber}
                  onChange={v => setConfig(c => ({ ...c, cards: { ...c.cards, uzsNumber: v } }))}
                  type={showCards ? 'text' : 'password'} placeholder="8600 0000 0000 0000" />
                <InputField label="Karta egasi" value={config.cards.uzsHolder}
                  onChange={v => setConfig(c => ({ ...c, cards: { ...c.cards, uzsHolder: v } }))}
                  placeholder="Suhrobbek" />
                <InputField label="Bank / Tizim" value={config.cards.uzsBank}
                  onChange={v => setConfig(c => ({ ...c, cards: { ...c.cards, uzsBank: v } }))}
                  placeholder="Uzcard / Humo" />
              </div>

              {/* USD */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-widest">USD Card</span>
                </div>
                <InputField label="Karta raqami" value={config.cards.usdNumber}
                  onChange={v => setConfig(c => ({ ...c, cards: { ...c.cards, usdNumber: v } }))}
                  type={showCards ? 'text' : 'password'} placeholder="4111 0000 0000 0000" />
                <InputField label="Karta egasi" value={config.cards.usdHolder}
                  onChange={v => setConfig(c => ({ ...c, cards: { ...c.cards, usdHolder: v } }))}
                  placeholder="Suhrobbek" />
                <InputField label="Bank / Tizim" value={config.cards.usdBank}
                  onChange={v => setConfig(c => ({ ...c, cards: { ...c.cards, usdBank: v } }))}
                  placeholder="Visa / Mastercard" />
              </div>
            </div>

            {/* Security note */}
            <div className="rounded-xl border border-white/5 bg-[#0E0E10] p-4 flex items-center gap-3">
              <Shield size={14} className="text-[#E8B84B] shrink-0" />
              <p className="text-xs text-gray-500 font-mono">Karta ma'lumotlari serverda xavfsiz saqlanadi va faqat to'lov sahifasida ko'rsatiladi.</p>
            </div>

            <button type="submit" disabled={savingCards}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#E8B84B] text-black font-bold font-mono text-sm hover:bg-[#f0c65a] active:scale-[0.98] disabled:opacity-50 transition-all">
              <Save size={14} />
              {savingCards ? 'Saqlanmoqda...' : 'Kartalarni saqlash'}
            </button>
          </form>
        </div>

        {/* Discount section */}
        <div className="rounded-2xl border border-white/8 bg-[#111113] p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#E8B84B]/10 border border-[#E8B84B]/20 flex items-center justify-center">
              <Percent size={14} className="text-[#E8B84B]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white font-mono">Discount Control</p>
              <p className="text-xs text-gray-500 font-mono mt-0.5">Chegirma foiz va muddat</p>
            </div>
          </div>

          <form onSubmit={saveDiscount} className="space-y-4">
            {/* Status indicator */}
            <div className="rounded-xl border border-white/5 bg-[#0E0E10] p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white font-mono">Holat</p>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{discountActive ? 'Faol chegirma' : 'Amal qilmayapti'}</p>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs font-bold ${
                discountActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-gray-500 border border-white/8'
              }`}>
                {discountActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                {config.discount.percent}%
              </div>
            </div>

            {/* Toggle */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => setConfig(c => ({ ...c, discount: { ...c.discount, active: !c.discount.active } }))}
                className={`w-10 h-5.5 rounded-full transition-all relative border ${
                  config.discount.active ? 'bg-[#E8B84B]/20 border-[#E8B84B]/40' : 'bg-white/5 border-white/10'
                }`}
                style={{ height: '22px' }}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
                  config.discount.active ? 'left-5 bg-[#E8B84B]' : 'left-0.5 bg-gray-500'
                }`} />
              </div>
              <span className="text-sm font-mono text-gray-300">Chegirmani yoqish</span>
            </label>

            {/* Percent */}
            <div>
              <label className="text-[11px] text-gray-500 font-mono uppercase tracking-widest block mb-1.5">Chegirma %</label>
              <input
                type="number" min={1} max={100}
                value={config.discount.percent}
                onChange={e => setConfig(c => ({ ...c, discount: { ...c.discount, percent: Number(e.target.value) } }))}
                className="w-full bg-[#0E0E10] border border-white/8 rounded-xl px-4 py-3 text-sm font-mono text-white outline-none focus:border-[#E8B84B]/40 transition-colors"
              />
            </div>

            {/* Expires */}
            <div>
              <label className="text-[11px] text-gray-500 font-mono uppercase tracking-widest block mb-1.5">Tugash vaqti</label>
              <input
                type="datetime-local"
                value={config.discount.expiresAt || ''}
                onChange={e => setConfig(c => ({ ...c, discount: { ...c.discount, expiresAt: e.target.value || null } }))}
                className="w-full bg-[#0E0E10] border border-white/8 rounded-xl px-4 py-3 text-sm font-mono text-white outline-none focus:border-[#E8B84B]/40 transition-colors"
              />
            </div>

            {/* Quick buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button type="button"
                onClick={() => setConfig(c => ({ ...c, discount: { ...c.discount, active: true, percent: 50 } }))}
                className="py-2.5 rounded-xl border border-[#E8B84B]/25 bg-[#E8B84B]/5 text-xs font-mono font-bold text-[#E8B84B] hover:bg-[#E8B84B]/10 transition-all">
                50% Set
              </button>
              <button type="button"
                onClick={() => setConfig(c => ({ ...c, discount: { ...c.discount, active: false } }))}
                className="py-2.5 rounded-xl border border-white/8 bg-[#0E0E10] text-xs font-mono font-bold text-gray-500 hover:text-white transition-all">
                O'chirish
              </button>
            </div>

            {/* Info */}
            <div className="rounded-xl border border-white/5 bg-[#0E0E10] p-3.5 flex items-start gap-2.5">
              <Clock size={12} className="text-gray-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-mono">{expiresLabel}</p>
                <p className="text-xs text-gray-600 font-mono mt-1">Muddati tugaganda tizim avtomatik o'chiradi.</p>
              </div>
            </div>

            <button type="submit" disabled={savingDiscount}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#E8B84B] text-black font-bold font-mono text-sm hover:bg-[#f0c65a] active:scale-[0.98] disabled:opacity-50 transition-all">
              <Save size={14} />
              {savingDiscount ? 'Saqlanmoqda...' : 'Chegirmani saqlash'}
            </button>
          </form>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border border-white/5 bg-[#111113] p-5 text-sm text-gray-500 font-mono animate-pulse">
          Sozlamalar yuklanmoqda...
        </div>
      )}
    </div>
  )
}