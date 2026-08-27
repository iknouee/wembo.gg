'use client'

import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, Lock, Ban, Link2, UserX, CheckCircle2, XCircle, Clock, Activity, Zap, Eye } from 'lucide-react'

// ─── Mock Data ───────────────────────────────────────────────────────────────

const securityEvents = [
  { id: '1', type: 'raid', description: 'Mass join attempt blocked (23 accounts)', time: '2 minutes ago', severity: 'high' as const },
  { id: '2', type: 'phishing', description: 'Phishing link detected and removed in #general', time: '14 minutes ago', severity: 'medium' as const },
  { id: '3', type: 'spam', description: 'Spam account auto-banned: suspicious_user#0001', time: '1 hour ago', severity: 'low' as const },
  { id: '4', type: 'impersonation', description: 'Potential staff impersonation detected', time: '3 hours ago', severity: 'high' as const },
  { id: '5', type: 'spam', description: 'Bulk message spam removed (47 messages)', time: '5 hours ago', severity: 'medium' as const },
  { id: '6', type: 'phishing', description: 'Discord nitro scam link blocked', time: '8 hours ago', severity: 'medium' as const },
]

const initialModules = [
  { id: 'antiraid', name: 'Anti-Raid', description: 'Detects and blocks mass join attacks', icon: Shield, active: true },
  { id: 'antispam', name: 'Anti-Spam', description: 'Auto-removes spam messages and accounts', icon: Ban, active: true },
  { id: 'phishing', name: 'Phishing Detection', description: 'Scans and blocks malicious links', icon: Link2, active: true },
  { id: 'impersonation', name: 'Impersonation Guard', description: 'Detects staff name/avatar copying', icon: UserX, active: false },
]

// ─── Page Component ──────────────────────────────────────────────────────────

export default function SecurityPage() {
  const [modules, setModules] = useState(initialModules)
  const [lockdown, setLockdown] = useState(false)
  const [score, setScore] = useState(0)
  const [mounted, setMounted] = useState(false)

  const targetScore = modules.filter(m => m.active).length === 4 ? 96 : modules.filter(m => m.active).length * 22 + 10

  useEffect(() => {
    setMounted(true)
    // Animate score on mount
    const timer = setTimeout(() => setScore(targetScore), 100)
    return () => clearTimeout(timer)
  }, [targetScore])

  const toggleModule = (id: string) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m))
  }

  const activeCount = modules.filter(m => m.active).length

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Security</h1>
          <p className="text-[#9A9CA3] mt-1 text-sm">Monitor threats and manage your server&apos;s protection.</p>
        </div>
        <button
          onClick={() => setLockdown(!lockdown)}
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

      {/* Lockdown Banner */}
      {lockdown && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <Lock className="h-4 w-4 text-red-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-400">Server Lockdown Active</p>
            <p className="text-xs text-red-400/60 mt-0.5">All new joins are blocked. Verification required for messages.</p>
          </div>
        </div>
      )}

      {/* Score + Modules Grid */}
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Security Score */}
        <div className="p-6 rounded-xl bg-[#0a0b0d] border border-white/[0.04] flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.04)" strokeWidth="6" fill="none" />
              <circle
                cx="50" cy="50" r="42"
                stroke={score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${mounted ? score * 2.64 : 0} ${100 * 2.64}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{mounted ? score : 0}</span>
              <span className="text-[10px] text-white/25 mt-0.5">/100</span>
            </div>
          </div>
          <p className="text-sm font-medium text-white/70">Security Score</p>
          <p className="text-xs text-white/25 mt-1">
            {score >= 80 ? 'Excellent protection' : score >= 50 ? 'Good, but can improve' : 'Needs attention'}
          </p>
          <div className="flex items-center gap-1.5 mt-3">
            <span className={`h-2 w-2 rounded-full ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <span className="text-[10px] text-white/30">{activeCount}/4 modules active</span>
          </div>
        </div>

        {/* Shield Modules */}
        <div className="grid sm:grid-cols-2 gap-3">
          {modules.map(mod => (
            <div key={mod.id} className={`p-4 rounded-xl border transition-all ${
              mod.active ? 'bg-[#0a0b0d] border-green-500/10 hover:border-green-500/20' : 'bg-[#08090b] border-white/[0.03] opacity-70'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${mod.active ? 'bg-green-500/10' : 'bg-white/[0.03]'}`}>
                  <mod.icon className={`h-4 w-4 ${mod.active ? 'text-green-400' : 'text-white/20'}`} />
                </div>
                {/* Toggle */}
                <button
                  onClick={() => toggleModule(mod.id)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${mod.active ? 'bg-green-500/30' : 'bg-white/[0.06]'}`}
                >
                  <span className={`absolute top-1 h-4 w-4 rounded-full transition-all ${mod.active ? 'left-6 bg-green-400' : 'left-1 bg-white/30'}`} />
                </button>
              </div>
              <h4 className="text-sm font-medium text-white/80">{mod.name}</h4>
              <p className="text-[11px] text-white/25 mt-0.5">{mod.description}</p>
              <div className="flex items-center gap-1 mt-2">
                {mod.active ? <CheckCircle2 className="h-3 w-3 text-green-400" /> : <XCircle className="h-3 w-3 text-white/15" />}
                <span className={`text-[10px] ${mod.active ? 'text-green-400' : 'text-white/15'}`}>{mod.active ? 'Active' : 'Disabled'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Shield} label="Threats Blocked" value="142" sublabel="this week" color="red" />
        <StatCard icon={AlertTriangle} label="Raids Prevented" value="3" sublabel="this month" color="orange" />
        <StatCard icon={Link2} label="Links Scanned" value="8,421" sublabel="total" color="blue" />
        <StatCard icon={UserX} label="Accounts Flagged" value="7" sublabel="active flags" color="purple" />
      </div>

      {/* Timeline + Breakdown */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Threat Timeline */}
        <div className="rounded-xl bg-[#0a0b0d] border border-white/[0.04] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
            <h2 className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Activity className="h-4 w-4 text-white/30" />
              Threat Timeline
            </h2>
            <span className="text-[10px] text-white/20">Last 24 hours</span>
          </div>
          <div className="divide-y divide-white/[0.03]">
            {securityEvents.map((event, i) => {
              const severityStyles = {
                high: { dot: 'bg-red-400', badge: 'bg-red-500/10 text-red-400' },
                medium: { dot: 'bg-orange-400', badge: 'bg-orange-500/10 text-orange-400' },
                low: { dot: 'bg-yellow-400', badge: 'bg-yellow-500/10 text-yellow-400' },
              }
              const style = severityStyles[event.severity]

              return (
                <div key={event.id} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.01] transition-colors ${i === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${style.dot} ${i === 0 ? 'animate-pulse' : ''}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/70 truncate">{event.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-white/15" />
                      <span className="text-[11px] text-white/20">{event.time}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-1 rounded-full flex-shrink-0 ${style.badge}`}>
                    {event.severity}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Threat Breakdown + Quick Actions */}
        <div className="space-y-4">
          {/* Breakdown */}
          <div className="p-5 rounded-xl bg-[#0a0b0d] border border-white/[0.04]">
            <h3 className="text-sm font-medium text-white/70 mb-4">Threat Breakdown</h3>
            <div className="space-y-3">
              <ThreatBar label="Spam" count={67} total={142} color="bg-orange-400" />
              <ThreatBar label="Phishing" count={38} total={142} color="bg-red-400" />
              <ThreatBar label="Raid Attempts" count={23} total={142} color="bg-purple-400" />
              <ThreatBar label="Impersonation" count={9} total={142} color="bg-blue-400" />
              <ThreatBar label="Other" count={5} total={142} color="bg-white/30" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-5 rounded-xl bg-[#0a0b0d] border border-white/[0.04]">
            <h3 className="text-sm font-medium text-white/70 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <QuickAction icon={Ban} label="Review flagged accounts" count={7} urgent />
              <QuickAction icon={Link2} label="Update link blocklist" count={null} />
              <QuickAction icon={Eye} label="View audit log" count={null} />
            </div>
          </div>
        </div>
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

function ThreatBar({ label, count, total, color }: {
  label: string; count: number; total: number; color: string
}) {
  const pct = Math.round((count / total) * 100)
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40">{label}</span>
        <span className="text-[11px] text-white/20">{count} ({pct}%)</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function QuickAction({ icon: Icon, label, count, urgent }: {
  icon: any; label: string; count: number | null; urgent?: boolean
}) {
  return (
    <button className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all hover:bg-white/[0.02] ${
      urgent ? 'border-red-500/10 bg-red-500/[0.02]' : 'border-white/[0.04]'
    }`}>
      <div className={`h-7 w-7 rounded-md flex items-center justify-center flex-shrink-0 ${urgent ? 'bg-red-500/10' : 'bg-white/[0.03]'}`}>
        <Icon className={`h-3.5 w-3.5 ${urgent ? 'text-red-400' : 'text-white/25'}`} />
      </div>
      <span className="text-xs text-white/50 flex-1 text-left">{label}</span>
      {count !== null && (
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${urgent ? 'bg-red-500/10 text-red-400' : 'bg-white/[0.04] text-white/30'}`}>{count}</span>
      )}
    </button>
  )
}
