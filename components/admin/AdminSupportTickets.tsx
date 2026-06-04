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

const ROLE_STYLE: Record<string, string> = {
  admin: 'bg-[#E8B84B]/10 text-[#E8B84B] border-[#E8B84B]/20',
  ultra: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  free:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
}

export default function AdminSupportTickets() {
  const [tickets,    setTickets]    = useState<SupportTicket[]>([])
  const [loading,    setLoading]    = useState(true)
  const [togglingBan, setTogglingBan] = useState<string | null>(null)

  function loadTickets() {
    fetch('/api/admin?action=support-tickets')
      .then(r => r.json())
      .then(data => { if (data.success && data.tickets) setTickets(data.tickets) })
      .catch(() => toast.error("Xabarlarni yuklab bo'lmadi"))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadTickets() }, [])

  async function handleToggleBan(email: string) {
    setTogglingBan(email)
    try {
      const res  = await fetch('/api/admin?action=toggle-ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) { toast.success(data.message); loadTickets() }
      else toast.error(data.error || 'Xatolik yuz berdi')
    } catch { toast.error("Server bilan bog'lanishda xatolik") }
    finally { setTogglingBan(null) }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono tracking-tight flex items-center gap-2.5">
            <MessageSquare size={20} className="text-[#E8B84B]" />
            Support Tickets
          </h1>
          <p className="text-gray-500 text-sm font-mono mt-0.5">
            Barcha murojaatlar va spam-moderatsiya
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#E8B84B]/5 border border-[#E8B84B]/15">
          <div className="w-1.5 h-1.5 rounded-full bg-[#E8B84B] animate-pulse" />
          <span className="text-[#E8B84B] font-mono text-xs font-semibold">{tickets.length} ta murojaat</span>
        </div>
      </div>

      {/* Tickets */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-[#111113] border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#111113] py-16 text-center">
          <MessageSquare size={32} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 font-mono text-sm">Hozircha hech qanday murojaat kelib tushmagan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map(t => (
            <div
              key={t._id}
              className={`rounded-2xl border p-5 transition-all duration-200 ${
                t.isBanned
                  ? 'border-red-500/15 bg-red-950/5'
                  : 'border-white/8 bg-[#111113] hover:border-white/12'
              }`}
            >
              {/* Top row */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4 pb-4 border-b border-white/5">
                <div className="space-y-1.5">
                  {/* Email + badges */}
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="font-mono text-sm font-semibold text-white flex items-center gap-1.5">
                      <Mail size={12} className="text-gray-500" />
                      {t.email}
                    </span>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono uppercase border ${ROLE_STYLE[t.userRole] || ROLE_STYLE.free}`}>
                      {t.userRole}
                    </span>
                    {t.isBanned && (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse">
                        BANNED
                      </span>
                    )}
                  </div>
                  {/* Date + words */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={11} />
                      {new Date(t.createdAt).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Tag size={11} />
                      {t.wordCount} so'z
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleBan(t.email)}
                  disabled={togglingBan === t.email}
                  className={`px-3.5 py-2 rounded-xl border font-mono text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 ${
                    t.isBanned
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                  }`}
                >
                  {togglingBan === t.email ? (
                    <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : t.isBanned ? (
                    <><ShieldCheck size={12} /> Unban</>
                  ) : (
                    <><ShieldAlert size={12} /> Ban</>
                  )}
                </button>
              </div>

              {/* Message */}
              <div className="space-y-2.5">
                <p className="text-sm text-white font-semibold">
                  <span className="text-[#E8B84B] font-mono text-xs mr-2">SUBJECT</span>
                  {t.subject}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap bg-[#0E0E10] rounded-xl p-4 border border-white/5 font-sans">
                  {t.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}