'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setIsMobileOpen(false) }, [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/[0.06]'
            : 'bg-transparent'
        )}
      >
        <nav className="container mx-auto flex h-14 items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-7 w-7 rounded-md bg-yellow-500 flex items-center justify-center group-hover:bg-yellow-400 transition-colors">
              <span className="text-black font-bold text-xs">W</span>
            </div>
            <span className="font-semibold text-sm text-white/90">Wembo</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {siteConfig.nav.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-1.5 text-[13px] rounded-md transition-colors',
                  pathname === item.href
                    ? 'text-white bg-white/[0.06]'
                    : 'text-white/40 hover:text-white/80'
                )}
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-white/40 hover:text-white text-xs h-8">
                Login
              </Button>
            </Link>
            <Link href="#">
              <Button size="sm" className="h-8 text-xs font-semibold bg-yellow-500 text-black hover:bg-yellow-400 gap-1.5">
                Add Wembo <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setIsMobileOpen(false)} />
          <div className="relative pt-20 px-6 flex flex-col h-full">
            <nav className="flex flex-col gap-1">
              {siteConfig.nav.main.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-3 text-base text-white/60 hover:text-white rounded-lg hover:bg-white/[0.03] transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
            <div className="mt-auto pb-8 space-y-3">
              <Link href="/login" className="block">
                <Button variant="outline" className="w-full h-11 border-white/10 text-white/70">Login</Button>
              </Link>
              <Link href="#" className="block">
                <Button className="w-full h-11 bg-yellow-500 text-black font-semibold hover:bg-yellow-400">
                  Add Wembo <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
