'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Crown, Trash2, ShieldOff, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

interface User {
  _id: string
  email: string
  username: string
  role: string
  plan?: string
  isPro: boolean
  createdAt: string
  stats: { testsCompleted: number; bestWpm: number }
}

export default function AdminUsers() {
  const [users,       setUsers]       = useState<User[]>([])
  const [search,      setSearch]      = useState('')
  const [loading,     setLoading]     = useState(true)
  const [page,        setPage]        = useState(1)
  const [total,       setTotal]       = useState(0)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const PER_PAGE = 20

  const load = useCallback(async () => {
    setLoading(true)
    const res  = await fetch(`/api/admin?action=users&search=${search}&page=${page}`)
    const data = await res.json()
    setUsers(data.users || [])
    setTotal(data.total || 0)
    setLoading(false)
  }, [search, page])

  useEffect(() => {
    load()
    fetch('/api/auth?action=me')
      .then(r => r.json())
      .then(d => { if (d.user) setCurrentUser(d.user) })
      .catch(() => {})
  }, [load])

  async function grantPro(userId: string, plan: 'basic' | 'ultra' = 'basic') {
    const res  = await fetch('/api/admin?action=grant-pro', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, plan }) })
    const data = await res.json()
    if (data.success) { toast.success(data.message || 'PRO berildi!'); load() }
    else toast.error(data.error || 'Xato')
  }

  async function revokePro(userId: string) {
    const res = await fetch('/api/admin?action=revoke-pro', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) })
    if ((await res.json()).success) { toast.success('PRO olib tashlandi'); load() }
  }

  async function changeRole(userId: string, role: 'user' | 'pro' | 'admin') {
    const res  = await fetch('/api/admin?action=update-role', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, role }) })
    const data = await res.json()
    if (data.success) { toast.success(data.message || 'Role yangilandi'); load() }
    else toast.error(data.error || 'Xato')
  }

  async function deleteUser(userId: string, username: string) {
    if (!confirm(`"${username}" o'chirilsinmi? Bu amalni ortga qaytarib bo'lmaydi.`)) return
    const res = await fetch('/api/admin?action=delete-user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) })
    if ((await res.json()).success) { toast.success("Foydalanuvchi o'chirildi"); load() }
  }

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono tracking-tight">
            Users
            <span className="text-gray-500 text-base ml-2">({total})</span>
          </h1>
          <p className="text-gray-500 text-sm font-mono mt-0.5">Barcha foydalanuvchilarni boshqaring</p>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Email yoki username..."
            className="bg-[#111113] border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#E8B84B]/40 w-64 placeholder:text-gray-600 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/8 bg-[#111113] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-5 py-3.5 text-[11px] font-mono uppercase tracking-widest text-gray-500">Foydalanuvchi</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-mono uppercase tracking-widest text-gray-500">Role</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-mono uppercase tracking-widest text-gray-500">Testlar</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-mono uppercase tracking-widest text-gray-500">Best WPM</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-mono uppercase tracking-widest text-gray-500">Sana</th>
              <th className="text-right px-5 py-3.5 text-[11px] font-mono uppercase tracking-widest text-gray-500">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-3.5 bg-white/5 rounded-lg animate-pulse" style={{ width: j === 0 ? '140px' : j === 5 ? '80px' : '60px' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-gray-600 font-mono text-sm">
                  Foydalanuvchilar topilmadi
                </td>
              </tr>
            ) : users.map(u => (
              <tr key={u._id} className="border-b border-white/5 hover:bg-white/2 transition-colors group">
                <td className="px-5 py-4">
                  <p className="font-semibold text-white text-sm">{u.username}</p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">{u.email}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {u._id === currentUser?._id ? (
                      <span className="text-xs px-2.5 py-1 rounded-lg font-mono bg-red-500/15 text-red-400 border border-red-500/20">
                        {u.role} (Sen)
                      </span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={e => changeRole(u._id, e.target.value as any)}
                        className="bg-[#0E0E10] border border-white/8 rounded-lg px-2 py-1 text-xs font-mono text-white focus:outline-none focus:border-[#E8B84B]/40 cursor-pointer"
                      >
                        <option value="user">user</option>
                        <option value="pro">pro</option>
                        <option value="admin">admin</option>
                      </select>
                    )}
                    {u.plan === 'ultra' && u.role === 'pro' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-lg font-mono bg-purple-500/15 text-purple-400 border border-purple-500/20">ultra</span>
                    )}
                    {u.plan === 'basic' && u.role === 'pro' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-lg font-mono bg-[#E8B84B]/10 text-[#E8B84B] border border-[#E8B84B]/20">basic</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4 font-mono text-gray-400 text-sm">{u.stats.testsCompleted}</td>
                <td className="px-5 py-4 font-mono text-[#E8B84B] text-sm font-semibold">{u.stats.bestWpm}</td>
                <td className="px-5 py-4 font-mono text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {u._id !== currentUser?._id && (
                      <>
                        {u.isPro ? (
                          <button onClick={() => revokePro(u._id)} title="PRO olib tashlash"
                            className="p-2 rounded-lg text-gray-500 hover:text-[#E8B84B] hover:bg-[#E8B84B]/10 transition-all">
                            <ShieldOff size={13} />
                          </button>
                        ) : (
                          <>
                            <button onClick={() => grantPro(u._id, 'basic')} title="Basic PRO berish"
                              className="p-2 rounded-lg text-gray-500 hover:text-[#E8B84B] hover:bg-[#E8B84B]/10 transition-all">
                              <Crown size={13} />
                            </button>
                            <button onClick={() => grantPro(u._id, 'ultra')} title="Ultra PRO berish"
                              className="px-2 py-1.5 rounded-lg text-gray-500 hover:text-purple-400 hover:bg-purple-400/10 transition-all text-[10px] font-bold font-mono">
                              Ultra
                            </button>
                          </>
                        )}
                        <button onClick={() => deleteUser(u._id, u.username)} title="O'chirish"
                          className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl border border-white/8 text-gray-500 hover:text-white hover:border-white/20 disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={14} />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-xl font-mono text-sm transition-all ${
                page === i + 1
                  ? 'bg-[#E8B84B] text-black font-bold'
                  : 'border border-white/8 text-gray-500 hover:text-white hover:border-white/20'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-xl border border-white/8 text-gray-500 hover:text-white hover:border-white/20 disabled:opacity-30 transition-all"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  )
}