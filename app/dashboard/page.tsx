'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/dashboard/dashboard-shell'
import { StatCard } from '@/components/dashboard/ui'
import { Server, Plus, ArrowRight, ArrowLeft, Shield, Zap, TrendingUp, Clock, Crown, Globe, Activity, CheckCircle2 } from 'lucide-react'

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const { user, guilds, setSelectedGuild } = useAuth()
  const selectedServerId = searchParams.get('server')

  // ─── Server Detail View ──────────────────────────────────────────────
  if (selectedServerId) {
    const guild = guilds.find(g => g.id === selectedServerId)
    const name = searchParams.get('name')
    const icon = searchParams.get('icon')
    const owner = searchParams.get('owner')
    const resolvedGuild = guild || (name ? { id: selectedServerId, name, icon: icon || null, owner: owner === '1', permissions: '0' } : null)

    if (!resolvedGuild) {
      return (
        <div className="p-6 lg:p-8 dash-content space-y-6 animate-fade-in">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-body-sm text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />Back to servers
          </Link>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-14 w-14 rounded-2xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-white/15" />
            </div>
            <h2 className="text-[17px] font-semibold text-white mb-2">Server not found</h2>
            <p className="text-body-sm text-white/30">This server may have been removed or you no longer have access.</p>
          </div>
        </div>
      )
    }

    const iconUrl = resolvedGuild.icon ? `https://cdn.discordapp.com/icons/${resolvedGuild.id}/${resolvedGuild.icon}.png?size=128` : null

    return (
      <div className="p-6 lg:p-8 dash-content space-y-6 animate-fade-in">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-body-sm text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />Back to servers
        </Link>

        {/* Server Header */}
        <div className="dash-card p-6">
          <div className="flex items-center gap-5">
            {iconUrl ? (
              <img src={iconUrl} alt={resolvedGuild.name} className="h-16 w-16 rounded-2xl object-cover ring-1 ring-white/[0.06]" />
            ) : (
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] flex items-center justify-center text-white/50 font-bold text-lg ring-1 ring-white/[0.06]">
                {resolvedGuild.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="text-[20px] font-bold text-white truncate">{resolvedGuild.name}</h1>
                {resolvedGuild.owner && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/10">
                    <Crown className="h-3 w-3" />Owner
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2.5">
                <span className="flex items-center gap-1.5 text-caption text-white/30">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/30" />
                  Connected
                </span>
                <span className="flex items-center gap-1.5 text-caption text-white/30">
                  <Shield className="h-3.5 w-3.5" />Protected
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Server ID */}
        <div className="dash-card px-5 py-3.5 w-fit">
          <div className="flex items-center gap-3">
            <span className="text-caption text-white/20">Server ID</span>
            <code className="text-caption text-white/50 font-mono bg-white/[0.03] px-2 py-0.5 rounded">{resolvedGuild.id}</code>
          </div>
        </div>

        {/* Features Notice */}
        <div className="dash-card border-[#FFD600]/[0.08] bg-[#FFD600]/[0.015] p-5">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#FFD600]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Zap className="h-4 w-4 text-[#FFD600]" />
            </div>
            <div>
              <p className="text-body-sm text-[#FFD600]/80 font-medium">Server features are being built</p>
              <p className="text-caption text-white/30 mt-1">Modules like AI, Security, Automations, and Analytics will appear here as they&apos;re added.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── Overview ────────────────────────────────────────────────────────
  const greeting = getGreeting()
  const displayName = user?.global_name || user?.username || ''

  return (
    <div className="p-6 lg:p-8 dash-content space-y-8 animate-fade-in">

      {/* Hero / Welcome */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-heading text-white">
            {greeting}{displayName ? `, ${displayName}` : ''} 👋
          </h1>
          <p className="text-body-sm text-white/40 mt-1.5">
            Here&apos;s what&apos;s happening across your communities.
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
            <span className="text-[11px] font-medium text-emerald-400">All systems operational</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      {guilds.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            icon={Server}
            iconColor="bg-[#FFD600]/[0.06] text-[#FFD600]"
            value={guilds.length}
            label="Servers"
            sub="+2 this month"
          />
          <StatCard
            icon={Shield}
            iconColor="bg-emerald-500/[0.06] text-emerald-400"
            value={guilds.length}
            label="Protected"
            sub="All active"
          />
          <StatCard
            icon={Zap}
            iconColor="bg-blue-500/[0.06] text-blue-400"
            value={guilds.length * 4}
            label="Automations"
            sub={`${(guilds.length * 4 * 31).toLocaleString()} runs this month`}
          />
          <StatCard
            icon={TrendingUp}
            iconColor="bg-purple-500/[0.06] text-purple-400"
            value="98%"
            label="Security Health"
            sub="Excellent"
          />
        </div>
      )}

      {/* Security Activity + Recent Activity */}
      {guilds.length > 0 && (
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Security Activity Chart Placeholder */}
          <div className="lg:col-span-3 dash-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[15px] font-semibold text-white/90">Security Activity</h3>
                <p className="text-micro text-white/25 mt-0.5">Threat detection across all servers</p>
              </div>
              <div className="segmented-control">
                <button data-active="true">7D</button>
                <button>30D</button>
                <button>90D</button>
              </div>
            </div>
            {/* Chart Area - ready for real data */}
            <div className="h-[180px] flex items-end gap-1.5 px-2">
              {Array.from({ length: 14 }).map((_, i) => {
                const h = Math.max(8, Math.random() * 100)
                return (
                  <div key={i} className="flex-1 group relative">
                    <div
                      className="w-full rounded-t-sm bg-[#FFD600]/20 group-hover:bg-[#FFD600]/40 transition-colors"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                )
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/[0.04]">
              <span className="flex items-center gap-1.5 text-micro text-white/25">
                <span className="h-2 w-2 rounded-sm bg-[#FFD600]/30" /> Threats blocked
              </span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 dash-card p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.04]">
              <h3 className="text-[14px] font-semibold text-white/80">Recent Activity</h3>
            </div>
            <div className="divide-y divide-white/[0.03]">
              <ActivityRow
                color="orange"
                title="Blocked Discord invite"
                meta="wembo.xyz Support • 2m ago"
              />
              <ActivityRow
                color="red"
                title="Impersonation detected"
                meta="Username matched staff • 18m ago"
              />
              <ActivityRow
                color="green"
                title="Anti-Raid enabled"
                meta="CordList Community • 1h ago"
              />
              <ActivityRow
                color="blue"
                title="Link scanned & cleared"
                meta="wembo.xyz Support • 2h ago"
              />
            </div>
            <div className="px-5 py-3 border-t border-white/[0.04]">
              <Link href="/dashboard/security" className="text-[11px] text-white/25 hover:text-[#FFD600] transition-colors font-medium">
                View all activity →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Server Grid */}
      {guilds.length === 0 ? (
        <div className="dash-card py-20 text-center">
          <div className="h-14 w-14 rounded-2xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-center mx-auto mb-4">
            <Server className="h-6 w-6 text-white/15" />
          </div>
          <h2 className="text-[17px] font-semibold text-white mb-2">No servers found</h2>
          <p className="text-body-sm text-white/30 max-w-sm mx-auto mb-6">
            You don&apos;t have any servers where you can manage Wembo. Add Wembo to a server to get started.
          </p>
          <a href="/invite" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFD600] text-black text-body-sm font-semibold hover:bg-[#FFD600]/90 transition-colors glow-btn">
            <Plus className="h-4 w-4" />Add Wembo to a Server
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-white/50">Your Servers</h2>
            <span className="text-caption text-white/20">{guilds.length} server{guilds.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {guilds.map((guild) => (
              <ServerCard key={guild.id} guild={guild} onSelect={() => setSelectedGuild(guild.id)} />
            ))}
            <a href="/invite" className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-dashed border-white/[0.06] hover:border-[#FFD600]/20 hover:bg-[#FFD600]/[0.015] transition-all duration-300 min-h-[180px]">
              <div className="h-10 w-10 rounded-xl bg-white/[0.03] border border-white/[0.06] group-hover:border-[#FFD600]/20 group-hover:bg-[#FFD600]/[0.04] flex items-center justify-center transition-all">
                <Plus className="h-4 w-4 text-white/20 group-hover:text-[#FFD600]/70 transition-colors" />
              </div>
              <span className="text-body-sm text-white/25 group-hover:text-white/50 transition-colors font-medium">Add a server</span>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Server Card ─────────────────────────────────────────────────────────────

function ServerCard({ guild, onSelect }: { guild: { id: string; name: string; icon: string | null; owner: boolean }; onSelect: () => void }) {
  const iconUrl = guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=64` : null

  return (
    <Link
      href={`/dashboard?server=${guild.id}&name=${encodeURIComponent(guild.name)}&icon=${encodeURIComponent(guild.icon || '')}&owner=${guild.owner ? '1' : '0'}`}
      onClick={onSelect}
      className="group dash-card p-5 hover:border-[rgba(255,255,255,0.11)] hover:bg-[#111214] transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3.5">
          {iconUrl ? (
            <img src={iconUrl} alt={guild.name} className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/[0.06]" />
          ) : (
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] flex items-center justify-center text-white/50 font-semibold text-[13px] ring-1 ring-white/[0.06]">
              {guild.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-white/90 group-hover:text-white truncate transition-colors">{guild.name}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/30" />
              <span className="text-[11px] text-emerald-400/70">Protected</span>
            </div>
          </div>
        </div>
        {guild.owner && (
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/10">
            Owner
          </span>
        )}
      </div>

      {/* Health bar */}
      <div className="mt-4 pt-4 border-t border-white/[0.03]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-micro text-white/20">Security Health</span>
          <span className="text-micro font-semibold text-emerald-400">94%</span>
        </div>
        <div className="h-1 rounded-full bg-white/[0.04] overflow-hidden">
          <div className="h-full rounded-full bg-emerald-500/60 w-[94%]" />
        </div>
      </div>

      {/* Action */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-micro text-white/20">Manage server</span>
        <ArrowRight className="h-3.5 w-3.5 text-white/10 group-hover:text-[#FFD600]/60 group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  )
}

// ─── Activity Row ────────────────────────────────────────────────────────────

function ActivityRow({ color, title, meta }: { color: string; title: string; meta: string }) {
  const colors: Record<string, string> = {
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    green: 'bg-emerald-500',
    blue: 'bg-blue-500',
    yellow: 'bg-[#FFD600]',
  }
  return (
    <div className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-white/[0.01] transition-colors">
      <span className={`h-2 w-2 rounded-full flex-shrink-0 ${colors[color] || 'bg-white/20'}`} />
      <div className="flex-1 min-w-0">
        <p className="text-body-sm text-white/60 truncate">{title}</p>
        <p className="text-micro text-white/20 mt-0.5">{meta}</p>
      </div>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
