'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Users, MessageSquare, Shield, Zap, Bot, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { setLoaded(true) }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[hsl(222,15%,4%)]" />

      {/* Blue glow orbs */}
      <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-blue-500/[0.06] blur-[150px]" />
      <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-600/[0.03] blur-[120px]" />
      <div className="absolute top-[30%] right-[5%] w-[300px] h-[300px] rounded-full bg-cyan-500/[0.02] blur-[100px]" />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px line-glow opacity-60" />

      <div className="relative container mx-auto px-4 lg:px-8 pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className={`mb-8 transition-all duration-600 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/15 bg-blue-500/[0.05] glow-border">
              <div className="h-2 w-2 rounded-full bg-blue-400 animate-glow-pulse" />
              <span className="text-xs font-medium text-blue-300/80">Trusted by 2,000+ Discord communities</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8 transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="text-white">Your community,</span>
            <br />
            <span className="text-gradient-glow">running smarter.</span>
          </h1>

          {/* Sub */}
          <p className={`text-lg text-white/40 max-w-2xl mx-auto leading-relaxed mb-12 transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            Powerful automation, intelligent security, AI-powered knowledge, and analytics — all from one beautiful dashboard.
          </p>

          {/* CTAs */}
          <div className={`flex flex-wrap items-center justify-center gap-4 mb-20 transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <Link href="#">
              <Button size="xl" className="gap-2.5 group">
                Add Wembo to Discord
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline" className="border-blue-500/10 hover:border-blue-500/25 hover:glow-border">
                Explore Features
              </Button>
            </Link>
          </div>

          {/* Dashboard Preview */}
          <div className={`transition-all duration-1000 delay-400 ${loaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.97]'}`}>
            <div className="relative max-w-4xl mx-auto">
              {/* Glow behind */}
              <div className="absolute -inset-4 bg-blue-500/[0.04] rounded-3xl blur-3xl" />
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-blue-500/[0.1] via-transparent to-transparent" />

              <div className="relative rounded-2xl border border-white/[0.06] bg-[hsl(222,12%,6%)] overflow-hidden glow-blue">
                {/* Window bar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05]">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-white/[0.06]" />
                    <div className="w-3 h-3 rounded-full bg-white/[0.06]" />
                    <div className="w-3 h-3 rounded-full bg-white/[0.06]" />
                  </div>
                  <div className="px-3 py-1 rounded-md bg-white/[0.03] border border-white/[0.04] text-[11px] text-white/20 font-mono">
                    wembo.com/dashboard
                  </div>
                  <div className="w-[52px]" />
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8 space-y-5">
                  {/* Health */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/30 uppercase tracking-wider font-medium">Community Health</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30" />
                      <span className="text-2xl font-bold text-white">87</span>
                      <span className="text-xs text-white/20">/100</span>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <DashStat icon={Users} label="Members" value="12,482" change="+5%" />
                    <DashStat icon={MessageSquare} label="Messages" value="84K" change="+12%" />
                    <DashStat icon={Shield} label="Threats Blocked" value="142" change="" />
                    <DashStat icon={TrendingUp} label="Growth" value="+8.2%" change="" />
                  </div>

                  {/* AI Insight */}
                  <div className="flex gap-4">
                    <div className="flex-1 rounded-xl border border-blue-500/10 bg-blue-500/[0.03] p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="h-3.5 w-3.5 text-blue-400" />
                        <span className="text-[10px] text-blue-400/70 font-medium uppercase tracking-wider">AI Insight</span>
                      </div>
                      <p className="text-xs text-white/40 leading-relaxed">
                        &ldquo;Retention dropped 11% this week. New members aren&apos;t completing onboarding.&rdquo;
                      </p>
                    </div>
                    <div className="flex-1 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                      <span className="text-[10px] text-white/25 uppercase tracking-wider font-medium">Noticed</span>
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-orange-400" /><span className="text-[11px] text-white/35">14 unanswered questions</span></div>
                        <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-400" /><span className="text-[11px] text-white/35">Retention up 8%</span></div>
                        <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-red-400" /><span className="text-[11px] text-white/35">2 suspicious accounts</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DashStat({ icon: Icon, label, value, change }: { icon: React.ElementType; label: string; value: string; change: string }) {
  return (
    <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3 w-3 text-white/20" />
        <span className="text-[10px] text-white/25">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-sm font-bold text-white/80">{value}</span>
        {change && <span className="text-[10px] text-emerald-400">{change}</span>}
      </div>
    </div>
  )
}
