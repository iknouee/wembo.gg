'use client'

import { useState } from 'react'
import { Shield, AlertTriangle, Lock, Eye, Activity, Ban, Link2, UserX, Zap, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { mockSecurityEvents } from '@/lib/mock-data'

export default function DashboardSecurityPage() {
  const [lockdownActive, setLockdownActive] = useState(false)
  const score = 87

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Security</h1>
          <p className="text-[#9A9CA3] mt-1 text-sm">Monitor and manage your server&apos;s security.</p>
        </div>
        <button
          onClick={() => setLockdownActive(!lockdownActive)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            lockdownActive
              ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
              : 'bg-[#0a0b0d] border border-white/[0.04] text-white/50 hover:text-white/80 hover:border-white/[0.08]'
          }`}
        >
          <Lock className="h-3.5 w-3.5" />
          {lockdownActive ? 'Lockdown Active' : 'Lockdown'}
        </button>
      </div>

      {/* Security Score + Shield Modules */}
      <div className="grid lg:grid-cols-[320px_1fr] gap-4">
        {/* Score */}
        <div className="p-6 rounded-xl bg-[#0a0b0d] border border-white/[0.04] flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="42"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="50" cy="50" r="42"
                stroke={score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${score * 2.64} ${100 * 2.64}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{score}</span>
              <span className="text-[10px] text-white/25">/100</span>
            </div>
          </div>
          <p className="text-sm font-medium text-white/70">Security Score</p>
          <p className="text-xs text-white/25 mt-1">Your server is well protected</p>
        </div>

        {/* Shield Modules */}
        <div className="grid grid-cols-2 gap-3">
          <ModuleCard
            icon={Shield}
            name="Anti-Raid"
            description="Detects and blocks mass join attacks"
            active={true}
          />
          <ModuleCard
            icon={Ban}
            name="Anti-Spam"
            description="Auto-removes spam messages"
            active={true}
          />
          <ModuleCard
            icon={Link2}
            name="Phishing Detection"
            description="Scans and blocks malicious links"
            active={true}
          />
          <ModuleCard
            icon={UserX}
            name="Impersonation Guard"
            description="Detects staff impersonation"
            active={false}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <ThreatStat label="Threats Blocked" value="142" sublabel="this week" icon={Shield} color="red" />
        <ThreatStat label="Raids Prevented" value="3" sublabel="this month" icon={AlertTriangle} color="orange" />
        <ThreatStat label="Links Scanned" value="8,421" sublabel="total" icon={Link2} color="blue" />
        <ThreatStat label="Accounts Flagged" value="7" sublabel="active flags" icon={UserX} color="purple" />
      </div>

      {/* Security Timeline */}
      <div className="rounded-xl bg-[#0a0b0d] border border-white/[0.04] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
          <h2 className="text-sm font-medium text-white/80 flex items-center gap-2">
            <Activity className="h-4 w-4 text-white/30" />
            Security Timeline
          </h2>
          <span className="text-xs text-white/20">Last 24 hours</span>
        </div>

        <div className="divide-y divide-white/[0.03]">
          {mockSecurityEvents.map((event, i) => (
            <TimelineEvent key={event.id} event={event} isFirst={i === 0} />
          ))}
        </div>
      </div>

      {/* Threat Breakdown */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-[#0a0b0d] border border-white/[0.04]">
          <h3 className="text-sm font-medium text-white/70 mb-4">Threat Breakdown (7 days)</h3>
          <div className="space-y-3">
            <ThreatBar label="Spam" count={67} total={142} color="bg-orange-400" />
            <ThreatBar label="Phishing Links" count={38} total={142} color="bg-red-400" />
            <ThreatBar label="Raid Attempts" count={23} total={142} color="bg-purple-400" />
            <ThreatBar label="Impersonation" count={9} total={142} color="bg-blue-400" />
            <ThreatBar label="Other" count={5} total={142} color="bg-white/30" />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0a0b0d] border border-white/[0.04]">
          <h3 className="text-sm font-medium text-white/70 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <QuickAction
              icon={Ban}
              label="Ban suspicious accounts"
              description="7 flagged accounts awaiting review"
              actionLabel="Review"
              urgent
            />
            <QuickAction
              icon={Link2}
              label="Update link blocklist"
              description="Last updated 3 days ago"
              actionLabel="Update"
            />
            <QuickAction
              icon={Shield}
              label="Adjust raid sensitivity"
              description="Currently set to Medium"
              actionLabel="Configure"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ModuleCard({ icon: Icon, name, description, active }: {
  icon: any; name: string; description: string; active: boolean
}) {
  return (
    <div className={`p-4 rounded-xl border transition-all ${
      active
        ? 'bg-[#0a0b0d] border-green-500/10 hover:border-green-500/20'
        : 'bg-[#08090b] border-white/[0.03] opacity-60'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
          active ? 'bg-green-500/10' : 'bg-white/[0.03]'
        }`}>
          <Icon className={`h-4 w-4 ${active ? 'text-green-400' : 'text-white/20'}`} />
        </div>
        <span className={`flex items-center gap-1 text-[10px] font-medium ${
          active ? 'text-green-400' : 'text-white/20'
        }`}>
          {active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
          {active ? 'Active' : 'Disabled'}
        </span>
      </div>
      <h4 className="text-sm font-medium text-white/80">{name}</h4>
      <p className="text-[11px] text-white/25 mt-0.5">{description}</p>
    </div>
  )
}

function ThreatStat({ label, value, sublabel, icon: Icon, color }: {
  label: string; value: string; sublabel: string; icon: any; color: string
}) {
  const colors: Record<string, string> = {
    red: 'bg-red-500/[0.08] text-red-400',
    orange: 'bg-orange-500/[0.08] text-orange-400',
    blue: 'bg-blue-500/[0.08] text-blue-400',
    purple: 'bg-purple-500/[0.08] text-purple-400',
  }

  return (
    <div className="p-4 rounded-xl bg-[#0a0b0d] border border-white/[0.04]">
      <div className={`h-7 w-7 rounded-lg flex items-center justify-center mb-2 ${colors[color]}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-[11px] text-white/25 mt-0.5">{label}</p>
      <p className="text-[10px] text-white/15">{sublabel}</p>
    </div>
  )
}

function TimelineEvent({ event, isFirst }: { event: typeof mockSecurityEvents[0]; isFirst: boolean }) {
  const severityStyles: Record<string, { dot: string; bg: string; text: string }> = {
    high: { dot: 'bg-red-400', bg: 'bg-red-500/10', text: 'text-red-400' },
    medium: { dot: 'bg-orange-400', bg: 'bg-orange-500/10', text: 'text-orange-400' },
    low: { dot: 'bg-yellow-400', bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  }

  const style = severityStyles[event.severity]

  return (
    <div className={`flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.01] transition-colors ${
      isFirst ? 'bg-white/[0.01]' : ''
    }`}>
      {/* Severity dot */}
      <div className="flex flex-col items-center gap-1">
        <span className={`h-2.5 w-2.5 rounded-full ${style.dot} ${isFirst ? 'animate-pulse' : ''}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/70">{event.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <Clock className="h-3 w-3 text-white/15" />
          <span className="text-xs text-white/20">{event.timestamp}</span>
        </div>
      </div>

      {/* Severity badge */}
      <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${style.bg} ${style.text}`}>
        {event.severity}
      </span>
    </div>
  )
}

function ThreatBar({ label, count, total, color }: {
  label: string; count: number; total: number; color: string
}) {
  const percentage = Math.round((count / total) * 100)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40">{label}</span>
        <span className="text-xs text-white/20">{count} ({percentage}%)</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

function QuickAction({ icon: Icon, label, description, actionLabel, urgent }: {
  icon: any; label: string; description: string; actionLabel: string; urgent?: boolean
}) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:bg-white/[0.02] ${
      urgent ? 'border-red-500/10 bg-red-500/[0.02]' : 'border-white/[0.04]'
    }`}>
      <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
        urgent ? 'bg-red-500/10' : 'bg-white/[0.03]'
      }`}>
        <Icon className={`h-4 w-4 ${urgent ? 'text-red-400' : 'text-white/25'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-white/70">{label}</p>
        <p className="text-[11px] text-white/25">{description}</p>
      </div>
      <button className={`text-[10px] font-medium px-2.5 py-1 rounded-md transition-colors ${
        urgent
          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
          : 'bg-white/[0.04] text-white/30 hover:text-white/60'
      }`}>
        {actionLabel}
      </button>
    </div>
  )
}
