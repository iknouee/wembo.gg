'use client'

import Link from 'next/link'
import { ArrowRight, Activity, Users, MessageSquare, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 lg:px-8 pt-24 pb-20 lg:pt-32 lg:pb-28">
        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5">
            The operating system for your Discord community
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
            Your Discord community,{' '}
            <span className="text-gradient">running smarter.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-fade-in-up animate-delay-100">
            Wembo gives your server powerful automation, intelligent security, AI-powered
            knowledge, analytics, and community tools — all from one beautiful dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up animate-delay-200">
            <Link href="#">
              <Button size="lg" className="gap-2">
                Add Wembo to Discord
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="max-w-5xl mx-auto opacity-0 animate-fade-in-up animate-delay-300">
          <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl shadow-primary/5 overflow-hidden">
            <div className="p-1">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                    wembo.com/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-6 space-y-6">
                {/* Community Health */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="font-semibold text-sm">Community Health</h3>
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-2xl font-bold text-green-400">87<span className="text-sm text-muted-foreground">/100</span></span>
                      </div>
                    </div>
                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <StatMini icon={Users} label="Members" value="12,482" />
                      <StatMini icon={Activity} label="Active" value="3,821" />
                      <StatMini icon={MessageSquare} label="Messages" value="84,291" />
                      <StatMini icon={TrendingUp} label="Growth" value="+8.2%" />
                    </div>
                  </div>
                </div>

                {/* Insights */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4 space-y-3">
                    <h4 className="text-sm font-medium">Wembo noticed...</h4>
                    <div className="space-y-2">
                      <InsightRow color="orange" text="14 unanswered questions" />
                      <InsightRow color="green" text="Member retention increased 8%" />
                      <InsightRow color="red" text="2 suspicious accounts detected" />
                    </div>
                  </Card>
                  <Card className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded bg-primary/20 flex items-center justify-center">
                        <span className="text-[10px] text-primary">AI</span>
                      </div>
                      <h4 className="text-sm font-medium">AI Recommendation</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      &ldquo;New-member retention has dropped 11% this week. Most new members
                      are joining but not completing onboarding.&rdquo;
                    </p>
                    <button className="text-sm text-primary font-medium hover:text-primary/80 transition-colors flex items-center gap-1">
                      Fix this <ArrowRight className="h-3 w-3" />
                    </button>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatMini({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-bold">{value}</span>
    </div>
  )
}

function InsightRow({ color, text }: { color: string; text: string }) {
  const colorMap: Record<string, string> = {
    orange: 'bg-orange-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
  }
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${colorMap[color]}`} />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  )
}
