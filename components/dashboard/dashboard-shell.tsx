'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, LogOut, Menu, X, Loader2, Shield, ChevronDown, Ban, Link2, UserX, Zap, ScrollText,
  Bell, HelpCircle, Search, Settings, Users, ChevronRight, Bomb, Bot, ShieldCheck, UserMinus,
  Gavel, AlertOctagon, FileText, UserPlus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ToastProvider } from '@/components/dashboard/ui/toast'

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

const mainNav = [
  { title: 'Overview', href: '/dashboard', icon: Home },
]

const securitySubNav = [
  { title: 'Overview', href: '/dashboard/security', icon: Shield },
  { title: 'Anti-Raid', href: '/dashboard/security/antiraid', icon: Zap },
  { title: 'Anti-Spam', href: '/dashboard/security/antispam', icon: Ban },
  { title: 'Anti-Nuke', href: '/dashboard/security/antinuke', icon: Bomb },
  { title: 'Link Blocker', href: '/dashboard/security/phishing', icon: Link2 },
  { title: 'Impersonation', href: '/dashboard/security/impersonation', icon: UserX },
  { title: 'Bot Guard', href: '/dashboard/security/botguard', icon: Bot },
  { title: 'Verification', href: '/dashboard/security/verification', icon: ShieldCheck },
  { title: 'Alt Detection', href: '/dashboard/security/altdetection', icon: UserMinus },
  { title: 'Security Logs', href: '/dashboard/security/logs', icon: ScrollText },
]

const moderationSubNav = [
  { title: 'Warnings', href: '/dashboard/moderation/warns', icon: AlertOctagon },
  { title: 'Mod Logs', href: '/dashboard/moderation/logs', icon: FileText },
]

const automationSubNav = [
  { title: 'Welcome & Goodbye', href: '/dashboard/welcome', icon: UserPlus },
]

// ─── Page Title Helper ───────────────────────────────────────────────────────

function getPageTitle(pathname: string): string {
  if (pathname === '/dashboard') return 'Overview'
  if (pathname === '/dashboard/security') return 'Security'
  if (pathname === '/dashboard/security/antiraid') return 'Security / Anti-Raid'
  if (pathname === '/dashboard/security/antispam') return 'Security / Anti-Spam'
  if (pathname === '/dashboard/security/antinuke') return 'Security / Anti-Nuke'
  if (pathname === '/dashboard/security/phishing') return 'Security / Link Blocker'
  if (pathname === '/dashboard/security/impersonation') return 'Security / Impersonation'
  if (pathname === '/dashboard/security/botguard') return 'Security / Bot Guard'
  if (pathname === '/dashboard/security/verification') return 'Security / Verification'
  if (pathname === '/dashboard/security/altdetection') return 'Security / Alt Detection'
  if (pathname === '/dashboard/security/logs') return 'Security / Logs'
  if (pathname === '/dashboard/moderation/warns') return 'Moderation / Warnings'
  if (pathname === '/dashboard/moderation/logs') return 'Moderation / Mod Logs'
  if (pathname === '/dashboard/welcome') return 'Automations / Welcome & Goodbye'
  return 'Dashboard'
}

// ─── Shell ───────────────────────────────────────────────────────────────────

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ user: null, guilds: [], loading: true, token: null, selectedGuild: null, setSelectedGuild: () => {} })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedGuild, setSelectedGuild] = useState<string | null>(null)
  const [serverSelectorOpen, setServerSelectorOpen] = useState(false)
  const pathname = usePathname()
  const [securityOpen, setSecurityOpen] = useState(pathname.includes('/security'))
  const [moderationOpen, setModerationOpen] = useState(pathname.includes('/moderation'))
  const [automationOpen, setAutomationOpen] = useState(pathname.includes('/welcome') || pathname.includes('/automations'))

  // ─── Auth Logic (PRESERVED EXACTLY) ──────────────────────────────────
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
  useEffect(() => { if (pathname.includes('/moderation')) setModerationOpen(true) }, [pathname])
  useEffect(() => { if (pathname.includes('/welcome') || pathname.includes('/automations')) setAutomationOpen(true) }, [pathname])

  // ─── Loading State ───────────────────────────────────────────────────
  if (auth.loading) {
    return (
      <div className="min-h-screen dash-page flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-[#FFD600] flex items-center justify-center">
            <span className="text-black font-bold text-sm">W</span>
          </div>
          <Loader2 className="h-5 w-5 text-[#FFD600] animate-spin" />
        </div>
      </div>
    )
  }

  // ─── Not Authenticated ───────────────────────────────────────────────
  if (!auth.token) {
    return (
      <div className="min-h-screen dash-page flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="h-12 w-12 rounded-xl bg-[#FFD600] flex items-center justify-center mx-auto mb-5">
            <span className="text-black font-bold text-lg">W</span>
          </div>
          <h2 className="text-[18px] font-bold text-white mb-2">Sign in to Wembo</h2>
          <p className="text-body-sm text-white/40 mb-6">You need to authenticate with Discord to access the dashboard.</p>
          <a href="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFD600] text-black text-[13px] font-semibold hover:bg-[#FFD600]/90 transition-colors glow-btn">
            Sign In with Discord
          </a>
        </div>
      </div>
    )
  }

  const isSecurityPage = pathname.includes('/security')
  const isModerationPage = pathname.includes('/moderation')
  const isAutomationPage = pathname.includes('/welcome') || pathname.includes('/automations')
  const selectedServer = auth.guilds.find(g => g.id === selectedGuild) || auth.guilds[0] || null

  return (
    <AuthContext.Provider value={{ ...auth, selectedGuild, setSelectedGuild }}>
      <ToastProvider>
        <div className="min-h-screen dash-page">

          {/* ═══════════════ Desktop Sidebar ═══════════════ */}
          <aside className="hidden lg:flex lg:flex-col lg:w-[260px] lg:fixed lg:inset-y-0 dash-sidebar border-r border-white/[0.04]">

            {/* Logo */}
            <div className="h-[60px] flex items-center px-5 border-b border-white/[0.04]">
              <Link href="/dashboard" className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#FFD600] flex items-center justify-center shadow-lg shadow-[#FFD600]/10">
                  <span className="text-black font-bold text-[12px]">W</span>
                </div>
                <span className="font-bold text-[15px] text-white tracking-tight">Wembo</span>
              </Link>
            </div>

            {/* Server Selector */}
            {selectedServer && (
              <div className="px-3 pt-4 pb-2">
                <button
                  onClick={() => setServerSelectorOpen(!serverSelectorOpen)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.03] transition-all"
                >
                  {selectedServer.icon ? (
                    <img src={`https://cdn.discordapp.com/icons/${selectedServer.id}/${selectedServer.icon}.png?size=64`} className="h-8 w-8 rounded-lg object-cover" alt="" />
                  ) : (
                    <div className="h-8 w-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-[10px] font-bold text-white/50">
                      {selectedServer.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-[12px] font-medium text-white/80 truncate">{selectedServer.name}</p>
                    <p className="text-[10px] text-white/25">{auth.guilds.length} server{auth.guilds.length !== 1 ? 's' : ''}</p>
                  </div>
                  <ChevronDown className={cn('h-3.5 w-3.5 text-white/20 transition-transform', serverSelectorOpen && 'rotate-180')} />
                </button>

                {/* Server Dropdown */}
                {serverSelectorOpen && (
                  <div className="mt-1.5 rounded-xl bg-[#111214] border border-white/[0.06] shadow-xl shadow-black/40 overflow-hidden animate-fade-down">
                    {auth.guilds.map(guild => (
                      <button
                        key={guild.id}
                        onClick={() => { setSelectedGuild(guild.id); setServerSelectorOpen(false) }}
                        className={cn(
                          'w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors',
                          guild.id === (selectedGuild || auth.guilds[0]?.id)
                            ? 'bg-[#FFD600]/[0.04]'
                            : 'hover:bg-white/[0.03]'
                        )}
                      >
                        {guild.icon ? (
                          <img src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=32`} className="h-6 w-6 rounded-md object-cover" alt="" />
                        ) : (
                          <div className="h-6 w-6 rounded-md bg-white/[0.06] flex items-center justify-center text-[8px] font-bold text-white/40">
                            {guild.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span className="text-[11px] text-white/60 truncate flex-1">{guild.name}</span>
                        {guild.id === (selectedGuild || auth.guilds[0]?.id) && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD600]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-3">
              {/* MAIN */}
              <p className="text-[10px] font-semibold text-white/20 uppercase tracking-[0.08em] px-3 mb-2">Main</p>
              {mainNav.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-all duration-200 mb-0.5',
                    pathname === item.href
                      ? 'bg-[#FFD600]/[0.08] text-[#FFD600] font-medium'
                      : 'text-white/45 hover:text-white/75 hover:bg-white/[0.03]'
                  )}
                >
                  <item.icon className={cn('h-4 w-4', pathname === item.href && 'text-[#FFD600]')} />
                  {item.title}
                </Link>
              ))}

              {/* SECURITY */}
              <p className="text-[10px] font-semibold text-white/20 uppercase tracking-[0.08em] px-3 mb-2 mt-6">Security</p>
              <button
                onClick={() => setSecurityOpen(!securityOpen)}
                className={cn(
                  'w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-[13px] transition-all duration-200 mb-0.5',
                  isSecurityPage ? 'text-white/80 bg-white/[0.02]' : 'text-white/45 hover:text-white/75 hover:bg-white/[0.03]'
                )}
              >
                <span className="flex items-center gap-3">
                  <Shield className={cn('h-4 w-4', isSecurityPage && 'text-[#FFD600]')} />
                  Security
                </span>
                <ChevronDown className={cn('h-3.5 w-3.5 text-white/20 transition-transform duration-200', securityOpen && 'rotate-180')} />
              </button>

              <div className={cn('overflow-hidden transition-all duration-300', securityOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0')}>
                <div className="ml-3 pl-3 border-l border-white/[0.04] space-y-0.5 py-1">
                  {securitySubNav.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2.5 rounded-md px-3 py-[7px] text-[12px] transition-all duration-200',
                        pathname === item.href
                          ? 'text-[#FFD600] bg-[#FFD600]/[0.06] font-medium'
                          : 'text-white/30 hover:text-white/60 hover:bg-white/[0.03]'
                      )}
                    >
                      <item.icon className={cn('h-3.5 w-3.5', pathname === item.href && 'text-[#FFD600]')} />
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* MODERATION */}
              <p className="text-[10px] font-semibold text-white/20 uppercase tracking-[0.08em] px-3 mb-2 mt-6">Moderation</p>
              <button
                onClick={() => setModerationOpen(!moderationOpen)}
                className={cn(
                  'w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-[13px] transition-all duration-200 mb-0.5',
                  isModerationPage ? 'text-white/80 bg-white/[0.02]' : 'text-white/45 hover:text-white/75 hover:bg-white/[0.03]'
                )}
              >
                <span className="flex items-center gap-3">
                  <Gavel className={cn('h-4 w-4', isModerationPage && 'text-[#FFD600]')} />
                  Moderation
                </span>
                <ChevronDown className={cn('h-3.5 w-3.5 text-white/20 transition-transform duration-200', moderationOpen && 'rotate-180')} />
              </button>

              <div className={cn('overflow-hidden transition-all duration-300', moderationOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0')}>
                <div className="ml-3 pl-3 border-l border-white/[0.04] space-y-0.5 py-1">
                  {moderationSubNav.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2.5 rounded-md px-3 py-[7px] text-[12px] transition-all duration-200',
                        pathname === item.href
                          ? 'text-[#FFD600] bg-[#FFD600]/[0.06] font-medium'
                          : 'text-white/30 hover:text-white/60 hover:bg-white/[0.03]'
                      )}
                    >
                      <item.icon className={cn('h-3.5 w-3.5', pathname === item.href && 'text-[#FFD600]')} />
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* AUTOMATION */}
              <p className="text-[10px] font-semibold text-white/20 uppercase tracking-[0.08em] px-3 mb-2 mt-6">Automation</p>
              <button
                onClick={() => setAutomationOpen(!automationOpen)}
                className={cn(
                  'w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-[13px] transition-all duration-200 mb-0.5',
                  isAutomationPage ? 'text-white/80 bg-white/[0.02]' : 'text-white/45 hover:text-white/75 hover:bg-white/[0.03]'
                )}
              >
                <span className="flex items-center gap-3">
                  <Zap className={cn('h-4 w-4', isAutomationPage && 'text-[#FFD600]')} />
                  Automations
                </span>
                <ChevronDown className={cn('h-3.5 w-3.5 text-white/20 transition-transform duration-200', automationOpen && 'rotate-180')} />
              </button>

              <div className={cn('overflow-hidden transition-all duration-300', automationOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0')}>
                <div className="ml-3 pl-3 border-l border-white/[0.04] space-y-0.5 py-1">
                  {automationSubNav.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2.5 rounded-md px-3 py-[7px] text-[12px] transition-all duration-200',
                        pathname === item.href
                          ? 'text-[#FFD600] bg-[#FFD600]/[0.06] font-medium'
                          : 'text-white/30 hover:text-white/60 hover:bg-white/[0.03]'
                      )}
                    >
                      <item.icon className={cn('h-3.5 w-3.5', pathname === item.href && 'text-[#FFD600]')} />
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* User Section */}
            <div className="p-3 border-t border-white/[0.04]">
              {auth.user && (
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                  {auth.user.avatar ? (
                    <img src={`https://cdn.discordapp.com/avatars/${auth.user.id}/${auth.user.avatar}.png?size=64`} className="h-8 w-8 rounded-full ring-1 ring-white/[0.06]" alt="" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[#FFD600]/10 flex items-center justify-center text-[11px] font-bold text-[#FFD600]">
                      {(auth.user.global_name || auth.user.username)[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-white/70 truncate">{auth.user.global_name || auth.user.username}</p>
                    <p className="text-[10px] text-white/20">Online</p>
                  </div>
                  <a href="/api/auth/logout" className="p-1.5 rounded-md text-white/20 hover:text-white/50 hover:bg-white/[0.04] transition-colors" title="Log out">
                    <LogOut className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          </aside>

          {/* ═══════════════ Mobile Header ═══════════════ */}
          <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 dash-sidebar border-b border-white/[0.04] flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-white/[0.04] transition-colors">
                <Menu className="h-5 w-5 text-white/50" />
              </button>
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-[#FFD600] flex items-center justify-center shadow-sm shadow-[#FFD600]/10">
                  <span className="text-black font-bold text-[10px]">W</span>
                </div>
                <span className="font-bold text-sm text-white">Wembo</span>
              </Link>
            </div>
            {auth.user?.avatar && (
              <img src={`https://cdn.discordapp.com/avatars/${auth.user.id}/${auth.user.avatar}.png?size=32`} className="h-7 w-7 rounded-full" alt="" />
            )}
          </div>

          {/* ═══════════════ Mobile Drawer ═══════════════ */}
          {sidebarOpen && (
            <>
              <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
              <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-[280px] dash-sidebar border-r border-white/[0.04] flex flex-col animate-fade-in-right">
                <div className="h-14 flex items-center justify-between px-5 border-b border-white/[0.04]">
                  <span className="font-bold text-[15px] text-white">Wembo</span>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-white/[0.04]">
                    <X className="h-5 w-5 text-white/50" />
                  </button>
                </div>
                <nav className="flex-1 px-3 py-4 overflow-y-auto">
                  <p className="text-[10px] font-semibold text-white/20 uppercase tracking-[0.08em] px-3 mb-2">Main</p>
                  {mainNav.map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                      className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] mb-0.5', pathname === item.href ? 'text-[#FFD600] bg-[#FFD600]/[0.08] font-medium' : 'text-white/45')}>
                      <item.icon className="h-4 w-4" /> {item.title}
                    </Link>
                  ))}
                  <p className="text-[10px] font-semibold text-white/20 uppercase tracking-[0.08em] px-3 mb-2 mt-5">Security</p>
                  {securitySubNav.map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                      className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] mb-0.5', pathname === item.href ? 'text-[#FFD600] bg-[#FFD600]/[0.08] font-medium' : 'text-white/45')}>
                      <item.icon className="h-4 w-4" /> {item.title}
                    </Link>
                  ))}
                  <p className="text-[10px] font-semibold text-white/20 uppercase tracking-[0.08em] px-3 mb-2 mt-5">Moderation</p>
                  {moderationSubNav.map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                      className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] mb-0.5', pathname === item.href ? 'text-[#FFD600] bg-[#FFD600]/[0.08] font-medium' : 'text-white/45')}>
                      <item.icon className="h-4 w-4" /> {item.title}
                    </Link>
                  ))}
                  <p className="text-[10px] font-semibold text-white/20 uppercase tracking-[0.08em] px-3 mb-2 mt-5">Automation</p>
                  {automationSubNav.map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                      className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] mb-0.5', pathname === item.href ? 'text-[#FFD600] bg-[#FFD600]/[0.08] font-medium' : 'text-white/45')}>
                      <item.icon className="h-4 w-4" /> {item.title}
                    </Link>
                  ))}
                </nav>
                <div className="p-3 border-t border-white/[0.04]">
                  <a href="/api/auth/logout" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-white/30 hover:text-white/50 transition-colors">
                    <LogOut className="h-4 w-4" /> Log Out
                  </a>
                </div>
              </div>
            </>
          )}

          {/* ═══════════════ Top Bar ═══════════════ */}
          <div className="hidden lg:flex fixed top-0 left-[260px] right-0 z-40 h-[60px] dash-sidebar border-b border-white/[0.04] items-center justify-between px-8">
            <div className="flex items-center gap-2 text-body-sm">
              <span className="text-white/80 font-medium">{getPageTitle(pathname)}</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2.5 rounded-lg text-white/25 hover:text-white/50 hover:bg-white/[0.03] transition-colors" title="Search (⌘K)">
                <Search className="h-4 w-4" />
              </button>
              <button className="p-2.5 rounded-lg text-white/25 hover:text-white/50 hover:bg-white/[0.03] transition-colors" title="Notifications">
                <Bell className="h-4 w-4" />
              </button>
              <button className="p-2.5 rounded-lg text-white/25 hover:text-white/50 hover:bg-white/[0.03] transition-colors" title="Help">
                <HelpCircle className="h-4 w-4" />
              </button>
              <div className="ml-2 pl-3 border-l border-white/[0.04]">
                <div className="flex items-center gap-1.5 text-[11px] text-white/25">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
                  Operational
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════ Main Content ═══════════════ */}
          <main className="lg:pl-[260px] lg:pt-[60px] pt-14">
            <div className="min-h-[calc(100vh-60px)]">
              {children}
            </div>
          </main>

        </div>
      </ToastProvider>
    </AuthContext.Provider>
  )
}
