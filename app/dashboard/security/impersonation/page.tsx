'use client'

import { useState, useEffect, useRef } from 'react'
import { UserX, Loader2, X, Plus, Shield, Eye, UserCheck, Clock } from 'lucide-react'
import { useAuth } from '@/components/dashboard/dashboard-shell'
import { PageHeader, StatCard, SettingCard, SettingRow, Toggle, SegmentedControl, NumberStepper, Slider, SaveBar, useToast } from '@/components/dashboard/ui'

export default function ImpersonationPage() {
  const { guilds, selectedGuild } = useAuth()
  const guildId = selectedGuild || guilds[0]?.id || null
  const { toast } = useToast()

  const [enabled, setEnabled] = useState(false)
  const [config, setConfig] = useState({
    similarity_threshold: 80,
    action: 'flag',
    check_avatars: true,
    check_nicknames: true,
    protected_names: [] as string[],
    auto_protect_staff: true,
    min_account_age_days: 7,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [newName, setNewName] = useState('')
  const initialState = useRef<{ enabled: boolean; config: typeof config } | null>(null)

  // ─── Data Fetching (PRESERVED) ───────────────────────────────────────
  useEffect(() => {
    if (!guildId) { setLoading(false); return }
    fetch(`/api/security/modules?guild_id=${guildId}`).then(r => r.json()).then(data => {
      const mod = (data.modules || []).find((m: any) => m.module_id === 'impersonation')
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
    await fetch('/api/security/modules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guild_id: guildId, module_id: 'impersonation', enabled, config }) })
    setSaving(false)
    setHasChanges(false)
    initialState.current = { enabled, config: { ...config } }
    toast('Impersonation Guard settings saved', 'success')
  }

  const reset = () => {
    if (!initialState.current) return
    setEnabled(initialState.current.enabled)
    setConfig({ ...initialState.current.config })
  }

  // ─── Name Management (PRESERVED) ────────────────────────────────────
  const addName = () => {
    const name = newName.trim().toLowerCase()
    if (name && !config.protected_names.includes(name)) {
      setConfig({ ...config, protected_names: [...config.protected_names, name] })
      setNewName('')
    }
  }

  const removeName = (name: string) => {
    setConfig({ ...config, protected_names: config.protected_names.filter(n => n !== name) })
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
        icon={UserX}
        iconColor="bg-purple-500/[0.08] text-purple-400"
        title="Impersonation Guard"
        description="Protect staff identities from copycats."
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
          icon={UserX}
          iconColor="bg-purple-500/[0.06] text-purple-400"
          value="3"
          label="Attempts Detected"
          sub="this month"
        />
        <StatCard
          icon={Shield}
          iconColor="bg-emerald-500/[0.06] text-emerald-400"
          value={String(config.protected_names.length + (config.auto_protect_staff ? 4 : 0))}
          label="Protected Identities"
          sub={config.auto_protect_staff ? 'incl. staff' : 'manual only'}
        />
        <StatCard
          icon={Eye}
          iconColor="bg-[#FFD600]/[0.06] text-[#FFD600]"
          value={`${config.similarity_threshold}%`}
          label="Similarity Threshold"
          sub={config.similarity_threshold >= 80 ? 'Strict' : config.similarity_threshold >= 60 ? 'Moderate' : 'Loose'}
        />
      </div>

      {/* Detection Sensitivity */}
      <SettingCard
        icon={Eye}
        iconColor="bg-purple-500/[0.06] text-purple-400"
        title="Detection Sensitivity"
        description="How closely a name must match to trigger detection"
      >
        <div className="space-y-4">
          <Slider
            value={config.similarity_threshold}
            onChange={v => setConfig({ ...config, similarity_threshold: v })}
            min={40}
            max={100}
            step={5}
            suffix="%"
            labels={{ left: 'Loose (more false positives)', right: 'Strict (fewer detections)' }}
          />
          <p className="text-caption text-white/25 leading-relaxed">
            At {config.similarity_threshold}%, a name must be at least {config.similarity_threshold}% similar to a protected name to trigger.
            {config.similarity_threshold <= 60 && ' This is very sensitive and may produce false positives.'}
            {config.similarity_threshold >= 90 && ' Only near-exact matches will be caught.'}
          </p>
        </div>
      </SettingCard>

      {/* Detection Methods */}
      <SettingCard
        icon={UserCheck}
        iconColor="bg-blue-500/[0.06] text-blue-400"
        title="Detection Methods"
        description="What to check for impersonation attempts"
      >
        <SettingRow label="Nickname Similarity" description="Check if nicknames are similar to protected names.">
          <Toggle checked={config.check_nicknames} onChange={v => setConfig({ ...config, check_nicknames: v })} />
        </SettingRow>
        <SettingRow label="Avatar Matching" description="Compare profile pictures against protected users.">
          <Toggle checked={config.check_avatars} onChange={v => setConfig({ ...config, check_avatars: v })} />
        </SettingRow>
        <SettingRow label="Auto-Protect Staff" description="Automatically protect names of admins and moderators.">
          <Toggle checked={config.auto_protect_staff} onChange={v => setConfig({ ...config, auto_protect_staff: v })} />
        </SettingRow>
        <SettingRow label="New Account Detection" description="Only flag accounts newer than this many days.">
          <NumberStepper value={config.min_account_age_days} onChange={v => setConfig({ ...config, min_account_age_days: v })} min={0} max={365} suffix="d" />
        </SettingRow>
      </SettingCard>

      {/* Response */}
      <SettingCard
        icon={UserX}
        iconColor="bg-red-500/[0.06] text-red-400"
        title="Response"
        description="Action when impersonation is detected"
      >
        <SettingRow label="Action" description="What to do with the impersonating user.">
          <SegmentedControl
            options={[
              { value: 'flag', label: 'Flag' },
              { value: 'rename', label: 'Reset Name' },
              { value: 'kick', label: 'Kick' },
              { value: 'ban', label: 'Ban' },
            ]}
            value={config.action}
            onChange={v => setConfig({ ...config, action: v })}
          />
        </SettingRow>
      </SettingCard>

      {/* Protected Identities */}
      <div className="dash-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-purple-500/[0.06] text-purple-400">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-white/90">Protected Identities</h3>
              <p className="text-micro text-white/25 mt-0.5">Anyone using a similar name will be flagged</p>
            </div>
          </div>
          <span className="text-caption text-white/20">{config.protected_names.length} custom</span>
        </div>

        <div className="p-6 space-y-5">
          {/* Add Name */}
          <div className="flex gap-2">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addName()}
              placeholder="Add a name to protect..."
              className="dash-input flex-1"
            />
            <button
              onClick={addName}
              disabled={!newName.trim()}
              className="flex items-center gap-1.5 px-4 h-[42px] rounded-lg bg-white/[0.04] border border-white/[0.06] text-caption font-medium text-white/40 hover:text-white/70 hover:border-white/[0.1] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="h-3.5 w-3.5" /> Protect
            </button>
          </div>

          {/* Protected Names List */}
          {config.protected_names.length > 0 ? (
            <div className="space-y-1.5">
              {config.protected_names.map(name => (
                <div key={name} className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/[0.02] border border-white/[0.04] group hover:border-white/[0.08] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-purple-400">{name[0].toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-body-sm font-medium text-white/70">{name}</p>
                      <p className="text-micro text-white/20">Protected</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeName(name)}
                    className="p-1.5 rounded-md text-white/15 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-caption text-white/20">
                {config.auto_protect_staff
                  ? 'No custom names added. Staff names are automatically protected.'
                  : 'No protected names. Add names manually or enable auto-protect staff.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Save Bar */}
      <SaveBar show={hasChanges} saving={saving} onSave={save} onReset={reset} />
    </div>
  )
}
