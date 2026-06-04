'use client'

import { useEffect, useState } from 'react'
import { Users, Activity, DollarSign, Clock, Bell, TrendingUp, Wifi } from 'lucide-react'
import Link from 'next/link'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

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
        .then(d => {
          if (d.error) setError(d.error)
          else setStats(d)
        })
        .catch(() => setError('API ga ulanib bo\'lmadi'))
        .finally(() => setLoading(false))
    }

    fetchStats()
    const interval = setInterval(fetchStats, 10000) // Har 10 soniyada yangilab turish
    return () => clearInterval(interval)
  }, [])

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
      <p className="text-red-400 font-mono text-sm">{error}</p>
      <button onClick={() => window.location.reload()}
        className="px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-sm font-mono">
        Qayta urinish
      </button>
    </div>
  )

  const cards = stats ? [
    { icon: Users,      label: 'Jami foydalanuvchilar', value: stats.totalUsers.toLocaleString(),               color: 'text-blue-400' },
    { icon: Activity,   label: 'Jami testlar',           value: stats.totalTests.toLocaleString(),              color: 'text-green-400' },
    { icon: DollarSign, label: "Daromad (ming so'm)",    value: `${Math.round(stats.totalRevenue/1000)}k`,      color: 'text-yellow-400' },
    { icon: Bell,       label: 'Kutilayotgan donatlar',  value: stats.pendingDonations,                         color: stats.pendingDonations > 0 ? 'text-orange-400' : 'text-gray-500' },
    { icon: Clock,      label: 'Bugungi faol',           value: stats.activeToday,                              color: 'text-purple-400' },
    { icon: TrendingUp, label: '7 kunlik faol',         value: stats.activeLast7Days,                          color: 'text-emerald-400' },
    { icon: Wifi,       label: 'Hozir onlayn',          value: stats.onlineUsers ?? 0,                         color: 'text-cyan-400' },
    { icon: Clock,      label: 'Bu hafta yangi',         value: stats.newUsersThisWeek,                         color: 'text-sky-400' },
  ] : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-[1.7rem]" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>Dashboard</h1>
        <p className="mt-2 text-sm text-gray-500 font-mono">TypeCraft admin paneli</p>
      </div>

      {stats?.discount?.active && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          50% chegirma faollashtirilgan. Muddat: {stats.discount.expiresAt ? new Date(stats.discount.expiresAt).toLocaleString() : 'cheksiz'}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-[#18181B] border border-[#2A2A2E] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-2xl border border-[#2A2A2E] bg-[#18181B] p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <Icon size={16} className={color} />
              </div>
              <p className={`font-mono text-xl font-bold sm:text-2xl ${color}`}>{value}</p>
              <p className="mt-1 text-xs text-gray-500 font-mono">{label}</p>
            </div>
          ))}
        </div>
      )}

      {mounted && stats?.weeklyActiveData && (
        <div className="rounded-2xl border border-[#2A2A2E] bg-[#18181B] p-4 sm:p-5">
          <h2 className="mb-4 text-sm font-bold text-gray-400 font-mono">Haftalik faol foydalanuvchilar dinamikasi (Weekly Active Users)</h2>
          <div className="h-64 w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.weeklyActiveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E8B84B" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#E8B84B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2E" />
                <XAxis dataKey="name" stroke="#888891" fontSize={11} tickLine={false} />
                <YAxis stroke="#888891" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F1F23', borderColor: '#2A2A2E', borderRadius: '8px' }}
                  labelStyle={{ color: '#E5E5E5', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#E8B84B', fontFamily: 'monospace' }}
                />
                <Area type="monotone" dataKey="users" stroke="#E8B84B" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {stats && stats.pendingDonations > 0 && (
        <div className="mt-6 bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-center justify-between">
          <p className="text-orange-400 font-mono text-sm font-semibold">
            🔔 {stats.pendingDonations} ta donat tasdiqlanishini kutmoqda
          </p>
          <Link href={`/${process.env.NEXT_PUBLIC_ADMIN_PATH || 'admin-dashboard'}/donations`}
            className="text-xs text-orange-400 border border-orange-500/30 px-3 py-1.5 rounded-lg hover:bg-orange-500/10 transition-all font-mono">
            Ko'rish →
          </Link>
        </div>
      )}
    </div>
  )
}
