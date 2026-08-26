'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out',
          isScrolled
            ? 'bg-background/60 backdrop-blur-2xl border-b border-white/[0.04] shadow-lg shadow-black/5'
            : 'bg-transparent'
        )}
      >
        {/* Subtle top gradient line when scrolled */}
        <div
          className={cn(
            'absolute top-0 left-0 right-0 h-px transition-opacity duration-500',
            isScrolled ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)',
          }}
        />

        <nav className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-sm">W</span>
              <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="font-bold text-lg tracking-tight">{siteConfig.name}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {siteConfig.nav.main.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-3.5 py-2 text-sm transition-all duration-200 rounded-lg',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.title}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Login
              </Button>
            </Link>
            <Link href="#">
              <Button size="sm" className="gap-2 group/btn relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Add Wembo
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                </span>
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden relative p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-5">
              <Menu
                className={cn(
                  'h-5 w-5 absolute inset-0 transition-all duration-300',
                  isMobileOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
                )}
              />
              <X
                className={cn(
                  'h-5 w-5 absolute inset-0 transition-all duration-300',
                  isMobileOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
                )}
              />
            </div>
          </button>
        </nav>
      </header>

      {/* Mobile Menu - Full screen overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 md:hidden transition-all duration-500',
          isMobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-background/90 backdrop-blur-xl transition-opacity duration-500',
            isMobileOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setIsMobileOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={cn(
            'relative h-full pt-20 px-6 flex flex-col transition-all duration-500',
            isMobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          )}
        >
          <nav className="flex flex-col gap-1">
            {siteConfig.nav.main.map((item, i) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-4 text-lg font-medium rounded-xl transition-all duration-200',
                    isActive
                      ? 'text-foreground bg-white/[0.05]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.03]'
                  )}
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  {item.title}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto pb-8 space-y-3">
            <Link href="/login" className="block">
              <Button variant="outline" className="w-full h-12 text-base">
                Login
              </Button>
            </Link>
            <Link href="#" className="block">
              <Button className="w-full h-12 text-base gap-2">
                Add Wembo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
