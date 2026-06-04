'use client'

import { useState, useEffect } from 'react'
import { Shield, ShieldAlert, ShieldCheck, Mail, Calendar, MessageSquare, Tag } from 'lucide-react'
import toast from 'react-hot-toast'

interface SupportTicket {
  _id: string
  email: string
  userRole: 'free' | 'ultra' | 'admin'
  subject: string
  message: string
  wordCount: number
  createdAt: string
  isBanned: boolean
  userId: string | null
}

export default function AdminSupportTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [togglingBan, setTogglingBan] = useState<string | null>(null)

  function loadTickets() {
    fetch('/api/admin?action=support-tickets')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.tickets) {
          setTickets(data.tickets)
        }
      })
      .catch(() => toast.error('Xabarlarni yuklab bo\'lmadi.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadTickets()
  }, [])

  async function handleToggleBan(email: string) {
    setTogglingBan(email)
    try {
      const res = await fetch('/api/admin?action=toggle-ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.message)
        // Refresh ticket list to update UI instantly
        loadTickets()
      } else {
        toast.error(data.error || 'Xatolik yuz berdi')
      }
    } catch {
      toast.error('Server bilan bog\'lanishda xatolik!')
    } finally {
      setTogglingBan(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="text-accent" /> Support Tickets
        </h1>
        <p className="text-sub text-sm max-w-2xl font-mono">
          Foydalanuvchilardan kelgan barcha murojaatlar va spam-moderatsiya tizimi.
        </p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-dark-border bg-dark-card p-6 text-sm text-gray-500 font-mono animate-pulse">
          Murojaatlar yuklanmoqda...
        </div>
      ) : tickets.length === 0 ? (
        <div className="rounded-3xl border border-dark-border bg-dark-card p-12 text-center text-sm text-gray-500 font-mono">
          Hozircha hech qanday murojaat kelib tushmagan.
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map(t => (
            <div
              key={t._id}
              className={`rounded-3xl border p-6 bg-dark-card transition-all duration-300 ${
                t.isBanned ? 'border-red-500/20 bg-red-950/5' : 'border-dark-border hover:border-accent/40'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4 border-b border-dark-border/40 pb-4">
                <div className="space-y-1.5">
                  <div className="flex items-center flex-wrap gap-2.5">
                    <span className="font-mono text-sm font-semibold text-white flex items-center gap-1.5">
                      <Mail size={13} className="text-sub" /> {t.email}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                        t.userRole === 'admin'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : t.userRole === 'ultra'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {t.userRole}
                    </span>
                    {t.isBanned && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1 animate-pulse">
                        <ShieldAlert size={10} /> Bloklangan
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-sub font-mono flex items-center gap-1.5">
                    <Calendar size={12} /> {new Date(t.createdAt).toLocaleString()}
                    <span className="text-gray-600">|</span>
                    <Tag size={12} /> {t.wordCount} so'z
                  </p>
                </div>

                <button
                    onClick={() => handleToggleBan(t.email)}
                    disabled={togglingBan === t.email}
                    className={`inline-flex items-center gap-1.5 px-4.5 py-2 rounded-2xl text-xs font-semibold font-mono transition-all duration-200 border ${
                      t.isBanned
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                    }`}
                  >
                    {t.isBanned ? (
                      <>
                        <ShieldCheck size={13} /> Blokdan ochish
                      </>
                    ) : (
                      <>
                        <Shield size={13} /> Bloklash (Ban)
                      </>
                    )}
                  </button>
              </div>

              <div className="space-y-3">
                <h3 className="font-display text-base font-bold text-gray-200">
                  <span className="text-accent">Mavzu:</span> {t.subject}
                </h3>
                <div className="rounded-2xl bg-dark-bg/60 p-4 border border-dark-border/40">
                  <p className="text-gray-300 text-sm font-mono whitespace-pre-wrap leading-relaxed">
                    {t.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
