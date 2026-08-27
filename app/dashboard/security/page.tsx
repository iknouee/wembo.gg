'use client'

import { Shield, Lock, Activity, AlertTriangle, Link2, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/stat-card'
import { mockSecurityEvents } from '@/lib/mock-data'

export default function DashboardSecurityPage() {
  return (
    <div className="p-5 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Security</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Monitor and manage your server&apos;s security.</p>
        </div>
        <Button size="sm" variant="outline" className="gap-1.5 text-[12px] h-8">
          <Lock className="h-3.5 w-3.5" /> Lockdown
        </Button>
      </div>

      {/* Security Score + Features */}
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/50" />
              <circle
                cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none"
                strokeDasharray={`${87 * 2.51} ${100 * 2.51}`}
                className="text-emerald-500" strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold">87</span>
              <span className="text-[9px] text-muted-foreground">/100</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-medium mb-1">Security Score</p>
            <p className="text-[12px] text-muted-foreground mb-3">Your server security is in good shape.</p>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="success" className="text-[10px]">Anti-raid</Badge>
              <Badge variant="success" className="text-[10px]">Anti-spam</Badge>
              <Badge variant="success" className="text-[10px]">Phishing detection</Badge>
              <Badge variant="secondary" className="text-[10px]">Lockdown: Ready</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title="Blocked" value="142" icon={Shield} description="this week" />
        <StatCard title="Raids" value="3" icon={AlertTriangle} description="prevented" />
        <StatCard title="Links" value="8,421" icon={Link2} description="scanned" />
        <StatCard title="Flagged" value="7" icon={UserX} description="active" />
      </div>

      {/* Security Timeline */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
            <h3 className="text-[13px] font-medium">Timeline</h3>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-[11px] text-muted-foreground">
            View all
          </Button>
        </div>
        <div className="divide-y divide-border/40">
          {mockSecurityEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between px-4 py-3 hover:bg-accent/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                  event.severity === 'high' ? 'bg-red-500' :
                  event.severity === 'medium' ? 'bg-amber-500' : 'bg-yellow-400'
                }`} />
                <div>
                  <p className="text-[13px] font-medium">{event.description}</p>
                  <p className="text-[11px] text-muted-foreground">{event.timestamp}</p>
                </div>
              </div>
              <Badge
                variant={event.severity === 'high' ? 'danger' : event.severity === 'medium' ? 'warning' : 'secondary'}
                className="text-[10px] flex-shrink-0"
              >
                {event.severity}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
