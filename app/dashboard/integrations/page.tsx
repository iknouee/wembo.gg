'use client'

import { Youtube, Twitch, Github, Rss, Webhook, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const availableIntegrations = [
  { name: 'YouTube', description: 'Post notifications for new video uploads', icon: Youtube, connected: true },
  { name: 'Twitch', description: 'Stream go-live notifications', icon: Twitch, connected: true },
  { name: 'GitHub', description: 'Repository activity and release notifications', icon: Github, connected: false },
  { name: 'Reddit', description: 'New post notifications from subreddits', icon: Rss, connected: false },
  { name: 'RSS', description: 'Custom RSS feed notifications', icon: Globe, connected: false },
  { name: 'Webhooks', description: 'Custom webhook integrations', icon: Webhook, connected: true },
]

export default function DashboardIntegrationsPage() {
  return (
    <div className="p-5 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Integrations</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Connect external services to your server.</p>
      </div>

      {/* Integrations Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {availableIntegrations.map((integration) => (
          <div
            key={integration.name}
            className="rounded-xl border border-border/60 bg-card p-4 hover:border-border transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-9 w-9 rounded-lg bg-primary/8 flex items-center justify-center">
                <integration.icon className="h-4 w-4 text-primary" />
              </div>
              <Badge
                variant={integration.connected ? 'success' : 'secondary'}
                className="text-[10px]"
              >
                {integration.connected ? 'Connected' : 'Available'}
              </Badge>
            </div>
            <p className="text-[13px] font-medium mb-0.5">{integration.name}</p>
            <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">{integration.description}</p>
            <Button
              variant={integration.connected ? 'outline' : 'default'}
              size="sm"
              className="w-full h-7 text-[11px]"
            >
              {integration.connected ? 'Configure' : 'Connect'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
