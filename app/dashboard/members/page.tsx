'use client'

import { Users, Search, Star, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/stat-card'
import { mockMembers } from '@/lib/mock-data'

export default function DashboardMembersPage() {
  return (
    <div className="p-5 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Members</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Understand and manage your community members.</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search members..."
            className="w-full h-8 rounded-lg border border-border/60 bg-card pl-9 pr-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
            readOnly
          />
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-[12px] h-8">
          <Filter className="h-3.5 w-3.5" /> Filter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title="Total" value="12,482" icon={Users} />
        <StatCard title="Online" value="1,247" trend="+89" trendUp={true} />
        <StatCard title="New (7d)" value="342" trend="+18%" trendUp={true} />
        <StatCard title="Avg. Rep" value="72" icon={Star} />
      </div>

      {/* Members Table */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60">
          <h3 className="text-[13px] font-medium">Active Members</h3>
        </div>
        <div className="divide-y divide-border/40">
          {mockMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-[11px] font-bold text-primary">
                    {member.name[0]}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card ${
                    member.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium">{member.name}</p>
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0">{member.role}</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{member.interests.join(' · ')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-1">
                  <Star className="h-3 w-3 text-amber-500" />
                  <span className="text-[12px] font-medium">{member.reputation}</span>
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-[11px] text-muted-foreground">{member.contributions.answers} answers</p>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-[11px]">View</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
