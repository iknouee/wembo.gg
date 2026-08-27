'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield, Lock, Loader2, Zap, Ban, Link2, UserX, AlertTriangle, Bomb, Bot } from 'lucide-react'
import { useAuth } from '@/components/dashboard/dashboard-shell'
import { PageHeader, StatCard, ModuleCard, SecurityScore, ConfirmModal, EmptyState } from '@/components/dashboard/ui'

interface SecurityEvent {
  id: string; event_type: string; severity: 'high' | 'medium' | 'low'; description: string; action_taken: string | null; created_at: string
}
interface Stats {
  threats_blocked_week: number; threats_blocked_month: number; raids_prevented_month: number; links_scanned_total: number; accounts_flagged: number
}

export default function SecurityOverview() {
  const { guilds, selectedGuild } = useAuth()
  const guildId = selectedGuild || guilds[0]?.id || null
  const guild = guilds.find(g => g.id === guildId)

  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [lockdown, setLockdown] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showLockdownModal, setShowLockdownModal] = useState(false)
  const [filter, setFilter] = useState<string>('all')

  // ─── Data Fetching (PRESERVED) ───────────────────────────────────────
  useEffect(() => {
    if (!guildId) { setLoading(false); return }
    setLoading(true)
    Promise.all([
      fetch(`/api/security/events?guild_id=${guildId}&limit=8`).then(r => r.json()),
      fetch(`/api/security/stats?guild_id=${guildId}`).then(r => r.json()),
      fetch(`/api/security/lockdown?guild_id=${guildId}`).then(r => r.json()),
    ]).then(([e, s, l]) => {
      setEvents(e.events || []); setStats(s.stats || null); setLockdown(l.lockdown || false); setLoading(false)
    }).catch(() => setLoading(false))
  }, [guildId])

  const toggleLockdown = async () => {
    if (!guildId) return
    const next = !lockdown; setLockdown(next)
    setShowLockdownModal(false)
    await fetch('/api/security/lockdown', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guild_id: guildId, active: next }) }).catch(() => setLockdown(!next))
  }

  // ─── Loading ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-5 w-5 text-[#FFD600] animate-spin" />
          <p className="text-micro text-white/20">Loading security data...</p>
        </div>
      </div>
    )
  }

  if (!guildId) {
    return (
      <div className="p-6 lg:p-8 dash-content">
        <EmptyState
          icon={Shield}
          title="No server selected"
          description="Select a server from the sidebar to view its security status."
        />
      </div>
    )
  }

  // ─── Compute Score ───────────────────────────────────────────────────
  const totalThreats = (stats?.threats_blocked_week ?? 0) + (stats?.raids_prevented_month ?? 0)
  const securityScore = Math.min(100, Math.max(60, 100 - totalThreats))
  const scoreLabel = securityScore >= 90 ? 'Excellent' : securityScore >= 70 ? 'Good' : securityScore >= 50 ? 'Fair' : 'Needs Attention'

  // ─── Filter events ───────────────────────────────────────────────────
  const filteredEvents = filter === 'all' ? events : events.filter(e => e.event_type === filter)

  return (
    <div className="p-6 lg:p-8 dash-content space-y-8 animate-fade-in">

      {/* Header */}
      <PageHeader
        icon={Shield}
        iconColor="bg-emerald-500/[0.08] text-emerald-400"
        title="Security"
        description={guild ? `Protecting ${guild.name}` : 'Real-time threat monitoring'}
        actions={
          <button
            onClick={() => lockdown ? toggleLockdown() : setShowLockdownModal(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-all duration-200 ${
              lockdown
                ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/15 shadow-lg shadow-red-500/5'
                : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:text-white/70 hover:border-white/[0.1] hover:bg-white/[0.05]'
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            {lockdown ? 'Deactivate Lockdown' : 'Lockdown'}
          </button>
        }
      />

      {/* Lockdown Warning Banner */}
      {lockdown && (
        <div className="dash-card border-red-500/15 bg-red-500/[0.03] p-5 animate-slide-up">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <Lock className="h-5 w-5 text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-red-400">Server Lockdown Active</p>
              <p className="text-caption text-red-400/40 mt-0.5">New joins are blocked and channels restricted. Click Deactivate to restore normal operation.</p>
            </div>
          </div>
        </div>
      )}

      {/* Security Score + Stats */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Score Card */}
        <div className="lg:col-span-2 dash-card p-6 flex items-center">
          <SecurityScore score={securityScore} label={scoreLabel} />
        </div>

        {/* Stats */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-3">
          <StatCard
            icon={Shield}
            iconColor="bg-[#FFD600]/[0.06] text-[#FFD600]"
            value={stats?.threats_blocked_week ?? 0}
            label="Threats Blocked"
            sub="this week"
          />
          <StatCard
            icon={Zap}
            iconColor="bg-orange-500/[0.06] text-orange-400"
            value={stats?.raids_prevented_month ?? 0}
            label="Raids Prevented"
            sub="this month"
          />
          <StatCard
            icon={Link2}
            iconColor="bg-blue-500/[0.06] text-blue-400"
            value={stats?.links_scanned_total ?? 0}
            label="Links Scanned"
            sub="all time"
          />
          <StatCard
            icon={UserX}
            iconColor="bg-purple-500/[0.06] text-purple-400"
            value={stats?.accounts_flagged ?? 0}
            label="Accounts Flagged"
            sub="active"
          />
        </div>
      </div>

      {/* Security Modules */}
      <div className="space-y-4">
        <p className="text-[11px] font-semibold text-white/20 uppercase tracking-[0.08em]">Security Modules</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <ModuleCard
            href="/dashboard/security/antiraid"
            icon={Zap}
            iconColor="bg-[#FFD600]/[0.06] text-[#FFD600]"
            name="Anti-Raid"
            description="Detect and stop coordinated join attacks."
            active={true}
            statLabel="Last triggered: 3 days ago"
          />
          <ModuleCard
            href="/dashboard/security/antispam"
            icon={Ban}
            iconColor="bg-red-500/[0.06] text-red-400"
            name="Anti-Spam"
            description="Detect floods, duplicates and mass mentions."
            active={true}
            stat={`${stats?.threats_blocked_week ?? 0}`}
            statLabel="actions this week"
          />
          <ModuleCard
            href="/dashboard/security/phishing"
            icon={Link2}
            iconColor="bg-blue-500/[0.06] text-blue-400"
            name="Link Protection"
            description="Block dangerous or unauthorized links."
            active={true}
            stat={`${stats?.links_scanned_total ?? 0}`}
            statLabel="links scanned"
          />
          <ModuleCard
            href="/dashboard/security/impersonation"
            icon={UserX}
            iconColor="bg-purple-500/[0.06] text-purple-400"
            name="Impersonation Guard"
            description="Protect staff identities from impersonation."
            active={true}
            stat={`${stats?.accounts_flagged ?? 0}`}
            statLabel="attempts detected"
          />
          <ModuleCard
            href="/dashboard/security/antinuke"
            icon={Bomb}
            iconColor="bg-orange-500/[0.06] text-orange-400"
            name="Anti-Nuke"
            description="Protect against mass deletions, bans, and permission changes."
            active={true}
            statLabel="Monitoring server actions"
          />
          <ModuleCard
            href="/dashboard/security/botguard"
            icon={Bot}
            iconColor="bg-emerald-500/[0.06] text-emerald-400"
            name="Bot Guard"
            description="Detect unauthorized bots and manage bot access."
            active={true}
            statLabel="All bots verified"
          />
        </div>
      </div>

      {/* Threat Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-white/20 uppercase tracking-[0.08em]">Threat Timeline</p>
          <div className="flex items-center gap-1">
            {[
              { value: 'all', label: 'All' },
              { value: 'raid', label: 'Raid' },
              { value: 'spam', label: 'Spam' },
              { value: 'phishing', label: 'Links' },
              { value: 'impersonation', label: 'Impersonation' },
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
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

        {filteredEvents.length === 0 ? (
          <div className="dash-card py-16 text-center">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-5 w-5 text-emerald-400/40" />
            </div>
            <p className="text-[14px] font-medium text-white/50 mb-1">No threats detected 🎉</p>
            <p className="text-caption text-white/20">Wembo hasn&apos;t detected any security threats recently.</p>
          </div>
        ) : (
          <div className="dash-card p-0 overflow-hidden">
            <div className="divide-y divide-white/[0.03]">
              {filteredEvents.map((event, i) => (
                <div key={event.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.015] transition-colors group cursor-default">
                  {/* Severity */}
                  <div className="flex flex-col items-center gap-1">
                    <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                      event.severity === 'high' ? 'bg-red-500 shadow-sm shadow-red-500/30' :
                      event.severity === 'medium' ? 'bg-orange-500 shadow-sm shadow-orange-500/30' :
                      'bg-[#FFD600] shadow-sm shadow-[#FFD600]/30'
                    } ${i === 0 ? 'animate-pulse-dot' : ''}`} />
                    <span className="text-[9px] font-bold uppercase text-white/15">
                      {event.severity === 'high' ? 'HIGH' : event.severity === 'medium' ? 'MED' : 'LOW'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm text-white/60 group-hover:text-white/80 transition-colors truncate">{event.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {event.action_taken && (
                        <span className="text-micro text-white/20">Action: {event.action_taken}</span>
                      )}
                      <span className="text-micro text-white/15">{getTimeAgo(event.created_at)}</span>
                    </div>
                  </div>

                  {/* Severity Badge */}
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    event.severity === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/15' :
                    event.severity === 'medium' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/15' :
                    'bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/15'
                  }`}>
                    {event.event_type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lockdown Confirmation Modal */}
      <ConfirmModal
        open={showLockdownModal}
        onClose={() => setShowLockdownModal(false)}
        onConfirm={toggleLockdown}
        title="Emergency Lockdown"
        description="This will temporarily restrict configured server channels and prevent new members from interacting. This action can be reversed at any time."
        confirmLabel="Activate Lockdown"
        variant="danger"
      />
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTimeAgo(d: string): string {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}
