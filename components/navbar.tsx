'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [visible, setVisible] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
        <header
          className={cn(
            'w-full max-w-[1240px] rounded-2xl border border-white/[0.06] bg-[#0c0d10]/80 backdrop-blur-2xl shadow-lg shadow-black/20 transition-all duration-700',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
          )}
        >
          <nav className="flex h-14 items-center justify-between px-5">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                <span className="text-black font-bold text-[11px]">W</span>
              </div>
              <span className="font-bold text-[14px] text-white tracking-[0.02em]">WEMBO</span>
            </Link>

            {/* Center Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {siteConfig.nav.main.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-1.5 text-[13px] rounded-md transition-all duration-200',
                    pathname === item.href
                      ? 'text-white bg-white/[0.06]'
                      : 'text-[#8B8D93] hover:text-white'
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>

            {/* Right */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              {/* Status */}
              <div className="flex items-center gap-1.5 mr-1">
                <div className="h-[6px] w-[6px] rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse-soft" />
                <span className="text-[11px] text-[#8B8D93]">All Systems Operational</span>
              </div>

              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-[#8B8D93] hover:text-white text-[12px]">
                  Log In
                </Button>
              </Link>

              <Link href="#">
                <Button size="sm" className="text-[12px] h-8 px-4 gap-1.5 rounded-lg">
                  Add to Discord
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-white/50 hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </nav>
        </header>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
          <div className="relative pt-24 px-6 flex flex-col h-full">
            <nav className="flex flex-col gap-1">
              {siteConfig.nav.main.map((item) => (
                <Link key={item.href} href={item.href} className="px-4 py-3.5 text-[15px] text-white/50 hover:text-white rounded-lg hover:bg-white/[0.03] transition-all">
                  {item.title}
                </Link>
              ))}
            </nav>
            <div className="mt-auto pb-8 space-y-3">
              <Link href="/login"><Button variant="outline" className="w-full h-12">Log In</Button></Link>
              <Link href="#"><Button className="w-full h-12 gap-2">Add to Discord <ArrowRight className="h-4 w-4" /></Button></Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
