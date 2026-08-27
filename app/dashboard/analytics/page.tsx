'use client'

import { Users, MessageSquare, TrendingUp, Hash, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/stat-card'
import { ActivityChart } from '@/components/activity-chart'

export default function DashboardAnalyticsPage() {
  return (
    <div className="p-5 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Community metrics and growth insights.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title="Members" value="12,482" icon={Users} trend="+342" trendUp={true} />
        <StatCard title="Messages (7d)" value="84,291" icon={MessageSquare} trend="+24%" trendUp={true} />
        <StatCard title="Active Rate" value="30.6%" icon={TrendingUp} trend="+3%" trendUp={true} />
        <StatCard title="Retention" value="92%" trend="+1.2%" trendUp={true} />
      </div>

      {/* Activity Chart */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
          <h3 className="text-[13px] font-medium">Message Activity</h3>
          <Badge variant="secondary" className="text-[10px]">7 days</Badge>
        </div>
        <div className="p-4">
          <ActivityChart />
        </div>
      </div>

      {/* Two column: Channels + Insights */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Top Channels */}
        <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border/60">
            <h3 className="text-[13px] font-medium">Top Channels</h3>
          </div>
          <div className="p-4 space-y-3.5">
            <ChannelRow name="general" messages={12483} percentage={85} />
            <ChannelRow name="gaming" messages={8921} percentage={68} />
            <ChannelRow name="programming" messages={6342} percentage={51} />
            <ChannelRow name="off-topic" messages={4128} percentage={35} />
            <ChannelRow name="music" messages={2891} percentage={24} />
          </div>
        </div>

        {/* Insights */}
        <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border/60 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <h3 className="text-[13px] font-medium">Insights</h3>
          </div>
          <div className="p-3 space-y-2">
            <InsightItem text="Activity increased 24% this week, primarily driven by #gaming." type="positive" />
            <InsightItem text="14 questions went unanswered in the last 24 hours." type="warning" />
            <InsightItem text="Peak activity is shifting from 8 PM to 10 PM on weekdays." type="info" />
          </div>
        </div>
      </div>

      {/* Member Growth */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60">
          <h3 className="text-[13px] font-medium">Member Growth</h3>
        </div>
        <div className="p-4">
          <div className="flex items-end gap-1 h-[120px]">
            {[30, 35, 42, 38, 45, 52, 48, 55, 62, 58, 65, 72].map((h, i) => (
              <div key={i} className="flex-1 flex items-end h-full group">
                <div
                  className="w-full rounded-t-[3px] bg-primary/60 group-hover:bg-primary transition-colors"
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ChannelRow({ name, messages, percentage }: { name: string; messages: number; percentage: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <Hash className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[12px] font-medium">{name}</span>
          <span className="text-[10px] text-muted-foreground">{messages.toLocaleString()}</span>
        </div>
        <div className="h-1 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary/70 rounded-full transition-all" style={{ width: `${percentage}%` }} />
        </div>
      </div>
    </div>
  )
}

function InsightItem({ text, type }: { text: string; type: 'positive' | 'warning' | 'info' }) {
  const colors = {
    positive: 'border-emerald-500/20 bg-emerald-500/5',
    warning: 'border-amber-500/20 bg-amber-500/5',
    info: 'border-blue-500/20 bg-blue-500/5',
  }
  const dots = {
    positive: 'bg-emerald-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
  }
  return (
    <div className={`flex items-start gap-2.5 p-3 rounded-lg border ${colors[type]}`}>
      <div className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${dots[type]}`} />
      <p className="text-[12px] leading-relaxed">{text}</p>
    </div>
  )
}
