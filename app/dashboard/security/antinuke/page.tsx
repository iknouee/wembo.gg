'use client'

import { useState, useEffect, useRef } from 'react'
import { Bomb, Loader2, Shield, Trash2, Users, Key, Webhook } from 'lucide-react'
import { useAuth } from '@/components/dashboard/dashboard-shell'
import { PageHeader, SettingCard, SettingRow, NumberStepper, Toggle, SegmentedControl, SaveBar, ProtectionStrength, useToast } from '@/components/dashboard/ui'

export default function AntiNukePage() {
  const { guilds, selectedGuild } = useAuth()
  const guildId = selectedGuild || guilds[0]?.id || null
  const { toast } = useToast()

  const [enabled, setEnabled] = useState(false)
  const [config, setConfig] = useState({
    max_channel_deletes: 3,
    max_role_deletes: 3,
    max_bans: 5,
    max_kicks: 5,
    time_window_seconds: 60,
    action: 'strip_roles',
    monitor_permission_changes: true,
    monitor_webhook_creation: true,
    monitor_channel_deletes: true,
    monitor_role_deletes: true,
    monitor_mass_bans: true,
    monitor_mass_kicks: true,
    whitelist_owner: true,
    whitelisted_roles: [] as string[],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const initialState = useRef<{ enabled: boolean; config: typeof config } | null>(null)

  // ─── Data Fetching ───────────────────────────────────────────────────
  useEffect(() => {
    if (!guildId) { setLoading(false); return }
    fetch(`/api/security/modules?guild_id=${guildId}`).then(r => r.json()).then(data => {
      const mod = (data.modules || []).find((m: any) => m.module_id === 'antinuke')
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
    await fetch('/api/security/modules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guild_id: guildId, module_id: 'antinuke', enabled, config }) })
    setSaving(false)
    setHasChanges(false)
    initialState.current = { enabled, config: { ...config } }
    toast('Anti-Nuke settings saved', 'success')
  }

  const reset = () => {
    if (!initialState.current) return
    setEnabled(initialState.current.enabled)
    setConfig({ ...initialState.current.config })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-5 w-5 text-[#FFD600] animate-spin" />
      </div>
    )
  }

  // ─── Protection Strength ─────────────────────────────────────────────
  const monitorCount = [config.monitor_channel_deletes, config.monitor_role_deletes, config.monitor_mass_bans, config.monitor_mass_kicks, config.monitor_permission_changes, config.monitor_webhook_creation].filter(Boolean).length
  const strengthScore = Math.min(100, (monitorCount * 12) + (config.action === 'ban' ? 20 : config.action === 'strip_roles' ? 15 : 8) + (config.time_window_seconds <= 30 ? 10 : 5))

  return (
    <div className="p-6 lg:p-8 dash-content space-y-8 animate-fade-in">

      {/* Header */}
      <PageHeader
        icon={Bomb}
        iconColor="bg-orange-500/[0.08] text-orange-400"
        title="Anti-Nuke"
        description="Protect against mass channel/role deletions, mass bans, and dangerous permission changes."
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
              {enabled ? 'Protection Status: Monitoring all audit log actions' : 'Protection Disabled'}
            </p>
            <p className="text-micro text-white/25 mt-0.5">
              {enabled ? `Watching ${monitorCount} action types • ${config.time_window_seconds}s detection window` : 'Enable Anti-Nuke to start monitoring destructive actions'}
            </p>
          </div>
        </div>
      </div>

      {/* Monitored Actions */}
      <SettingCard
        icon={Shield}
        iconColor="bg-orange-500/[0.06] text-orange-400"
        title="Monitored Actions"
        description="What destructive actions to watch for"
      >
        <SettingRow label="Channel Deletions" description="Detect mass channel deletion attempts.">
          <Toggle checked={config.monitor_channel_deletes} onChange={v => setConfig({ ...config, monitor_channel_deletes: v })} />
        </SettingRow>
        <SettingRow label="Role Deletions" description="Detect mass role deletion attempts.">
          <Toggle checked={config.monitor_role_deletes} onChange={v => setConfig({ ...config, monitor_role_deletes: v })} />
        </SettingRow>
        <SettingRow label="Mass Bans" description="Detect rapid mass banning of members.">
          <Toggle checked={config.monitor_mass_bans} onChange={v => setConfig({ ...config, monitor_mass_bans: v })} />
        </SettingRow>
        <SettingRow label="Mass Kicks" description="Detect rapid mass kicking of members.">
          <Toggle checked={config.monitor_mass_kicks} onChange={v => setConfig({ ...config, monitor_mass_kicks: v })} />
        </SettingRow>
        <SettingRow label="Permission Changes" description="Detect dangerous permission escalation.">
          <Toggle checked={config.monitor_permission_changes} onChange={v => setConfig({ ...config, monitor_permission_changes: v })} />
        </SettingRow>
        <SettingRow label="Webhook Attacks" description="Detect mass webhook creation or abuse.">
          <Toggle checked={config.monitor_webhook_creation} onChange={v => setConfig({ ...config, monitor_webhook_creation: v })} />
        </SettingRow>
      </SettingCard>

      {/* Thresholds */}
      <SettingCard
        icon={Trash2}
        iconColor="bg-red-500/[0.06] text-red-400"
        title="Thresholds"
        description="How many actions before triggering protection"
      >
        <SettingRow label="Channel Deletes" description="Max channels deleted before trigger.">
          <NumberStepper value={config.max_channel_deletes} onChange={v => setConfig({ ...config, max_channel_deletes: v })} min={1} max={20} />
        </SettingRow>
        <SettingRow label="Role Deletes" description="Max roles deleted before trigger.">
          <NumberStepper value={config.max_role_deletes} onChange={v => setConfig({ ...config, max_role_deletes: v })} min={1} max={20} />
        </SettingRow>
        <SettingRow label="Mass Bans" description="Max bans before trigger.">
          <NumberStepper value={config.max_bans} onChange={v => setConfig({ ...config, max_bans: v })} min={2} max={30} />
        </SettingRow>
        <SettingRow label="Mass Kicks" description="Max kicks before trigger.">
          <NumberStepper value={config.max_kicks} onChange={v => setConfig({ ...config, max_kicks: v })} min={2} max={30} />
        </SettingRow>
        <SettingRow label="Time Window" description="Seconds to count actions within.">
          <NumberStepper value={config.time_window_seconds} onChange={v => setConfig({ ...config, time_window_seconds: v })} min={10} max={300} suffix="s" />
        </SettingRow>
      </SettingCard>

      {/* Response */}
      <SettingCard
        icon={Key}
        iconColor="bg-[#FFD600]/[0.06] text-[#FFD600]"
        title="Response"
        description="What happens when a nuke attempt is detected"
      >
        <SettingRow label="Action" description="How to stop the attacker.">
          <SegmentedControl
            options={[
              { value: 'strip_roles', label: 'Strip Roles' },
              { value: 'kick', label: 'Kick' },
              { value: 'ban', label: 'Ban' },
            ]}
            value={config.action}
            onChange={v => setConfig({ ...config, action: v })}
          />
        </SettingRow>
        <SettingRow label="Whitelist Server Owner" description="Never trigger on the server owner's actions.">
          <Toggle checked={config.whitelist_owner} onChange={v => setConfig({ ...config, whitelist_owner: v })} />
        </SettingRow>
      </SettingCard>

      {/* Protection Strength */}
      <ProtectionStrength level={strengthScore} />

      {/* Rule Preview */}
      <div className="dash-card p-5">
        <p className="text-micro text-white/20 uppercase tracking-wider font-semibold mb-2">Current Rule</p>
        <p className="text-body-sm text-white/50 leading-relaxed">
          &ldquo;If any user deletes {config.max_channel_deletes}+ channels, {config.max_role_deletes}+ roles, bans {config.max_bans}+ members, or kicks {config.max_kicks}+ members within {config.time_window_seconds} seconds, their roles will be stripped and the action logged.
          Response: <span className="text-white/80 font-medium capitalize">{config.action.replace('_', ' ')}</span>.&rdquo;
        </p>
      </div>

      {/* Save Bar */}
      <SaveBar show={hasChanges} saving={saving} onSave={save} onReset={reset} />
    </div>
  )
}
