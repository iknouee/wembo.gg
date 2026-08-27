'use client'

import { Ticket, Plus, Clock, User, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/stat-card'
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
    <div className="p-5 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Tickets</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Support tickets and member requests.</p>
        </div>
        <Button size="sm" className="gap-1.5 text-[12px] h-8">
          <Plus className="h-3.5 w-3.5" /> Create Panel
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title="Open" value="8" icon={Ticket} description="active" />
        <StatCard title="In Progress" value="5" />
        <StatCard title="Closed Today" value="12" trend="+4" trendUp={true} />
        <StatCard title="Avg. Response" value="4m" icon={Clock} />
      </div>

      {/* Tickets List */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60">
          <h3 className="text-[13px] font-medium">Recent Tickets</h3>
        </div>
        <div className="divide-y divide-border/40">
          {mockTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/8 flex items-center justify-center">
                  <Ticket className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-[13px] font-medium">{ticket.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <User className="h-2.5 w-2.5" /> {ticket.user}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Tag className="h-2.5 w-2.5" /> {ticket.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Clock className="h-2.5 w-2.5" /> {ticket.createdAt}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground hidden sm:block">→ {ticket.assignee}</span>
                <Badge variant={statusColors[ticket.status] as any} className="text-[10px]">
                  {statusLabels[ticket.status]}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
