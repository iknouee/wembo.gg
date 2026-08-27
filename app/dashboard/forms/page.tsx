'use client'

import { FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/stat-card'
import { mockForms } from '@/lib/mock-data'

export default function DashboardFormsPage() {
  return (
    <div className="p-5 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Forms</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Create and manage application forms.</p>
        </div>
        <Button size="sm" className="gap-1.5 text-[12px] h-8">
          <Plus className="h-3.5 w-3.5" /> Create
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard title="Active" value={String(mockForms.length)} icon={FileText} />
        <StatCard title="Submissions" value="148" trend="+24" trendUp={true} />
        <StatCard title="Pending" value="12" description="need review" />
      </div>

      {/* Forms List */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60">
          <h3 className="text-[13px] font-medium">Your Forms</h3>
        </div>
        <div className="divide-y divide-border/40">
          {mockForms.map((form) => (
            <div
              key={form.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/8 flex items-center justify-center">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-[13px] font-medium">{form.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {form.submissions} submissions · Last: {form.lastSubmission}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success" className="text-[10px]">{form.status}</Badge>
                <Button variant="ghost" size="sm" className="h-7 text-[11px]">Edit</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
