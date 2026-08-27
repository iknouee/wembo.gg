'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LogOut, Menu, X, Loader2, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Auth Context ────────────────────────────────────────────────────────────

interface User {
  id: string
  username: string
  avatar: string | null
  global_name: string | null
}

interface Guild {
  id: string
  name: string
  icon: string | null
  owner: boolean
  permissions: string
}

interface AuthState {
  user: User | null
  guilds: Guild[]
  loading: boolean
  token: string | null
}

const AuthContext = createContext<AuthState>({ user: null, guilds: [], loading: true, token: null })
export const useAuth = () => useContext(AuthContext)

// Read token from cookie via JS (non-httpOnly cookie)
function getToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|; )wembo_token=([^;]*)/)
  return match ? match[1] : null
}

// ─── Shell Component ─────────────────────────────────────────────────────────

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ user: null, guilds: [], loading: true, token: null })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setAuth({ user: null, guilds: [], loading: false, token: null })
      return
    }

    // Fetch user and guilds directly from Discord
    Promise.all([
      fetch('https://discord.com/api/v10/users/@me', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => r.ok ? r.json() : null),
      fetch('https://discord.com/api/v10/users/@me/guilds', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => r.ok ? r.json() : []),
    ]).then(([userData, allGuilds]) => {
      const user = userData ? {
        id: userData.id,
        username: userData.username,
        avatar: userData.avatar,
        global_name: userData.global_name,
      } : null

      const guilds = (allGuilds || []).filter((g: any) => {
        const perms = BigInt(g.permissions)
        return g.owner || (perms & BigInt(0x20)) !== BigInt(0)
      })

      setAuth({ user, guilds, loading: false, token })
    }).catch(() => {
      setAuth({ user: null, guilds: [], loading: false, token: null })
    })
  }, [])

  useEffect(() => { setSidebarOpen(false) }, [pathname])

  if (auth.loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-[#FFD600] animate-spin" />
      </div>
    )
  }

  if (!auth.token) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 mb-4">You need to sign in to access the dashboard.</p>
          <a href="/login" className="px-4 py-2 rounded-lg bg-[#FFD600] text-black text-sm font-semibold">Sign In</a>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={auth}>
      <div className="min-h-screen bg-[#050505]">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-[#090A0C]">
          <div className="h-16 flex items-center justify-between px-5">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-[#FFD600] flex items-center justify-center">
                <span className="text-black font-bold text-[11px]">W</span>
              </div>
              <span className="font-bold text-sm text-white">Wembo</span>
            </Link>
            <a href="/" className="text-white/30 hover:text-white/60 transition-colors" title="Back to home">
              <Home className="h-4 w-4" />
            </a>
          </div>
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              <li>
                <Link href="/dashboard" className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200',
                  pathname === '/dashboard' && !pathname.includes('security') ? 'bg-[#FFD600]/10 text-[#FFD600] font-medium' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                )}>
                  <Home className="h-4 w-4" /> Overview
                </Link>
              </li>
              <li>
                <Link href="/dashboard/security" className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200',
                  pathname === '/dashboard/security' ? 'bg-[#FFD600]/10 text-[#FFD600] font-medium' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                )}>
                  <Shield className="h-4 w-4" /> Security
                </Link>
              </li>
            </ul>
          </nav>
          <div className="p-3">
            <a href="/api/auth/logout" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all">
              <LogOut className="h-4 w-4" /> Log Out
            </a>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[#090A0C] flex items-center px-4 gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-white/[0.04]"><Menu className="h-5 w-5 text-white/50" /></button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-[#FFD600] flex items-center justify-center"><span className="text-black font-bold text-[9px]">W</span></div>
            <span className="font-bold text-sm text-white">Wembo</span>
          </Link>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <>
            <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[#090A0C] flex flex-col">
              <div className="h-14 flex items-center justify-between px-4">
                <span className="font-bold text-sm text-white">Wembo</span>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-white/[0.04]"><X className="h-5 w-5 text-white/50" /></button>
              </div>
              <nav className="flex-1 px-3 py-4">
                <Link href="/dashboard" onClick={() => setSidebarOpen(false)} className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm mb-1',
                  pathname === '/dashboard' && !pathname.includes('security') ? 'text-[#FFD600] bg-[#FFD600]/10 font-medium' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                )}>
                  <Home className="h-4 w-4" /> Overview
                </Link>
                <Link href="/dashboard/security" onClick={() => setSidebarOpen(false)} className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm',
                  pathname === '/dashboard/security' ? 'text-[#FFD600] bg-[#FFD600]/10 font-medium' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                )}>
                  <Shield className="h-4 w-4" /> Security
                </Link>
              </nav>
              <div className="p-3">
                <a href="/api/auth/logout" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/30 hover:text-white/60">
                  <LogOut className="h-4 w-4" /> Log Out
                </a>
              </div>
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="lg:pl-64">
          <div className="pt-14 lg:pt-0">
            {children}
          </div>
        </main>
      </div>
    </AuthContext.Provider>
  )
}
