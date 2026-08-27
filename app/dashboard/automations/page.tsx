'use client'

import { useState } from 'react'
import { Zap, Plus, Play, Pause, Clock, ArrowRight, Activity, RefreshCw, Users, Shield, Bell, Youtube } from 'lucide-react'
import { mockAutomations } from '@/lib/mock-data'

type AutomationStatus = 'active' | 'paused'

export default function DashboardAutomationsPage() {
  const [automations, setAutomations] = useState(mockAutomations)

  const toggleStatus = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: (a.status === 'active' ? 'paused' : 'active') as AutomationStatus }
          : a
      )
    )
  }

  const activeCount = automations.filter((a) => a.status === 'active').length
  const totalRuns = automations.reduce((sum, a) => sum + a.runs, 0)

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Automations</h1>
          <p className="text-[#9A9CA3] mt-1 text-sm">Build and manage your workflow automations.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FFD600] text-black text-xs font-semibold hover:bg-[#FFD600]/90 transition-colors">
          <Plus className="h-3.5 w-3.5" />
          Create
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-[#0a0b0d] border border-white/[0.04]">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-green-500/[0.08] flex items-center justify-center">
              <Activity className="h-3.5 w-3.5 text-green-400" />
            </div>
          </div>
          <p className="text-xl font-bold text-white">{activeCount}</p>
          <p className="text-[11px] text-white/25 mt-0.5">Active</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0a0b0d] border border-white/[0.04]">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-[#FFD600]/[0.08] flex items-center justify-center">
              <RefreshCw className="h-3.5 w-3.5 text-[#FFD600]" />
            </div>
          </div>
          <p className="text-xl font-bold text-white">{totalRuns.toLocaleString()}</p>
          <p className="text-[11px] text-white/25 mt-0.5">Total Runs</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0a0b0d] border border-white/[0.04]">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-blue-500/[0.08] flex items-center justify-center">
              <Clock className="h-3.5 w-3.5 text-blue-400" />
            </div>
          </div>
          <p className="text-xl font-bold text-white">47</p>
          <p className="text-[11px] text-white/25 mt-0.5">Runs Today</p>
        </div>
      </div>

      {/* Automation Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-white/60">Your Automations</h2>
          <span className="text-xs text-white/20">{automations.length} total</span>
        </div>

        {automations.map((automation) => (
          <AutomationCard
            key={automation.id}
            automation={automation}
            onToggle={() => toggleStatus(automation.id)}
          />
        ))}
      </div>

      {/* Templates Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-white/60">Quick Templates</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <TemplateCard
            icon={Users}
            name="Auto-Role on Join"
            description="Assign roles when members join your server"
            color="purple"
          />
          <TemplateCard
            icon={Shield}
            name="Anti-Spam Filter"
            description="Auto-delete messages matching spam patterns"
            color="red"
          />
          <TemplateCard
            icon={Bell}
            name="Milestone Alert"
            description="Notify when server reaches member milestones"
            color="blue"
          />
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function AutomationCard({ automation, onToggle }: {
  automation: typeof mockAutomations[0]
  onToggle: () => void
}) {
  const isActive = automation.status === 'active'

  const triggerIcons: Record<string, any> = {
    'Member joins': Users,
    'Mass join detected': Shield,
    'Level reached': Zap,
    'YouTube upload': Youtube,
  }
  const TriggerIcon = triggerIcons[automation.trigger] || Zap

  return (
    <div className={`group flex items-center gap-4 p-4 rounded-xl border transition-all ${
      isActive
        ? 'bg-[#0a0b0d] border-white/[0.04] hover:border-green-500/15'
        : 'bg-[#08090b] border-white/[0.03] opacity-60 hover:opacity-80'
    }`}>
      {/* Icon */}
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isActive ? 'bg-green-500/10' : 'bg-white/[0.03]'
      }`}>
        <TriggerIcon className={`h-4.5 w-4.5 ${isActive ? 'text-green-400' : 'text-white/20'}`} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-white/90 truncate">{automation.name}</h3>
          <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
            isActive
              ? 'bg-green-500/10 text-green-400'
              : 'bg-white/[0.04] text-white/25'
          }`}>
            {isActive ? 'Active' : 'Paused'}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-white/25 flex items-center gap-1">
            <ArrowRight className="h-2.5 w-2.5" />
            {automation.trigger}
          </span>
          <span className="text-xs text-white/15">·</span>
          <span className="text-xs text-white/20">{automation.runs.toLocaleString()} runs</span>
          <span className="text-xs text-white/15 hidden sm:inline">·</span>
          <span className="text-xs text-white/15 hidden sm:inline flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" />
            {automation.lastRun}
          </span>
        </div>
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        className={`relative h-6 w-11 rounded-full transition-colors flex-shrink-0 ${
          isActive ? 'bg-green-500/30' : 'bg-white/[0.06]'
        }`}
      >
        <span className={`absolute top-1 h-4 w-4 rounded-full transition-all ${
          isActive
            ? 'left-6 bg-green-400'
            : 'left-1 bg-white/30'
        }`} />
      </button>
    </div>
  )
}

function TemplateCard({ icon: Icon, name, description, color }: {
  icon: any; name: string; description: string; color: string
}) {
  const colors: Record<string, string> = {
    purple: 'bg-purple-500/[0.06] text-purple-400',
    red: 'bg-red-500/[0.06] text-red-400',
    blue: 'bg-blue-500/[0.06] text-blue-400',
  }

  return (
    <button className="group text-left p-4 rounded-xl bg-[#0a0b0d] border border-white/[0.04] hover:border-white/[0.08] hover:bg-[#0c0d10] transition-all">
      <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{name}</h3>
      <p className="text-xs text-white/25 mt-1 leading-relaxed">{description}</p>
    </button>
  )
}
