'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { dashboardNav } from '@/config/dashboard'
import { Menu, X, Home, LogOut } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r border-white/[0.03] bg-[#090A0C]">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-white/[0.03]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#FFD600] flex items-center justify-center">
            <span className="text-black font-bold text-[11px]">W</span>
          </div>
          <span className="font-bold text-sm text-white">Wembo</span>
        </Link>
        <Link href="/" className="text-white/30 hover:text-white/60 transition-colors" title="Back to home">
          <Home className="h-4 w-4" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {dashboardNav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200',
                    isActive
                      ? 'bg-[#FFD600]/10 text-[#FFD600] font-medium'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom — Logout */}
      <div className="border-t border-white/[0.03] p-3">
        <Link
          href="/api/auth/logout"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </Link>
      </div>
    </aside>
  )
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 border-b border-white/[0.03] bg-[#090A0C] flex items-center px-4 gap-3">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:bg-white/[0.04] transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-white/50" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-[#FFD600] flex items-center justify-center">
            <span className="text-black font-bold text-[9px]">W</span>
          </div>
          <span className="font-bold text-sm text-white">Wembo</span>
        </Link>
        <Link href="/" className="ml-auto text-white/30 hover:text-white/60 transition-colors" title="Back to home">
          <Home className="h-4 w-4" />
        </Link>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[#090A0C] border-r border-white/[0.03] flex flex-col">
            <div className="h-14 flex items-center justify-between px-4 border-b border-white/[0.03]">
              <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <div className="h-7 w-7 rounded-lg bg-[#FFD600] flex items-center justify-center">
                  <span className="text-black font-bold text-[11px]">W</span>
                </div>
                <span className="font-bold text-sm text-white">Wembo</span>
              </Link>
              <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-white/[0.04]" aria-label="Close">
                <X className="h-5 w-5 text-white/50" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              <ul className="space-y-1">
                {dashboardNav.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all',
                          isActive ? 'bg-[#FFD600]/10 text-[#FFD600] font-medium' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
            <div className="border-t border-white/[0.03] p-3">
              <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/30 hover:text-white/60 hover:bg-white/[0.04]" onClick={() => setOpen(false)}>
                <Home className="h-4 w-4" /> Back to Home
              </Link>
              <Link href="/api/auth/logout" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/30 hover:text-white/60 hover:bg-white/[0.04]">
                <LogOut className="h-4 w-4" /> Log Out
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  )
}
