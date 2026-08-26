'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Users, MessageSquare, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { setLoaded(true) }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background — pure black with subtle warm radial */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute top-[-30%] right-[-10%] w-[800px] h-[800px] rounded-full bg-yellow-500/[0.03] blur-[150px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/[0.02] blur-[120px]" />

      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px line-glow" />

      <div className="relative container mx-auto px-4 lg:px-8 py-32 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left — Text */}
          <div>
            <div className={`transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/[0.05] mb-8">
                <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse-soft" />
                <span className="text-xs font-medium text-yellow-500/80">Now serving 2,000+ communities</span>
              </div>
            </div>

            <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8 transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              Your community,<br />
              <span className="text-gradient">running smarter.</span>
            </h1>

            <p className={`text-lg text-white/50 max-w-lg leading-relaxed mb-10 transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              Powerful automation, intelligent security, AI-powered knowledge, and analytics — all from one dashboard.
            </p>

            <div className={`flex flex-wrap gap-4 mb-14 transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <Link href="#">
                <Button size="lg" className="h-12 px-7 text-sm font-semibold gap-2 bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 transition-all">
                  Add to Discord
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="outline" className="h-12 px-7 text-sm font-semibold border-white/10 text-white/70 hover:text-white hover:bg-white/5 hover:border-white/20">
                  See Features
                </Button>
              </Link>
            </div>

            {/* Mini stats */}
            <div className={`flex gap-8 transition-all duration-700 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <Stat value="12K+" label="Members managed" />
              <Stat value="99.9%" label="Uptime" />
              <Stat value="<1s" label="Response time" />
            </div>
          </div>

          {/* Right — Dashboard Card */}
          <div className={`transition-all duration-1000 delay-500 ${loaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
            <div className="relative">
              {/* Glow behind */}
              <div className="absolute -inset-4 bg-yellow-500/[0.04] rounded-3xl blur-2xl" />

              <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm overflow-hidden">
                {/* Top bar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  </div>
                  <div className="text-[10px] text-white/20 font-mono">wembo.com/dashboard</div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Health Score */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 uppercase tracking-wider font-medium">Community Health</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-xl font-bold text-white">87</span>
                      <span className="text-xs text-white/30">/100</span>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-4 gap-2">
                    <MiniStat icon={Users} label="Members" value="12,482" />
                    <MiniStat icon={MessageSquare} label="Messages" value="84K" />
                    <MiniStat icon={Shield} label="Blocked" value="142" />
                    <MiniStat icon={Zap} label="Automations" value="23" />
                  </div>

                  {/* Insight */}
                  <div className="rounded-lg border border-yellow-500/10 bg-yellow-500/[0.03] p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="h-4 w-4 rounded bg-yellow-500/20 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-yellow-500">AI</span>
                      </div>
                      <span className="text-[10px] text-yellow-500/70 font-medium">RECOMMENDATION</span>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed">
                      New member retention dropped 11% — consider improving your onboarding flow.
                    </p>
                  </div>

                  {/* Activity bars */}
                  <div className="flex items-end gap-1 h-16">
                    {[35, 50, 40, 65, 75, 85, 60].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-yellow-500/30 to-yellow-500/60 transition-all duration-700" style={{ height: `${h}%`, transitionDelay: `${i * 80 + 800}ms`, opacity: loaded ? 1 : 0 }} />
                    ))}
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

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-xs text-white/30">{label}</p>
    </div>
  )
}

function MiniStat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 text-center">
      <Icon className="h-3 w-3 text-white/30 mx-auto mb-1" />
      <p className="text-xs font-bold text-white/80">{value}</p>
      <p className="text-[9px] text-white/25">{label}</p>
    </div>
  )
}
