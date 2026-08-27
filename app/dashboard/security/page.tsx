'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Shield, AlertTriangle, Lock, Ban, Link2, UserX, CheckCircle2, XCircle, Clock, Activity, RefreshCw, Loader2, ChevronDown, ChevronRight, Settings, Zap } from 'lucide-react'
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
  config: Record<string, any>
}

interface SecurityStats {
  threats_blocked_week: number
  threats_blocked_month: number
  raids_prevented_month: number
  links_scanned_total: number
  accounts_flagged: number
}

// ─── Module Configs ──────────────────────────────────────────────────────────

const MODULE_DEFAULTS: Record<string, { name: string; description: string; icon: any; defaultConfig: Record<string, any> }> = {
  antiraid: {
    name: 'Anti-Raid',
    description: 'Detects and blocks mass join attacks automatically',
    icon: Shield,
    defaultConfig: {
      join_threshold: 10,
      time_window_seconds: 10,
      action: 'kick',
      min_account_age_hours: 24,
      notify_channel: true,
    },
  },
  antispam: {
    name: 'Anti-Spam',
    description: 'Detects rapid messaging, duplicates, and floods',
    icon: Ban,
    defaultConfig: {
      message_limit: 5,
      time_window_seconds: 3,
      duplicate_limit: 3,
      action: 'delete',
      mute_duration_minutes: 10,
      exempt_roles: [],
    },
  },
  phishing: {
    name: 'Phishing Detection',
    description: 'Scans links against known malicious domains and patterns',
    icon: Link2,
    defaultConfig: {
      auto_delete: true,
      quarantine_user: false,
      warn_in_channel: true,
      custom_blocklist: [],
      scan_embeds: true,
    },
  },
  impersonation: {
    name: 'Impersonation Guard',
    description: 'Detects users copying staff names or avatars',
    icon: UserX,
    defaultConfig: {
      protected_roles: [],
      similarity_threshold: 80,
      action: 'flag',
      check_avatars: true,
      check_nicknames: true,
    },
  },
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SecurityPage() {
  const { guilds } = useAuth()
  const searchParams = useSearchParams()
  const guildId = searchParams.get('guild') || (guilds.length > 0 ? guilds[0].id : null)

  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [modules, setModules] = useState<SecurityModule[]>([])
  const [stats, setStats] = useState<SecurityStats | null>(null)
  const [lockdown, setLockdown] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [expandedModule, setExpandedModule] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)

  const fetchData = async () => {
    if (!guildId) { setLoading(false); return }
    try {
      const [eventsRes, statsRes, modulesRes, lockdownRes] = await Promise.all([
        fetch(`/api/security/events?guild_id=${guildId}&limit=10`).then(r => r.json()),
        fetch(`/api/security/stats?guild_id=${guildId}`).then(r => r.json()),
        fetch(`/api/security/modules?guild_id=${guildId}`).then(r => r.json()),
        fetch(`/api/security/lockdown?guild_id=${guildId}`).then(r => r.json()),
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

  useEffect(() => { fetchData() }, [guildId])

  const toggleModule = async (moduleId: string) => {
    if (!guildId) return
    const mod = modules.find(m => m.module_id === moduleId)
    const newEnabled = !(mod?.enabled ?? false)
    const config = mod?.config || MODULE_DEFAULTS[moduleId]?.defaultConfig || {}

    setModules(prev => prev.map(m => m.module_id === moduleId ? { ...m, enabled: newEnabled } : m)
      .concat(prev.find(m => m.module_id === moduleId) ? [] : [{ module_id: moduleId, enabled: newEnabled, config }])
    )

    try {
      await fetch('/api/security/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guild_id: guildId, module_id: moduleId, enabled: newEnabled, config }),
      })
    } catch {
      setModules(prev => prev.map(m => m.module_id === moduleId ? { ...m, enabled: !newEnabled } : m))
    }
  }

  const saveModuleConfig = async (moduleId: string, config: Record<string, any>) => {
    if (!guildId) return
    setSaving(moduleId)

    const mod = modules.find(m => m.module_id === moduleId)
    setModules(prev => prev.map(m => m.module_id === moduleId ? { ...m, config } : m))

    try {
      await fetch('/api/security/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guild_id: guildId, module_id: moduleId, enabled: mod?.enabled ?? true, config }),
      })
    } catch {}
    setSaving(null)
  }

  const toggleLockdown = async () => {
    if (!guildId) return
    const newState = !lockdown
    setLockdown(newState)
    try {
      await fetch('/api/security/lockdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guild_id: guildId, active: newState }),
      })
    } catch { setLockdown(!newState) }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-6 w-6 text-[#FFD600] animate-spin" /></div>
  }

  if (!guildId) {
    return <div className="p-6 lg:p-8"><p className="text-white/50">Select a server from the Overview to view security settings.</p></div>
  }

  const activeModules = modules.filter(m => m.enabled).length
  const totalModules = Object.keys(MODULE_DEFAULTS).length
  const score = totalModules > 0 ? Math.round((activeModules / totalModules) * 100) : 0

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Security</h1>
          <p className="text-[#9A9CA3] mt-1 text-sm">Real-time threat protection for your server.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setRefreshing(true); fetchData() }} className="p-2 rounded-lg bg-[#0a0b0d] border border-white/[0.04] text-white/30 hover:text-white/60 transition-colors">
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={toggleLockdown} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${lockdown ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-[#0a0b0d] border border-white/[0.04] text-white/50 hover:text-white/80'}`}>
            <Lock className="h-3.5 w-3.5" />
            {lockdown ? 'Lockdown Active' : 'Emergency Lockdown'}
          </button>
        </div>
      </div>

      {lockdown && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
          <Lock className="h-5 w-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-400">Server Lockdown Active</p>
            <p className="text-xs text-red-400/60 mt-0.5">All new joins blocked. Verification required for messages. Click the button again to disable.</p>
          </div>
        </div>
      )}

      {/* Stats + Score */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-[#0a0b0d] border border-white/[0.04] flex flex-col items-center justify-center col-span-2 lg:col-span-1">
          <div className="relative w-16 h-16 mb-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.04)" strokeWidth="8" fill="none" />
              <circle cx="50" cy="50" r="42" stroke={score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'} strokeWidth="8" fill="none" strokeDasharray={`${score * 2.64} ${100 * 2.64}`} strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-white">{score}</span>
            </div>
          </div>
          <p className="text-[10px] text-white/30">{activeModules}/{totalModules} active</p>
        </div>
        <StatCard icon={Shield} label="Threats Blocked" value={stats?.threats_blocked_week?.toString() || '0'} sublabel="this week" color="red" />
        <StatCard icon={AlertTriangle} label="Raids Prevented" value={stats?.raids_prevented_month?.toString() || '0'} sublabel="this month" color="orange" />
        <StatCard icon={Link2} label="Links Scanned" value={stats?.links_scanned_total?.toLocaleString() || '0'} sublabel="total" color="blue" />
        <StatCard icon={UserX} label="Flagged" value={stats?.accounts_flagged?.toString() || '0'} sublabel="accounts" color="purple" />
      </div>

      {/* Modules with Config */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-white/60">Protection Modules</h2>
        {Object.entries(MODULE_DEFAULTS).map(([id, meta]) => {
          const mod = modules.find(m => m.module_id === id)
          const enabled = mod?.enabled ?? false
          const config = mod?.config || meta.defaultConfig
          const isExpanded = expandedModule === id
          const Icon = meta.icon

          return (
            <div key={id} className={`rounded-xl border transition-all overflow-hidden ${enabled ? 'bg-[#0a0b0d] border-white/[0.06]' : 'bg-[#08090b] border-white/[0.03]'}`}>
              {/* Module Header */}
              <div className="flex items-center gap-4 p-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${enabled ? 'bg-green-500/10' : 'bg-white/[0.03]'}`}>
                  <Icon className={`h-5 w-5 ${enabled ? 'text-green-400' : 'text-white/20'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white/90">{meta.name}</h3>
                  <p className="text-[11px] text-white/30 mt-0.5">{meta.description}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Config button */}
                  <button
                    onClick={() => setExpandedModule(isExpanded ? null : id)}
                    className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-[#FFD600]/10 text-[#FFD600]' : 'text-white/20 hover:text-white/50 hover:bg-white/[0.04]'}`}
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                  {/* Toggle */}
                  <button onClick={() => toggleModule(id)} className={`relative h-6 w-11 rounded-full transition-colors ${enabled ? 'bg-green-500/30' : 'bg-white/[0.06]'}`}>
                    <span className={`absolute top-1 h-4 w-4 rounded-full transition-all ${enabled ? 'left-6 bg-green-400' : 'left-1 bg-white/30'}`} />
                  </button>
                </div>
              </div>

              {/* Config Panel */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-white/[0.04]">
                  <ModuleConfig
                    moduleId={id}
                    config={config}
                    defaultConfig={meta.defaultConfig}
                    onSave={(newConfig) => saveModuleConfig(id, newConfig)}
                    saving={saving === id}
                  />
                </div>
              )}
            </div>
          )
        })}
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
            <p className="text-xs text-white/15 mt-1">Events appear here when the bot detects threats</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {events.map((event, i) => {
              const styles = { high: { dot: 'bg-red-400', badge: 'bg-red-500/10 text-red-400' }, medium: { dot: 'bg-orange-400', badge: 'bg-orange-500/10 text-orange-400' }, low: { dot: 'bg-yellow-400', badge: 'bg-yellow-500/10 text-yellow-400' } }
              const s = styles[event.severity]
              return (
                <div key={event.id} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.01] ${i === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${s.dot} ${i === 0 ? 'animate-pulse' : ''}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/70 truncate">{event.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[11px] text-white/20"><Clock className="h-3 w-3" />{getTimeAgo(event.created_at)}</span>
                      {event.action_taken && <span className="text-[10px] text-white/15">→ {event.action_taken.replace(/_/g, ' ')}</span>}
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${s.badge}`}>{event.severity}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Module Config Component ─────────────────────────────────────────────────

function ModuleConfig({ moduleId, config, defaultConfig, onSave, saving }: {
  moduleId: string; config: Record<string, any>; defaultConfig: Record<string, any>; onSave: (config: Record<string, any>) => void; saving: boolean
}) {
  const [local, setLocal] = useState<Record<string, any>>({ ...defaultConfig, ...config })

  const update = (key: string, value: any) => {
    setLocal(prev => ({ ...prev, [key]: value }))
  }

  const configs: Record<string, JSX.Element> = {
    antiraid: (
      <div className="space-y-4">
        <ConfigRow label="Join Threshold" description="Number of joins to trigger raid detection">
          <NumberInput value={local.join_threshold} onChange={(v) => update('join_threshold', v)} min={3} max={50} />
        </ConfigRow>
        <ConfigRow label="Time Window" description="Seconds to count joins within">
          <NumberInput value={local.time_window_seconds} onChange={(v) => update('time_window_seconds', v)} min={5} max={60} suffix="s" />
        </ConfigRow>
        <ConfigRow label="Action" description="What to do when a raid is detected">
          <SelectInput value={local.action} onChange={(v) => update('action', v)} options={[{ value: 'kick', label: 'Kick' }, { value: 'ban', label: 'Ban' }, { value: 'lockdown', label: 'Auto-Lockdown' }]} />
        </ConfigRow>
        <ConfigRow label="Min Account Age" description="Flag accounts newer than this">
          <NumberInput value={local.min_account_age_hours} onChange={(v) => update('min_account_age_hours', v)} min={0} max={720} suffix="hrs" />
        </ConfigRow>
        <ConfigRow label="Notify Channel" description="Post alert in log channel">
          <ToggleInput value={local.notify_channel} onChange={(v) => update('notify_channel', v)} />
        </ConfigRow>
      </div>
    ),
    antispam: (
      <div className="space-y-4">
        <ConfigRow label="Message Limit" description="Max messages in time window before flagging">
          <NumberInput value={local.message_limit} onChange={(v) => update('message_limit', v)} min={3} max={20} />
        </ConfigRow>
        <ConfigRow label="Time Window" description="Seconds to count messages within">
          <NumberInput value={local.time_window_seconds} onChange={(v) => update('time_window_seconds', v)} min={1} max={30} suffix="s" />
        </ConfigRow>
        <ConfigRow label="Duplicate Limit" description="Same message repeated this many times">
          <NumberInput value={local.duplicate_limit} onChange={(v) => update('duplicate_limit', v)} min={2} max={10} />
        </ConfigRow>
        <ConfigRow label="Action" description="What to do with spam messages">
          <SelectInput value={local.action} onChange={(v) => update('action', v)} options={[{ value: 'delete', label: 'Delete Message' }, { value: 'mute', label: 'Mute User' }, { value: 'ban', label: 'Ban User' }]} />
        </ConfigRow>
        <ConfigRow label="Mute Duration" description="How long to mute (if action is mute)">
          <NumberInput value={local.mute_duration_minutes} onChange={(v) => update('mute_duration_minutes', v)} min={1} max={1440} suffix="min" />
        </ConfigRow>
      </div>
    ),
    phishing: (
      <div className="space-y-4">
        <ConfigRow label="Auto-Delete" description="Automatically delete messages with malicious links">
          <ToggleInput value={local.auto_delete} onChange={(v) => update('auto_delete', v)} />
        </ConfigRow>
        <ConfigRow label="Quarantine User" description="Restrict user permissions on detection">
          <ToggleInput value={local.quarantine_user} onChange={(v) => update('quarantine_user', v)} />
        </ConfigRow>
        <ConfigRow label="Warn in Channel" description="Post a warning message when a link is removed">
          <ToggleInput value={local.warn_in_channel} onChange={(v) => update('warn_in_channel', v)} />
        </ConfigRow>
        <ConfigRow label="Scan Embeds" description="Also scan link previews and embeds">
          <ToggleInput value={local.scan_embeds} onChange={(v) => update('scan_embeds', v)} />
        </ConfigRow>
      </div>
    ),
    impersonation: (
      <div className="space-y-4">
        <ConfigRow label="Similarity Threshold" description="How similar a name must be to flag (%)">
          <NumberInput value={local.similarity_threshold} onChange={(v) => update('similarity_threshold', v)} min={50} max={100} suffix="%" />
        </ConfigRow>
        <ConfigRow label="Action" description="What to do when impersonation is detected">
          <SelectInput value={local.action} onChange={(v) => update('action', v)} options={[{ value: 'flag', label: 'Flag for Review' }, { value: 'rename', label: 'Reset Nickname' }, { value: 'kick', label: 'Kick User' }]} />
        </ConfigRow>
        <ConfigRow label="Check Avatars" description="Compare avatars against staff members">
          <ToggleInput value={local.check_avatars} onChange={(v) => update('check_avatars', v)} />
        </ConfigRow>
        <ConfigRow label="Check Nicknames" description="Compare nicknames against staff names">
          <ToggleInput value={local.check_nicknames} onChange={(v) => update('check_nicknames', v)} />
        </ConfigRow>
      </div>
    ),
  }

  return (
    <div className="space-y-4">
      {configs[moduleId]}
      <button
        onClick={() => onSave(local)}
        disabled={saving}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD600] text-black text-xs font-semibold hover:bg-[#FFD600]/90 transition-colors disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
        Save Configuration
      </button>
    </div>
  )
}

// ─── Config Inputs ───────────────────────────────────────────────────────────

function ConfigRow({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs font-medium text-white/70">{label}</p>
        <p className="text-[10px] text-white/25 mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  )
}

function NumberInput({ value, onChange, min, max, suffix }: { value: number; onChange: (v: number) => void; min: number; max: number; suffix?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Math.min(max, Math.max(min, parseInt(e.target.value) || min)))}
        min={min}
        max={max}
        className="w-16 h-8 rounded-md bg-[#0f1012] border border-white/[0.06] text-xs text-white text-center focus:outline-none focus:border-[#FFD600]/30"
      />
      {suffix && <span className="text-[10px] text-white/20">{suffix}</span>}
    </div>
  )
}

function SelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 rounded-md bg-[#0f1012] border border-white/[0.06] text-xs text-white px-2 focus:outline-none focus:border-[#FFD600]/30 appearance-none cursor-pointer"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

function ToggleInput({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className={`relative h-6 w-11 rounded-full transition-colors flex-shrink-0 ${value ? 'bg-[#FFD600]/30' : 'bg-white/[0.06]'}`}>
      <span className={`absolute top-1 h-4 w-4 rounded-full transition-all ${value ? 'left-6 bg-[#FFD600]' : 'left-1 bg-white/30'}`} />
    </button>
  )
}

function StatCard({ icon: Icon, label, value, sublabel, color }: { icon: any; label: string; value: string; sublabel: string; color: string }) {
  const colors: Record<string, string> = { red: 'bg-red-500/[0.08] text-red-400', orange: 'bg-orange-500/[0.08] text-orange-400', blue: 'bg-blue-500/[0.08] text-blue-400', purple: 'bg-purple-500/[0.08] text-purple-400' }
  return (
    <div className="p-4 rounded-xl bg-[#0a0b0d] border border-white/[0.04]">
      <div className={`h-7 w-7 rounded-lg flex items-center justify-center mb-2 ${colors[color]}`}><Icon className="h-3.5 w-3.5" /></div>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-[10px] text-white/30">{label}</p>
      <p className="text-[9px] text-white/15">{sublabel}</p>
    </div>
  )
}

function getTimeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
