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
    <div className="p-6 lg:p-8 space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">{greeting} 👋</h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening in your community.
        </p>
      </div>

      {/* Community Health */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Community Health</h2>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-2xl font-bold text-green-400">
              {mockStats.communityHealth}
              <span className="text-sm text-muted-foreground font-normal">/100</span>
            </span>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Insights & Security */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Wembo Noticed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-primary/20 flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary">AI</span>
              </div>
              Wembo noticed...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockInsights.map((insight) => (
              <div
                key={insight.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/20 transition-colors"
              >
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    insight.color === 'orange'
                      ? 'bg-orange-500'
                      : insight.color === 'green'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                />
                <span className="text-sm">{insight.message}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Security Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                Recent Security Events
              </CardTitle>
              <Link href="/dashboard/security">
                <Button variant="ghost" size="sm" className="text-xs">
                  View all
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockSecurityEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start justify-between p-3 rounded-lg border border-border/50"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{event.timestamp}</p>
                </div>
                <Badge
                  variant={
                    event.severity === 'high'
                      ? 'danger'
                      : event.severity === 'medium'
                      ? 'warning'
                      : 'secondary'
                  }
                >
                  {event.severity}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Activity</CardTitle>
            <Badge variant="secondary">Last 7 days</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ActivityChart />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <QuickAction icon={Zap} label="Create Automation" href="/dashboard/automations" />
            <QuickAction icon={FileText} label="Create Form" href="/dashboard/forms" />
            <QuickAction icon={Lightbulb} label="Add Knowledge" href="/dashboard/knowledge" />
            <QuickAction icon={Shield} label="View Security" href="/dashboard/security" />
            <QuickAction icon={Plus} label="Invite Wembo" href="#" />
          </div>
        </CardContent>
      </Card>
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
      className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 text-center"
    >
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
