'use client'

import { useEffect, useState } from 'react'
import { Users, Activity, DollarSign, Clock, Bell, TrendingUp, Wifi, Zap } from 'lucide-react'
import Link from 'next/link'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'

interface Stats {
  totalUsers: number
  totalTests: number
  totalRevenue: number
  pendingDonations: number
  activeToday: number
  activeLast7Days: number
  newUsersThisWeek: number
  totalDonations: number
  discount?: { active: boolean; percent: number; expiresAt?: string | null }
  onlineUsers?: number
  weeklyActiveData?: Array<{ name: string; users: number }>
}

const ADMIN_PATH = process.env.NEXT_PUBLIC_ADMIN_PATH || 'admin-dashboard'

export default function AdminDashboard() {
  const [stats,   setStats]   = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    function fetchStats() {
      fetch('/api/admin?action=stats')
        .then(r => r.json())
        .then(d => { if (d.error) setError(d.error); else setStats(d) })
        .catch(() => setError("API ga ulanib bo'lmadi"))
        .finally(() => setLoading(false))
    }
    fetchStats()
    const iv = setInterval(fetchStats, 10000)
    return () => clearInterval(iv)
  }, [])

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <Zap size={20} className="text-red-400" />
      </div>
      <p className="text-red-400 font-mono text-sm">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 rounded-xl bg-[#E8B84B]/10 text-[#E8B84B] border border-[#E8B84B]/20 text-sm font-mono hover:bg-[#E8B84B]/20 transition-all"
      >
        Qayta urinish
      </button>
    </div>
  )

  const cards = stats ? [
    { icon: Users,      label: 'Jami foydalanuvchilar', value: stats.totalUsers.toLocaleString(),          color: 'text-blue-400',     bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
    { icon: Activity,   label: 'Jami testlar',           value: stats.totalTests.toLocaleString(),         color: 'text-[#E8B84B]',    bg: 'bg-[#E8B84B]/10',  border: 'border-[#E8B84B]/20' },
    { icon: DollarSign, label: "Daromad (ming so'm)",    value: `${Math.round(stats.totalRevenue/1000)}k`, color: 'text-emerald-400',  bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { icon: Bell,       label: 'Kutilayotgan donatlar',  value: stats.pendingDonations,                    color: stats.pendingDonations > 0 ? 'text-orange-400' : 'text-gray-600', bg: stats.pendingDonations > 0 ? 'bg-orange-500/10' : 'bg-white/5', border: stats.pendingDonations > 0 ? 'border-orange-500/20' : 'border-white/10' },
    { icon: Clock,      label: 'Bugungi faol',           value: stats.activeToday,                         color: 'text-purple-400',   bg: 'bg-purple-500/10',  border: 'border-purple-500/20' },
    { icon: TrendingUp, label: '7 kunlik faol',          value: stats.activeLast7Days,                     color: 'text-emerald-400',  bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { icon: Wifi,       label: 'Hozir onlayn',           value: stats.onlineUsers ?? 0,                    color: 'text-cyan-400',     bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20' },
    { icon: Clock,      label: 'Bu hafta yangi',         value: stats.newUsersThisWeek,                    color: 'text-sky-400',      bg: 'bg-sky-500/10',     border: 'border-sky-500/20' },
  ] : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-mono tracking-tight">Dashboard</h1>
        <p className="text-gray-500 text-sm font-mono mt-1">TypeCraft admin paneli</p>
      </div>

      {/* Discount banner */}
      {stats?.discount?.active && (
        <div className="rounded-2xl border border-[#E8B84B]/20 bg-[#E8B84B]/5 p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#E8B84B]/15 flex items-center justify-center shrink-0">
            <Zap size={15} className="text-[#E8B84B]" />
          </div>
          <p className="text-sm text-[#E8B84B] font-mono">
            {stats.discount.percent}% chegirma faollashtirilgan.{' '}
            {stats.discount.expiresAt
              ? `Muddat: ${new Date(stats.discount.expiresAt).toLocaleString()}`
              : 'Cheksiz amal qiladi.'}
          </p>
        </div>
      )}

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-[#111113] border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {cards.map(({ icon: Icon, label, value, color, bg, border }) => (
            <div
              key={label}
              className={`rounded-2xl border ${border} ${bg} p-5 group hover:scale-[1.02] transition-all duration-200`}
            >
              <div className={`w-8 h-8 rounded-xl ${bg} border ${border} flex items-center justify-center mb-3`}>
                <Icon size={15} className={color} />
              </div>
              <p className={`font-mono text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-gray-500 text-xs font-mono mt-1 leading-tight">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      {mounted && stats?.weeklyActiveData && (
        <div className="rounded-2xl border border-white/5 bg-[#111113] p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold font-mono text-white">Weekly Active Users</h2>
              <p className="text-xs text-gray-500 font-mono mt-0.5">Haftalik faol foydalanuvchilar dinamikasi</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-[#E8B84B] animate-pulse" />
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.weeklyActiveData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#E8B84B" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#E8B84B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" stroke="#444" fontSize={11} tickLine={false} fontFamily="monospace" />
                <YAxis stroke="#444" fontSize={11} tickLine={false} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181B', borderColor: 'rgba(232,184,75,0.2)', borderRadius: '12px', fontFamily: 'monospace', fontSize: '12px' }}
                  labelStyle={{ color: '#E5E5E5' }}
                  itemStyle={{ color: '#E8B84B' }}
                  cursor={{ stroke: 'rgba(232,184,75,0.2)', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="users" stroke="#E8B84B" strokeWidth={2} fillOpacity={1} fill="url(#gold)" dot={false} activeDot={{ r: 4, fill: '#E8B84B', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Pending donations alert */}
      {stats && stats.pendingDonations > 0 && (
        <div className="rounded-2xl bg-orange-500/5 border border-orange-500/20 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500/15 flex items-center justify-center">
              <Bell size={14} className="text-orange-400" />
            </div>
            <p className="text-orange-400 font-mono text-sm font-semibold">
              {stats.pendingDonations} ta donat tasdiqlanishini kutmoqda
            </p>
          </div>
          <Link
            href={`/${ADMIN_PATH}/donations`}
            className="text-xs text-orange-400 border border-orange-500/25 px-3 py-1.5 rounded-xl hover:bg-orange-500/10 transition-all font-mono"
          >
            Ko'rish →
          </Link>
        </div>
      )}
    </div>
  )
}