'use client'

import { useState, useEffect } from 'react'
import { Ban, Loader2, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/dashboard/dashboard-shell'

export default function AntiSpamPage() {
  const { guilds, selectedGuild } = useAuth()
  const guildId = selectedGuild || guilds[0]?.id || null

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
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!guildId) { setLoading(false); return }
    fetch(`/api/security/modules?guild_id=${guildId}`).then(r => r.json()).then(data => {
      const mod = (data.modules || []).find((m: any) => m.module_id === 'antispam')
      if (mod) { setEnabled(mod.enabled); setConfig(c => ({ ...c, ...mod.config })) }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [guildId])

  const save = async () => {
    if (!guildId) return
    setSaving(true); setSaved(false)
    await fetch('/api/security/modules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guild_id: guildId, module_id: 'antispam', enabled, config }) })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-5 w-5 text-[#FFD600] animate-spin" /></div>

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-300">
      {/* Back */}
      <Link href="/dashboard/security" className="inline-flex items-center gap-2 text-[12px] text-white/25 hover:text-white/50 transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Security
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-red-500/[0.08] flex items-center justify-center">
            <Ban className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Anti-Spam</h1>
            <p className="text-[13px] text-white/25 mt-0.5">Detect rapid messaging, floods, and duplicates</p>
          </div>
        </div>
        <button onClick={() => setEnabled(!enabled)} className={`relative h-7 w-12 rounded-full transition-all duration-200 ${enabled ? 'bg-green-500/25 ring-1 ring-green-500/20' : 'bg-white/[0.04] ring-1 ring-white/[0.06]'}`}>
          <span className={`absolute top-1.5 h-4 w-4 rounded-full transition-all duration-200 ${enabled ? 'left-7 bg-green-400 shadow-sm shadow-green-400/50' : 'left-1 bg-white/30'}`} />
        </button>
      </div>

      {/* Settings */}
      <div className="space-y-6">
        <SettingsSection title="Rate Limiting">
          <SettingRow label="Message Limit" desc="Max messages before flagging">
            <NumberInput value={config.message_limit} onChange={v => setConfig({ ...config, message_limit: v })} min={3} max={20} />
          </SettingRow>
          <SettingRow label="Time Window" desc="Seconds to count within">
            <div className="flex items-center gap-2">
              <NumberInput value={config.time_window_seconds} onChange={v => setConfig({ ...config, time_window_seconds: v })} min={1} max={30} />
              <span className="text-[11px] text-white/15">sec</span>
            </div>
          </SettingRow>
          <SettingRow label="Duplicate Limit" desc="Same message repeated X times" last>
            <NumberInput value={config.duplicate_limit} onChange={v => setConfig({ ...config, duplicate_limit: v })} min={2} max={10} />
          </SettingRow>
        </SettingsSection>

        <SettingsSection title="Advanced Detection">
          <SettingRow label="Mention Spam" desc="Max mentions in a single message">
            <NumberInput value={config.mentions_limit} onChange={v => setConfig({ ...config, mentions_limit: v })} min={3} max={30} />
          </SettingRow>
          <SettingRow label="Emoji Spam" desc="Max emojis in a single message">
            <NumberInput value={config.emoji_spam_limit} onChange={v => setConfig({ ...config, emoji_spam_limit: v })} min={5} max={50} />
          </SettingRow>
          <SettingRow label="Caps Threshold" desc="Percentage of CAPS to flag as shouting" last>
            <div className="flex items-center gap-2">
              <NumberInput value={config.caps_percentage} onChange={v => setConfig({ ...config, caps_percentage: v })} min={50} max={100} />
              <span className="text-[11px] text-white/15">%</span>
            </div>
          </SettingRow>
        </SettingsSection>

        <SettingsSection title="Response">
          <SettingRow label="Action" desc="What happens when spam is detected">
            <ActionSelect value={config.action} onChange={v => setConfig({ ...config, action: v })} options={[{ value: 'delete', label: 'Delete' }, { value: 'mute', label: 'Mute' }, { value: 'ban', label: 'Ban' }]} />
          </SettingRow>
          <SettingRow label="Mute Duration" desc="Minutes to mute (if action is Mute)">
            <div className="flex items-center gap-2">
              <NumberInput value={config.mute_duration_minutes} onChange={v => setConfig({ ...config, mute_duration_minutes: v })} min={1} max={1440} />
              <span className="text-[11px] text-white/15">min</span>
            </div>
          </SettingRow>
          <SettingRow label="Delete on Mute" desc="Also delete spam messages when muting" last>
            <ToggleSwitch value={config.delete_on_mute} onChange={v => setConfig({ ...config, delete_on_mute: v })} />
          </SettingRow>
        </SettingsSection>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FFD600] text-black text-[13px] font-semibold hover:bg-[#FFD600]/90 active:scale-[0.98] transition-all disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
        {saved && <span className="text-[12px] text-green-400 animate-in fade-in">✓ Saved</span>}
      </div>
    </div>
  )
}

// ─── Shared UI Components ────────────────────────────────────────────────────

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-white/20 uppercase tracking-widest mb-3">{title}</p>
      <div className="rounded-2xl bg-white/[0.015] ring-1 ring-white/[0.04] overflow-hidden">{children}</div>
    </div>
  )
}

function SettingRow({ label, desc, children, last }: { label: string; desc: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-5 py-4 ${!last ? 'border-b border-white/[0.03]' : ''}`}>
      <div>
        <p className="text-[13px] text-white/60">{label}</p>
        <p className="text-[11px] text-white/15 mt-0.5">{desc}</p>
      </div>
      <div className="flex-shrink-0 ml-4">{children}</div>
    </div>
  )
}

function NumberInput({ value, onChange, min, max }: { value: number; onChange: (v: number) => void; min: number; max: number }) {
  return (
    <input
      type="number"
      value={value}
      onChange={e => onChange(Math.min(max, Math.max(min, parseInt(e.target.value) || min)))}
      min={min} max={max}
      className="w-16 h-9 rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06] text-[13px] text-white text-center tabular-nums focus:outline-none focus:ring-[#FFD600]/20 transition-all"
    />
  )
}

function ActionSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06]">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200 ${value === o.value ? 'bg-[#FFD600]/10 text-[#FFD600] shadow-sm' : 'text-white/30 hover:text-white/60'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}


function ToggleSwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return <button onClick={() => onChange(!value)} className={`relative h-6 w-11 rounded-full transition-all duration-200 ${value ? 'bg-[#FFD600]/25 ring-1 ring-[#FFD600]/20' : 'bg-white/[0.04] ring-1 ring-white/[0.06]'}`}><span className={`absolute top-1 h-4 w-4 rounded-full transition-all duration-200 ${value ? 'left-6 bg-[#FFD600]' : 'left-1 bg-white/30'}`} /></button>
}
