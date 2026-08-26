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
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setTimeout(() => setVisible(true), 150) }, [])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => { setMobileOpen(false) }, [pathname])

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
              <div className="h-7 w-7 rounded-md bg-[#FFD600] flex items-center justify-center shadow-md shadow-[#FFD600]/20 group-hover:shadow-[#FFD600]/30 transition-shadow">
                <span className="text-black font-black text-[11px]">W</span>
              </div>
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
              <div className="flex items-center gap-1.5 mr-2">
                <div className="h-[6px] w-[6px] rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse-dot" />
                <span className="text-[11px] text-[#9A9CA3]/70">Operational</span>
              </div>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-[12px]">Log In</Button>
              </Link>
              <Link href="#">
                <Button size="sm" className="text-[12px] h-8 gap-1.5">
                  Add to Discord <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
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
            <Link href="/login"><Button variant="outline" className="w-full h-12">Log In</Button></Link>
            <Link href="#"><Button className="w-full h-12 gap-2">Add to Discord <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      )}
    </>
  )
}
