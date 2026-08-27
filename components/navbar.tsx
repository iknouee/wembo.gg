'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowRight, LayoutDashboard, Settings, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { WemboLogo } from '@/components/wembo-logo'

interface User {
  id: string
  username: string
  avatar: string | null
  global_name: string | null
}

export function Navbar() {
  const [visible, setVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => { setTimeout(() => setVisible(true), 150) }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false); setDropdownOpen(false) }, [pathname])

  // Check if logged in
  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => { if (r.ok) return r.json(); throw new Error() })
      .then((data) => { if (data.user) setUser(data.user) })
      .catch(() => {})
  }, [pathname])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`
    : null

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3">
        <header
          className={cn(
            'w-full max-w-[1200px] rounded-2xl border border-white/[0.08] shadow-xl shadow-black/30 transition-all duration-500',
            scrolled ? 'bg-[#0a0a0c]/85 backdrop-blur-2xl py-0' : 'bg-[#0a0a0c]/72 backdrop-blur-xl',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          )}
        >
          <nav className={cn('flex items-center justify-between px-5 transition-all duration-300', scrolled ? 'h-12' : 'h-14')}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <WemboLogo size={28} className="group-hover:shadow-[#FFD600]/30 transition-shadow" />
              <span className="font-bold text-[14px] text-white tracking-[0.04em]">WEMBO</span>
            </Link>

            {/* Center Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {siteConfig.nav.main.map((item) => (
                <Link key={item.href} href={item.href} className={cn(
                  'relative px-3 py-1.5 text-[13px] rounded-md transition-all duration-200',
                  pathname === item.href ? 'text-white' : 'text-[#9A9CA3] hover:text-white'
                )}>
                  {item.title}
                  {pathname === item.href && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#FFD600] rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              {user ? (
                /* Logged in — profile dropdown */
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="" className="h-7 w-7 rounded-full" />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-[#FFD600]/10 flex items-center justify-center text-[10px] font-bold text-[#FFD600]">
                        {(user.global_name || user.username || '?')[0].toUpperCase()}
                      </div>
                    )}
                    <ChevronDown className={cn('h-3 w-3 text-[#9A9CA3] transition-transform', dropdownOpen && 'rotate-180')} />
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-[#0c0d10] border border-white/[0.06] shadow-2xl shadow-black/50 py-1.5 z-50">
                      {/* User info */}
                      <div className="px-3.5 py-2.5 border-b border-white/[0.04] mb-1.5">
                        <p className="text-[13px] font-medium text-white truncate">{user.global_name || user.username}</p>
                        <p className="text-[11px] text-[#9A9CA3] truncate">@{user.username}</p>
                      </div>

                      <Link href="/dashboard" className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-[#9A9CA3] hover:text-white hover:bg-white/[0.04] transition-colors" onClick={() => setDropdownOpen(false)}>
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link href="/dashboard/settings" className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-[#9A9CA3] hover:text-white hover:bg-white/[0.04] transition-colors" onClick={() => setDropdownOpen(false)}>
                        <Settings className="h-4 w-4" />
                        Settings
                        <span className="ml-auto text-[10px] text-[#9A9CA3]/50">Soon</span>
                      </Link>

                      <div className="border-t border-white/[0.04] mt-1.5 pt-1.5">
                        <a href="/api/auth/logout" className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.04] transition-colors">
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Not logged in */
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-[12px]">Log In</Button>
                  </Link>
                  <Link href="/invite">
                    <Button size="sm" className="text-[12px] h-8 gap-1.5">
                      Add to Discord <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <button className="lg:hidden p-2 text-white/50 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </nav>
        </header>
      </div>

      {/* Mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black/97 backdrop-blur-xl pt-24 px-6">
          <nav className="flex flex-col gap-1">
            {siteConfig.nav.main.map((item) => (
              <Link key={item.href} href={item.href} className="px-4 py-3.5 text-[15px] text-white/50 hover:text-white rounded-lg hover:bg-white/[0.03] transition-all">{item.title}</Link>
            ))}
          </nav>
          <div className="mt-8 space-y-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="h-9 w-9 rounded-full" />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-[#FFD600]/10 flex items-center justify-center text-xs font-bold text-[#FFD600]">
                      {(user.global_name || user.username || '?')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{user.global_name || user.username}</p>
                    <p className="text-xs text-[#9A9CA3]">@{user.username}</p>
                  </div>
                </div>
                <Link href="/dashboard"><Button variant="outline" className="w-full h-11 gap-2"><LayoutDashboard className="h-4 w-4" /> Dashboard</Button></Link>
                <a href="/api/auth/logout"><Button variant="outline" className="w-full h-11 gap-2 text-red-400 border-red-500/10 hover:bg-red-500/[0.04]"><LogOut className="h-4 w-4" /> Sign Out</Button></a>
              </>
            ) : (
              <>
                <Link href="/login"><Button variant="outline" className="w-full h-12">Log In</Button></Link>
                <Link href="/invite"><Button className="w-full h-12 gap-2">Add to Discord <ArrowRight className="h-4 w-4" /></Button></Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
