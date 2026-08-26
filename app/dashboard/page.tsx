'use client'

import Link from 'next/link'
import {
  Users,
  Activity,
  MessageSquare,
  TrendingUp,
  Shield,
  Zap,
  FileText,
  Lightbulb,
  Eye,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/stat-card'
import { ActivityChart } from '@/components/activity-chart'
import { mockStats, mockInsights, mockSecurityEvents } from '@/lib/mock-data'

export default function DashboardOverview() {
  const greeting = getGreeting()

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{greeting} 👋</h1>
          <p className="text-muted-foreground/60 mt-1">
            Here&apos;s what&apos;s happening in your community.
          </p>
        </div>
        <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20 hidden sm:flex gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          Bot Online
        </Badge>
      </div>

      {/* Community Health */}
      <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-r from-primary/[0.03] to-transparent p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-14 w-14 rounded-full border-2 border-green-500/30 flex items-center justify-center">
                <span className="text-xl font-bold text-green-400">{mockStats.communityHealth}</span>
              </div>
              <div className="absolute inset-0 h-14 w-14 rounded-full border-2 border-green-500/10 animate-ripple" />
            </div>
            <div>
              <h2 className="font-semibold">Community Health</h2>
              <p className="text-sm text-muted-foreground/50">Score is excellent — up 3 points this week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Members" value={mockStats.members.toLocaleString()} icon={Users} trend="+124" trendUp={true} />
        <StatCard title="Active" value={mockStats.active.toLocaleString()} icon={Activity} trend="+8%" trendUp={true} />
        <StatCard title="Messages" value={mockStats.messages.toLocaleString()} icon={MessageSquare} trend="+12%" trendUp={true} />
        <StatCard title="Growth" value={mockStats.growth} icon={TrendingUp} trend="+2.1%" trendUp={true} />
      </div>

      {/* Insights & Security */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Wembo Noticed */}
        <div className="rounded-2xl border border-white/[0.06] bg-card/50 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Wembo noticed...</h3>
          </div>
          <div className="space-y-3">
            {mockInsights.map((insight) => (
              <div
                key={insight.id}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:border-primary/15 hover:bg-primary/[0.02] transition-all duration-300 cursor-pointer group"
              >
                <div className={`h-2.5 w-2.5 rounded-full shadow-sm ${
                  insight.color === 'orange' ? 'bg-orange-500 shadow-orange-500/50' :
                  insight.color === 'green' ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50'
                }`} />
                <span className="text-sm text-muted-foreground/70 group-hover:text-foreground/80 transition-colors">{insight.message}</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground/20 ml-auto group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Security Events */}
        <div className="rounded-2xl border border-white/[0.06] bg-card/50 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground/50" />
              <h3 className="font-semibold">Recent Security Events</h3>
            </div>
            <Link href="/dashboard/security">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground/50 hover:text-foreground">
                View all
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {mockSecurityEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-start justify-between p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] transition-all duration-300">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground/80">{event.description}</p>
                  <p className="text-xs text-muted-foreground/40 mt-0.5">{event.timestamp}</p>
                </div>
                <Badge variant={event.severity === 'high' ? 'danger' : event.severity === 'medium' ? 'warning' : 'secondary'}>
                  {event.severity}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="rounded-2xl border border-white/[0.06] bg-card/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold">Activity</h3>
          <Badge variant="secondary" className="bg-white/[0.04]">Last 7 days</Badge>
        </div>
        <ActivityChart />
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-white/[0.06] bg-card/50 p-6">
        <h3 className="font-semibold mb-5">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <QuickAction icon={Zap} label="Create Automation" href="/dashboard/automations" />
          <QuickAction icon={FileText} label="Create Form" href="/dashboard/forms" />
          <QuickAction icon={Lightbulb} label="Add Knowledge" href="/dashboard/knowledge" />
          <QuickAction icon={Shield} label="View Security" href="/dashboard/security" />
          <QuickAction icon={Plus} label="Invite Wembo" href="#" />
        </div>
      </div>
    </div>
  )
}

function QuickAction({ icon: Icon, label, href }: { icon: React.ElementType; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:border-primary/20 hover:bg-primary/[0.03] hover:-translate-y-0.5 transition-all duration-300 text-center group"
    >
      <div className="rounded-lg bg-primary/[0.06] p-2 group-hover:bg-primary/[0.12] transition-colors">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <span className="text-xs font-medium text-muted-foreground/70 group-hover:text-foreground/80 transition-colors">{label}</span>
    </Link>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
