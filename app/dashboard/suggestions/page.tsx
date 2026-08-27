'use client'

import { Heart, ThumbsUp, ThumbsDown, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  under_review: 'Under Review',
  approved: 'Approved',
  denied: 'Denied',
  implemented: 'Implemented',
}

export default function DashboardSuggestionsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Suggestions</h1>
          <p className="text-muted-foreground mt-1">Community feedback and feature requests.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> New Suggestion
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Total Suggestions</p>
          <p className="text-xl font-bold">284</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Pending Review</p>
          <p className="text-xl font-bold text-orange-500">14</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Approved</p>
          <p className="text-xl font-bold text-green-500">89</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Implemented</p>
          <p className="text-xl font-bold text-primary">42</p>
        </Card>
      </div>

      {/* Suggestions List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="flex items-center justify-between p-4 rounded-lg /50  transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Votes */}
                  <div className="flex flex-col items-center gap-1 min-w-[50px]">
                    <div className="flex items-center gap-1 text-green-500">
                      <ThumbsUp className="h-3 w-3" />
                      <span className="text-xs font-medium">{suggestion.upvotes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-400">
                      <ThumbsDown className="h-3 w-3" />
                      <span className="text-xs font-medium">{suggestion.downvotes}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">#{suggestion.id}</span>
                      <h4 className="text-sm font-medium">{suggestion.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      by {suggestion.author} · {suggestion.createdAt}
                    </p>
                  </div>
                </div>
                <Badge variant={statusColors[suggestion.status] as any}>
                  {statusLabels[suggestion.status]}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
