'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-white/[0.06]' : 'bg-transparent'
      )}>
        <nav className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-black font-bold text-sm">W</span>
            </div>
            <span className="font-bold text-[15px] text-white tracking-tight">WEMBO</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {siteConfig.nav.main.map((item) => (
              <Link key={item.href} href={item.href} className={cn(
                'text-[13px] transition-colors',
                pathname === item.href ? 'text-white' : 'text-white/40 hover:text-white/70'
              )}>
                {item.title}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 mr-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30" />
              <span className="text-[11px] text-white/30">All Systems Operational</span>
            </div>
            <Link href="/login">
              <Button variant="outline" size="sm">Log In</Button>
            </Link>
          </div>

          <button className="md:hidden p-2 text-white/60" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-background/98 backdrop-blur-xl pt-20 px-6">
          <nav className="flex flex-col gap-1">
            {siteConfig.nav.main.map((item) => (
              <Link key={item.href} href={item.href} className="px-4 py-3 text-white/50 hover:text-white rounded-lg hover:bg-white/[0.03]">{item.title}</Link>
            ))}
          </nav>
          <div className="mt-8 space-y-3">
            <Link href="/login"><Button variant="outline" className="w-full h-11">Log In</Button></Link>
            <Link href="#"><Button className="w-full h-11">Invite Wembo</Button></Link>
          </div>
        </div>
      )}
    </>
  )
}
