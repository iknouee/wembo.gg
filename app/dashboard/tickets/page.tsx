'use client'

import { useState } from 'react'
import { Ticket, Plus, Clock, User, Tag, MessageSquare, CheckCircle2, AlertCircle, ArrowUpRight, CircleDot, Loader2 } from 'lucide-react'
import { mockTickets } from '@/lib/mock-data'

type TicketFilter = 'all' | 'open' | 'in_progress' | 'closed'

export default function DashboardTicketsPage() {
  const [filter, setFilter] = useState<TicketFilter>('all')

  const filteredTickets = filter === 'all'
    ? mockTickets
    : mockTickets.filter((t) => t.status === filter)

  const openCount = mockTickets.filter((t) => t.status === 'open').length
  const inProgressCount = mockTickets.filter((t) => t.status === 'in_progress').length

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tickets</h1>
          <p className="text-[#9A9CA3] mt-1 text-sm">Support tickets and member requests.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FFD600] text-black text-xs font-semibold hover:bg-[#FFD600]/90 transition-colors">
          <Plus className="h-3.5 w-3.5" />
          Create Panel
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Open"
          value={openCount.toString()}
          icon={AlertCircle}
          color="orange"
          pulse={openCount > 0}
        />
        <StatCard
          label="In Progress"
          value={inProgressCount.toString()}
          icon={Loader2}
          color="blue"
        />
        <StatCard
          label="Closed Today"
          value="12"
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          label="Avg. Response"
          value="4m"
          icon={Clock}
          color="yellow"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0a0b0d] border border-white/[0.04] w-fit">
        {([
          { key: 'all', label: 'All', count: mockTickets.length },
          { key: 'open', label: 'Open', count: openCount },
          { key: 'in_progress', label: 'In Progress', count: inProgressCount },
          { key: 'closed', label: 'Closed', count: mockTickets.filter(t => t.status === 'closed').length },
        ] as { key: TicketFilter; label: string; count: number }[]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              filter === tab.key
                ? 'bg-[#FFD600]/10 text-[#FFD600]'
                : 'text-white/30 hover:text-white/60'
            }`}
          >
            {tab.label}
            <span className={`text-[10px] px-1 rounded ${
              filter === tab.key ? 'text-[#FFD600]/60' : 'text-white/15'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tickets List */}
      <div className="space-y-2">
        {filteredTickets.map((ticket) => (
          <TicketRow key={ticket.id} ticket={ticket} />
        ))}

        {filteredTickets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Ticket className="h-8 w-8 text-white/10 mb-3" />
            <p className="text-sm text-white/30">No tickets found</p>
            <p className="text-xs text-white/15 mt-1">All clear!</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color, pulse }: {
  label: string; value: string; icon: any; color: string; pulse?: boolean
}) {
  const colors: Record<string, { bg: string; text: string }> = {
    orange: { bg: 'bg-orange-500/[0.08]', text: 'text-orange-400' },
    blue: { bg: 'bg-blue-500/[0.08]', text: 'text-blue-400' },
    green: { bg: 'bg-green-500/[0.08]', text: 'text-green-400' },
    yellow: { bg: 'bg-[#FFD600]/[0.08]', text: 'text-[#FFD600]' },
  }

  return (
    <div className="p-4 rounded-xl bg-[#0a0b0d] border border-white/[0.04]">
      <div className="flex items-center justify-between mb-2">
        <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${colors[color].bg}`}>
          <Icon className={`h-3.5 w-3.5 ${colors[color].text}`} />
        </div>
        {pulse && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400" />
          </span>
        )}
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-[11px] text-white/25 mt-0.5">{label}</p>
    </div>
  )
}

function TicketRow({ ticket }: { ticket: typeof mockTickets[0] }) {
  const statusConfig: Record<string, { icon: any; label: string; style: string; dot: string }> = {
    open: {
      icon: AlertCircle,
      label: 'Open',
      style: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      dot: 'bg-orange-400',
    },
    in_progress: {
      icon: CircleDot,
      label: 'In Progress',
      style: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      dot: 'bg-blue-400',
    },
    closed: {
      icon: CheckCircle2,
      label: 'Closed',
      style: 'bg-green-500/10 text-green-400 border-green-500/20',
      dot: 'bg-green-400',
    },
  }

  const categoryColors: Record<string, string> = {
    'Support': 'bg-purple-500/10 text-purple-400',
    'Report': 'bg-red-500/10 text-red-400',
    'Partnership': 'bg-[#FFD600]/10 text-[#FFD600]',
  }

  const status = statusConfig[ticket.status]
  const StatusIcon = status.icon

  return (
    <div className="group flex items-center gap-4 p-4 rounded-xl bg-[#0a0b0d] border border-white/[0.03] hover:border-white/[0.06] hover:bg-[#0c0d10] transition-all cursor-pointer">
      {/* Priority indicator */}
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
        ticket.status === 'open' ? 'bg-orange-500/10' : ticket.status === 'in_progress' ? 'bg-blue-500/10' : 'bg-white/[0.03]'
      }`}>
        <StatusIcon className={`h-4 w-4 ${
          ticket.status === 'open' ? 'text-orange-400' : ticket.status === 'in_progress' ? 'text-blue-400' : 'text-white/20'
        }`} />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-white/90 truncate">{ticket.title}</h3>
          <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${status.style}`}>
            {status.label}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="flex items-center gap-1 text-xs text-white/25">
            <User className="h-3 w-3" />
            {ticket.user}
          </span>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${categoryColors[ticket.category] || 'bg-white/[0.04] text-white/30'}`}>
            {ticket.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-white/15 hidden sm:flex">
            <Clock className="h-3 w-3" />
            {ticket.createdAt}
          </span>
        </div>
      </div>

      {/* Assignee */}
      <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.03]">
          <div className="h-4 w-4 rounded-full bg-gradient-to-br from-[#FFD600]/20 to-[#FFD600]/5 flex items-center justify-center">
            <span className="text-[7px] font-bold text-[#FFD600]/70">{ticket.assignee[0]}</span>
          </div>
          <span className="text-xs text-white/30">{ticket.assignee}</span>
        </div>
      </div>
    </div>
  )
}
