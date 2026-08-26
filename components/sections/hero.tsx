'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Users, MessageSquare, Shield, Bot, TrendingUp, Zap, Check, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  const [loaded, setLoaded] = useState(false)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { setTimeout(() => setLoaded(true), 250) }, [])

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!ref.current || window.innerWidth < 1024) return
      const r = ref.current.getBoundingClientRect()
      setMouse({ x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 })
    }
    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [])

  return (
    <section ref={ref} className="relative min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-20 lg:pt-0">
      {/* ===== BACKGROUND ===== */}
      <div className="absolute inset-0 surface-0" />

      {/* Large yellow ambient glow — left */}
      <div className="absolute top-[15%] left-[5%] w-[500px] h-[500px] bg-[#FFD600]/[0.012] rounded-full blur-[180px] animate-glow-breathe" />
      {/* Large glow — behind right mockup */}
      <div className="absolute top-[10%] right-[-5%] w-[800px] h-[700px] bg-[#FFD600]/[0.018] rounded-full blur-[200px] animate-glow-breathe" style={{ animationDelay: '2.5s' }} />

      {/* Grid */}
      <div className="absolute inset-0 animate-grid-pulse" style={{
        backgroundImage: 'linear-gradient(rgba(255,214,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,214,0,0.025) 1px, transparent 1px)',
        backgroundSize: '72px 72px',
      }} />

      {/* Dots */}
      <div className="absolute inset-0 opacity-[0.012]" style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      {/* Horizontal accent lines */}
      <div className="absolute top-[35%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD600]/[0.05] to-transparent" />
      <div className="absolute top-[75%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#050505_85%)]" />

      {/* ===== CONTENT ===== */}
      <div className="relative w-full max-w-content mx-auto px-4 lg:px-8 py-20 lg:py-0">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">
          {/* === LEFT TEXT === */}
          <div>
            {/* Badge */}
            <div className={`mb-7 transition-all duration-700 delay-[200ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="inline-flex items-center gap-2 px-3.5 py-[6px] rounded-full border border-[#FFD600]/20 bg-[#FFD600]/[0.04]">
                <span className="h-[6px] w-[6px] rounded-full bg-[#FFD600] animate-pulse-dot" />
                <span className="text-[11px] font-semibold text-[#FFD600]/80 uppercase tracking-wider">AI-Powered Discord Management</span>
              </span>
            </div>

            {/* Headline */}
            <h1 className={`text-[clamp(2.5rem,5.5vw,4.75rem)] font-bold leading-[1.05] tracking-[-0.035em] mb-6 transition-all duration-700 delay-[300ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <span className="text-white">Your Discord community,</span>
              <br />
              <span className="text-gradient-gold">running smarter.</span>
            </h1>

            {/* Description */}
            <p className={`text-[16px] text-[#b0b2b8] leading-[1.75] max-w-[480px] mb-8 transition-all duration-700 delay-[400ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              AI, moderation, automations, analytics and community intelligence — all working together in one powerful Discord platform.
            </p>

            {/* CTAs */}
            <div className={`flex flex-wrap gap-3 mb-7 transition-all duration-700 delay-[500ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <Link href="#">
                <Button size="xl" className="gap-2 group">
                  Add Wembo to Discord
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="outline" className="gap-2 group">
                  Explore Features
                  <ArrowRight className="h-3.5 w-3.5 opacity-50 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>

            {/* Checklist */}
            <div className={`flex flex-wrap gap-x-5 gap-y-2 mb-8 transition-all duration-700 delay-[600ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {['Setup in under 2 minutes', 'No coding required', 'Free to get started'].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-[12px] text-[#9A9CA3]">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  {t}
                </span>
              ))}
            </div>

            {/* Product highlights */}
            <div className={`flex items-center gap-2 transition-all duration-700 delay-[700ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="text-[12px] text-[#9A9CA3]">AI • Security • Automations • Analytics</span>
            </div>
          </div>

          {/* === RIGHT DASHBOARD MOCKUP === */}
          <div
            className={`relative transition-all duration-1000 delay-[500ms] ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
            style={{ transform: loaded ? `perspective(1400px) rotateY(${mouse.x * -1.2}deg) rotateX(${mouse.y * 0.8}deg) translateZ(0)` : undefined, transition: 'transform 0.1s ease-out' }}
          >
            {/* Glow underneath */}
            <div className="absolute -inset-6 bg-[#FFD600]/[0.015] rounded-3xl blur-3xl" />

            {/* Illuminated grid surface */}
            <div className="absolute -bottom-8 left-[5%] right-[5%] h-20 opacity-40" style={{
              backgroundImage: 'linear-gradient(rgba(255,214,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,214,0,0.03) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
              maskImage: 'linear-gradient(to bottom, transparent, black 40%, black 60%, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 40%, black 60%, transparent)',
            }} />

            {/* === MAIN CARD === */}
            <div className="relative rounded-xl border border-white/[0.07] bg-[#0a0b0d] shadow-2xl shadow-black/50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.05] bg-[#080909]">
                <div className="h-8 w-8 rounded-full bg-[#FFD600]/10 flex items-center justify-center">
                  <span className="text-[10px] font-black text-[#FFD600]">W</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-white/90">Wembo</span>
                    <span className="text-[8px] bg-[#5865F2] text-white px-1.5 py-[1px] rounded font-bold uppercase">Bot</span>
                  </div>
                </div>
                <span className="text-[9px] text-white/15 uppercase tracking-wider">Example</span>
              </div>

              {/* Embed */}
              <div className="p-4">
                <div className="border-l-[3px] border-[#FFD600] rounded-r-lg bg-[#111215] p-5">
                  <p className="text-[13px] font-semibold text-white/90 mb-0.5">Server Overview</p>
                  <p className="text-[11px] text-white/35 mb-4">Your community is looking healthy today.</p>

                  <div className="grid grid-cols-2 gap-2.5 mb-4">
                    <MiniStat icon={Users} label="Members" value="12,482" sub="+8.4%" />
                    <MiniStat icon={MessageSquare} label="Messages" value="3,219" sub="Today" />
                    <MiniStat icon={Shield} label="Threats" value="2 blocked" sub="Protected" />
                    <MiniStat icon={Bot} label="AI Queries" value="89" sub="Answered" />
                  </div>

                  {/* Mini chart */}
                  <div className="rounded-md bg-[#090a0c] border border-white/[0.04] p-3 mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] text-white/25 uppercase tracking-wider font-medium">Member Growth</span>
                      <span className="text-[9px] text-emerald-400 font-medium">+12% ↑</span>
                    </div>
                    <div className="flex items-end gap-[2px] h-9">
                      {[25,30,28,35,40,38,45,50,48,55,60,65,62,70,75].map((h,i) => (
                        <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-[#FFD600]/15 to-[#FFD600]/45" style={{height:`${h}%`}} />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="px-3 py-1.5 rounded text-[10px] font-semibold bg-[#FFD600] text-black">View Dashboard</span>
                    <span className="px-3 py-1.5 rounded text-[10px] font-medium bg-white/[0.05] text-white/50 border border-white/[0.06]">Security</span>
                    <span className="px-3 py-1.5 rounded text-[10px] font-medium bg-white/[0.05] text-white/50 border border-white/[0.06]">Analytics</span>
                  </div>
                </div>
              </div>
            </div>

            {/* === FLOATING CARDS === */}
            <div className="absolute -left-8 top-[55%] rounded-lg border border-white/[0.08] bg-[#0a0b0d]/95 backdrop-blur-sm p-3 shadow-xl shadow-black/40 animate-float-slow w-[165px]" style={{animationDelay:'0.5s'}}>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[11px] font-semibold text-white/80">Threat Blocked</span>
              </div>
              <p className="text-[10px] text-white/30">Suspicious account quarantined</p>
            </div>

            <div className="absolute -right-6 top-[15%] rounded-lg border border-white/[0.08] bg-[#0a0b0d]/95 backdrop-blur-sm p-3 shadow-xl shadow-black/40 animate-float-slow-2 w-[160px]" style={{animationDelay:'1.5s'}}>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-3.5 w-3.5 text-[#FFD600]" />
                <span className="text-[11px] font-semibold text-white/80">Automation</span>
              </div>
              <p className="text-[10px] text-white/30">Welcome flow completed</p>
            </div>

            <div className="absolute -right-4 bottom-[20%] rounded-lg border border-white/[0.08] bg-[#0a0b0d]/95 backdrop-blur-sm p-3 shadow-xl shadow-black/40 animate-float-slow w-[155px]" style={{animationDelay:'3s'}}>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[11px] font-semibold text-white/80">+342 members</span>
              </div>
              <p className="text-[10px] text-white/30">This week</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MiniStat({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-md bg-[#090a0c] border border-white/[0.04] p-2.5">
      <div className="flex items-center gap-1 mb-0.5">
        <Icon className="h-3 w-3 text-white/20" />
        <span className="text-[9px] text-white/25">{label}</span>
      </div>
      <span className="text-[13px] font-bold text-white block">{value}</span>
      <span className="text-[9px] text-emerald-400/80">{sub}</span>
    </div>
  )
}
