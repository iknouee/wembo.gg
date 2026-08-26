'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Activity, Users, MessageSquare, TrendingUp, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 animated-gradient-bg" />

      {/* Radial glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-primary/[0.07] rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/[0.04] rounded-full blur-[100px]" />
      <div className="absolute top-[20%] left-[-5%] w-[400px] h-[400px] bg-violet-500/[0.03] rounded-full blur-[80px]" />

      {/* Dot grid overlay */}
      <div className="absolute inset-0 dot-grid opacity-30" />

      {/* Floating orbs */}
      <div className="absolute top-[15%] right-[15%] w-2 h-2 rounded-full bg-primary/40 animate-float" />
      <div className="absolute top-[25%] left-[20%] w-1.5 h-1.5 rounded-full bg-violet-400/30 animate-float-slow" />
      <div className="absolute bottom-[30%] right-[25%] w-1 h-1 rounded-full bg-indigo-400/40 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[40%] left-[10%] w-2.5 h-2.5 rounded-full bg-primary/20 animate-float-slow" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-[20%] left-[30%] w-1.5 h-1.5 rounded-full bg-violet-300/20 animate-float" style={{ animationDelay: '3s' }} />

      {/* Orbiting ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/[0.04] animate-spin-slow opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-primary/[0.02] animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />

      {/* Hero Content */}
      <div className="relative container mx-auto px-4 lg:px-8 pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="text-center max-w-4xl mx-auto mb-16">
          {/* Badge */}
          <div className="opacity-0 animate-fade-in-up">
            <Badge variant="secondary" className="mb-8 px-4 py-2 border-primary/20 bg-primary/[0.05] backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 mr-2 text-primary" />
              <span className="text-xs font-medium">The operating system for your Discord community</span>
            </Badge>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8 opacity-0 animate-fade-in-up delay-100">
            <span className="block">Your Discord community,</span>
            <span className="block mt-2 text-gradient-hero glow-text">running smarter.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed opacity-0 animate-fade-in-up delay-200">
            Wembo gives your server powerful automation, intelligent security, AI-powered
            knowledge, analytics, and community tools — all from one beautiful dashboard.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up delay-300">
            <Link href="#">
              <Button size="xl" className="gap-2.5 group shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                Add Wembo to Discord
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline" className="border-white/10 hover:border-white/20 hover:bg-white/[0.03] backdrop-blur-sm">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="max-w-5xl mx-auto opacity-0 animate-slide-up-fade delay-500">
          <div className="relative group">
            {/* Glow behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-violet-500/10 to-indigo-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-700" />

            <div className="relative rounded-2xl border border-white/[0.08] bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/20 overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/10 hover:bg-red-500/60 transition-colors duration-200" />
                  <div className="w-3 h-3 rounded-full bg-white/10 hover:bg-yellow-500/60 transition-colors duration-200" />
                  <div className="w-3 h-3 rounded-full bg-white/10 hover:bg-green-500/60 transition-colors duration-200" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-xs text-muted-foreground">
                    wembo.com/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-6 lg:p-8 space-y-6">
                {/* Health + Stats row */}
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-5">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Community Health</h3>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                          <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-green-500 animate-ripple" />
                        </div>
                        <span className="text-3xl font-bold text-green-400">87<span className="text-sm text-muted-foreground/70 font-normal">/100</span></span>
                      </div>
                    </div>
                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <StatMini icon={Users} label="Members" value="12,482" />
                      <StatMini icon={Activity} label="Active" value="3,821" />
                      <StatMini icon={MessageSquare} label="Messages" value="84,291" />
                      <StatMini icon={TrendingUp} label="Growth" value="+8.2%" valueColor="text-green-400" />
                    </div>
                  </div>
                </div>

                {/* Insights + AI */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      Wembo noticed...
                    </h4>
                    <div className="space-y-2.5">
                      <InsightRow color="orange" text="14 unanswered questions" />
                      <InsightRow color="green" text="Member retention increased 8%" />
                      <InsightRow color="red" text="2 suspicious accounts detected" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-primary/10 bg-primary/[0.02] p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-md bg-primary/20 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-primary">AI</span>
                      </div>
                      <h4 className="text-sm font-semibold">AI Recommendation</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      &ldquo;New-member retention has dropped 11% this week. Most new members
                      are joining but not completing onboarding.&rdquo;
                    </p>
                    <button className="text-sm text-primary font-medium hover:text-primary/80 transition-colors flex items-center gap-1.5 group/fix">
                      Fix this <ArrowRight className="h-3 w-3 transition-transform group-hover/fix:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted by text */}
        <div className="mt-16 text-center opacity-0 animate-fade-in delay-700">
          <p className="text-xs uppercase tracking-widest text-muted-foreground/50 font-medium">
            Trusted by 2,000+ Discord communities
          </p>
        </div>
      </div>
    </section>
  )
}

function StatMini({
  icon: Icon,
  label,
  value,
  valueColor,
}: {
  icon: React.ElementType
  label: string
  value: string
  valueColor?: string
}) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5 hover:border-primary/20 hover:bg-primary/[0.02] transition-all duration-300">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className="h-3 w-3 text-muted-foreground/70" />
        <span className="text-xs text-muted-foreground/70">{label}</span>
      </div>
      <span className={cn('text-sm font-bold', valueColor)}>{value}</span>
    </div>
  )
}

function InsightRow({ color, text }: { color: string; text: string }) {
  const colorMap: Record<string, string> = {
    orange: 'bg-orange-500 shadow-orange-500/50',
    green: 'bg-green-500 shadow-green-500/50',
    red: 'bg-red-500 shadow-red-500/50',
  }
  return (
    <div className="flex items-center gap-3 group/insight">
      <div className={`h-2 w-2 rounded-full shadow-sm ${colorMap[color]}`} />
      <span className="text-sm text-muted-foreground group-hover/insight:text-foreground transition-colors duration-200">{text}</span>
    </div>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
