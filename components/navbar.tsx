'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowRight } from 'lucide-react'
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
        scrolled ? 'bg-[hsl(222,15%,4%)]/80 backdrop-blur-2xl border-b border-white/[0.04]' : 'bg-transparent'
      )}>
        <nav className="container mx-auto flex h-14 items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-7 w-7 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
              <span className="text-white font-bold text-xs">W</span>
            </div>
            <span className="font-semibold text-[15px] text-white/90">Wembo</span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {siteConfig.nav.main.map((item) => (
              <Link key={item.href} href={item.href} className={cn(
                'px-3 py-1.5 text-[13px] rounded-md transition-colors',
                pathname === item.href ? 'text-white bg-white/[0.06]' : 'text-white/40 hover:text-white/70'
              )}>
                {item.title}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2.5">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs">Login</Button>
            </Link>
            <Link href="#">
              <Button size="sm" className="text-xs gap-1.5 h-8">
                Add Wembo <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          <button className="md:hidden p-2 text-white/60" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-[hsl(222,15%,4%)]/98 backdrop-blur-xl pt-20 px-6">
          <nav className="flex flex-col gap-1">
            {siteConfig.nav.main.map((item) => (
              <Link key={item.href} href={item.href} className="px-4 py-3 text-white/50 hover:text-white rounded-lg hover:bg-white/[0.03] transition-colors">
                {item.title}
              </Link>
            ))}
          </nav>
          <div className="mt-8 space-y-3">
            <Link href="/login"><Button variant="outline" className="w-full h-11">Login</Button></Link>
            <Link href="#"><Button className="w-full h-11 gap-2">Add Wembo <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      )}
    </>
  )
}
