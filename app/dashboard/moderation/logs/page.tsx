'use client'

import { useState, useEffect } from 'react'
import { FileText, Loader2, Search, Shield, AlertOctagon, Ban, UserX, Clock, Volume2, Hash, ChevronDown, Check, RefreshCw, Send } from 'lucide-react'
import { useAuth } from '@/components/dashboard/dashboard-shell'
import { PageHeader, StatCard, SettingCard, useToast } from '@/components/dashboard/ui'

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
  const { toast } = useToast()

  const [logs, setLogs] = useState<ModLog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const [channels, setChannels] = useState<{ id: string; name: string }[]>([])
  const [modLogChannelId, setModLogChannelId] = useState('')
  const [savingChannel, setSavingChannel] = useState(false)
  const [channelDropdownOpen, setChannelDropdownOpen] = useState(false)
  const [channelSearch, setChannelSearch] = useState('')

  // ─── Fetch Channels (separate, only on guild change) ─────────────────
  useEffect(() => {
    if (!guildId) return
    fetch(`/api/security/channels?guild_id=${guildId}`)
      .then(r => r.json())
      .then(data => {
        console.log('[ModLogs] Channels fetched:', data.channels?.length || 0)
        setChannels(data.channels || [])
      })
      .catch(err => console.error('[ModLogs] Channel fetch error:', err))
  }, [guildId])

  // ─── Fetch Logs + Settings ───────────────────────────────────────────
  useEffect(() => {
    if (!guildId) { setLoading(false); return }
    const params = new URLSearchParams({ guild_id: guildId, limit: '100' })
    if (filter !== 'all') params.set('filter', filter)

    Promise.all([
      fetch(`/api/moderation/logs?${params}`).then(r => r.json()),
      fetch(`/api/security/settings?guild_id=${guildId}`).then(r => r.json()),
    ]).then(([logData, settingsData]) => {
      setLogs(logData.logs || [])
      if (settingsData?.settings?.mod_log_channel_id) {
        setModLogChannelId(settingsData.settings.mod_log_channel_id)
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [guildId, filter])

  // ─── Save Mod Log Channel ────────────────────────────────────────────
  const saveModLogChannel = async () => {
    if (!guildId) return
    setSavingChannel(true)
    try {
      await fetch('/api/security/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guild_id: guildId, mod_log_channel_id: modLogChannelId || null }),
      })
      toast('Mod log channel saved', 'success')
    } catch {
      toast('Failed to save channel', 'error')
    }
    setSavingChannel(false)
  }

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

      {/* Mod Log Channel Config */}
      <SettingCard
        icon={Hash}
        iconColor="bg-blue-500/[0.06] text-blue-400"
        title="Mod Log Channel"
        description="Where moderation actions are logged as Discord embeds"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <button
              onClick={() => { setChannelDropdownOpen(!channelDropdownOpen); setChannelSearch('') }}
              className="dash-input w-full flex items-center justify-between gap-2 cursor-pointer"
            >
              <span className="truncate text-left">
                {modLogChannelId
                  ? `# ${stripEmoji(channels.find(c => c.id === modLogChannelId)?.name || modLogChannelId)}`
                  : 'Disabled — no logging'}
              </span>
              <ChevronDown className={`h-3.5 w-3.5 text-white/20 flex-shrink-0 transition-transform ${channelDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {channelDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setChannelDropdownOpen(false)} />
                <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl bg-[#111214] border border-white/[0.06] shadow-2xl shadow-black/60 overflow-hidden">
                  <div className="p-2.5 border-b border-white/[0.04]">
                    <input
                      value={channelSearch}
                      onChange={e => setChannelSearch(e.target.value)}
                      placeholder="Search or paste channel ID..."
                      className="w-full h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 text-[13px] text-white/80 placeholder:text-white/25 focus:outline-none focus:border-[#FFD600]/30"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-[220px] overflow-y-auto p-1">
                    {channelSearch && /^\d{17,20}$/.test(channelSearch.trim()) && (
                      <button
                        onClick={() => { setModLogChannelId(channelSearch.trim()); setChannelDropdownOpen(false); setChannelSearch('') }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-body-sm text-[#FFD600]/80 hover:bg-[#FFD600]/[0.04] transition-colors"
                      >
                        <Hash className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>Use ID: {channelSearch.trim()}</span>
                      </button>
                    )}
                    {!channelSearch && (
                      <button
                        onClick={() => { setModLogChannelId(''); setChannelDropdownOpen(false) }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-body-sm transition-colors ${!modLogChannelId ? 'bg-[#FFD600]/[0.04] text-white/70' : 'text-white/40 hover:bg-white/[0.03]'}`}
                      >
                        <span className="text-white/20 w-3.5 text-center">—</span>
                        <span>Disabled — no logging</span>
                        {!modLogChannelId && <Check className="h-3 w-3 text-[#FFD600] ml-auto" />}
                      </button>
                    )}
                    {channels
                      .filter(ch => !channelSearch || stripEmoji(ch.name).toLowerCase().includes(channelSearch.toLowerCase()) || ch.name.toLowerCase().includes(channelSearch.toLowerCase()))
                      .map(ch => (
                        <button
                          key={ch.id}
                          onClick={() => { setModLogChannelId(ch.id); setChannelDropdownOpen(false); setChannelSearch('') }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-body-sm transition-colors ${modLogChannelId === ch.id ? 'bg-[#FFD600]/[0.04] text-white/70' : 'text-white/40 hover:bg-white/[0.03]'}`}
                        >
                          <Hash className="h-3.5 w-3.5 text-white/20 flex-shrink-0" />
                          <span className="truncate">{stripEmoji(ch.name)}</span>
                          {modLogChannelId === ch.id && <Check className="h-3 w-3 text-[#FFD600] ml-auto flex-shrink-0" />}
                        </button>
                      ))}
                    {channels.filter(ch => !channelSearch || stripEmoji(ch.name).toLowerCase().includes(channelSearch.toLowerCase()) || ch.name.toLowerCase().includes(channelSearch.toLowerCase())).length === 0 && channelSearch && !/^\d{17,20}$/.test(channelSearch.trim()) && (
                      <p className="px-3 py-4 text-[12px] text-white/20 text-center">No channels found. Paste a channel ID instead.</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <button
            onClick={saveModLogChannel}
            disabled={savingChannel}
            className="flex items-center gap-2 px-4 h-[42px] rounded-lg bg-[#FFD600] text-black text-caption font-semibold hover:bg-[#FFD600]/90 transition-colors disabled:opacity-50"
          >
            {savingChannel ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            Save
          </button>
        </div>
        <p className="text-micro text-white/20 mt-2">
          When set, all /warn, /mute, /kick, /ban actions will be sent as embeds to this channel.
        </p>
      </SettingCard>

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


function stripEmoji(name: string): string {
  return name.replace(/[^\w\s-]/g, '').replace(/[·•|]/g, '').replace(/\s{2,}/g, ' ').trim()
}
