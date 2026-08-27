'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, Users, MessageSquare, Hash, Clock, ArrowUpRight, ArrowDownRight, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ActivityChart } from '@/components/activity-chart'

export default function DashboardAnalyticsPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d')

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-[#9A9CA3] mt-1 text-sm">Community metrics and growth insights.</p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0a0b0d] border border-white/[0.04]">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                period === p
                  ? 'bg-[#FFD600]/10 text-[#FFD600]'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsStat
          label="Total Members"
          value="12,482"
          change="+342"
          changePercent="+2.8%"
          isUp={true}
          icon={Users}
        />
        <AnalyticsStat
          label="Messages"
          value="84,291"
          change="+16,482"
          changePercent="+24%"
          isUp={true}
          icon={MessageSquare}
        />
        <AnalyticsStat
          label="Active Rate"
          value="30.6%"
          change="+3.1%"
          changePercent=""
          isUp={true}
          icon={TrendingUp}
        />
        <AnalyticsStat
          label="Retention"
          value="92%"
          change="+1.2%"
          changePercent=""
          isUp={true}
          icon={Eye}
        />
      </div>

      {/* Activity Chart */}
      <Card className="border-white/[0.04] bg-[#0a0b0d]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-base text-white/90">Message Activity</CardTitle>
              <Badge variant="secondary" className="text-[10px] bg-white/[0.04] text-white/40 border-0">
                Last {period === '7d' ? '7 days' : period === '30d' ? '30 days' : '90 days'}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-white/30">
                <span className="h-2 w-2 rounded-full bg-[#FFD600]" />
                Messages
              </span>
              <span className="flex items-center gap-1.5 text-white/30">
                <span className="h-2 w-2 rounded-full bg-blue-400/60" />
                Members
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ActivityChart />
        </CardContent>
      </Card>

      {/* Two columns: Top Channels + Peak Hours */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Top Channels */}
        <Card className="border-white/[0.04] bg-[#0a0b0d]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-white/90">Top Channels</CardTitle>
              <span className="text-xs text-white/20">by messages</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChannelRow name="general" messages={12483} percentage={100} rank={1} />
            <ChannelRow name="gaming" messages={8921} percentage={71} rank={2} />
            <ChannelRow name="programming" messages={6342} percentage={51} rank={3} />
            <ChannelRow name="off-topic" messages={4128} percentage={33} rank={4} />
            <ChannelRow name="music" messages={2891} percentage={23} rank={5} />
            <ChannelRow name="art-showcase" messages={1847} percentage={15} rank={6} />
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card className="border-white/[0.04] bg-[#0a0b0d]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-white/90 flex items-center gap-2">
                <Clock className="h-4 w-4 text-white/40" />
                Peak Hours
              </CardTitle>
              <span className="text-xs text-white/20">UTC</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-1.5">
              {peakHoursData.map((hour) => (
                <div key={hour.hour} className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-full h-16 rounded-md transition-colors"
                    style={{
                      backgroundColor: `rgba(255, 214, 0, ${hour.intensity * 0.4})`,
                    }}
                    title={`${hour.hour}:00 — ${hour.messages.toLocaleString()} messages`}
                  />
                  <span className="text-[9px] text-white/20">{hour.hour}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.04]">
              <div>
                <p className="text-xs text-white/30">Busiest hour</p>
                <p className="text-sm font-medium text-white/80">10:00 PM</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/30">Quietest hour</p>
                <p className="text-sm font-medium text-white/80">5:00 AM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights + Member Growth */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* AI Insights */}
        <Card className="border-white/[0.04] bg-[#0a0b0d]">
          <CardHeader>
            <CardTitle className="text-base text-white/90 flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-[#FFD600]/15 flex items-center justify-center">
                <span className="text-[8px] font-bold text-[#FFD600]">AI</span>
              </div>
              Wembo Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InsightItem
              text="Activity surged 24% this week, primarily from #gaming channel engagement."
              type="positive"
            />
            <InsightItem
              text="14 questions went unanswered in the last 24 hours — consider enabling AI auto-replies."
              type="warning"
            />
            <InsightItem
              text="Peak activity is shifting from 8 PM to 10 PM — consider scheduling events later."
              type="info"
            />
            <InsightItem
              text="Member churn decreased 18% compared to last month."
              type="positive"
            />
          </CardContent>
        </Card>

        {/* Member Growth */}
        <Card className="border-white/[0.04] bg-[#0a0b0d]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-white/90">Member Growth</CardTitle>
              <div className="flex items-center gap-1 text-green-400 text-xs font-medium">
                <ArrowUpRight className="h-3 w-3" />
                +8.2%
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1.5 h-36">
              {memberGrowthData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                  <div className="relative w-full flex justify-center">
                    <div className="absolute -top-6 px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-white/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {d.members.toLocaleString()}
                    </div>
                  </div>
                  <div
                    className="w-full rounded-t-sm bg-gradient-to-t from-[#FFD600]/30 to-[#FFD600]/70 group-hover:from-[#FFD600]/50 group-hover:to-[#FFD600] transition-colors cursor-pointer"
                    style={{ height: `${(d.members / 12500) * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 text-[10px] text-white/20">
              {memberGrowthData.map((d, i) => (
                <span key={i} className="flex-1 text-center">{d.month}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function AnalyticsStat({ label, value, change, changePercent, isUp, icon: Icon }: {
  label: string; value: string; change: string; changePercent: string; isUp: boolean; icon: any
}) {
  return (
    <div className="p-4 rounded-xl bg-[#0a0b0d] border border-white/[0.04] space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/30">{label}</span>
        <div className="h-7 w-7 rounded-lg bg-white/[0.03] flex items-center justify-center">
          <Icon className="h-3.5 w-3.5 text-white/20" />
        </div>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
      <div className="flex items-center gap-1.5">
        {isUp ? (
          <ArrowUpRight className="h-3 w-3 text-green-400" />
        ) : (
          <ArrowDownRight className="h-3 w-3 text-red-400" />
        )}
        <span className={`text-xs font-medium ${isUp ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </span>
        {changePercent && (
          <span className="text-xs text-white/20">{changePercent}</span>
        )}
      </div>
    </div>
  )
}

function ChannelRow({ name, messages, percentage, rank }: { name: string; messages: number; percentage: number; rank: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-medium text-white/15 w-4 text-right">{rank}</span>
      <Hash className="h-3.5 w-3.5 text-white/20" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-white/70">{name}</span>
          <span className="text-xs text-white/25">{messages.toLocaleString()}</span>
        </div>
        <div className="h-1 rounded-full bg-white/[0.04] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FFD600]/40 to-[#FFD600]/80 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function InsightItem({ text, type }: { text: string; type: 'positive' | 'warning' | 'info' }) {
  const styles = {
    positive: 'border-green-500/10 bg-green-500/[0.03]',
    warning: 'border-orange-500/10 bg-orange-500/[0.03]',
    info: 'border-blue-500/10 bg-blue-500/[0.03]',
  }
  const dots = {
    positive: 'bg-green-400',
    warning: 'bg-orange-400',
    info: 'bg-blue-400',
  }
  return (
    <div className={`p-3 rounded-lg border ${styles[type]} flex items-start gap-2.5`}>
      <span className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${dots[type]}`} />
      <p className="text-xs text-white/50 leading-relaxed">{text}</p>
    </div>
  )
}

// ─── Data ────────────────────────────────────────────────────────────────────

const peakHoursData = [
  { hour: '0', messages: 1200, intensity: 0.2 },
  { hour: '2', messages: 400, intensity: 0.05 },
  { hour: '4', messages: 200, intensity: 0.02 },
  { hour: '6', messages: 800, intensity: 0.1 },
  { hour: '8', messages: 2400, intensity: 0.35 },
  { hour: '10', messages: 3800, intensity: 0.55 },
  { hour: '12', messages: 4200, intensity: 0.6 },
  { hour: '14', messages: 5100, intensity: 0.75 },
  { hour: '16', messages: 5800, intensity: 0.85 },
  { hour: '18', messages: 6200, intensity: 0.9 },
  { hour: '20', messages: 6800, intensity: 0.95 },
  { hour: '22', messages: 7100, intensity: 1.0 },
]

const memberGrowthData = [
  { month: 'Jan', members: 8200 },
  { month: 'Feb', members: 8600 },
  { month: 'Mar', members: 9100 },
  { month: 'Apr', members: 9400 },
  { month: 'May', members: 9900 },
  { month: 'Jun', members: 10400 },
  { month: 'Jul', members: 10800 },
  { month: 'Aug', members: 11200 },
  { month: 'Sep', members: 11500 },
  { month: 'Oct', members: 11900 },
  { month: 'Nov', members: 12100 },
  { month: 'Dec', members: 12482 },
]
