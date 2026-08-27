'use client'

import { useState, useEffect, useRef } from 'react'
import { Zap, Loader2, Shield, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/dashboard/dashboard-shell'
import { PageHeader, SettingCard, SettingRow, NumberStepper, Toggle, SegmentedControl, SaveBar, ProtectionStrength, useToast } from '@/components/dashboard/ui'

export default function AntiRaidPage() {
  const { guilds, selectedGuild } = useAuth()
  const guildId = selectedGuild || guilds[0]?.id || null
  const { toast } = useToast()

  const [enabled, setEnabled] = useState(false)
  const [config, setConfig] = useState({
    join_threshold: 10,
    time_window_seconds: 10,
    action: 'kick',
    min_account_age_hours: 24,
    notify_channel: true,
    auto_lockdown_threshold: 20,
    auto_lockdown_enabled: false,
    whitelist_verified_email: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const initialState = useRef<{ enabled: boolean; config: typeof config } | null>(null)

  // ─── Data Fetching (PRESERVED) ───────────────────────────────────────
  useEffect(() => {
    if (!guildId) { setLoading(false); return }
    fetch(`/api/security/modules?guild_id=${guildId}`).then(r => r.json()).then(data => {
      const mod = (data.modules || []).find((m: any) => m.module_id === 'antiraid')
      if (mod) { setEnabled(mod.enabled); setConfig(c => ({ ...c, ...mod.config })) }
      setLoading(false)
      // Capture initial state for dirty detection
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
    await fetch('/api/security/modules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guild_id: guildId, module_id: 'antiraid', enabled, config }) })
    setSaving(false)
    setHasChanges(false)
    initialState.current = { enabled, config: { ...config } }
    toast('Anti-Raid settings saved', 'success')
  }

  const reset = () => {
    if (!initialState.current) return
    setEnabled(initialState.current.enabled)
    setConfig({ ...initialState.current.config })
  }

  // ─── Loading ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-5 w-5 text-[#FFD600] animate-spin" />
      </div>
    )
  }

  // ─── Protection Strength Calculation ─────────────────────────────────
  const strengthScore = Math.min(100, Math.max(0,
    (config.join_threshold <= 5 ? 30 : config.join_threshold <= 10 ? 20 : 10) +
    (config.time_window_seconds <= 10 ? 20 : 10) +
    (config.min_account_age_hours >= 24 ? 20 : config.min_account_age_hours >= 12 ? 15 : 5) +
    (config.whitelist_verified_email ? 0 : 10) +
    (config.auto_lockdown_enabled ? 15 : 0) +
    (config.action === 'ban' ? 15 : config.action === 'lockdown' ? 20 : 10)
  ))

  return (
    <div className="p-6 lg:p-8 dash-content space-y-8 animate-fade-in">

      {/* Header */}
      <PageHeader
        icon={Zap}
        iconColor="bg-[#FFD600]/[0.08] text-[#FFD600]"
        title="Anti-Raid"
        description="Detect and stop coordinated join attacks."
        badge={
          enabled ? (
            <span className="status-active"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Active</span>
          ) : (
            <span className="status-inactive">Disabled</span>
          )
        }
        actions={
          <Toggle checked={enabled} onChange={setEnabled} />
        }
      />

      {/* Status Card */}
      <div className="dash-card p-5">
        <div className="flex items-center gap-4">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${enabled ? 'bg-emerald-500/[0.08] text-emerald-400' : 'bg-white/[0.03] text-white/20'}`}>
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-body-sm font-medium text-white/70">
              {enabled ? 'Protection Status: Monitoring' : 'Protection Disabled'}
            </p>
            <p className="text-micro text-white/25 mt-0.5">
              {enabled ? '0 raids detected this week • Last incident: 3 days ago' : 'Enable Anti-Raid to start monitoring join patterns'}
            </p>
          </div>
        </div>
      </div>

      {/* Detection Rules */}
      <SettingCard
        icon={AlertTriangle}
        iconColor="bg-orange-500/[0.06] text-orange-400"
        title="Detection Rules"
        description="Configure when Anti-Raid should trigger"
      >
        <SettingRow label="Join Threshold" description="Number of joins within the time window to trigger detection.">
          <NumberStepper value={config.join_threshold} onChange={v => setConfig({ ...config, join_threshold: v })} min={3} max={50} />
        </SettingRow>
        <SettingRow label="Time Window" description="Time period in seconds to count joins within.">
          <NumberStepper value={config.time_window_seconds} onChange={v => setConfig({ ...config, time_window_seconds: v })} min={5} max={60} suffix="s" />
        </SettingRow>
        <SettingRow label="Minimum Account Age" description="Flag accounts created less than this many hours ago.">
          <NumberStepper value={config.min_account_age_hours} onChange={v => setConfig({ ...config, min_account_age_hours: v })} min={0} max={720} suffix="h" />
        </SettingRow>
        <SettingRow label="Verified Email Bypass" description="Skip detection for accounts with a verified email address.">
          <Toggle checked={config.whitelist_verified_email} onChange={v => setConfig({ ...config, whitelist_verified_email: v })} />
        </SettingRow>
      </SettingCard>

      {/* Response */}
      <SettingCard
        icon={Zap}
        iconColor="bg-[#FFD600]/[0.06] text-[#FFD600]"
        title="Response"
        description="What happens when a raid is detected"
      >
        <SettingRow label="Action" description="What to do with accounts flagged as raiding.">
          <SegmentedControl
            options={[
              { value: 'kick', label: 'Kick' },
              { value: 'ban', label: 'Ban' },
              { value: 'lockdown', label: 'Lockdown' },
            ]}
            value={config.action}
            onChange={v => setConfig({ ...config, action: v })}
          />
        </SettingRow>
        <SettingRow label="Auto-Lockdown" description="Automatically lock the server at a higher join threshold.">
          <Toggle checked={config.auto_lockdown_enabled} onChange={v => setConfig({ ...config, auto_lockdown_enabled: v })} />
        </SettingRow>
        {config.auto_lockdown_enabled && (
          <SettingRow label="Auto-Lockdown Threshold" description="Number of joins that triggers automatic lockdown.">
            <NumberStepper value={config.auto_lockdown_threshold} onChange={v => setConfig({ ...config, auto_lockdown_threshold: v })} min={10} max={100} />
          </SettingRow>
        )}
      </SettingCard>

      {/* Protection Strength */}
      <ProtectionStrength level={strengthScore} />

      {/* Rule Preview */}
      <div className="dash-card p-5">
        <p className="text-micro text-white/20 uppercase tracking-wider font-semibold mb-2">Current Rule</p>
        <p className="text-body-sm text-white/50 leading-relaxed">
          &ldquo;{config.join_threshold} accounts joining within {config.time_window_seconds} seconds will trigger Anti-Raid.
          Action: <span className="text-white/80 font-medium capitalize">{config.action}</span>.
          {config.min_account_age_hours > 0 && ` Accounts younger than ${config.min_account_age_hours}h are flagged.`}
          {config.auto_lockdown_enabled && ` Auto-lockdown at ${config.auto_lockdown_threshold} joins.`}&rdquo;
        </p>
      </div>

      {/* Save Bar */}
      <SaveBar show={hasChanges} saving={saving} onSave={save} onReset={reset} />
    </div>
  )
}
