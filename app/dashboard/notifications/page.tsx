'use client'

import { Bell, Plus, Youtube, Twitch, Github, Rss, Webhook, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">Configure external platform notifications.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Integration
        </Button>
      </div>

      {/* Active Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configured Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockIntegrations.map((integration) => {
              const Icon = integrationIcons[integration.name] || Webhook
              return (
                <div
                  key={integration.id}
                  className="flex items-center justify-between p-4 rounded-lg /50  transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{integration.name}</h4>
                      <p className="text-xs text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {integration.channel && (
                      <span className="text-xs text-muted-foreground hidden sm:block">{integration.channel}</span>
                    )}
                    <Badge variant={integration.status === 'connected' ? 'success' : 'secondary'}>
                      {integration.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      {integration.status === 'connected' ? 'Edit' : 'Connect'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <NotificationItem
            platform="YouTube"
            content="New video: &quot;Building a Discord Bot in 2024&quot;"
            channel="#youtube"
            time="2 hours ago"
          />
          <NotificationItem
            platform="Twitch"
            content="GameMaster went live: &quot;Late Night Gaming&quot;"
            channel="#streams"
            time="5 hours ago"
          />
          <NotificationItem
            platform="YouTube"
            content="New video: &quot;Community Update #42&quot;"
            channel="#youtube"
            time="1 day ago"
          />
        </CardContent>
      </Card>
    </div>
  )
}

function NotificationItem({
  platform,
  content,
  channel,
  time,
}: {
  platform: string
  content: string
  channel: string
  time: string
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg /50">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-primary" />
        <div>
          <p className="text-sm">
            <span className="font-medium">{platform}:</span> {content}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Posted to {channel} · {time}
          </p>
        </div>
      </div>
    </div>
  )
}
