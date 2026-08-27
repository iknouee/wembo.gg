'use client'

import { Bell, Plus, Youtube, Twitch, Github, Rss, Webhook } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockIntegrations } from '@/lib/mock-data'

const integrationIcons: Record<string, React.ElementType> = {
  YouTube: Youtube,
  Twitch: Twitch,
  GitHub: Github,
  Reddit: Rss,
}

export default function DashboardNotificationsPage() {
  return (
    <div className="p-5 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Configure external platform notifications.</p>
        </div>
        <Button size="sm" className="gap-1.5 text-[12px] h-8">
          <Plus className="h-3.5 w-3.5" /> Add
        </Button>
      </div>

      {/* Configured Integrations */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60">
          <h3 className="text-[13px] font-medium">Configured Integrations</h3>
        </div>
        <div className="divide-y divide-border/40">
          {mockIntegrations.map((integration) => {
            const Icon = integrationIcons[integration.name] || Webhook
            return (
              <div
                key={integration.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/8 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium">{integration.name}</p>
                    <p className="text-[11px] text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {integration.channel && (
                    <span className="text-[10px] text-muted-foreground hidden sm:block">{integration.channel}</span>
                  )}
                  <Badge
                    variant={integration.status === 'connected' ? 'success' : 'secondary'}
                    className="text-[10px]"
                  >
                    {integration.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-7 text-[11px]">
                    {integration.status === 'connected' ? 'Edit' : 'Connect'}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60">
          <h3 className="text-[13px] font-medium">Recent Notifications</h3>
        </div>
        <div className="divide-y divide-border/40">
          <NotificationItem
            platform="YouTube"
            content='New video: "Building a Discord Bot in 2024"'
            channel="#youtube"
            time="2 hours ago"
          />
          <NotificationItem
            platform="Twitch"
            content='GameMaster went live: "Late Night Gaming"'
            channel="#streams"
            time="5 hours ago"
          />
          <NotificationItem
            platform="YouTube"
            content='New video: "Community Update #42"'
            channel="#youtube"
            time="1 day ago"
          />
        </div>
      </div>
    </div>
  )
}

function NotificationItem({ platform, content, channel, time }: {
  platform: string; content: string; channel: string; time: string
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-accent/30 transition-colors">
      <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[12px] truncate">
          <span className="font-medium">{platform}:</span> {content}
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          → {channel} · {time}
        </p>
      </div>
    </div>
  )
}
