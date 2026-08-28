'use client'

import { useState, useEffect } from 'react'
import { FileText, Loader2, Search, Shield, AlertOctagon, Ban, UserX, Clock, Volume2 } from 'lucide-react'
import { useAuth } from '@/components/dashboard/dashboard-shell'
import { PageHeader, StatCard } from '@/components/dashboard/ui'

interface ModLog {
  id: string
  guild_id: string
  case_number: number
  action: string
  user_id: string
  user_tag: string
  moderator_id: string
  moderator_tag: string
  reason: string
  duration: string | null
  created_at: string
}

const ACTION_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  warn: { icon: AlertOctagon, color: 'text-orange-400 bg-orange-500/[0.06]', label: 'Warn' },
  mute: { icon: Volume2, color: 'text-purple-400 bg-purple-500/[0.06]', label: 'Mute' },
  kick: { icon: UserX, color: 'text-amber-400 bg-amber-500/[0.06]', label: 'Kick' },
  ban: { icon: Ban, color: 'text-red-400 bg-red-500/[0.06]', label: 'Ban' },
  unban: { icon: Shield, color: 'text-emerald-400 bg-emerald-500/[0.06]', label: 'Unban' },
}

export default function ModLogsPage() {
  const { guilds, selectedGuild } = useAuth()
  const guildId = selectedGuild || guilds[0]?.id || null

  const [logs, setLogs] = useState<ModLog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')

  // ─── Fetch Logs ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!guildId) { setLoading(false); return }
    const params = new URLSearchParams({ guild_id: guildId, limit: '100' })
    if (filter !== 'all') params.set('filter', filter)
    fetch(`/api/moderation/logs?${params}`)
      .then(r => r.json())
      .then(data => { setLogs(data.logs || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [guildId, filter])

  // ─── Filter by search ────────────────────────────────────────────────
  const filtered = logs.filter(log =>
    !search ||
    log.user_tag.toLowerCase().includes(search.toLowerCase()) ||
    log.user_id.includes(search) ||
    log.moderator_tag.toLowerCase().includes(search.toLowerCase()) ||
    log.reason.toLowerCase().includes(search.toLowerCase()) ||
    log.case_number.toString().includes(search)
  )

  // ─── Stats ───────────────────────────────────────────────────────────
  const totalCases = logs.length
  const thisWeek = logs.filter(l => Date.now() - new Date(l.created_at).getTime() < 7 * 24 * 60 * 60 * 1000).length
  const bansCount = logs.filter(l => l.action === 'ban').length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-5 w-5 text-[#FFD600] animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 dash-content space-y-8 animate-fade-in">

      {/* Header */}
      <PageHeader
        icon={FileText}
        iconColor="bg-blue-500/[0.08] text-blue-400"
        title="Mod Logs"
        description="Complete history of all moderation actions in your server."
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={FileText}
          iconColor="bg-blue-500/[0.06] text-blue-400"
          value={totalCases}
          label="Total Cases"
          sub="all time"
        />
        <StatCard
          icon={Clock}
          iconColor="bg-purple-500/[0.06] text-purple-400"
          value={thisWeek}
          label="This Week"
          sub="actions taken"
        />
        <StatCard
          icon={Ban}
          iconColor="bg-red-500/[0.06] text-red-400"
          value={bansCount}
          label="Bans"
          sub="total"
        />
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by user, case #, or reason..."
            className="dash-input pl-10"
          />
        </div>
        <div className="flex items-center gap-1">
          {[
            { value: 'all', label: 'All' },
            { value: 'warn', label: 'Warns' },
            { value: 'mute', label: 'Mutes' },
            { value: 'kick', label: 'Kicks' },
            { value: 'ban', label: 'Bans' },
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                filter === f.value
                  ? 'bg-[#FFD600]/[0.08] text-[#FFD600]'
                  : 'text-white/25 hover:text-white/50 hover:bg-white/[0.03]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logs List */}
      {filtered.length === 0 ? (
        <div className="dash-card py-16 text-center">
          <div className="h-14 w-14 rounded-2xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-center mx-auto mb-4">
            <FileText className="h-6 w-6 text-white/15" />
          </div>
          <p className="text-[14px] font-medium text-white/50 mb-1">
            {search || filter !== 'all' ? 'No logs match your filters' : 'No moderation actions recorded'}
          </p>
          <p className="text-caption text-white/20">
            {search || filter !== 'all' ? 'Try different filters.' : 'Use /warn, /mute, /kick, /ban in Discord to log actions.'}
          </p>
        </div>
      ) : (
        <div className="dash-card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between">
            <p className="text-[14px] font-semibold text-white/80">Action History</p>
            <span className="text-caption text-white/20">{filtered.length} case{filtered.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="divide-y divide-white/[0.03]">
            {filtered.map(log => {
              const actionConfig = ACTION_CONFIG[log.action] || ACTION_CONFIG.warn
              const Icon = actionConfig.icon
              return (
                <div key={log.id} className="flex items-start gap-4 px-6 py-4 hover:bg-white/[0.015] transition-colors">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${actionConfig.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-micro font-bold text-white/20">#{log.case_number}</span>
                      <span className="text-body-sm font-medium text-white/80">{log.user_tag}</span>
                      <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${actionConfig.color}`}>
                        {actionConfig.label}
                      </span>
                    </div>
                    <p className="text-body-sm text-white/40 mb-1.5">{log.reason}</p>
                    <div className="flex items-center gap-3 text-micro text-white/20">
                      <span>By {log.moderator_tag}</span>
                      {log.duration && <><span>•</span><span>Duration: {log.duration}</span></>}
                      <span>•</span>
                      <span>{getTimeAgo(log.created_at)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function getTimeAgo(d: string): string {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}
