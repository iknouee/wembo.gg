'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield, AlertTriangle, Link2, UserX, Clock, Activity, Lock, Loader2, Zap, Ban, ArrowRight } from 'lucide-react'
import { useAuth } from '@/components/dashboard/dashboard-shell'

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
    await fetch('/api/security/lockdown', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guild_id: guildId, active: next }) }).catch(() => setLockdown(!next))
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-5 w-5 text-[#FFD600] animate-spin" /></div>

  if (!guildId) return (
    <div className="p-6 lg:p-8">
      <p className="text-white/40 text-sm">Select a server from Overview first.</p>
    </div>
  )

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Security</h1>
          <p className="text-white/30 mt-1 text-sm">
            {guild ? `Protecting ${guild.name}` : 'Real-time threat monitoring'}
          </p>
        </div>
        <button onClick={toggleLockdown} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${lockdown ? 'bg-red-500/15 text-red-400 ring-1 ring-red-500/20 shadow-lg shadow-red-500/5' : 'bg-white/[0.03] text-white/40 ring-1 ring-white/[0.06] hover:text-white/70 hover:ring-white/[0.1] hover:bg-white/[0.05]'}`}>
          <Lock className="h-3.5 w-3.5" />
          {lockdown ? 'Lockdown Active' : 'Lockdown'}
        </button>
      </div>

      {lockdown && (
        <div className="p-5 rounded-2xl bg-red-500/[0.05] ring-1 ring-red-500/10 flex items-center gap-4 animate-in slide-in-from-top duration-300">
          <Lock className="h-5 w-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-400">Server is locked down</p>
            <p className="text-xs text-red-400/40 mt-0.5">New joins blocked. Click again to disable.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Threats Blocked" value={stats?.threats_blocked_week ?? 0} sub="this week" />
        <Stat label="Raids Prevented" value={stats?.raids_prevented_month ?? 0} sub="this month" />
        <Stat label="Links Scanned" value={stats?.links_scanned_total ?? 0} sub="all time" />
        <Stat label="Flagged" value={stats?.accounts_flagged ?? 0} sub="accounts" />
      </div>

      {/* Modules */}
      <div className="space-y-3">
        <p className="text-[11px] font-medium text-white/20 uppercase tracking-widest">Modules</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <ModuleCard href="/dashboard/security/antiraid" icon={Zap} name="Anti-Raid" desc="Mass join detection" color="yellow" />
          <ModuleCard href="/dashboard/security/antispam" icon={Ban} name="Anti-Spam" desc="Message flood protection" color="red" />
          <ModuleCard href="/dashboard/security/phishing" icon={Link2} name="Link Blocker" desc="Block links except whitelisted" color="blue" />
          <ModuleCard href="/dashboard/security/impersonation" icon={UserX} name="Impersonation" desc="Staff identity protection" color="purple" />
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        <p className="text-[11px] font-medium text-white/20 uppercase tracking-widest">Recent Threats</p>
        {events.length === 0 ? (
          <div className="rounded-2xl bg-white/[0.015] ring-1 ring-white/[0.04] py-16 text-center">
            <Shield className="h-7 w-7 text-white/[0.06] mx-auto mb-3" />
            <p className="text-[13px] text-white/20">No threats detected</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white/[0.015] ring-1 ring-white/[0.04] divide-y divide-white/[0.03] overflow-hidden">
            {events.map((event, i) => (
              <div key={event.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.01] transition-colors">
                <span className={`h-2 w-2 rounded-full flex-shrink-0 ${event.severity === 'high' ? 'bg-red-400' : event.severity === 'medium' ? 'bg-orange-400' : 'bg-[#FFD600]'} ${i === 0 ? 'animate-pulse' : ''}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-white/50 truncate">{event.description}</p>
                  <p className="text-[11px] text-white/15 mt-1">{getTimeAgo(event.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className="p-5 rounded-2xl bg-white/[0.015] ring-1 ring-white/[0.04] hover:ring-white/[0.06] transition-all duration-200">
      <p className="text-2xl font-bold text-white tabular-nums">{value.toLocaleString()}</p>
      <p className="text-[11px] text-white/25 mt-1.5">{label}</p>
      <p className="text-[10px] text-white/10">{sub}</p>
    </div>
  )
}

function ModuleCard({ href, icon: Icon, name, desc, color }: { href: string; icon: any; name: string; desc: string; color: string }) {
  const iconColors: Record<string, string> = { yellow: 'text-[#FFD600] bg-[#FFD600]/[0.06]', red: 'text-red-400 bg-red-500/[0.06]', blue: 'text-blue-400 bg-blue-500/[0.06]', purple: 'text-purple-400 bg-purple-500/[0.06]' }
  return (
    <Link href={href} className="group flex items-center gap-4 p-5 rounded-2xl bg-white/[0.015] ring-1 ring-white/[0.04] hover:ring-white/[0.08] hover:bg-white/[0.025] transition-all duration-200">
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${iconColors[color]} transition-colors`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="flex-1">
        <p className="text-[13px] font-medium text-white/70 group-hover:text-white/90 transition-colors">{name}</p>
        <p className="text-[11px] text-white/20 mt-0.5">{desc}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-white/10 group-hover:text-white/25 group-hover:translate-x-0.5 transition-all" />
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
