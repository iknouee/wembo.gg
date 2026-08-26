'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Bot, Shield, Zap, BarChart3, Lightbulb, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { setLoaded(true) }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[hsl(220,16%,4%)]" />

      {/* Decorative geometric shapes — gold outlines */}
      <div className="absolute top-[10%] right-[5%] w-[200px] h-[200px] border border-yellow-500/[0.08] rounded-3xl rotate-12 animate-float" />
      <div className="absolute top-[25%] right-[15%] w-[120px] h-[120px] border border-yellow-500/[0.06] rounded-2xl -rotate-6 animate-float-reverse" />
      <div className="absolute bottom-[15%] right-[8%] w-[160px] h-[160px] border border-yellow-500/[0.07] rounded-3xl rotate-45 animate-float" />
      <div className="absolute top-[60%] right-[25%] w-[80px] h-[80px] border border-yellow-500/[0.05] rounded-xl rotate-12 animate-float-reverse" />
      <div className="absolute top-[15%] left-[5%] w-[100px] h-[100px] border border-yellow-500/[0.04] rounded-2xl -rotate-12 animate-float" />
      <div className="absolute bottom-[20%] left-[8%] w-[140px] h-[140px] border border-yellow-500/[0.06] rounded-3xl rotate-6 animate-float-reverse" />

      {/* Gold glow in background */}
      <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-yellow-500/[0.03] rounded-full blur-[150px]" />
      <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] bg-yellow-500/[0.02] rounded-full blur-[120px]" />

      <div className="relative container mx-auto px-4 lg:px-8 py-32 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Text */}
          <div>
            <div className={`transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-6">
                <span className="h-1 w-1 rounded-full bg-primary" />
                The ultimate Discord management platform
              </span>
            </div>

            <h1 className={`text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.15] mb-6 text-white transition-all duration-600 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              The only bot your<br />server will ever<br />need
            </h1>

            <p className={`text-base text-white/40 max-w-md leading-relaxed mb-10 transition-all duration-600 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              Powerful AI, smart security, automations, analytics, and community tools — trusted by thousands of communities.
            </p>

            <div className={`flex flex-wrap gap-3 transition-all duration-600 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <Link href="#">
                <Button size="lg">Invite Wembo</Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="gap-2">
                  Open Dashboard <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right — Discord-style Embed */}
          <div className={`transition-all duration-800 delay-400 ${loaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.97]'}`}>
            <div className="relative">
              <div className="rounded-xl border border-white/[0.08] bg-[#1e1f22] overflow-hidden shadow-2xl shadow-black/40">
                {/* Discord embed header */}
                <div className="px-4 py-3 flex items-center gap-2 border-b border-white/[0.06]">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">W</span>
                  </div>
                  <span className="text-sm font-semibold text-white/90">Wembo</span>
                  <span className="text-[10px] bg-[#5865f2] text-white px-1.5 py-0.5 rounded text-[9px] font-medium">BOT</span>
                  <span className="ml-auto text-[11px] text-white/20">Today at 4:20 PM</span>
                </div>

                {/* Embed content */}
                <div className="p-4">
                  <div className="border-l-4 border-primary rounded-r-lg bg-[#2b2d31] p-4">
                    <p className="text-sm font-semibold text-white/90 mb-3">Wembo Dashboard</p>
                    <p className="text-[13px] text-white/50 leading-relaxed mb-4">
                      Your community is running smoothly. Here&apos;s your daily summary:
                    </p>

                    <div className="space-y-2 mb-4">
                      <EmbedField label="Members" value="12,482 (+47 today)" />
                      <EmbedField label="Messages" value="3,219 today" />
                      <EmbedField label="Security" value="2 threats blocked" />
                      <EmbedField label="AI Queries" value="89 answered" />
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <EmbedButton label="View Dashboard" active />
                      <EmbedButton label="Security Log" />
                      <EmbedButton label="Analytics" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature icons row */}
        <div className={`mt-20 lg:mt-28 transition-all duration-700 delay-600 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 lg:gap-8 max-w-4xl mx-auto">
            <FeatureIcon icon={Bot} label="AI Assistant" />
            <FeatureIcon icon={Shield} label="Smart Security" />
            <FeatureIcon icon={Zap} label="Automations" />
            <FeatureIcon icon={BarChart3} label="Analytics" />
            <FeatureIcon icon={Lightbulb} label="Knowledge" />
            <FeatureIcon icon={Users} label="Member Intel" />
          </div>
        </div>
      </div>
    </section>
  )
}

function EmbedField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-white/30">{label}</span>
      <span className="text-xs text-white/60 font-medium">{value}</span>
    </div>
  )
}

function EmbedButton({ label, active }: { label: string; active?: boolean }) {
  return (
    <div className={`px-3 py-1.5 rounded text-xs font-medium ${active ? 'bg-primary text-black' : 'bg-[#4e5058] text-white/70'}`}>
      {label}
    </div>
  )
}

function FeatureIcon({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 group">
      <div className="h-10 w-10 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/[0.05] transition-all duration-300">
        <Icon className="h-4 w-4 text-white/40 group-hover:text-primary transition-colors" />
      </div>
      <span className="text-[11px] text-white/30 group-hover:text-white/60 transition-colors text-center">{label}</span>
    </div>
  )
}
