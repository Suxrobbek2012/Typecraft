'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  Keyboard,
  LayoutDashboard,
  Users,
  Heart,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH || 'admin-dashboard'

const NAV = [
  { href: `/${adminPath}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
  { href: `/${adminPath}/users`, label: 'Users', icon: Users },
  { href: `/${adminPath}/donations`, label: 'Donations', icon: Heart },
  { href: `/${adminPath}/support`, label: 'Support Tickets', icon: MessageSquare },
  { href: `/${adminPath}/settings`, label: 'Settings', icon: Settings },
]

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex items-center gap-2 px-2 mb-6">
        <Keyboard size={18} className="text-yellow-400" />
        <span className="font-bold text-lg">
          Type<span className="text-yellow-400">Craft</span>
        </span>
        <span className="text-[10px] bg-yellow-400/20 text-yellow-400 px-1.5 py-0.5 rounded font-mono ml-1">
          admin
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(`${href}/`)

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all ${
                active
                  ? 'bg-yellow-400/15 text-yellow-300'
                  : 'text-gray-300 hover:bg-white/5 hover:text-yellow-300'
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </nav>

      <a
        href="/api/auth?action=logout"
        className="mt-4 flex items-center gap-2.5 rounded-xl border border-white/10 px-3 py-2.5 text-sm text-gray-300 transition-all hover:border-red-400/30 hover:text-red-300"
      >
        <LogOut size={15} />
        Logout
      </a>
    </div>
  )
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  if (pathname?.endsWith('/login')) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#0E0E10] text-white">
      <div className="border-b border-[#2A2A2E] bg-[#111113]/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Keyboard size={17} className="text-yellow-400" />
            <span className="font-bold text-sm">
              Type<span className="text-yellow-400">Craft</span>
            </span>
            <span className="text-[9px] bg-yellow-400/20 text-yellow-400 px-1.5 py-0.5 rounded font-mono">
              admin
            </span>
          </Link>

          <button
            type="button"
            aria-label="Open admin navigation"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg border border-[#2A2A2E] bg-[#18181B] p-2 text-gray-200"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-57px)] lg:min-h-screen lg:flex-row">
        <aside className="hidden w-64 shrink-0 border-r border-[#2A2A2E] bg-[#111113]/80 px-3 py-6 lg:flex lg:flex-col">
          <SidebarNav />
        </aside>

        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/70 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 w-72 border-r border-[#2A2A2E] bg-[#111113] px-4 py-5 shadow-2xl lg:hidden">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Admin panel</span>
                <button
                  type="button"
                  aria-label="Close admin navigation"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg border border-[#2A2A2E] bg-[#18181B] p-2 text-gray-200"
                >
                  <X size={18} />
                </button>
              </div>
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
            </div>
          </>
        )}

        <main className="flex-1 overflow-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
