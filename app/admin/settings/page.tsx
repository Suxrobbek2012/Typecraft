'use client'

import { useState, useEffect } from 'react'
import { Save, Eye, EyeOff, Percent, Clock, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLocale } from '@/components/layout/LocaleProvider'

interface AdminConfig {
  cards: {
    uzsNumber: string
    uzsHolder: string
    uzsBank: string
    usdNumber: string
    usdHolder: string
    usdBank: string
  }
  discount: {
    active: boolean
    percent: number
    expiresAt: string | null
  }
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
  discount: {
    active: false,
    percent: 50,
    expiresAt: null,
  },
}

function parseLocalDateTime(value: string | null | undefined) {
  if (!value) return null
  const date = new Date(value)
  if (isNaN(date.getTime())) return null
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}

export default function AdminSettings() {
  const { t: tr } = useLocale()
  const [config, setConfig] = useState<AdminConfig>(DEFAULT_CONFIG)
  const [showCards, setShowCards] = useState(false)
  const [savingCards, setSavingCards] = useState(false)
  const [savingDiscount, setSavingDiscount] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin?action=settings')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.config) {
          const cards = data.config.cards || {}
          setConfig({
            cards: {
              uzsNumber: String(cards.uzsNumber || DEFAULT_CONFIG.cards.uzsNumber),
              uzsHolder: String(cards.uzsHolder || cards.holder || DEFAULT_CONFIG.cards.uzsHolder),
              uzsBank:   String(cards.uzsBank || DEFAULT_CONFIG.cards.uzsBank),
              usdNumber: String(cards.usdNumber || DEFAULT_CONFIG.cards.usdNumber),
              usdHolder: String(cards.usdHolder || cards.holder || DEFAULT_CONFIG.cards.usdHolder),
              usdBank:   String(cards.usdBank || DEFAULT_CONFIG.cards.usdBank),
            },
            discount: {
              active:    Boolean(data.config.discount?.active),
              percent:   Number(data.config.discount?.percent ?? DEFAULT_CONFIG.discount.percent),
              expiresAt: parseLocalDateTime(data.config.discount?.expiresAt) || null,
            },
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const expiresAt = config.discount.expiresAt ? new Date(config.discount.expiresAt) : null
  const discountActive = config.discount.active && (!expiresAt || expiresAt.getTime() > Date.now())
  const expiresLabel = expiresAt
    ? expiresAt.getTime() > Date.now()
      ? `${expiresAt.toLocaleString()} ga qadar` 
      : 'Chegirma muddati tugagan'
    : 'Hozircha amal qilmaydi'

  async function saveCardSettings(e: React.FormEvent) {
    e.preventDefault()
    setSavingCards(true)
    const res = await fetch('/api/admin?action=update-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cards: config.cards }),
    })
    const data = await res.json()
    if (data.success) {
      toast.success('Karta sozlamalari saqlandi')
    } else {
      toast.error(data.error || 'Xatolik yuz berdi')
    }
    setSavingCards(false)
  }

  async function saveDiscountSettings(e: React.FormEvent) {
    e.preventDefault()
    setSavingDiscount(true)
    const res = await fetch('/api/admin?action=update-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discount: config.discount }),
    })
    const data = await res.json()
    if (data.success) {
      toast.success('Chegirma sozlamalari saqlandi')
    } else {
      toast.error(data.error || 'Xatolik yuz berdi')
    }
    setSavingDiscount(false)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="max-w-2xl text-sm text-gray-300">Admin paneldan to‘lov kartalari va chegirma holatini boshqarish. Chegirma vaqt tugaganda avtomatik o‘chadi.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-dark-border bg-dark-card p-6 shadow-sm shadow-black/10 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-sub font-semibold">Payment cards</p>
              <p className="text-xs text-gray-500">Uzcard / Visa raqamlarini va ma'lumotlarini yangilang.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowCards(s => !s)}
              className="inline-flex items-center gap-2 rounded-full border border-dark-border px-3 py-2 text-xs font-mono text-sub hover:text-accent transition-all"
            >
              {showCards ? <EyeOff size={14} /> : <Eye size={14} />}
              {showCards ? 'Hide' : 'Show'}
            </button>
          </div>

          <form onSubmit={saveCardSettings} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* UZS Card Section */}
              <div className="space-y-4 border-b border-dark-border pb-6 md:border-b-0 md:border-r md:pr-6">
                <h3 className="text-xs font-mono font-bold tracking-wider text-accent uppercase flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  UZS Currency Card
                </h3>
                
                <label className="block text-xs text-sub font-mono">
                  Card number
                  <input
                    value={config.cards.uzsNumber}
                    onChange={e => setConfig(c => ({ ...c, cards: { ...c.cards, uzsNumber: e.target.value } }))}
                    type={showCards ? 'text' : 'password'}
                    placeholder="8600 0000 0000 0000"
                    className="mt-2 w-full rounded-2xl border border-dark-border bg-dark-surface px-4 py-3 text-sm font-mono text-white outline-none focus:border-accent transition-all duration-200"
                  />
                </label>

                <label className="block text-xs text-sub font-mono">
                  Card holder name
                  <input
                    value={config.cards.uzsHolder}
                    onChange={e => setConfig(c => ({ ...c, cards: { ...c.cards, uzsHolder: e.target.value } }))}
                    placeholder="E.g. Suhrobbek"
                    className="mt-2 w-full rounded-2xl border border-dark-border bg-dark-surface px-4 py-3 text-sm font-mono text-white outline-none focus:border-accent transition-all duration-200"
                  />
                </label>

                <label className="block text-xs text-sub font-mono">
                  Bank / System Name
                  <input
                    value={config.cards.uzsBank}
                    onChange={e => setConfig(c => ({ ...c, cards: { ...c.cards, uzsBank: e.target.value } }))}
                    placeholder="E.g. Uzcard / Humo"
                    className="mt-2 w-full rounded-2xl border border-dark-border bg-dark-surface px-4 py-3 text-sm font-mono text-white outline-none focus:border-accent transition-all duration-200"
                  />
                </label>
              </div>

              {/* USD Card Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold tracking-wider text-accent uppercase flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  USD Currency Card
                </h3>

                <label className="block text-xs text-sub font-mono">
                  Card number
                  <input
                    value={config.cards.usdNumber}
                    onChange={e => setConfig(c => ({ ...c, cards: { ...c.cards, usdNumber: e.target.value } }))}
                    type={showCards ? 'text' : 'password'}
                    placeholder="4111 0000 0000 0000"
                    className="mt-2 w-full rounded-2xl border border-dark-border bg-dark-surface px-4 py-3 text-sm font-mono text-white outline-none focus:border-accent transition-all duration-200"
                  />
                </label>

                <label className="block text-xs text-sub font-mono">
                  Card holder name
                  <input
                    value={config.cards.usdHolder}
                    onChange={e => setConfig(c => ({ ...c, cards: { ...c.cards, usdHolder: e.target.value } }))}
                    placeholder="E.g. Suhrobbek"
                    className="mt-2 w-full rounded-2xl border border-dark-border bg-dark-surface px-4 py-3 text-sm font-mono text-white outline-none focus:border-accent transition-all duration-200"
                  />
                </label>

                <label className="block text-xs text-sub font-mono">
                  Bank / System Name
                  <input
                    value={config.cards.usdBank}
                    onChange={e => setConfig(c => ({ ...c, cards: { ...c.cards, usdBank: e.target.value } }))}
                    placeholder="E.g. Visa / Mastercard"
                    className="mt-2 w-full rounded-2xl border border-dark-border bg-dark-surface px-4 py-3 text-sm font-mono text-white outline-none focus:border-accent transition-all duration-200"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-3xl border border-dark-border bg-[#111] p-4 flex flex-col gap-2">
              <div className="flex items-center gap-3 text-sm font-mono text-gray-300">
                <Shield size={16} className="text-accent" /> Kartalaringiz serverda xavfsiz saqlanadi.
              </div>
              <p className="text-xs text-gray-500 font-mono">Ma'lumotlar foydalanuvchining to'lov sahifasida real vaqtda yangilanadi.</p>
            </div>

            <button
              type="submit"
              disabled={savingCards}
              className="inline-flex items-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-accent-light disabled:opacity-60 font-mono animate-fade-in"
            >
              <Save size={16} /> {savingCards ? 'Saqlanmoqda...' : 'Karta sozlamalarini saqlash'}
            </button>
          </form>
        </section>

        <aside className="space-y-6 animate-slide-up">
          <section className="rounded-3xl border border-dark-border bg-dark-card p-6 shadow-sm shadow-black/10">
            <form onSubmit={saveDiscountSettings} className="space-y-4">
              <div className="flex items-center gap-3 text-sm font-mono uppercase tracking-[0.16em] text-sub mb-2">
                <Percent size={16} className="text-accent" /> Discount control
              </div>
              <p className="text-xs text-gray-500 font-mono">Chegirma foizini va uning tugash vaqtini belgilang.</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-dark-border bg-[#0D0D10] p-4">
                  <div>
                    <p className="text-sm font-semibold">Chegirma holati</p>
                    <p className="text-xs text-gray-500 font-mono">{discountActive ? 'Faol chegirma' : 'Amal qilmayapti'}</p>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-xs font-mono font-bold ${discountActive ? 'bg-emerald-500/15 text-emerald-300' : 'bg-gray-700 text-gray-400'}`}>
                    {config.discount.percent}%
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <label className="flex items-center gap-2 text-xs font-mono text-sub cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={config.discount.active}
                      onChange={e => setConfig(c => ({ ...c, discount: { ...c.discount, active: e.target.checked } }))}
                      className="rounded border-dark-border bg-dark-surface text-accent focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    Chegirmani yoqish
                  </label>
                </div>

                <label className="block text-xs text-sub font-mono">
                  Chegirma %
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={config.discount.percent}
                    onChange={e => setConfig(c => ({ ...c, discount: { ...c.discount, percent: Number(e.target.value) } }))}
                    className="mt-2 w-full rounded-2xl border border-dark-border bg-dark-surface px-4 py-3 text-sm font-mono text-white outline-none focus:border-accent transition-all duration-200"
                  />
                </label>

                <label className="block text-xs text-sub font-mono">
                  Chegirma tugash vaqti
                  <input
                    type="datetime-local"
                    value={config.discount.expiresAt || ''}
                    onChange={e => setConfig(c => ({ ...c, discount: { ...c.discount, expiresAt: e.target.value || null } }))}
                    className="mt-2 w-full rounded-2xl border border-dark-border bg-dark-surface px-4 py-3 text-sm font-mono text-white outline-none focus:border-accent transition-all duration-200"
                  />
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConfig(c => ({ ...c, discount: { ...c.discount, active: true, percent: 50 } }))}
                    className="rounded-2xl border border-accent/30 bg-accent/5 px-3 py-2.5 text-xs font-semibold text-accent hover:bg-accent/10 transition-all font-mono"
                  >
                    50% Set
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfig(c => ({ ...c, discount: { ...c.discount, active: false } }))}
                    className="rounded-2xl border border-dark-border bg-dark-surface px-3 py-2.5 text-xs font-semibold text-sub hover:text-white transition-all font-mono"
                  >
                    O'chirish
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-dark-border bg-[#0D0D10] p-4 text-xs text-gray-400 font-mono">
                <p>{expiresLabel}</p>
                <p className="mt-2 text-gray-500">Muddati tugaganda tizim chegirmalarni avtomatik o'chiradi.</p>
              </div>

              <button
                type="submit"
                disabled={savingDiscount}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-accent-light disabled:opacity-60 font-mono"
              >
                <Save size={16} /> {savingDiscount ? 'Saqlanmoqda...' : 'Chegirmani saqlash'}
              </button>
            </form>
          </section>
        </aside>
      </div>

      {loading && (
        <div className="mt-6 rounded-3xl border border-dark-border bg-[#111] p-6 text-sm text-gray-500 font-mono">
          Loading saved settings...
        </div>
      )}
    </div>
  )
}
