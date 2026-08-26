'use client'

import { BarChart3, TrendingUp, Users, MessageSquare, Hash } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ActivityChart } from '@/components/activity-chart'
import { StatCard } from '@/components/stat-card'

export default function DashboardAnalyticsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Community metrics and growth data.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Members" value="12,482" icon={Users} trend="+342" trendUp={true} />
        <StatCard title="Messages (7d)" value="84,291" icon={MessageSquare} trend="+24%" trendUp={true} />
        <StatCard title="Active Rate" value="30.6%" icon={TrendingUp} trend="+3%" trendUp={true} />
        <StatCard title="Retention" value="92%" icon={Users} trend="+1.2%" trendUp={true} />
      </div>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Message Activity</CardTitle>
            <Badge variant="secondary">7 days</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ActivityChart />
        </CardContent>
      </Card>

      {/* Top Channels & Insights */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Channels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ChannelRow name="#general" messages={12483} percentage={85} />
            <ChannelRow name="#gaming" messages={8921} percentage={68} />
            <ChannelRow name="#programming" messages={6342} percentage={51} />
            <ChannelRow name="#off-topic" messages={4128} percentage={35} />
            <ChannelRow name="#music" messages={2891} percentage={24} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-primary/20 flex items-center justify-center">
                <span className="text-[9px] font-bold text-primary">AI</span>
              </div>
              Wembo Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InsightItem
              text="Activity increased 24% this week, primarily driven by #gaming."
              type="positive"
            />
            <InsightItem
              text="14 questions went unanswered in the last 24 hours."
              type="warning"
            />
            <InsightItem
              text="Peak activity is shifting from 8 PM to 10 PM on weekdays."
              type="info"
            />
          </CardContent>
        </Card>
      </div>

      {/* Growth */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Member Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-1 h-32">
            {[30, 35, 42, 38, 45, 52, 48, 55, 62, 58, 65, 72].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <div
                  className="w-full rounded-t-sm bg-gradient-to-t from-primary/60 to-primary/30"
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ChannelRow({ name, messages, percentage }: { name: string; messages: number; percentage: number }) {
  return (
    <div className="flex items-center gap-3">
      <Hash className="h-4 w-4 text-muted-foreground" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">{name}</span>
          <span className="text-xs text-muted-foreground">{messages.toLocaleString()} msgs</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${percentage}%` }} />
        </div>
      </div>
    </div>
  )
}

function InsightItem({ text, type }: { text: string; type: 'positive' | 'warning' | 'info' }) {
  const colors = {
    positive: 'border-green-500/20 bg-green-500/5',
    warning: 'border-orange-500/20 bg-orange-500/5',
    info: 'border-blue-500/20 bg-blue-500/5',
  }
  return (
    <div className={`p-3 rounded-lg border ${colors[type]}`}>
      <p className="text-sm">{text}</p>
    </div>
  )
}
