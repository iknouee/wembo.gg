'use client'

import { useState } from 'react'
import { Users, Search, Star, Filter, ChevronDown, MessageSquare, BookOpen, Calendar, ArrowUpRight, UserPlus, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { mockMembers } from '@/lib/mock-data'

type FilterTab = 'all' | 'online' | 'new' | 'top'

export default function DashboardMembersPage() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const filteredMembers = mockMembers.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.tag.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Members</h1>
          <p className="text-[#9A9CA3] mt-1 text-sm">Understand and manage your community members.</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0a0b0d] border border-white/[0.04] text-xs text-white/40 hover:text-white/60 hover:border-white/[0.08] transition-all">
          <UserPlus className="h-3.5 w-3.5" />
          Invite
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatBox label="Total Members" value="12,482" change="+342" isUp={true} />
        <StatBox label="Online Now" value="1,247" dot="green" />
        <StatBox label="New This Week" value="342" change="+18%" isUp={true} />
        <StatBox label="Avg. Reputation" value="72" icon={<Star className="h-3 w-3 text-[#FFD600]" />} />
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
          <input
            type="text"
            placeholder="Search by name or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 rounded-lg bg-[#0a0b0d] border border-white/[0.04] pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFD600]/30 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0a0b0d] border border-white/[0.04]">
          {([
            { key: 'all', label: 'All' },
            { key: 'online', label: 'Online' },
            { key: 'new', label: 'New' },
            { key: 'top', label: 'Top' },
          ] as { key: FilterTab; label: string }[]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === tab.key
                  ? 'bg-[#FFD600]/10 text-[#FFD600]'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Member List */}
      <div className="space-y-2">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[1fr_100px_120px_80px] gap-4 px-4 py-2 text-[10px] font-medium text-white/20 uppercase tracking-wider">
          <span>Member</span>
          <span className="text-center">Reputation</span>
          <span className="text-center">Contributions</span>
          <span className="text-right">Status</span>
        </div>

        {/* Member rows */}
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="group grid sm:grid-cols-[1fr_100px_120px_80px] gap-4 items-center p-4 rounded-xl bg-[#0a0b0d] border border-white/[0.03] hover:border-white/[0.06] hover:bg-[#0c0d10] transition-all cursor-pointer"
          >
            {/* Member Info */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FFD600]/20 to-[#FFD600]/5 flex items-center justify-center text-sm font-bold text-[#FFD600]/70">
                  {member.name[0]}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0a0b0d] ${
                  member.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-white/90 truncate">{member.name}</h4>
                  <RoleBadge role={member.role} />
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-white/25 truncate">{member.tag}</p>
                  <span className="text-white/10">·</span>
                  <p className="text-xs text-white/20 truncate hidden md:block">
                    {member.interests.slice(0, 2).join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Reputation */}
            <div className="hidden sm:flex items-center justify-center gap-1.5">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-[#FFD600]/60" />
                <span className="text-sm font-semibold text-white/70">{member.reputation}</span>
              </div>
              <ReputationBar value={member.reputation} />
            </div>

            {/* Contributions */}
            <div className="hidden sm:flex items-center justify-center gap-3">
              <span className="flex items-center gap-1 text-xs text-white/30" title="Answers">
                <MessageSquare className="h-3 w-3" />
                {member.contributions.answers}
              </span>
              <span className="flex items-center gap-1 text-xs text-white/30" title="Guides">
                <BookOpen className="h-3 w-3" />
                {member.contributions.guides}
              </span>
            </div>

            {/* Status */}
            <div className="hidden sm:flex justify-end">
              <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${
                member.status === 'online'
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-yellow-500/10 text-yellow-400'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  member.status === 'online' ? 'bg-green-400' : 'bg-yellow-400'
                }`} />
                {member.status === 'online' ? 'Online' : 'Idle'}
              </span>
            </div>
          </div>
        ))}

        {filteredMembers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-8 w-8 text-white/10 mb-3" />
            <p className="text-sm text-white/30">No members found</p>
            <p className="text-xs text-white/15 mt-1">Try a different search term</p>
          </div>
        )}
      </div>

      {/* Pagination hint */}
      {filteredMembers.length > 0 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-white/20">
            Showing {filteredMembers.length} of 12,482 members
          </p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-xs text-white/30 rounded-md hover:bg-white/[0.04] transition-colors">
              Previous
            </button>
            <button className="px-3 py-1.5 text-xs bg-[#FFD600]/10 text-[#FFD600] rounded-md">
              1
            </button>
            <button className="px-3 py-1.5 text-xs text-white/30 rounded-md hover:bg-white/[0.04] transition-colors">
              2
            </button>
            <button className="px-3 py-1.5 text-xs text-white/30 rounded-md hover:bg-white/[0.04] transition-colors">
              3
            </button>
            <button className="px-3 py-1.5 text-xs text-white/30 rounded-md hover:bg-white/[0.04] transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatBox({ label, value, change, isUp, dot, icon }: {
  label: string; value: string; change?: string; isUp?: boolean; dot?: string; icon?: React.ReactNode
}) {
  return (
    <div className="p-4 rounded-xl bg-[#0a0b0d] border border-white/[0.04]">
      <p className="text-xs text-white/30 mb-1.5">{label}</p>
      <div className="flex items-center gap-2">
        {dot && <span className={`h-2 w-2 rounded-full bg-${dot}-500 animate-pulse`} />}
        {icon}
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
      {change && (
        <div className="flex items-center gap-1 mt-1.5">
          <ArrowUpRight className={`h-3 w-3 ${isUp ? 'text-green-400' : 'text-red-400'}`} />
          <span className={`text-xs ${isUp ? 'text-green-400' : 'text-red-400'}`}>{change}</span>
          <span className="text-xs text-white/15">this week</span>
        </div>
      )}
    </div>
  )
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    'Moderator': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Trusted Member': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Active Member': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  }
  const style = styles[role] || 'bg-white/[0.04] text-white/30 border-white/[0.06]'

  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${style}`}>
      {role}
    </span>
  )
}

function ReputationBar({ value }: { value: number }) {
  return (
    <div className="h-1 w-8 rounded-full bg-white/[0.04] overflow-hidden">
      <div
        className="h-full rounded-full bg-[#FFD600]/50"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
