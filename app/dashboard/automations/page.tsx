'use client'

import { Zap, Plus, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/stat-card'
import { mockAutomations } from '@/lib/mock-data'

export default function DashboardAutomationsPage() {
  return (
    <div className="p-5 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Automations</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Build and manage workflow automations.</p>
        </div>
        <Button size="sm" className="gap-1.5 text-[12px] h-8">
          <Plus className="h-3.5 w-3.5" /> Create
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard title="Active" value="3" icon={Zap} />
        <StatCard title="Total Runs" value="2,318" trend="+142" trendUp={true} />
        <StatCard title="Today" value="47" trend="+12" trendUp={true} />
      </div>

      {/* Automations List */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60">
          <h3 className="text-[13px] font-medium">Your Automations</h3>
        </div>
        <div className="divide-y divide-border/40">
          {mockAutomations.map((automation) => (
            <div
              key={automation.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                  automation.status === 'active' ? 'bg-emerald-500/10' : 'bg-muted'
                }`}>
                  <Zap className={`h-3.5 w-3.5 ${
                    automation.status === 'active' ? 'text-emerald-500' : 'text-muted-foreground'
                  }`} />
                </div>
                <div>
                  <p className="text-[13px] font-medium">{automation.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {automation.trigger} · {automation.runs.toLocaleString()} runs · Last: {automation.lastRun}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={automation.status === 'active' ? 'success' : 'secondary'}
                  className="text-[10px]"
                >
                  {automation.status}
                </Badge>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  {automation.status === 'active' ? (
                    <Pause className="h-3 w-3" />
                  ) : (
                    <Play className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
