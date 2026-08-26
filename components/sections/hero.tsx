'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Users, MessageSquare, Shield, Bot, TrendingUp, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  const [loaded, setLoaded] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setTimeout(() => setLoaded(true), 200) }, [])

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height
      setMousePos({ x: x * 3, y: y * 3 })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-24">
      {/* === BACKGROUND === */}
      <div className="absolute inset-0 bg-[#070809]" />

      {/* Large yellow glow behind hero text */}
      <div className="absolute top-[20%] left-[15%] w-[600px] h-[500px] bg-[#FFD400]/[0.015] rounded-full blur-[180px] animate-glow-breathe" />

      {/* Glow behind dashboard mockup */}
      <div className="absolute top-[25%] right-[5%] w-[700px] h-[600px] bg-[#FFD400]/[0.02] rounded-full blur-[160px] animate-glow-breathe" style={{ animationDelay: '2s' }} />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 animate-grid-fade"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,212,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,212,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Dotted pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Thin decorative lines */}
      <div className="absolute top-[30%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFD400]/[0.06] to-transparent" />
      <div className="absolute top-[70%] left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#070809_100%)]" />

      {/* === CONTENT === */}
      <div className="relative container mx-auto px-4 lg:px-8 py-16 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT — Text */}
          <div className="max-w-[560px]">
            {/* Badge */}
            <div className={`mb-7 transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#FFD400]/20 bg-[#FFD400]/[0.04]">
                <div className="h-[6px] w-[6px] rounded-full bg-[#FFD400] animate-pulse-soft" />
                <span className="text-[11px] font-semibold text-[#FFD400]/80 uppercase tracking-wider">The Discord bot built for everything</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className={`text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.08] tracking-[-0.03em] mb-6 transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <span className="text-white">Run your </span>
              <span className="text-gradient-gold">entire</span>
              <br />
              <span className="text-white">Discord server</span>
              <br />
              <span className="text-white">with </span>
              <span className="text-gradient-gold">Wembo.</span>
            </h1>

            {/* Description */}
            <p className={`text-[16px] text-[#a8aab0] leading-[1.7] max-w-[480px] mb-9 transition-all duration-700 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              Moderation, AI, automations, analytics and community tools — all inside one powerful Discord bot.
            </p>

            {/* Buttons */}
            <div className={`flex flex-wrap gap-3 mb-10 transition-all duration-700 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <Link href="#">
                <Button size="xl" className="gap-2 rounded-lg">
                  Add Wembo to Discord
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="gap-2 group">
                  Explore Dashboard
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className={`flex items-center gap-3 transition-all duration-700 delay-600 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {/* Overlapping avatars */}
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="h-7 w-7 rounded-full border-2 border-[#070809] bg-gradient-to-br from-[#FFD400]/20 to-[#FFD400]/5 flex items-center justify-center">
                    <span className="text-[8px] text-[#FFD400]/60 font-medium">{String.fromCharCode(64 + i)}</span>
                  </div>
                ))}
              </div>
              <span className="text-[13px] text-[#8B8D93]">Trusted by <span className="text-white font-medium">2,500+</span> communities</span>
            </div>
          </div>

          {/* RIGHT — Dashboard Mockup */}
          <div
            className={`relative transition-all duration-1000 delay-500 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
            style={{ transform: loaded ? `perspective(1200px) rotateY(${mousePos.x * -0.5}deg) rotateX(${mousePos.y * 0.5}deg)` : undefined }}
          >
            {/* Glow under mockup */}
            <div className="absolute -inset-8 bg-[#FFD400]/[0.02] rounded-3xl blur-3xl" />

            {/* Illuminated grid under mockup */}
            <div className="absolute -bottom-12 left-[10%] right-[10%] h-32 opacity-30"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,212,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,212,0,0.04) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                maskImage: 'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)',
              }}
            />

            {/* Main Discord embed card */}
            <div className="relative rounded-xl overflow-hidden card-elevated">
              {/* Discord-style header */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.05] bg-[#0c0d10]">
                <div className="h-9 w-9 rounded-full bg-[#FFD400]/10 flex items-center justify-center shadow-inner">
                  <span className="text-[11px] font-bold text-[#FFD400]">W</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-white/90">Wembo</span>
                    <span className="text-[9px] bg-[#5865F2] text-white px-1.5 py-[2px] rounded font-medium">BOT</span>
                  </div>
                  <span className="text-[10px] text-white/25">Today at 4:20 PM</span>
                </div>
              </div>

              {/* Embed body */}
              <div className="p-5">
                <div className="border-l-[3px] border-[#FFD400] rounded-r-lg bg-[#141519] p-5">
                  <p className="text-[14px] font-semibold text-white/90 mb-1">Wembo Dashboard</p>
                  <p className="text-[12px] text-white/40 mb-5">Your community is looking healthy.</p>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <StatBox icon={Users} label="Members" value="12,482" change="+8.4%" />
                    <StatBox icon={MessageSquare} label="Messages" value="3,219" change="Today" />
                    <StatBox icon={Shield} label="Threats Blocked" value="2" change="Security" />
                    <StatBox icon={Bot} label="AI Queries" value="89" change="Today" />
                  </div>

                  {/* Mini graph */}
                  <div className="rounded-lg bg-[#0c0d10] border border-white/[0.04] p-3 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">Member Growth</span>
                      <span className="text-[10px] text-emerald-400">+12%</span>
                    </div>
                    <div className="flex items-end gap-[3px] h-10">
                      {[30, 35, 28, 42, 50, 45, 55, 60, 52, 65, 70, 75].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-[#FFD400]/20 to-[#FFD400]/50" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <div className="px-3 py-1.5 rounded text-[11px] font-medium bg-[#FFD400] text-black">View Dashboard</div>
                    <div className="px-3 py-1.5 rounded text-[11px] font-medium bg-[#2b2d31] text-white/60">Security Log</div>
                    <div className="px-3 py-1.5 rounded text-[11px] font-medium bg-[#2b2d31] text-white/60">Analytics</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating security card */}
            <div className="absolute -left-6 bottom-[15%] rounded-lg card-elevated p-3.5 animate-float w-[180px]" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-2 mb-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[11px] font-semibold text-white/80">Security</span>
              </div>
              <p className="text-[10px] text-white/35">2 threats blocked today</p>
              <div className="flex items-center gap-1 mt-1.5">
                <div className="h-[5px] w-[5px] rounded-full bg-emerald-500" />
                <span className="text-[9px] text-emerald-400/70">Protected</span>
              </div>
            </div>

            {/* Floating AI card */}
            <div className="absolute -right-4 top-[20%] rounded-lg card-elevated p-3.5 animate-float w-[170px]" style={{ animationDelay: '1.5s' }}>
              <div className="flex items-center gap-2 mb-1.5">
                <Bot className="h-3.5 w-3.5 text-[#FFD400]" />
                <span className="text-[11px] font-semibold text-white/80">AI Assistant</span>
              </div>
              <p className="text-[10px] text-white/35">89 questions answered</p>
              <div className="flex items-center gap-1 mt-1.5">
                <div className="h-[5px] w-[5px] rounded-full bg-[#FFD400]" />
                <span className="text-[9px] text-[#FFD400]/70">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatBox({ icon: Icon, label, value, change }: { icon: React.ElementType; label: string; value: string; change: string }) {
  return (
    <div className="rounded-lg bg-[#0c0d10] border border-white/[0.04] p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3 w-3 text-white/20" />
        <span className="text-[10px] text-white/30">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[15px] font-bold text-white">{value}</span>
        <span className="text-[9px] text-emerald-400 font-medium">{change}</span>
      </div>
    </div>
  )
}
