'use client'

import { Ticket, Plus, Clock, User, Tag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockTickets } from '@/lib/mock-data'

const statusColors: Record<string, string> = {
  open: 'warning',
  in_progress: 'default',
  closed: 'secondary',
}

const statusLabels: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  closed: 'Closed',
}

export default function DashboardTicketsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tickets</h1>
          <p className="text-muted-foreground mt-1">Support tickets and member requests.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Create Panel
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Open Tickets</p>
          <p className="text-xl font-bold text-orange-500">8</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">In Progress</p>
          <p className="text-xl font-bold text-primary">5</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Closed Today</p>
          <p className="text-xl font-bold text-green-500">12</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Avg. Response</p>
          <p className="text-xl font-bold">4m</p>
        </Card>
      </div>

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-4 rounded-lg /50  transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Ticket className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{ticket.title}</h4>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" /> {ticket.user}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" /> {ticket.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {ticket.createdAt}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    → {ticket.assignee}
                  </span>
                  <Badge variant={statusColors[ticket.status] as any}>
                    {statusLabels[ticket.status]}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
