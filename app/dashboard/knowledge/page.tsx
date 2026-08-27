'use client'

import { BookOpen, Plus, Search, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/stat-card'
import { mockKnowledge } from '@/lib/mock-data'

export default function DashboardKnowledgePage() {
  return (
    <div className="p-5 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Knowledge Base</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Manage your community&apos;s knowledge sources.</p>
        </div>
        <Button size="sm" className="gap-1.5 text-[12px] h-8">
          <Plus className="h-3.5 w-3.5" /> Add
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search knowledge base..."
          className="w-full h-8 rounded-lg border border-border/60 bg-card pl-9 pr-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
          readOnly
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title="Sources" value="12" icon={BookOpen} />
        <StatCard title="Articles" value="47" trend="+5" trendUp={true} />
        <StatCard title="Answered" value="1,284" trend="+23%" trendUp={true} />
        <StatCard title="Accuracy" value="94%" icon={Sparkles} />
      </div>

      {/* Knowledge Items */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60">
          <h3 className="text-[13px] font-medium">Sources</h3>
        </div>
        <div className="divide-y divide-border/40">
          {mockKnowledge.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/8 flex items-center justify-center">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-[13px] font-medium">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.source} · Updated {item.lastUpdated}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">{item.category}</Badge>
                <Button variant="ghost" size="sm" className="h-7 text-[11px]">Edit</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
