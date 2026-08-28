'use client'

import { useState, useEffect } from 'react'
import { AlertOctagon, Loader2, Search, Trash2, User, Clock, Shield } from 'lucide-react'
import { useAuth } from '@/components/dashboard/dashboard-shell'
import { PageHeader, StatCard, useToast } from '@/components/dashboard/ui'

interface Warning {
  id: string
  guild_id: string
  user_id: string
  user_tag: string
  moderator_id: string
  moderator_tag: string
  reason: string
  created_at: string
}

export default function WarnsPage() {
  const { guilds, selectedGuild } = useAuth()
  const guildId = selectedGuild || guilds[0]?.id || null
  const { toast } = useToast()

  const [warnings, setWarnings] = useState<Warning[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  // ─── Fetch Warnings ──────────────────────────────────────────────────
  useEffect(() => {
    if (!guildId) { setLoading(false); return }
    fetch(`/api/moderation/warns?guild_id=${guildId}&limit=100`)
      .then(r => r.json())
      .then(data => { setWarnings(data.warnings || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [guildId])

  // ─── Delete Warning ──────────────────────────────────────────────────
  const deleteWarning = async (id: string) => {
    if (!guildId) return
    setDeleting(id)
    try {
      const res = await fetch('/api/moderation/warns', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, guild_id: guildId }),
      })
      const data = await res.json()
      if (data.success) {
        setWarnings(prev => prev.filter(w => w.id !== id))
        toast('Warning removed', 'success')
      } else {
        toast(data.error || 'Failed to remove warning', 'error')
      }
    } catch {
      toast('Failed to remove warning', 'error')
    }
    setDeleting(null)
  }

  // ─── Filter ──────────────────────────────────────────────────────────
  const filtered = warnings.filter(w =>
    !search ||
    w.user_tag.toLowerCase().includes(search.toLowerCase()) ||
    w.user_id.includes(search) ||
    w.reason.toLowerCase().includes(search.toLowerCase())
  )

  // ─── Stats ───────────────────────────────────────────────────────────
  const uniqueUsers = new Set(warnings.map(w => w.user_id)).size
  const thisWeek = warnings.filter(w => Date.now() - new Date(w.created_at).getTime() < 7 * 24 * 60 * 60 * 1000).length

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
        icon={AlertOctagon}
        iconColor="bg-orange-500/[0.08] text-orange-400"
        title="Warnings"
        description="View and manage user warnings issued by moderators."
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={AlertOctagon}
          iconColor="bg-orange-500/[0.06] text-orange-400"
          value={warnings.length}
          label="Total Warnings"
          sub="all time"
        />
        <StatCard
          icon={User}
          iconColor="bg-blue-500/[0.06] text-blue-400"
          value={uniqueUsers}
          label="Users Warned"
          sub="unique"
        />
        <StatCard
          icon={Clock}
          iconColor="bg-purple-500/[0.06] text-purple-400"
          value={thisWeek}
          label="This Week"
          sub="new warnings"
        />
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by user, ID, or reason..."
          className="dash-input pl-10"
        />
      </div>

      {/* Warnings List */}
      {filtered.length === 0 ? (
        <div className="dash-card py-16 text-center">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-6 w-6 text-emerald-400/40" />
          </div>
          <p className="text-[14px] font-medium text-white/50 mb-1">
            {search ? 'No warnings match your search' : 'No warnings issued'}
          </p>
          <p className="text-caption text-white/20">
            {search ? 'Try a different search term.' : 'Use /warn in Discord to issue warnings.'}
          </p>
        </div>
      ) : (
        <div className="dash-card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between">
            <p className="text-[14px] font-semibold text-white/80">Warning History</p>
            <span className="text-caption text-white/20">{filtered.length} warning{filtered.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="divide-y divide-white/[0.03]">
            {filtered.map(warn => (
              <div key={warn.id} className="flex items-start gap-4 px-6 py-4 hover:bg-white/[0.015] transition-colors group">
                <div className="h-9 w-9 rounded-lg bg-orange-500/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertOctagon className="h-4 w-4 text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-body-sm font-medium text-white/80">{warn.user_tag}</span>
                    <span className="text-micro text-white/15 font-mono">{warn.user_id}</span>
                  </div>
                  <p className="text-body-sm text-white/40 mb-1.5">{warn.reason}</p>
                  <div className="flex items-center gap-3 text-micro text-white/20">
                    <span>By {warn.moderator_tag}</span>
                    <span>•</span>
                    <span>{getTimeAgo(warn.created_at)}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteWarning(warn.id)}
                  disabled={deleting === warn.id}
                  className="p-2 rounded-lg text-white/10 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                  title="Remove warning"
                >
                  {deleting === warn.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                </button>
              </div>
            ))}
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
