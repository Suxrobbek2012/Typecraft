'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, Crown, Trash2, ShieldOff } from 'lucide-react'
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
  const [users,   setUsers]   = useState<User[]>([])
  const [search,  setSearch]  = useState('')
  const [loading, setLoading] = useState(true)
  const [page,    setPage]    = useState(1)
  const [total,   setTotal]   = useState(0)
  const [currentUser, setCurrentUser] = useState<any>(null)

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
    const res = await fetch('/api/admin?action=grant-pro', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, plan }),
    })
    const data = await res.json()
    if (data.success) { toast.success(data.message || 'PRO granted!'); load() }
    else toast.error(data.error || 'Failed')
  }

  async function revokePro(userId: string) {
    const res = await fetch('/api/admin?action=revoke-pro', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    if ((await res.json()).success) { toast.success('PRO revoked'); load() }
  }

  async function changeRole(userId: string, role: 'user' | 'pro' | 'admin') {
    const res = await fetch('/api/admin?action=update-role', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role }),
    })
    const data = await res.json()
    if (data.success) {
      toast.success(data.message || 'Role updated');
      load()
    } else {
      toast.error(data.error || 'Failed to update role')
    }
  }

  async function deleteUser(userId: string, username: string) {
    if (!confirm(`Delete user "${username}"? This is irreversible.`)) return
    const res = await fetch('/api/admin?action=delete-user', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    if ((await res.json()).success) { toast.success('User deleted'); load() }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Users <span className="text-sub text-base font-mono">({total})</span></h1>
          <p className="mt-1 text-sm text-gray-500 font-mono">Foydalanuvchilarni qidirish, PRO ni boshqarish va role o‘zgartirish.</p>
        </div>
        <div className="relative w-full lg:max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sub" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search email or username..."
            className="w-full bg-dark-card border border-dark-border rounded-lg pl-8 pr-3 py-2 text-sm font-mono focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-dark-border bg-dark-card">
        <table className="min-w-[900px] w-full text-sm">
          <thead>
            <tr className="border-b border-dark-border text-sub font-mono text-xs uppercase">
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">Tests</th>
              <th className="text-left px-4 py-3">Best WPM</th>
              <th className="text-left px-4 py-3">Joined</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-dark-border">
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-dark-muted rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : users.map(u => (
              <tr key={u._id} className="border-b border-dark-border hover:bg-dark-surface/50 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-semibold">{u.username}</p>
                    <p className="text-xs text-sub font-mono">{u.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {u._id === currentUser?._id ? (
                      <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-red-500/20 text-red-400">
                        {u.role} (You)
                      </span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={e => changeRole(u._id, e.target.value as 'user' | 'pro' | 'admin')}
                        className="bg-[#18181B] border border-dark-border rounded px-1.5 py-0.5 text-xs font-mono focus:outline-none focus:border-accent cursor-pointer"
                      >
                        <option value="user">user</option>
                        <option value="pro">pro</option>
                        <option value="admin">admin</option>
                      </select>
                    )}
                    {u.plan === 'ultra' && u.role === 'pro' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono bg-purple-500/20 text-purple-400">ultra</span>
                    )}
                    {u.plan === 'basic' && u.role === 'pro' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono bg-yellow-500/15 text-yellow-500">basic</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-sub">{u.stats.testsCompleted}</td>
                <td className="px-4 py-3 font-mono text-accent">{u.stats.bestWpm}</td>
                <td className="px-4 py-3 font-mono text-sub text-xs">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {u._id !== currentUser?._id && (
                      <>
                        {u.isPro ? (
                          <button onClick={() => revokePro(u._id)} title="Revoke PRO"
                            className="p-1.5 rounded text-sub hover:text-yellow-400 hover:bg-yellow-400/10 transition-all">
                            <ShieldOff size={13} />
                          </button>
                        ) : (
                          <>
                            <button onClick={() => grantPro(u._id, 'basic')} title="Grant Basic PRO"
                              className="p-1.5 rounded text-sub hover:text-accent hover:bg-accent/10 transition-all">
                              <Crown size={13} />
                            </button>
                            <button onClick={() => grantPro(u._id, 'ultra')} title="Grant Ultra PRO"
                              className="p-1.5 rounded text-sub hover:text-purple-400 hover:bg-purple-400/10 transition-all text-[10px] font-bold font-mono">
                              U
                            </button>
                          </>
                        )}
                        <button onClick={() => deleteUser(u._id, u.username)} title="Delete user"
                          className="p-1.5 rounded text-sub hover:text-red-400 hover:bg-red-400/10 transition-all">
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
      {total > 20 && (
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(Math.ceil(total / 20))].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded font-mono text-sm transition-all ${page === i + 1 ? 'bg-accent text-dark-bg' : 'bg-dark-card border border-dark-border text-sub hover:text-accent'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
