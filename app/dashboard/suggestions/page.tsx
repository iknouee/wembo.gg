'use client'

import { Heart, ThumbsUp, ThumbsDown, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/stat-card'
import { mockSuggestions } from '@/lib/mock-data'

const statusColors: Record<string, string> = {
  pending: 'secondary',
  under_review: 'warning',
  approved: 'success',
  denied: 'danger',
  implemented: 'default',
}

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  under_review: 'Review',
  approved: 'Approved',
  denied: 'Denied',
  implemented: 'Done',
}

export default function DashboardSuggestionsPage() {
  return (
    <div className="p-5 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Suggestions</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Community feedback and feature requests.</p>
        </div>
        <Button size="sm" className="gap-1.5 text-[12px] h-8">
          <Plus className="h-3.5 w-3.5" /> New
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title="Total" value="284" icon={Heart} />
        <StatCard title="Pending" value="14" description="need review" />
        <StatCard title="Approved" value="89" trend="+7" trendUp={true} />
        <StatCard title="Implemented" value="42" trend="+3" trendUp={true} />
      </div>

      {/* Suggestions List */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60">
          <h3 className="text-[13px] font-medium">Recent Suggestions</h3>
        </div>
        <div className="divide-y divide-border/40">
          {mockSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Vote counts */}
                <div className="flex flex-col items-center gap-0.5 min-w-[40px]">
                  <div className="flex items-center gap-0.5 text-emerald-500">
                    <ThumbsUp className="h-2.5 w-2.5" />
                    <span className="text-[10px] font-semibold">{suggestion.upvotes}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-red-400">
                    <ThumbsDown className="h-2.5 w-2.5" />
                    <span className="text-[10px] font-semibold">{suggestion.downvotes}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">#{suggestion.id}</span>
                    <p className="text-[13px] font-medium">{suggestion.title}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    by {suggestion.author} · {suggestion.createdAt}
                  </p>
                </div>
              </div>
              <Badge variant={statusColors[suggestion.status] as any} className="text-[10px]">
                {statusLabels[suggestion.status]}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
