'use client'

import { Puzzle, Plus, Youtube, Twitch, Github, Rss, Webhook, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-muted-foreground mt-1">Connect external services to your server.</p>
        </div>
      </div>

      {/* Available Integrations */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableIntegrations.map((integration) => (
          <Card key={integration.name} className="p-6  transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <integration.icon className="h-5 w-5 text-primary" />
              </div>
              <Badge variant={integration.connected ? 'success' : 'secondary'}>
                {integration.connected ? 'Connected' : 'Available'}
              </Badge>
            </div>
            <h3 className="font-semibold mb-1">{integration.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
            <Button
              variant={integration.connected ? 'outline' : 'default'}
              size="sm"
              className="w-full"
            >
              {integration.connected ? 'Configure' : 'Connect'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
