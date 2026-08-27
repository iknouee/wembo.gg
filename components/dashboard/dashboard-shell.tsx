'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LogOut, Menu, X, Loader2, Shield, ChevronDown, Ban, Link2, UserX, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Auth Context ────────────────────────────────────────────────────────────

interface User { id: string; username: string; avatar: string | null; global_name: string | null }
interface Guild { id: string; name: string; icon: string | null; owner: boolean; permissions: string }
interface AuthState { user: User | null; guilds: Guild[]; loading: boolean; token: string | null; selectedGuild: string | null; setSelectedGuild: (id: string) => void }

const AuthContext = createContext<AuthState>({ user: null, guilds: [], loading: true, token: null, selectedGuild: null, setSelectedGuild: () => {} })
export const useAuth = () => useContext(AuthContext)

function getToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|; )wembo_token=([^;]*)/)
  return match ? match[1] : null
}

// ─── Nav Config ──────────────────────────────────────────────────────────────

const securitySubNav = [
  { title: 'Overview', href: '/dashboard/security', icon: Shield },
  { title: 'Anti-Raid', href: '/dashboard/security/antiraid', icon: Zap },
  { title: 'Anti-Spam', href: '/dashboard/security/antispam', icon: Ban },
  { title: 'Phishing', href: '/dashboard/security/phishing', icon: Link2 },
  { title: 'Impersonation', href: '/dashboard/security/impersonation', icon: UserX },
]

// ─── Shell ───────────────────────────────────────────────────────────────────

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ user: null, guilds: [], loading: true, token: null, selectedGuild: null, setSelectedGuild: () => {} })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedGuild, setSelectedGuild] = useState<string | null>(null)
  const pathname = usePathname()
  const [securityOpen, setSecurityOpen] = useState(pathname.includes('/security'))

  useEffect(() => {
    const token = getToken()
    if (!token) { setAuth({ user: null, guilds: [], loading: false, token: null, selectedGuild: null, setSelectedGuild: () => {} }); return }

    Promise.all([
      fetch('https://discord.com/api/v10/users/@me', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
      fetch('https://discord.com/api/v10/users/@me/guilds', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : []),
    ]).then(([userData, allGuilds]) => {
      const user = userData ? { id: userData.id, username: userData.username, avatar: userData.avatar, global_name: userData.global_name } : null
      const guilds = (allGuilds || []).filter((g: any) => { const p = BigInt(g.permissions); return g.owner || (p & BigInt(0x20)) !== BigInt(0) })
      setAuth({ user, guilds, loading: false, token, selectedGuild: null, setSelectedGuild: () => {} })
    }).catch(() => setAuth({ user: null, guilds: [], loading: false, token: null, selectedGuild: null, setSelectedGuild: () => {} }))
  }, [])

  useEffect(() => { setSidebarOpen(false) }, [pathname])
  useEffect(() => { if (pathname.includes('/security')) setSecurityOpen(true) }, [pathname])

  if (auth.loading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="h-6 w-6 text-[#FFD600] animate-spin" /></div>
  }

  if (!auth.token) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="text-center"><p className="text-white/50 mb-4">You need to sign in to access the dashboard.</p><a href="/login" className="px-4 py-2 rounded-lg bg-[#FFD600] text-black text-sm font-semibold">Sign In</a></div></div>
  }

  const isSecurityPage = pathname.includes('/security')

  return (
    <AuthContext.Provider value={{ ...auth, selectedGuild, setSelectedGuild }}>
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
            <a href="/" className="text-white/20 hover:text-white/50 transition-colors" title="Home">
              <Home className="h-4 w-4" />
            </a>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3">
            {/* Overview */}
            <Link href="/dashboard" className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-all',
              pathname === '/dashboard' ? 'bg-[#FFD600]/10 text-[#FFD600] font-medium' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
            )}>
              <Home className="h-4 w-4" /> Overview
            </Link>

            {/* Security Section */}
            <div className="mt-6">
              <button
                onClick={() => setSecurityOpen(!securityOpen)}
                className={cn(
                  'w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-[13px] transition-all',
                  isSecurityPage ? 'text-white/80' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
                )}
              >
                <span className="flex items-center gap-3">
                  <Shield className="h-4 w-4" /> Security
                </span>
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', securityOpen && 'rotate-180')} />
              </button>

              {securityOpen && (
                <div className="mt-1 ml-4 pl-3 border-l border-white/[0.04] space-y-0.5">
                  {securitySubNav.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2.5 rounded-md px-3 py-2 text-[12px] transition-all',
                        pathname === item.href
                          ? 'text-[#FFD600] bg-[#FFD600]/[0.06] font-medium'
                          : 'text-white/30 hover:text-white/60 hover:bg-white/[0.03]'
                      )}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* User + Logout */}
          <div className="p-3 space-y-1">
            {auth.user && (
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg">
                {auth.user.avatar ? (
                  <img src={`https://cdn.discordapp.com/avatars/${auth.user.id}/${auth.user.avatar}.png?size=32`} className="h-6 w-6 rounded-full" alt="" />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-[#FFD600]/10 flex items-center justify-center text-[9px] font-bold text-[#FFD600]">
                    {(auth.user.global_name || auth.user.username)[0].toUpperCase()}
                  </div>
                )}
                <span className="text-[11px] text-white/40 truncate">{auth.user.global_name || auth.user.username}</span>
              </div>
            )}
            <a href="/api/auth/logout" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] text-white/25 hover:text-white/50 hover:bg-white/[0.03] transition-all">
              <LogOut className="h-3.5 w-3.5" /> Log Out
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

        {/* Mobile Drawer */}
        {sidebarOpen && (
          <>
            <div className="lg:hidden fixed inset-0 z-50 bg-black/80" onClick={() => setSidebarOpen(false)} />
            <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[#090A0C] flex flex-col">
              <div className="h-14 flex items-center justify-between px-4">
                <span className="font-bold text-sm text-white">Wembo</span>
                <button onClick={() => setSidebarOpen(false)} className="p-2"><X className="h-5 w-5 text-white/50" /></button>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-1">
                <Link href="/dashboard" onClick={() => setSidebarOpen(false)} className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm', pathname === '/dashboard' ? 'text-[#FFD600] bg-[#FFD600]/10 font-medium' : 'text-white/40')}>
                  <Home className="h-4 w-4" /> Overview
                </Link>
                {securitySubNav.map(item => (
                  <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm', pathname === item.href ? 'text-[#FFD600] bg-[#FFD600]/10 font-medium' : 'text-white/40')}>
                    <item.icon className="h-4 w-4" /> {item.title}
                  </Link>
                ))}
              </nav>
              <div className="p-3">
                <a href="/api/auth/logout" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/30"><LogOut className="h-4 w-4" /> Log Out</a>
              </div>
            </div>
          </>
        )}

        {/* Content */}
        <main className="lg:pl-64"><div className="pt-14 lg:pt-0">{children}</div></main>
      </div>
    </AuthContext.Provider>
  )
}
