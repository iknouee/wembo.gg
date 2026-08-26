'use client'

import { Shield, AlertTriangle, Lock, Eye, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockSecurityEvents } from '@/lib/mock-data'

export default function DashboardSecurityPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Security</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage your server&apos;s security.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Lock className="h-4 w-4" /> Lockdown
        </Button>
      </div>

      {/* Security Score */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
              <circle
                cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none"
                strokeDasharray={`${87 * 2.51} ${100 * 2.51}`}
                className="text-green-500" strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">87</span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Security Score</h3>
            <p className="text-sm text-muted-foreground mb-3">Your server security is in good shape.</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success">Anti-raid: Active</Badge>
              <Badge variant="success">Anti-spam: Active</Badge>
              <Badge variant="success">Phishing detection: Active</Badge>
              <Badge variant="secondary">Lockdown: Ready</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Threats Blocked</p>
          <p className="text-xl font-bold">142</p>
          <p className="text-xs text-muted-foreground">this week</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Raids Prevented</p>
          <p className="text-xl font-bold">3</p>
          <p className="text-xs text-muted-foreground">this month</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Links Scanned</p>
          <p className="text-xl font-bold">8,421</p>
          <p className="text-xs text-muted-foreground">total</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Accounts Flagged</p>
          <p className="text-xl font-bold">7</p>
          <p className="text-xs text-muted-foreground">active flags</p>
        </Card>
      </div>

      {/* Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" /> Security Timeline
            </CardTitle>
            <Button variant="ghost" size="sm">View all</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockSecurityEvents.map((event) => (
            <div key={event.id} className="flex items-start justify-between p-4 rounded-lg border border-border/50">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 h-2.5 w-2.5 rounded-full ${
                  event.severity === 'high' ? 'bg-red-500' :
                  event.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                }`} />
                <div>
                  <p className="text-sm font-medium">{event.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{event.timestamp}</p>
                </div>
              </div>
              <Badge variant={
                event.severity === 'high' ? 'danger' :
                event.severity === 'medium' ? 'warning' : 'secondary'
              }>
                {event.severity}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
