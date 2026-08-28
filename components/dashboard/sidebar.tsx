'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  dashboardTopItems,
  dashboardSections,
  type NavSection,
  type NavGroup,
} from '@/config/dashboard'
import { ServerSelector } from '@/components/dashboard/server-selector'
import { UserProfile } from '@/components/dashboard/user-profile'
import { Menu, X, ChevronUp } from 'lucide-react'

function SidebarGroup({
  group,
  pathname,
  onClick,
}: {
  group: NavGroup
  pathname: string
  onClick?: () => void
}) {
  const isChildActive = group.children.some(
    (child) => pathname === child.href || pathname.startsWith(child.href + '/')
  )

  const [expanded, setExpanded] = useState(isChildActive || pathname.startsWith(group.href))

  return (
    <div>
      {/* Group header — expandable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all duration-200',
          isChildActive
            ? 'text-foreground font-medium'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
        )}
      >
        <div className="flex items-center gap-3">
          <group.icon className="h-4 w-4" />
          <span>{group.title}</span>
        </div>
        <ChevronUp
          className={cn(
            'h-3.5 w-3.5 text-muted-foreground/60 transition-transform duration-200',
            !expanded && 'rotate-180'
          )}
        />
      </button>

      {/* Children */}
      {expanded && (
        <ul className="mt-1 ml-5 pl-3 border-l border-border/40 space-y-0.5">
          {group.children.map((child) => {
            const isActive = pathname === child.href
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  onClick={onClick}
                  className={cn(
                    'block rounded-lg px-3 py-2 text-sm transition-all duration-200',
                    isActive
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  {child.title}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function SidebarNav({
  pathname,
  onClick,
}: {
  pathname: string
  onClick?: () => void
}) {
  return (
    <div className="space-y-6">
      {/* Top-level items under MAIN */}
      <div className="space-y-1">
        <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Main
        </p>
        <ul className="space-y-0.5">
          {dashboardTopItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClick}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Sectioned groups */}
      {dashboardSections.map((section) => (
        <div key={section.label} className="space-y-1">
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
            {section.label}
          </p>
          {section.groups.map((group) => (
            <SidebarGroup
              key={group.href}
              group={group}
              pathname={pathname}
              onClick={onClick}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r border-border bg-card/50">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-xs">W</span>
          </div>
          <span className="font-bold text-lg">Wembo</span>
        </Link>
      </div>

      {/* Server Selector */}
      <div className="border-b border-border p-3">
        <ServerSelector />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <SidebarNav pathname={pathname} />
      </nav>

      {/* User Profile at bottom */}
      <div className="border-t border-border p-3">
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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-background/95 backdrop-blur-sm flex items-center px-4 gap-3">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">W</span>
          </div>
          <span className="font-bold">Wembo</span>
        </Link>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border flex flex-col animate-slide-in-left">
            <div className="h-14 flex items-center justify-between px-4 border-b border-border">
              <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-xs">W</span>
                </div>
                <span className="font-bold text-lg">Wembo</span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Server Selector */}
            <div className="border-b border-border p-3">
              <ServerSelector />
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3">
              <SidebarNav pathname={pathname} onClick={() => setOpen(false)} />
            </nav>

            <div className="border-t border-border p-3">
              <UserProfile />
            </div>
          </div>
        </>
      )}
    </>
  )
}
