'use client'

import { useState, useEffect, useRef } from 'react'
import { Ban, Loader2, MessageSquare, Shield, Zap } from 'lucide-react'
import { useAuth } from '@/components/dashboard/dashboard-shell'
import { PageHeader, SettingCard, SettingRow, NumberStepper, Toggle, SegmentedControl, SaveBar, useToast } from '@/components/dashboard/ui'

export default function AntiSpamPage() {
  const { guilds, selectedGuild } = useAuth()
  const guildId = selectedGuild || guilds[0]?.id || null
  const { toast } = useToast()

  const [enabled, setEnabled] = useState(false)
  const [config, setConfig] = useState({
    message_limit: 5,
    time_window_seconds: 3,
    duplicate_limit: 3,
    action: 'delete',
    mute_duration_minutes: 10,
    mentions_limit: 5,
    emoji_spam_limit: 10,
    caps_percentage: 80,
    delete_on_mute: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const initialState = useRef<{ enabled: boolean; config: typeof config } | null>(null)

  // ─── Data Fetching (PRESERVED) ───────────────────────────────────────
  useEffect(() => {
    if (!guildId) { setLoading(false); return }
    fetch(`/api/security/modules?guild_id=${guildId}`).then(r => r.json()).then(data => {
      const mod = (data.modules || []).find((m: any) => m.module_id === 'antispam')
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
    await fetch('/api/security/modules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guild_id: guildId, module_id: 'antispam', enabled, config }) })
    setSaving(false)
    setHasChanges(false)
    initialState.current = { enabled, config: { ...config } }
    toast('Anti-Spam settings saved', 'success')
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

  return (
    <div className="p-6 lg:p-8 dash-content space-y-8 animate-fade-in">

      {/* Header */}
      <PageHeader
        icon={Ban}
        iconColor="bg-red-500/[0.08] text-red-400"
        title="Anti-Spam"
        description="Detect rapid messaging, floods, and duplicates."
        badge={
          enabled ? (
            <span className="status-active"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Active</span>
          ) : (
            <span className="status-inactive">Disabled</span>
          )
        }
        actions={<Toggle checked={enabled} onChange={setEnabled} />}
      />

      {/* Status */}
      <div className="dash-card p-5">
        <div className="flex items-center gap-4">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${enabled ? 'bg-emerald-500/[0.08] text-emerald-400' : 'bg-white/[0.03] text-white/20'}`}>
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-body-sm font-medium text-white/70">
              {enabled ? '128 spam messages stopped this week' : 'Anti-Spam is disabled'}
            </p>
            <p className="text-micro text-white/25 mt-0.5">
              {enabled ? 'Monitoring all text channels' : 'Enable to start protecting against spam'}
            </p>
          </div>
        </div>
      </div>

      {/* Rate Limiting */}
      <SettingCard
        icon={MessageSquare}
        iconColor="bg-blue-500/[0.06] text-blue-400"
        title="Rate Limiting"
        description="Control message frequency thresholds"
      >
        <SettingRow label="Message Limit" description="Maximum messages before triggering.">
          <NumberStepper value={config.message_limit} onChange={v => setConfig({ ...config, message_limit: v })} min={3} max={20} />
        </SettingRow>
        <SettingRow label="Time Window" description="Seconds to count messages within.">
          <NumberStepper value={config.time_window_seconds} onChange={v => setConfig({ ...config, time_window_seconds: v })} min={1} max={30} suffix="s" />
        </SettingRow>
        <SettingRow label="Duplicate Limit" description="Same message repeated X times triggers.">
          <NumberStepper value={config.duplicate_limit} onChange={v => setConfig({ ...config, duplicate_limit: v })} min={2} max={10} />
        </SettingRow>
      </SettingCard>

      {/* Advanced Detection */}
      <SettingCard
        icon={Zap}
        iconColor="bg-orange-500/[0.06] text-orange-400"
        title="Advanced Detection"
        description="Additional spam indicators"
      >
        <SettingRow label="Mention Limit" description="Maximum mentions in a single message.">
          <NumberStepper value={config.mentions_limit} onChange={v => setConfig({ ...config, mentions_limit: v })} min={3} max={30} />
        </SettingRow>
        <SettingRow label="Emoji Limit" description="Maximum emojis in a single message.">
          <NumberStepper value={config.emoji_spam_limit} onChange={v => setConfig({ ...config, emoji_spam_limit: v })} min={5} max={50} />
        </SettingRow>
        <SettingRow label="Caps Threshold" description="Percentage of CAPS to flag as shouting.">
          <NumberStepper value={config.caps_percentage} onChange={v => setConfig({ ...config, caps_percentage: v })} min={50} max={100} suffix="%" />
        </SettingRow>
      </SettingCard>

      {/* Response */}
      <SettingCard
        icon={Ban}
        iconColor="bg-red-500/[0.06] text-red-400"
        title="Response"
        description="What happens when spam is detected"
      >
        <SettingRow label="Action" description="Primary response to spam detection.">
          <SegmentedControl
            options={[
              { value: 'delete', label: 'Delete' },
              { value: 'mute', label: 'Mute' },
              { value: 'kick', label: 'Kick' },
              { value: 'ban', label: 'Ban' },
            ]}
            value={config.action}
            onChange={v => setConfig({ ...config, action: v })}
          />
        </SettingRow>
        {config.action === 'mute' && (
          <SettingRow label="Mute Duration" description="How long to mute the user.">
            <NumberStepper value={config.mute_duration_minutes} onChange={v => setConfig({ ...config, mute_duration_minutes: v })} min={1} max={1440} suffix="m" />
          </SettingRow>
        )}
        {(config.action === 'mute' || config.action === 'kick' || config.action === 'ban') && (
          <SettingRow label="Delete Messages" description="Also delete the spam messages.">
            <Toggle checked={config.delete_on_mute} onChange={v => setConfig({ ...config, delete_on_mute: v })} />
          </SettingRow>
        )}
      </SettingCard>

      {/* Rule Preview */}
      <div className="dash-card p-5">
        <p className="text-micro text-white/20 uppercase tracking-wider font-semibold mb-2">Current Rule</p>
        <p className="text-body-sm text-white/50 leading-relaxed">
          &ldquo;{config.message_limit} messages within {config.time_window_seconds} second{config.time_window_seconds !== 1 ? 's' : ''} will trigger Anti-Spam.
          Action: <span className="text-white/80 font-medium capitalize">{config.action}</span>.
          {config.action === 'mute' && ` Mute for ${config.mute_duration_minutes} minute${config.mute_duration_minutes !== 1 ? 's' : ''}.`}
          {config.delete_on_mute && config.action !== 'delete' && ' Messages will be deleted.'}
          Duplicates flagged at {config.duplicate_limit}x repeats.&rdquo;
        </p>
      </div>

      {/* Save Bar */}
      <SaveBar show={hasChanges} saving={saving} onSave={save} onReset={reset} />
    </div>
  )
}
