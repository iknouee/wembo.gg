'use client'

import { Zap, Plus, Play, Pause, MoreVertical } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/empty-state'
import { mockAutomations } from '@/lib/mock-data'

export default function DashboardAutomationsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Automations</h1>
          <p className="text-muted-foreground mt-1">Build and manage your workflow automations.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Create Automation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Active Automations</p>
          <p className="text-2xl font-bold">3</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Runs</p>
          <p className="text-2xl font-bold">2,318</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Runs Today</p>
          <p className="text-2xl font-bold">47</p>
        </Card>
      </div>

      {/* Automations List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Automations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAutomations.map((automation) => (
              <div
                key={automation.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                    automation.status === 'active' ? 'bg-green-500/10' : 'bg-muted'
                  }`}>
                    <Zap className={`h-4 w-4 ${
                      automation.status === 'active' ? 'text-green-500' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{automation.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      Trigger: {automation.trigger} · {automation.runs.toLocaleString()} runs
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={automation.status === 'active' ? 'success' : 'secondary'}
                  >
                    {automation.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    Last: {automation.lastRun}
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {automation.status === 'active' ? (
                      <Pause className="h-3.5 w-3.5" />
                    ) : (
                      <Play className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
