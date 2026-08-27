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
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/stat-card'
import { ActivityChart } from '@/components/activity-chart'
import { mockStats, mockInsights, mockSecurityEvents } from '@/lib/mock-data'

export default function DashboardOverview() {
  const greeting = getGreeting()

  return (
    <div className="p-5 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{greeting} 👋</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Here&apos;s what&apos;s happening in your community today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[12px] font-semibold text-emerald-500">
              {mockStats.communityHealth}/100
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Members"
          value={mockStats.members.toLocaleString()}
          icon={Users}
          trend="+124"
          trendUp={true}
        />
        <StatCard
          title="Active"
          value={mockStats.active.toLocaleString()}
          icon={Activity}
          trend="+8%"
          trendUp={true}
        />
        <StatCard
          title="Messages"
          value={mockStats.messages.toLocaleString()}
          icon={MessageSquare}
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          title="Growth"
          value={mockStats.growth}
          icon={TrendingUp}
          trend="+2.1%"
          trendUp={true}
        />
      </div>

      {/* Two Column: Insights + Security */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* AI Insights */}
        <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <h3 className="text-[13px] font-medium">Wembo noticed</h3>
            </div>
            <Link href="/dashboard/ai">
              <Button variant="ghost" size="sm" className="h-7 text-[11px] text-muted-foreground hover:text-foreground">
                View all
              </Button>
            </Link>
          </div>
          <div className="p-3 space-y-1.5">
            {mockInsights.map((insight) => (
              <div
                key={insight.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div
                  className={`h-2 w-2 rounded-full flex-shrink-0 ${
                    insight.color === 'orange'
                      ? 'bg-amber-500'
                      : insight.color === 'green'
                      ? 'bg-emerald-500'
                      : 'bg-red-500'
                  }`}
                />
                <span className="text-[13px] text-foreground/90">{insight.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Events */}
        <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-muted-foreground" />
              <h3 className="text-[13px] font-medium">Security Events</h3>
            </div>
            <Link href="/dashboard/security">
              <Button variant="ghost" size="sm" className="h-7 text-[11px] text-muted-foreground hover:text-foreground">
                View all
              </Button>
            </Link>
          </div>
          <div className="p-3 space-y-1.5">
            {mockSecurityEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate">{event.description}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{event.timestamp}</p>
                </div>
                <Badge
                  variant={
                    event.severity === 'high'
                      ? 'danger'
                      : event.severity === 'medium'
                      ? 'warning'
                      : 'secondary'
                  }
                  className="ml-3 text-[10px] flex-shrink-0"
                >
                  {event.severity}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
          <h3 className="text-[13px] font-medium">Activity</h3>
          <Badge variant="secondary" className="text-[10px] font-medium">Last 7 days</Badge>
        </div>
        <div className="p-4">
          <ActivityChart />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60">
          <h3 className="text-[13px] font-medium">Quick Actions</h3>
        </div>
        <div className="p-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            <QuickAction icon={Zap} label="Automation" href="/dashboard/automations" />
            <QuickAction icon={FileText} label="Form" href="/dashboard/forms" />
            <QuickAction icon={Lightbulb} label="Knowledge" href="/dashboard/knowledge" />
            <QuickAction icon={Shield} label="Security" href="/dashboard/security" />
            <QuickAction icon={Plus} label="Invite Bot" href="/dashboard/integrations" />
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickAction({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ElementType
  label: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border/40 hover:border-primary/30 hover:bg-primary/5 transition-all duration-150 group"
    >
      <Icon className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors" />
      <span className="text-[12px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
    </Link>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
