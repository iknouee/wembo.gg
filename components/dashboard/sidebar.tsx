'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { dashboardNav } from '@/config/dashboard'
import { ServerSelector } from '@/components/dashboard/server-selector'
import { UserProfile } from '@/components/dashboard/user-profile'
import { Menu, X } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-[260px] lg:fixed lg:inset-y-0 border-r border-border/60 bg-card">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-border/60">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/20">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <span className="font-semibold text-[15px] tracking-tight">Wembo</span>
        </Link>
      </div>

      {/* Server Selector */}
      <div className="px-3 pt-3 pb-1">
        <ServerSelector />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-0.5">
          {dashboardNav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                  )}
                >
                  <item.icon className={cn('h-[15px] w-[15px]', isActive && 'text-primary')} />
                  {item.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Profile at bottom */}
      <div className="border-t border-border/60 p-3">
        <UserProfile />
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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 border-b border-border/60 bg-card flex items-center px-4 gap-3">
        <button
          onClick={() => setOpen(true)}
          className="p-1.5 rounded-md hover:bg-accent transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-muted-foreground" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/20">
            <span className="text-white font-bold text-[11px]">W</span>
          </div>
          <span className="font-semibold text-sm tracking-tight">Wembo</span>
        </Link>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-[280px] bg-card border-r border-border/60 flex flex-col animate-slide-in-left shadow-2xl">
            <div className="h-14 flex items-center justify-between px-4 border-b border-border/60">
              <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/20">
                  <span className="text-white font-bold text-[11px]">W</span>
                </div>
                <span className="font-semibold text-sm tracking-tight">Wembo</span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-md hover:bg-accent transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="px-3 pt-3 pb-1">
              <ServerSelector />
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-2">
              <ul className="space-y-0.5">
                {dashboardNav.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/dashboard' && pathname.startsWith(item.href))
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] font-medium transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                        )}
                      >
                        <item.icon className={cn('h-[15px] w-[15px]', isActive && 'text-primary')} />
                        {item.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="border-t border-border/60 p-3">
              <UserProfile />
            </div>
          </div>
        </>
      )}
    </>
  )
}
