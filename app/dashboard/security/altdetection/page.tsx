'use client'

import { useState, useEffect, useRef } from 'react'
import { UserMinus, Loader2, Shield, Clock, AlertTriangle, UserX, Mail, CalendarDays } from 'lucide-react'
import { useAuth } from '@/components/dashboard/dashboard-shell'
import { PageHeader, StatCard, SettingCard, SettingRow, NumberStepper, Toggle, SegmentedControl, Slider, SaveBar, ProtectionStrength, useToast } from '@/components/dashboard/ui'

export default function AltDetectionPage() {
  const { guilds, selectedGuild } = useAuth()
  const guildId = selectedGuild || guilds[0]?.id || null
  const { toast } = useToast()

  const [enabled, setEnabled] = useState(false)
  const [config, setConfig] = useState({
    // Account age thresholds
    min_account_age_days: 7,
    suspicious_age_days: 30,
    // Actions
    action_new_account: 'flag',       // flag / kick / ban / quarantine
    action_suspicious: 'flag',         // flag / notify / quarantine
    // Detection criteria
    check_no_avatar: true,
    check_no_banner: true,
    check_default_username: true,
    check_no_mutual_servers: true,
    check_join_velocity: true,
    // Join velocity
    join_velocity_threshold: 3,        // X accounts from same IP/pattern
    join_velocity_window: 60,          // seconds
    // Bypass
    bypass_verified_email: false,
    bypass_phone_verified: true,
    bypass_nitro: true,
    bypass_roles: [] as string[],
    // Quarantine
    quarantine_role_id: '',
    quarantine_duration_hours: 24,
    // Notifications
    notify_on_flag: true,
    notify_on_action: true,
    dm_on_kick: true,
    dm_message: 'Your account was flagged as a potential alt. If this is a mistake, please contact a moderator.',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const initialState = useRef<{ enabled: boolean; config: typeof config } | null>(null)

  // ─── Data Fetching ───────────────────────────────────────────────────
  useEffect(() => {
    if (!guildId) { setLoading(false); return }
    fetch(`/api/security/modules?guild_id=${guildId}`).then(r => r.json()).then(data => {
      const mod = (data.modules || []).find((m: any) => m.module_id === 'altdetection')
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
    await fetch('/api/security/modules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guild_id: guildId, module_id: 'altdetection', enabled, config }) })
    setSaving(false)
    setHasChanges(false)
    initialState.current = { enabled, config: { ...config } }
    toast('Alt Detection settings saved', 'success')
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

  // Protection strength calculation
  const strengthScore = Math.min(100,
    (config.min_account_age_days >= 7 ? 20 : config.min_account_age_days >= 3 ? 12 : 5) +
    (config.action_new_account === 'ban' ? 20 : config.action_new_account === 'kick' ? 15 : config.action_new_account === 'quarantine' ? 12 : 5) +
    (config.check_no_avatar ? 10 : 0) +
    (config.check_default_username ? 10 : 0) +
    (config.check_join_velocity ? 15 : 0) +
    (config.check_no_mutual_servers ? 10 : 0) +
    (!config.bypass_verified_email ? 10 : 0) +
    (config.notify_on_action ? 5 : 0)
  )

  return (
    <div className="p-6 lg:p-8 dash-content space-y-8 animate-fade-in">

      {/* Header */}
      <PageHeader
        icon={UserMinus}
        iconColor="bg-amber-500/[0.08] text-amber-400"
        title="Alt Detection"
        description="Detect and take action on alt accounts and suspiciously new accounts."
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={UserMinus}
          iconColor="bg-amber-500/[0.06] text-amber-400"
          value="0"
          label="Alts Detected"
          sub="this week"
        />
        <StatCard
          icon={AlertTriangle}
          iconColor="bg-red-500/[0.06] text-red-400"
          value="0"
          label="Actions Taken"
          sub="this week"
        />
        <StatCard
          icon={Clock}
          iconColor="bg-blue-500/[0.06] text-blue-400"
          value={`${config.min_account_age_days}d`}
          label="Min Account Age"
          sub="threshold"
        />
        <StatCard
          icon={Shield}
          iconColor="bg-emerald-500/[0.06] text-emerald-400"
          value={`${strengthScore}%`}
          label="Protection"
          sub={strengthScore >= 80 ? 'Strong' : strengthScore >= 50 ? 'Moderate' : 'Weak'}
        />
      </div>

      {/* Status Card */}
      <div className="dash-card p-5">
        <div className="flex items-center gap-4">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${enabled ? 'bg-emerald-500/[0.08] text-emerald-400' : 'bg-white/[0.03] text-white/20'}`}>
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-body-sm font-medium text-white/70">
              {enabled ? 'Monitoring all new joins for alt account indicators' : 'Alt Detection is disabled'}
            </p>
            <p className="text-micro text-white/25 mt-0.5">
              {enabled ? `Accounts under ${config.min_account_age_days} days old will be actioned • Suspicious under ${config.suspicious_age_days} days flagged` : 'Enable to start detecting alt accounts'}
            </p>
          </div>
        </div>
      </div>

      {/* Account Age Thresholds */}
      <SettingCard
        icon={CalendarDays}
        iconColor="bg-amber-500/[0.06] text-amber-400"
        title="Account Age Thresholds"
        description="Define what counts as a new or suspicious account"
      >
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-body-sm font-medium text-white/70">Minimum Account Age</p>
                <p className="text-micro text-white/25 mt-0.5">Accounts younger than this are considered new and will trigger the primary action.</p>
              </div>
              <span className="text-[15px] font-bold text-white tabular-nums">{config.min_account_age_days}d</span>
            </div>
            <Slider
              value={config.min_account_age_days}
              onChange={v => setConfig({ ...config, min_account_age_days: v })}
              min={1}
              max={90}
              step={1}
              showValue={false}
              suffix="d"
              labels={{ left: '1 day', right: '90 days' }}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-body-sm font-medium text-white/70">Suspicious Account Age</p>
                <p className="text-micro text-white/25 mt-0.5">Accounts between min age and this value are considered suspicious (lighter action).</p>
              </div>
              <span className="text-[15px] font-bold text-white tabular-nums">{config.suspicious_age_days}d</span>
            </div>
            <Slider
              value={config.suspicious_age_days}
              onChange={v => setConfig({ ...config, suspicious_age_days: v })}
              min={config.min_account_age_days + 1}
              max={180}
              step={1}
              showValue={false}
              suffix="d"
              labels={{ left: `${config.min_account_age_days + 1} days`, right: '180 days' }}
            />
          </div>
        </div>
      </SettingCard>

      {/* Actions */}
      <SettingCard
        icon={UserX}
        iconColor="bg-red-500/[0.06] text-red-400"
        title="Actions"
        description="What to do when an alt is detected"
      >
        <SettingRow label="New Account Action" description={`Accounts under ${config.min_account_age_days} days old.`}>
          <SegmentedControl
            options={[
              { value: 'flag', label: 'Flag' },
              { value: 'quarantine', label: 'Quarantine' },
              { value: 'kick', label: 'Kick' },
              { value: 'ban', label: 'Ban' },
            ]}
            value={config.action_new_account}
            onChange={v => setConfig({ ...config, action_new_account: v })}
          />
        </SettingRow>
        <SettingRow label="Suspicious Account Action" description={`Accounts ${config.min_account_age_days}–${config.suspicious_age_days} days old.`}>
          <SegmentedControl
            options={[
              { value: 'flag', label: 'Flag' },
              { value: 'notify', label: 'Notify' },
              { value: 'quarantine', label: 'Quarantine' },
            ]}
            value={config.action_suspicious}
            onChange={v => setConfig({ ...config, action_suspicious: v })}
          />
        </SettingRow>
        {(config.action_new_account === 'quarantine' || config.action_suspicious === 'quarantine') && (
          <>
            <SettingRow label="Quarantine Role ID" description="Role to assign to quarantined users (restricted permissions).">
              <input
                value={config.quarantine_role_id}
                onChange={e => setConfig({ ...config, quarantine_role_id: e.target.value })}
                placeholder="Role ID"
                className="dash-input w-48 font-mono"
              />
            </SettingRow>
            <SettingRow label="Quarantine Duration" description="How long to keep the quarantine role (0 = permanent until manual review).">
              <NumberStepper value={config.quarantine_duration_hours} onChange={v => setConfig({ ...config, quarantine_duration_hours: v })} min={0} max={720} suffix="h" />
            </SettingRow>
          </>
        )}
        {(config.action_new_account === 'kick' || config.action_new_account === 'ban') && (
          <SettingRow label="DM Before Action" description="Send a DM explaining why before kicking/banning.">
            <Toggle checked={config.dm_on_kick} onChange={v => setConfig({ ...config, dm_on_kick: v })} />
          </SettingRow>
        )}
        {config.dm_on_kick && (config.action_new_account === 'kick' || config.action_new_account === 'ban') && (
          <div className="px-0">
            <label className="text-caption text-white/40 block mb-1.5">DM Message</label>
            <textarea
              value={config.dm_message}
              onChange={e => setConfig({ ...config, dm_message: e.target.value })}
              rows={2}
              className="dash-input resize-none"
              placeholder="Your account was flagged as a potential alt..."
            />
          </div>
        )}
      </SettingCard>

      {/* Detection Signals */}
      <SettingCard
        icon={AlertTriangle}
        iconColor="bg-orange-500/[0.06] text-orange-400"
        title="Detection Signals"
        description="Additional indicators used to identify alts (combined with account age)"
      >
        <SettingRow label="No Avatar" description="Flag accounts with the default Discord avatar.">
          <Toggle checked={config.check_no_avatar} onChange={v => setConfig({ ...config, check_no_avatar: v })} />
        </SettingRow>
        <SettingRow label="No Banner" description="Flag accounts with no profile banner.">
          <Toggle checked={config.check_no_banner} onChange={v => setConfig({ ...config, check_no_banner: v })} />
        </SettingRow>
        <SettingRow label="Default Username" description="Flag accounts with auto-generated usernames (e.g. User1234).">
          <Toggle checked={config.check_default_username} onChange={v => setConfig({ ...config, check_default_username: v })} />
        </SettingRow>
        <SettingRow label="No Mutual Servers" description="Flag accounts sharing no other servers with existing members.">
          <Toggle checked={config.check_no_mutual_servers} onChange={v => setConfig({ ...config, check_no_mutual_servers: v })} />
        </SettingRow>
        <SettingRow label="Join Velocity" description="Detect multiple new accounts joining in a short window.">
          <Toggle checked={config.check_join_velocity} onChange={v => setConfig({ ...config, check_join_velocity: v })} />
        </SettingRow>
        {config.check_join_velocity && (
          <>
            <SettingRow label="Velocity Threshold" description="How many new accounts joining within the window to trigger.">
              <NumberStepper value={config.join_velocity_threshold} onChange={v => setConfig({ ...config, join_velocity_threshold: v })} min={2} max={20} />
            </SettingRow>
            <SettingRow label="Velocity Window" description="Time window in seconds to count joins.">
              <NumberStepper value={config.join_velocity_window} onChange={v => setConfig({ ...config, join_velocity_window: v })} min={10} max={300} suffix="s" />
            </SettingRow>
          </>
        )}
      </SettingCard>

      {/* Bypass Rules */}
      <SettingCard
        icon={Mail}
        iconColor="bg-emerald-500/[0.06] text-emerald-400"
        title="Bypass Rules"
        description="Accounts matching these criteria skip alt detection"
      >
        <SettingRow label="Verified Email" description="Skip accounts with a verified email address.">
          <Toggle checked={config.bypass_verified_email} onChange={v => setConfig({ ...config, bypass_verified_email: v })} />
        </SettingRow>
        <SettingRow label="Phone Verified" description="Skip accounts with a verified phone number.">
          <Toggle checked={config.bypass_phone_verified} onChange={v => setConfig({ ...config, bypass_phone_verified: v })} />
        </SettingRow>
        <SettingRow label="Nitro Subscriber" description="Skip accounts with an active Nitro subscription.">
          <Toggle checked={config.bypass_nitro} onChange={v => setConfig({ ...config, bypass_nitro: v })} />
        </SettingRow>
      </SettingCard>

      {/* Notifications */}
      <SettingCard
        icon={Shield}
        iconColor="bg-blue-500/[0.06] text-blue-400"
        title="Notifications"
        description="How you're notified about detected alts"
      >
        <SettingRow label="Notify on Flag" description="Send to the security log channel when an account is flagged.">
          <Toggle checked={config.notify_on_flag} onChange={v => setConfig({ ...config, notify_on_flag: v })} />
        </SettingRow>
        <SettingRow label="Notify on Action" description="Send to the security log channel when an action is taken.">
          <Toggle checked={config.notify_on_action} onChange={v => setConfig({ ...config, notify_on_action: v })} />
        </SettingRow>
      </SettingCard>

      {/* Protection Strength */}
      <ProtectionStrength level={strengthScore} />

      {/* Rule Preview */}
      <div className="dash-card p-5">
        <p className="text-micro text-white/20 uppercase tracking-wider font-semibold mb-2">Current Rule</p>
        <p className="text-body-sm text-white/50 leading-relaxed">
          &ldquo;Accounts under <span className="text-white/80 font-medium">{config.min_account_age_days} days</span> old will be <span className="text-white/80 font-medium capitalize">{config.action_new_account === 'flag' ? 'flagged' : config.action_new_account + 'ed'}</span>.
          Accounts {config.min_account_age_days}–{config.suspicious_age_days} days old will be <span className="text-white/80 font-medium capitalize">{config.action_suspicious === 'flag' ? 'flagged' : config.action_suspicious === 'notify' ? 'flagged with notification' : config.action_suspicious + 'ed'}</span>.
          {config.bypass_phone_verified && ' Phone-verified accounts bypass detection.'}
          {config.bypass_nitro && ' Nitro subscribers bypass detection.'}
          {config.check_join_velocity && ` ${config.join_velocity_threshold}+ new accounts joining within ${config.join_velocity_window}s triggers velocity alert.`}&rdquo;
        </p>
      </div>

      {/* Save Bar */}
      <SaveBar show={hasChanges} saving={saving} onSave={save} onReset={reset} />
    </div>
  )
}
