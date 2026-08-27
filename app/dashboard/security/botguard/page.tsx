'use client'

import { useState, useEffect, useRef } from 'react'
import { Bot, Loader2, Shield, Plus, X, Check, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/components/dashboard/dashboard-shell'
import { PageHeader, SettingCard, SettingRow, Toggle, SegmentedControl, SaveBar, useToast } from '@/components/dashboard/ui'

export default function BotGuardPage() {
  const { guilds, selectedGuild } = useAuth()
  const guildId = selectedGuild || guilds[0]?.id || null
  const { toast } = useToast()

  const [enabled, setEnabled] = useState(false)
  const [config, setConfig] = useState({
    action: 'kick',
    notify_on_add: true,
    quarantine_unverified: true,
    auto_kick_unverified: false,
    require_verification: true,
    log_bot_actions: true,
    whitelisted_bots: [] as string[],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [newBotId, setNewBotId] = useState('')
  const initialState = useRef<{ enabled: boolean; config: typeof config } | null>(null)

  // ─── Data Fetching ───────────────────────────────────────────────────
  useEffect(() => {
    if (!guildId) { setLoading(false); return }
    fetch(`/api/security/modules?guild_id=${guildId}`).then(r => r.json()).then(data => {
      const mod = (data.modules || []).find((m: any) => m.module_id === 'botguard')
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

  // ─── Save ────────────────────────────────────────────────────────────
  const save = async () => {
    if (!guildId) return
    setSaving(true)
    await fetch('/api/security/modules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guild_id: guildId, module_id: 'botguard', enabled, config }) })
    setSaving(false)
    setHasChanges(false)
    initialState.current = { enabled, config: { ...config } }
    toast('Bot Guard settings saved', 'success')
  }

  const reset = () => {
    if (!initialState.current) return
    setEnabled(initialState.current.enabled)
    setConfig({ ...initialState.current.config })
  }

  // ─── Bot Whitelist Management ────────────────────────────────────────
  const addBot = () => {
    const id = newBotId.trim()
    if (id && !config.whitelisted_bots.includes(id)) {
      setConfig({ ...config, whitelisted_bots: [...config.whitelisted_bots, id] })
      setNewBotId('')
    }
  }

  const removeBot = (id: string) => {
    setConfig({ ...config, whitelisted_bots: config.whitelisted_bots.filter(b => b !== id) })
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
        icon={Bot}
        iconColor="bg-emerald-500/[0.08] text-emerald-400"
        title="Bot Guard"
        description="Detect unauthorized bots and manage bot access to your server."
        badge={
          enabled ? (
            <span className="status-active"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Active</span>
          ) : (
            <span className="status-inactive">Disabled</span>
          )
        }
        actions={<Toggle checked={enabled} onChange={setEnabled} />}
      />

      {/* Status Card */}
      <div className="dash-card p-5">
        <div className="flex items-center gap-4">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${enabled ? 'bg-emerald-500/[0.08] text-emerald-400' : 'bg-white/[0.03] text-white/20'}`}>
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-body-sm font-medium text-white/70">
              {enabled ? 'Bot Guard Active — monitoring for unauthorized bot additions' : 'Bot Guard is disabled'}
            </p>
            <p className="text-micro text-white/25 mt-0.5">
              {enabled ? `${config.whitelisted_bots.length} bot${config.whitelisted_bots.length !== 1 ? 's' : ''} whitelisted • Unverified bots will be ${config.action === 'kick' ? 'kicked' : config.action === 'quarantine' ? 'quarantined' : 'banned'}` : 'Enable to protect against unauthorized bot additions'}
            </p>
          </div>
        </div>
      </div>

      {/* Detection Settings */}
      <SettingCard
        icon={AlertTriangle}
        iconColor="bg-orange-500/[0.06] text-orange-400"
        title="Detection"
        description="How Bot Guard identifies unauthorized bots"
      >
        <SettingRow label="Require Verification" description="All bots must be whitelisted before being allowed to stay.">
          <Toggle checked={config.require_verification} onChange={v => setConfig({ ...config, require_verification: v })} />
        </SettingRow>
        <SettingRow label="Quarantine Unverified" description="Restrict unverified bots to no permissions until reviewed.">
          <Toggle checked={config.quarantine_unverified} onChange={v => setConfig({ ...config, quarantine_unverified: v })} />
        </SettingRow>
        <SettingRow label="Auto-Kick Unverified" description="Automatically kick bots that aren't on the whitelist.">
          <Toggle checked={config.auto_kick_unverified} onChange={v => setConfig({ ...config, auto_kick_unverified: v })} />
        </SettingRow>
        <SettingRow label="Notify on Bot Add" description="Send a notification when any bot is added to the server.">
          <Toggle checked={config.notify_on_add} onChange={v => setConfig({ ...config, notify_on_add: v })} />
        </SettingRow>
        <SettingRow label="Log Bot Actions" description="Log bot permission usage and suspicious behavior.">
          <Toggle checked={config.log_bot_actions} onChange={v => setConfig({ ...config, log_bot_actions: v })} />
        </SettingRow>
      </SettingCard>

      {/* Response */}
      <SettingCard
        icon={Bot}
        iconColor="bg-red-500/[0.06] text-red-400"
        title="Response"
        description="Action to take on unauthorized bots"
      >
        <SettingRow label="Action" description="What happens when an unverified bot is detected.">
          <SegmentedControl
            options={[
              { value: 'quarantine', label: 'Quarantine' },
              { value: 'kick', label: 'Kick' },
              { value: 'ban', label: 'Ban' },
            ]}
            value={config.action}
            onChange={v => setConfig({ ...config, action: v })}
          />
        </SettingRow>
      </SettingCard>

      {/* Whitelisted Bots */}
      <div className="dash-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-emerald-500/[0.06] text-emerald-400">
              <Check className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-white/90">Whitelisted Bots</h3>
              <p className="text-micro text-white/25 mt-0.5">These bots are authorized and won&apos;t be removed</p>
            </div>
          </div>
          <span className="text-caption text-white/20">{config.whitelisted_bots.length} bot{config.whitelisted_bots.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="p-6 space-y-5">
          {/* Add Bot */}
          <div className="flex gap-2">
            <input
              value={newBotId}
              onChange={e => setNewBotId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addBot()}
              placeholder="Bot ID or name (e.g. 123456789012345678)"
              className="dash-input flex-1 font-mono"
            />
            <button
              onClick={addBot}
              disabled={!newBotId.trim()}
              className="flex items-center gap-1.5 px-4 h-[42px] rounded-lg bg-white/[0.04] border border-white/[0.06] text-caption font-medium text-white/40 hover:text-white/70 hover:border-white/[0.1] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="h-3.5 w-3.5" /> Whitelist
            </button>
          </div>

          {/* Bot List */}
          {config.whitelisted_bots.length > 0 ? (
            <div className="space-y-1.5">
              {config.whitelisted_bots.map(botId => (
                <div key={botId} className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/[0.02] border border-white/[0.04] group hover:border-white/[0.08] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Bot className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-body-sm font-mono text-white/60">{botId}</p>
                      <p className="text-micro text-white/20">Whitelisted</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeBot(botId)}
                    className="p-1.5 rounded-md text-white/15 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <Bot className="h-6 w-6 text-white/10 mx-auto mb-2" />
              <p className="text-caption text-white/20">No bots whitelisted yet.</p>
              <p className="text-micro text-white/12 mt-0.5">Add bot IDs to allow them in your server.</p>
            </div>
          )}
        </div>
      </div>

      {/* Save Bar */}
      <SaveBar show={hasChanges} saving={saving} onSave={save} onReset={reset} />
    </div>
  )
}
