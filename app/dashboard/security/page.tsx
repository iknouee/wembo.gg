'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield, AlertTriangle, Link2, UserX, Clock, Activity, Lock, RefreshCw, Loader2, Zap, Ban, ArrowRight } from 'lucide-react'
import { useAuth } from '@/components/dashboard/dashboard-shell'

interface SecurityEvent {
  id: string; event_type: string; severity: 'high' | 'medium' | 'low'; description: string; action_taken: string | null; created_at: string
}
interface Stats {
  threats_blocked_week: number; threats_blocked_month: number; raids_prevented_month: number; links_scanned_total: number; accounts_flagged: number
}

export default function SecurityOverview() {
  const { guilds } = useAuth()
  const guildId = guilds.length > 0 ? guilds[0].id : null

  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [lockdown, setLockdown] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!guildId) { setLoading(false); return }
    Promise.all([
      fetch(`/api/security/events?guild_id=${guildId}&limit=8`).then(r => r.json()),
      fetch(`/api/security/stats?guild_id=${guildId}`).then(r => r.json()),
      fetch(`/api/security/lockdown?guild_id=${guildId}`).then(r => r.json()),
    ]).then(([e, s, l]) => {
      setEvents(e.events || [])
      setStats(s.stats || null)
      setLockdown(l.lockdown || false)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [guildId])

  const toggleLockdown = async () => {
    if (!guildId) return
    const next = !lockdown
    setLockdown(next)
    await fetch('/api/security/lockdown', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guild_id: guildId, active: next }) }).catch(() => setLockdown(!next))
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-6 w-6 text-[#FFD600] animate-spin" /></div>

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Security Overview</h1>
          <p className="text-[#9A9CA3] mt-2 text-sm leading-relaxed">Real-time threat monitoring and protection status.</p>
        </div>
        <button onClick={toggleLockdown} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${lockdown ? 'bg-red-500/15 text-red-400 ring-1 ring-red-500/20' : 'bg-white/[0.03] text-white/40 ring-1 ring-white/[0.06] hover:text-white/70 hover:ring-white/[0.1]'}`}>
          <Lock className="h-3.5 w-3.5" />
          {lockdown ? 'Lockdown Active' : 'Emergency Lockdown'}
        </button>
      </div>

      {lockdown && (
        <div className="p-5 rounded-2xl bg-red-500/[0.06] ring-1 ring-red-500/10 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0"><Lock className="h-5 w-5 text-red-400" /></div>
          <div>
            <p className="text-sm font-medium text-red-400">Server is in lockdown mode</p>
            <p className="text-xs text-red-400/50 mt-0.5">New joins are blocked. Click the button to disable.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Threats Blocked" value={stats?.threats_blocked_week ?? 0} sub="this week" />
        <Stat label="Raids Prevented" value={stats?.raids_prevented_month ?? 0} sub="this month" />
        <Stat label="Links Scanned" value={stats?.links_scanned_total ?? 0} sub="all time" />
        <Stat label="Flagged Accounts" value={stats?.accounts_flagged ?? 0} sub="active" />
      </div>

      {/* Modules Quick Links */}
      <div>
        <h2 className="text-xs font-medium text-white/30 uppercase tracking-wider mb-4">Modules</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <ModuleLink href="/dashboard/security/antiraid" icon={Zap} name="Anti-Raid" description="Mass join detection & blocking" />
          <ModuleLink href="/dashboard/security/antispam" icon={Ban} name="Anti-Spam" description="Message flood & duplicate detection" />
          <ModuleLink href="/dashboard/security/phishing" icon={Link2} name="Phishing Detection" description="Malicious link scanning" />
          <ModuleLink href="/dashboard/security/impersonation" icon={UserX} name="Impersonation Guard" description="Staff name & avatar protection" />
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h2 className="text-xs font-medium text-white/30 uppercase tracking-wider mb-4">Recent Activity</h2>
        {events.length === 0 ? (
          <div className="rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.04] py-16 text-center">
            <Shield className="h-8 w-8 text-white/[0.06] mx-auto mb-3" />
            <p className="text-sm text-white/20">No threats detected yet</p>
            <p className="text-xs text-white/10 mt-1">Events will appear here when the bot detects activity</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.04] divide-y divide-white/[0.03] overflow-hidden">
            {events.map((event, i) => {
              const sev = { high: 'bg-red-400', medium: 'bg-orange-400', low: 'bg-[#FFD600]' }
              return (
                <div key={event.id} className="flex items-center gap-4 px-6 py-4">
                  <span className={`h-2 w-2 rounded-full flex-shrink-0 ${sev[event.severity]} ${i === 0 ? 'animate-pulse' : ''}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-white/60 truncate">{event.description}</p>
                    <p className="text-[11px] text-white/20 mt-1 flex items-center gap-1.5"><Clock className="h-3 w-3" />{getTimeAgo(event.created_at)}</p>
                  </div>
                  {event.action_taken && <span className="text-[10px] text-white/15 flex-shrink-0">{event.action_taken.replace(/_/g, ' ')}</span>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className="p-5 rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.04]">
      <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
      <p className="text-[11px] text-white/30 mt-1">{label}</p>
      <p className="text-[10px] text-white/15">{sub}</p>
    </div>
  )
}

function ModuleLink({ href, icon: Icon, name, description }: { href: string; icon: any; name: string; description: string }) {
  return (
    <Link href={href} className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.04] hover:ring-white/[0.08] hover:bg-white/[0.03] transition-all">
      <div className="h-10 w-10 rounded-xl bg-white/[0.03] flex items-center justify-center group-hover:bg-[#FFD600]/[0.06] transition-colors">
        <Icon className="h-4.5 w-4.5 text-white/20 group-hover:text-[#FFD600] transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-white/70 group-hover:text-white transition-colors">{name}</p>
        <p className="text-[11px] text-white/25 mt-0.5">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-white/10 group-hover:text-white/30 transition-colors" />
    </Link>
  )
}

function getTimeAgo(d: string): string {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}
