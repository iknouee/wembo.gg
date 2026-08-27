'use client'

import { useState, useEffect, useRef } from 'react'
import { Link2, Loader2, X, Plus, Shield, Globe, Search, ChevronDown } from 'lucide-react'
import { useAuth } from '@/components/dashboard/dashboard-shell'
import { PageHeader, StatCard, SettingCard, SettingRow, Toggle, SegmentedControl, NumberStepper, SaveBar, useToast } from '@/components/dashboard/ui'

const BUILTIN_DOMAINS = ['discord.com', 'tenor.com', 'giphy.com', 'imgur.com', 'youtube.com', 'youtu.be', 'twitch.tv', 'twitter.com', 'x.com', 'reddit.com', 'spotify.com', 'github.com', 'google.com', 'wikipedia.org', 'medium.com', 'stackoverflow.com', 'notion.so']

export default function LinkBlockerPage() {
  const { guilds, selectedGuild } = useAuth()
  const guildId = selectedGuild || guilds[0]?.id || null
  const { toast } = useToast()

  const [enabled, setEnabled] = useState(false)
  const [config, setConfig] = useState({
    block_all_links: true,
    block_invites: true,
    action: 'delete',
    timeout_minutes: 5,
    warn_in_channel: true,
    whitelisted_domains: [] as string[],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [newDomain, setNewDomain] = useState('')
  const [showBuiltIn, setShowBuiltIn] = useState(false)
  const initialState = useRef<{ enabled: boolean; config: typeof config } | null>(null)

  // ─── Data Fetching (PRESERVED) ───────────────────────────────────────
  useEffect(() => {
    if (!guildId) { setLoading(false); return }
    fetch(`/api/security/modules?guild_id=${guildId}`).then(r => r.json()).then(data => {
      const mod = (data.modules || []).find((m: any) => m.module_id === 'phishing')
      if (mod) { setEnabled(mod.enabled); setConfig(c => ({ ...c, ...mod.config })) }
      setLoading(false)
      setTimeout(() => {
        initialState.current = { enabled: mod?.enabled ?? false, config: { ...config, ...(mod?.config || {}) } }
      }, 0)
    }).catch(() => setLoading(false))
  }, [guildId])

  // ─── Dirty Detection ─────────────────────────────────────────────────
  useEffect(() => {
    if (!initialState.current) return
    const changed = enabled !== initialState.current.enabled ||
      JSON.stringify(config) !== JSON.stringify(initialState.current.config)
    setHasChanges(changed)
  }, [enabled, config])

  // ─── Save (PRESERVED) ────────────────────────────────────────────────
  const save = async () => {
    if (!guildId) return
    setSaving(true)
    await fetch('/api/security/modules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guild_id: guildId, module_id: 'phishing', enabled, config }) })
    setSaving(false)
    setHasChanges(false)
    initialState.current = { enabled, config: { ...config } }
    toast('Link Blocker settings saved', 'success')
  }

  const reset = () => {
    if (!initialState.current) return
    setEnabled(initialState.current.enabled)
    setConfig({ ...initialState.current.config })
  }

  // ─── Domain Management (PRESERVED) ──────────────────────────────────
  const addDomain = () => {
    const d = newDomain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    if (d && !config.whitelisted_domains.includes(d)) {
      setConfig({ ...config, whitelisted_domains: [...config.whitelisted_domains, d] })
      setNewDomain('')
    }
  }

  const removeDomain = (d: string) => {
    setConfig({ ...config, whitelisted_domains: config.whitelisted_domains.filter(x => x !== d) })
  }

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
        icon={Link2}
        iconColor="bg-blue-500/[0.08] text-blue-400"
        title="Link Blocker"
        description="Block all links except whitelisted domains."
        badge={
          enabled ? (
            <span className="status-active"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Active</span>
          ) : (
            <span className="status-inactive">Disabled</span>
          )
        }
        actions={<Toggle checked={enabled} onChange={setEnabled} />}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={Link2}
          iconColor="bg-blue-500/[0.06] text-blue-400"
          value="42"
          label="Links Blocked"
          sub="this week"
        />
        <StatCard
          icon={Globe}
          iconColor="bg-emerald-500/[0.06] text-emerald-400"
          value={String(config.whitelisted_domains.length + BUILTIN_DOMAINS.length)}
          label="Domains Allowed"
          sub={`${config.whitelisted_domains.length} custom`}
        />
        <StatCard
          icon={Shield}
          iconColor="bg-purple-500/[0.06] text-purple-400"
          value="0"
          label="False Positives"
          sub="this month"
        />
      </div>

      {/* Settings */}
      <SettingCard
        icon={Link2}
        iconColor="bg-blue-500/[0.06] text-blue-400"
        title="Link Blocking Rules"
        description="Configure which links to block"
      >
        <SettingRow label="Block All Links" description="Block every link except domains in the whitelist.">
          <Toggle checked={config.block_all_links} onChange={v => setConfig({ ...config, block_all_links: v })} />
        </SettingRow>
        <SettingRow label="Block Invite Links" description="Block discord.gg and discord.com/invite links.">
          <Toggle checked={config.block_invites} onChange={v => setConfig({ ...config, block_invites: v })} />
        </SettingRow>
        <SettingRow label="Warn in Channel" description="Send a warning message that auto-deletes after 5 seconds.">
          <Toggle checked={config.warn_in_channel} onChange={v => setConfig({ ...config, warn_in_channel: v })} />
        </SettingRow>
        <SettingRow label="Response Action" description="What happens when a blocked link is posted.">
          <SegmentedControl
            options={[
              { value: 'delete', label: 'Delete' },
              { value: 'timeout', label: 'Timeout' },
              { value: 'kick', label: 'Kick' },
              { value: 'ban', label: 'Ban' },
            ]}
            value={config.action}
            onChange={v => setConfig({ ...config, action: v })}
          />
        </SettingRow>
        {config.action === 'timeout' && (
          <SettingRow label="Timeout Duration" description="How long to timeout the user.">
            <NumberStepper value={config.timeout_minutes} onChange={v => setConfig({ ...config, timeout_minutes: v })} min={1} max={1440} suffix="m" />
          </SettingRow>
        )}
      </SettingCard>

      {/* Domain Management */}
      <div className="dash-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-emerald-500/[0.06] text-emerald-400">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-white/90">Domain Whitelist</h3>
              <p className="text-micro text-white/25 mt-0.5">These domains are always allowed through the filter</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Add Domain */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
              <input
                value={newDomain}
                onChange={e => setNewDomain(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addDomain()}
                placeholder="Add domain (e.g. tiktok.com)"
                className="dash-input pl-9"
              />
            </div>
            <button
              onClick={addDomain}
              disabled={!newDomain.trim()}
              className="flex items-center gap-1.5 px-4 h-[42px] rounded-lg bg-white/[0.04] border border-white/[0.06] text-caption font-medium text-white/40 hover:text-white/70 hover:border-white/[0.1] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>

          {/* Custom Domains */}
          {config.whitelisted_domains.length > 0 ? (
            <div className="space-y-1.5">
              <p className="text-micro text-white/25 font-medium">Custom domains ({config.whitelisted_domains.length})</p>
              <div className="space-y-1">
                {config.whitelisted_domains.map(d => (
                  <div key={d} className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] group hover:border-white/[0.08] transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/60" />
                      <span className="text-body-sm text-white/60 font-mono">{d}</span>
                    </div>
                    <button
                      onClick={() => removeDomain(d)}
                      className="p-1 rounded text-white/15 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-caption text-white/15 py-2">No custom domains added yet.</p>
          )}

          {/* Built-in Domains (Collapsible) */}
          <div className="pt-4 border-t border-white/[0.03]">
            <button
              onClick={() => setShowBuiltIn(!showBuiltIn)}
              className="flex items-center gap-2 text-micro text-white/25 hover:text-white/40 transition-colors font-medium"
            >
              <ChevronDown className={`h-3 w-3 transition-transform ${showBuiltIn ? 'rotate-180' : ''}`} />
              Trusted by Wembo ({BUILTIN_DOMAINS.length} domains)
            </button>
            {showBuiltIn && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-1.5 animate-fade-in">
                {BUILTIN_DOMAINS.map(d => (
                  <div key={d} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.015]">
                    <span className="h-1 w-1 rounded-full bg-white/10" />
                    <span className="text-[11px] text-white/20 font-mono">{d}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Bar */}
      <SaveBar show={hasChanges} saving={saving} onSave={save} onReset={reset} />
    </div>
  )
}
