'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Shield, AlertTriangle, Lock, Ban, Link2, UserX, CheckCircle2, XCircle, Clock, Activity, Eye, Loader2, RefreshCw } from 'lucide-react'
import { useAuth } from '@/components/dashboard/dashboard-shell'

// ─── Types ───────────────────────────────────────────────────────────────────

interface SecurityEvent {
  id: string
  event_type: string
  severity: 'high' | 'medium' | 'low'
  description: string
  user_tag: string | null
  action_taken: string | null
  created_at: string
}

interface SecurityModule {
  module_id: string
  enabled: boolean
}

interface SecurityStats {
  threats_blocked_week: number
  threats_blocked_month: number
  raids_prevented_month: number
  links_scanned_total: number
  accounts_flagged: number
}

// ─── Module metadata ─────────────────────────────────────────────────────────

const MODULE_META: Record<string, { name: string; description: string; icon: any }> = {
  antiraid: { name: 'Anti-Raid', description: 'Detects and blocks mass join attacks', icon: Shield },
  antispam: { name: 'Anti-Spam', description: 'Auto-removes spam messages and accounts', icon: Ban },
  phishing: { name: 'Phishing Detection', description: 'Scans and blocks malicious links', icon: Link2 },
  impersonation: { name: 'Impersonation Guard', description: 'Detects staff name/avatar copying', icon: UserX },
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default function SecurityPage() {
  const { guilds } = useAuth()
  const searchParams = useSearchParams()

  // Get guild ID from URL or use first guild
  const guildIdParam = searchParams.get('guild') || (guilds.length > 0 ? guilds[0].id : null)

  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [modules, setModules] = useState<SecurityModule[]>([])
  const [stats, setStats] = useState<SecurityStats | null>(null)
  const [lockdown, setLockdown] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    if (!guildIdParam) { setLoading(false); return }

    try {
      const [eventsRes, statsRes, modulesRes, lockdownRes] = await Promise.all([
        fetch(`/api/security/events?guild_id=${guildIdParam}&limit=10`).then(r => r.json()),
        fetch(`/api/security/stats?guild_id=${guildIdParam}`).then(r => r.json()),
        fetch(`/api/security/modules?guild_id=${guildIdParam}`).then(r => r.json()),
        fetch(`/api/security/lockdown?guild_id=${guildIdParam}`).then(r => r.json()),
      ])

      setEvents(eventsRes.events || [])
      setStats(statsRes.stats || null)
      setModules(modulesRes.modules || [])
      setLockdown(lockdownRes.lockdown || false)
    } catch (err) {
      console.error('Failed to fetch security data:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchData() }, [guildIdParam])

  const handleRefresh = () => { setRefreshing(true); fetchData() }

  const toggleModule = async (moduleId: string, currentlyEnabled: boolean) => {
    if (!guildIdParam) return

    // Optimistic update
    setModules(prev => prev.map(m => m.module_id === moduleId ? { ...m, enabled: !currentlyEnabled } : m))

    try {
      await fetch('/api/security/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guild_id: guildIdParam, module_id: moduleId, enabled: !currentlyEnabled }),
      })
    } catch {
      // Revert on error
      setModules(prev => prev.map(m => m.module_id === moduleId ? { ...m, enabled: currentlyEnabled } : m))
    }
  }

  const toggleLockdown = async () => {
    if (!guildIdParam) return

    const newState = !lockdown
    setLockdown(newState)

    try {
      await fetch('/api/security/lockdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guild_id: guildIdParam, active: newState }),
      })
    } catch {
      setLockdown(!newState)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 text-[#FFD600] animate-spin" />
      </div>
    )
  }

  if (!guildIdParam) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-white/50">Select a server from the Overview to view security settings.</p>
      </div>
    )
  }

  const activeModules = modules.filter(m => m.enabled).length
  const totalModules = Object.keys(MODULE_META).length
  const score = totalModules > 0 ? Math.round((activeModules / totalModules) * 100) : 0

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Security</h1>
          <p className="text-[#9A9CA3] mt-1 text-sm">Monitor threats and manage your server&apos;s protection.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleRefresh} className="p-2 rounded-lg bg-[#0a0b0d] border border-white/[0.04] text-white/30 hover:text-white/60 transition-colors" title="Refresh">
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={toggleLockdown}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              lockdown
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 shadow-lg shadow-red-500/10'
                : 'bg-[#0a0b0d] border border-white/[0.04] text-white/50 hover:text-white/80 hover:border-white/[0.08]'
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            {lockdown ? 'Lockdown Active' : 'Lockdown'}
          </button>
        </div>
      </div>

      {/* Lockdown Banner */}
      {lockdown && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 animate-pulse">
          <div className="h-8 w-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <Lock className="h-4 w-4 text-red-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-400">Server Lockdown Active</p>
            <p className="text-xs text-red-400/60 mt-0.5">All new joins are blocked. Verification required for messages.</p>
          </div>
        </div>
      )}

      {/* Score + Modules */}
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Security Score */}
        <div className="p-6 rounded-xl bg-[#0a0b0d] border border-white/[0.04] flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.04)" strokeWidth="6" fill="none" />
              <circle
                cx="50" cy="50" r="42"
                stroke={score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${score * 2.64} ${100 * 2.64}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{score}</span>
              <span className="text-[10px] text-white/25 mt-0.5">/100</span>
            </div>
          </div>
          <p className="text-sm font-medium text-white/70">Security Score</p>
          <p className="text-xs text-white/25 mt-1">
            {score >= 75 ? 'Excellent protection' : score >= 50 ? 'Good, but can improve' : 'Needs attention'}
          </p>
          <div className="flex items-center gap-1.5 mt-3">
            <span className={`h-2 w-2 rounded-full ${score >= 75 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <span className="text-[10px] text-white/30">{activeModules}/{totalModules} modules active</span>
          </div>
        </div>

        {/* Shield Modules */}
        <div className="grid sm:grid-cols-2 gap-3">
          {Object.entries(MODULE_META).map(([id, meta]) => {
            const mod = modules.find(m => m.module_id === id)
            const enabled = mod?.enabled ?? false
            const Icon = meta.icon

            return (
              <div key={id} className={`p-4 rounded-xl border transition-all ${
                enabled ? 'bg-[#0a0b0d] border-green-500/10 hover:border-green-500/20' : 'bg-[#08090b] border-white/[0.03] opacity-70'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${enabled ? 'bg-green-500/10' : 'bg-white/[0.03]'}`}>
                    <Icon className={`h-4 w-4 ${enabled ? 'text-green-400' : 'text-white/20'}`} />
                  </div>
                  <button
                    onClick={() => toggleModule(id, enabled)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${enabled ? 'bg-green-500/30' : 'bg-white/[0.06]'}`}
                  >
                    <span className={`absolute top-1 h-4 w-4 rounded-full transition-all ${enabled ? 'left-6 bg-green-400' : 'left-1 bg-white/30'}`} />
                  </button>
                </div>
                <h4 className="text-sm font-medium text-white/80">{meta.name}</h4>
                <p className="text-[11px] text-white/25 mt-0.5">{meta.description}</p>
                <div className="flex items-center gap-1 mt-2">
                  {enabled ? <CheckCircle2 className="h-3 w-3 text-green-400" /> : <XCircle className="h-3 w-3 text-white/15" />}
                  <span className={`text-[10px] ${enabled ? 'text-green-400' : 'text-white/15'}`}>{enabled ? 'Active' : 'Disabled'}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Shield} label="Threats Blocked" value={stats?.threats_blocked_week?.toString() || '0'} sublabel="this week" color="red" />
        <StatCard icon={AlertTriangle} label="Raids Prevented" value={stats?.raids_prevented_month?.toString() || '0'} sublabel="this month" color="orange" />
        <StatCard icon={Link2} label="Links Scanned" value={stats?.links_scanned_total?.toLocaleString() || '0'} sublabel="total" color="blue" />
        <StatCard icon={UserX} label="Accounts Flagged" value={stats?.accounts_flagged?.toString() || '0'} sublabel="active flags" color="purple" />
      </div>

      {/* Threat Timeline */}
      <div className="rounded-xl bg-[#0a0b0d] border border-white/[0.04] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
          <h2 className="text-sm font-medium text-white/80 flex items-center gap-2">
            <Activity className="h-4 w-4 text-white/30" />
            Threat Timeline
          </h2>
          <span className="text-[10px] text-white/20">Live</span>
        </div>

        {events.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Shield className="h-8 w-8 text-white/10 mx-auto mb-3" />
            <p className="text-sm text-white/30">No security events yet</p>
            <p className="text-xs text-white/15 mt-1">Events will appear here when the bot detects threats</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {events.map((event, i) => {
              const severityStyles = {
                high: { dot: 'bg-red-400', badge: 'bg-red-500/10 text-red-400' },
                medium: { dot: 'bg-orange-400', badge: 'bg-orange-500/10 text-orange-400' },
                low: { dot: 'bg-yellow-400', badge: 'bg-yellow-500/10 text-yellow-400' },
              }
              const style = severityStyles[event.severity]
              const timeAgo = getTimeAgo(event.created_at)

              return (
                <div key={event.id} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.01] transition-colors ${i === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${style.dot} ${i === 0 ? 'animate-pulse' : ''}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/70 truncate">{event.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[11px] text-white/20">
                        <Clock className="h-3 w-3" />{timeAgo}
                      </span>
                      {event.action_taken && (
                        <span className="text-[10px] text-white/15">→ {event.action_taken.replace('_', ' ')}</span>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-1 rounded-full flex-shrink-0 ${style.badge}`}>
                    {event.severity}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sublabel, color }: {
  icon: any; label: string; value: string; sublabel: string; color: string
}) {
  const colors: Record<string, string> = {
    red: 'bg-red-500/[0.08] text-red-400',
    orange: 'bg-orange-500/[0.08] text-orange-400',
    blue: 'bg-blue-500/[0.08] text-blue-400',
    purple: 'bg-purple-500/[0.08] text-purple-400',
  }

  return (
    <div className="p-4 rounded-xl bg-[#0a0b0d] border border-white/[0.04]">
      <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-[11px] text-white/30 mt-0.5">{label}</p>
      <p className="text-[10px] text-white/15">{sublabel}</p>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTimeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
