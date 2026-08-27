'use client'

import { useState, useEffect } from 'react'
import { Zap, Loader2, Save } from 'lucide-react'
import { useAuth } from '@/components/dashboard/dashboard-shell'

export default function AntiRaidPage() {
  const { guilds } = useAuth()
  const guildId = guilds[0]?.id || null

  const [enabled, setEnabled] = useState(false)
  const [config, setConfig] = useState({ join_threshold: 10, time_window_seconds: 10, action: 'kick', min_account_age_hours: 24, notify_channel: true })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!guildId) { setLoading(false); return }
    fetch(`/api/security/modules?guild_id=${guildId}`).then(r => r.json()).then(data => {
      const mod = (data.modules || []).find((m: any) => m.module_id === 'antiraid')
      if (mod) { setEnabled(mod.enabled); setConfig({ ...config, ...mod.config }) }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [guildId])

  const save = async () => {
    if (!guildId) return
    setSaving(true)
    await fetch('/api/security/modules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guild_id: guildId, module_id: 'antiraid', enabled, config }) }).catch(() => {})
    setSaving(false)
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-6 w-6 text-[#FFD600] animate-spin" /></div>

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[#FFD600]/[0.06] flex items-center justify-center">
            <Zap className="h-6 w-6 text-[#FFD600]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Anti-Raid</h1>
            <p className="text-[13px] text-white/30 mt-0.5">Detect and block mass join attacks</p>
          </div>
        </div>
        <button onClick={() => { setEnabled(!enabled); }} className={`relative h-7 w-12 rounded-full transition-colors ${enabled ? 'bg-green-500/30' : 'bg-white/[0.06]'}`}>
          <span className={`absolute top-1.5 h-4 w-4 rounded-full transition-all ${enabled ? 'left-7 bg-green-400' : 'left-1 bg-white/30'}`} />
        </button>
      </div>

      {/* Config */}
      <div className="space-y-6">
        <Section title="Detection">
          <Row label="Join Threshold" desc="Number of joins within the time window to trigger raid detection">
            <NumberField value={config.join_threshold} onChange={v => setConfig({ ...config, join_threshold: v })} min={3} max={50} />
          </Row>
          <Row label="Time Window" desc="How many seconds to count joins within">
            <div className="flex items-center gap-2">
              <NumberField value={config.time_window_seconds} onChange={v => setConfig({ ...config, time_window_seconds: v })} min={5} max={60} />
              <span className="text-[11px] text-white/20">seconds</span>
            </div>
          </Row>
          <Row label="Min Account Age" desc="Flag accounts created less than this many hours ago">
            <div className="flex items-center gap-2">
              <NumberField value={config.min_account_age_hours} onChange={v => setConfig({ ...config, min_account_age_hours: v })} min={0} max={720} />
              <span className="text-[11px] text-white/20">hours</span>
            </div>
          </Row>
        </Section>

        <Section title="Response">
          <Row label="Action" desc="What to do when a raid is detected">
            <Select value={config.action} onChange={v => setConfig({ ...config, action: v })} options={[{ value: 'kick', label: 'Kick raiders' }, { value: 'ban', label: 'Ban raiders' }, { value: 'lockdown', label: 'Auto-lockdown server' }]} />
          </Row>
          <Row label="Notify Log Channel" desc="Send an alert when a raid is detected">
            <Toggle value={config.notify_channel} onChange={v => setConfig({ ...config, notify_channel: v })} />
          </Row>
        </Section>
      </div>

      {/* Save */}
      <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FFD600] text-black text-[13px] font-semibold hover:bg-[#FFD600]/90 transition-colors disabled:opacity-50">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save Changes
      </button>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[11px] font-medium text-white/25 uppercase tracking-wider mb-4">{title}</h2>
      <div className="space-y-1 rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.04] divide-y divide-white/[0.03] overflow-hidden">{children}</div>
    </div>
  )
}

function Row({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div><p className="text-[13px] text-white/70">{label}</p><p className="text-[11px] text-white/20 mt-0.5">{desc}</p></div>
      {children}
    </div>
  )
}

function NumberField({ value, onChange, min, max }: { value: number; onChange: (v: number) => void; min: number; max: number }) {
  return <input type="number" value={value} onChange={e => onChange(Math.min(max, Math.max(min, parseInt(e.target.value) || min)))} min={min} max={max} className="w-20 h-9 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] text-[13px] text-white text-center focus:outline-none focus:ring-[#FFD600]/30" />
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return <select value={value} onChange={e => onChange(e.target.value)} className="h-9 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] text-[13px] text-white px-3 focus:outline-none focus:ring-[#FFD600]/30 appearance-none cursor-pointer">{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return <button onClick={() => onChange(!value)} className={`relative h-6 w-11 rounded-full transition-colors ${value ? 'bg-[#FFD600]/25' : 'bg-white/[0.06]'}`}><span className={`absolute top-1 h-4 w-4 rounded-full transition-all ${value ? 'left-6 bg-[#FFD600]' : 'left-1 bg-white/30'}`} /></button>
}
