import { Metadata } from 'next'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react'
import { mockStatusServices } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'Status',
  description: 'Check the current status of Wembo services.',
}

function getStatusConfig(status: string) {
  switch (status) {
    case 'operational':
      return { icon: CheckCircle2, label: 'Operational', color: 'text-green-500', bg: 'bg-green-500/10' }
    case 'degraded':
      return { icon: AlertTriangle, label: 'Degraded', color: 'text-yellow-500', bg: 'bg-yellow-500/10' }
    case 'outage':
      return { icon: XCircle, label: 'Outage', color: 'text-red-500', bg: 'bg-red-500/10' }
    case 'maintenance':
      return { icon: Clock, label: 'Maintenance', color: 'text-blue-500', bg: 'bg-blue-500/10' }
    default:
      return { icon: CheckCircle2, label: 'Unknown', color: 'text-muted-foreground', bg: 'bg-muted' }
  }
}

export default function StatusPage() {
  const allOperational = mockStatusServices.every((s) => s.status === 'operational')

  return (
    <div className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">System Status</h1>
            <p className="text-muted-foreground">
              Current status of Wembo services.
            </p>
          </div>

          {/* Overall Status */}
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {allOperational ? (
                  <>
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-semibold text-green-500">All Systems Operational</span>
                  </>
                ) : (
                  <>
                    <div className="h-3 w-3 rounded-full bg-yellow-500 animate-pulse" />
                    <span className="font-semibold text-yellow-500">Some Systems Degraded</span>
                  </>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                Last checked: just now
              </span>
            </div>
          </Card>

          {/* Services */}
          <Card className="divide-y divide-border">
            {mockStatusServices.map((service) => {
              const config = getStatusConfig(service.status)
              const StatusIcon = config.icon
              return (
                <div key={service.name} className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`h-5 w-5 ${config.color}`} />
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{service.uptime} uptime</span>
                    <Badge variant="success" className="text-xs">
                      {config.label}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </Card>

          {/* Incident History */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Recent Incidents</h2>
            <Card className="p-6">
              <div className="text-center py-8">
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No recent incidents. All systems running smoothly.</p>
              </div>
            </Card>
          </div>

          {/* Subscribe */}
          <Card className="mt-8 p-6 text-center">
            <h3 className="font-semibold mb-2">Get notified about incidents</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to receive updates when services are affected.
            </p>
            <div className="flex max-w-sm mx-auto gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 h-10 rounded-lg border border-border bg-muted/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                readOnly
              />
              <button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
