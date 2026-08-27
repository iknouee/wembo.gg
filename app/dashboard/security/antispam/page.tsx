'use client'

import { useState, useEffect } from 'react'
import { Ban, Loader2, Save } from 'lucide-react'
import { useAuth } from '@/components/dashboard/dashboard-shell'

export default function AntiSpamPage() {
  const { guilds } = useAuth()
  const guildId = guilds[0]?.id || null

  const [enabled, setEnabled] = useState(false)
  const [config, setConfig] = useState({ message_limit: 5, time_window_seconds: 3, duplicate_limit: 3, action: 'delete', mute_duration_minutes: 10 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!guildId) { setLoading(false); return }
    fetch(`/api/security/modules?guild_id=${guildId}`).then(r => r.json()).then(data => {
      const mod = (data.modules || []).find((m: any) => m.module_id === 'antispam')
      if (mod) { setEnabled(mod.enabled); setConfig({ ...config, ...mod.config }) }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [guildId])

  const save = async () => {
    if (!guildId) return
    setSaving(true)
    await fetch('/api/security/modules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guild_id: guildId, module_id: 'antispam', enabled, config }) }).catch(() => {})
    setSaving(false)
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-6 w-6 text-[#FFD600] animate-spin" /></div>

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-red-500/[0.06] flex items-center justify-center"><Ban className="h-6 w-6 text-red-400" /></div>
          <div><h1 className="text-xl font-bold text-white">Anti-Spam</h1><p className="text-[13px] text-white/30 mt-0.5">Detect rapid messaging, floods, and duplicates</p></div>
        </div>
        <button onClick={() => setEnabled(!enabled)} className={`relative h-7 w-12 rounded-full transition-colors ${enabled ? 'bg-green-500/30' : 'bg-white/[0.06]'}`}><span className={`absolute top-1.5 h-4 w-4 rounded-full transition-all ${enabled ? 'left-7 bg-green-400' : 'left-1 bg-white/30'}`} /></button>
      </div>

      <div className="space-y-6">
        <Section title="Rate Limiting">
          <Row label="Message Limit" desc="Max messages allowed within the time window"><NumberField value={config.message_limit} onChange={v => setConfig({ ...config, message_limit: v })} min={3} max={20} /></Row>
          <Row label="Time Window" desc="Seconds to count messages within"><div className="flex items-center gap-2"><NumberField value={config.time_window_seconds} onChange={v => setConfig({ ...config, time_window_seconds: v })} min={1} max={30} /><span className="text-[11px] text-white/20">sec</span></div></Row>
          <Row label="Duplicate Limit" desc="Same message repeated this many times"><NumberField value={config.duplicate_limit} onChange={v => setConfig({ ...config, duplicate_limit: v })} min={2} max={10} /></Row>
        </Section>

        <Section title="Response">
          <Row label="Action" desc="What to do when spam is detected"><Select value={config.action} onChange={v => setConfig({ ...config, action: v })} options={[{ value: 'delete', label: 'Delete messages' }, { value: 'mute', label: 'Mute user' }, { value: 'ban', label: 'Ban user' }]} /></Row>
          <Row label="Mute Duration" desc="How long to mute if action is 'Mute'"><div className="flex items-center gap-2"><NumberField value={config.mute_duration_minutes} onChange={v => setConfig({ ...config, mute_duration_minutes: v })} min={1} max={1440} /><span className="text-[11px] text-white/20">min</span></div></Row>
        </Section>
      </div>

      <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FFD600] text-black text-[13px] font-semibold hover:bg-[#FFD600]/90 transition-colors disabled:opacity-50">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Changes
      </button>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <div><h2 className="text-[11px] font-medium text-white/25 uppercase tracking-wider mb-4">{title}</h2><div className="space-y-0 rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.04] divide-y divide-white/[0.03] overflow-hidden">{children}</div></div> }
function Row({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) { return <div className="flex items-center justify-between px-5 py-4"><div><p className="text-[13px] text-white/70">{label}</p><p className="text-[11px] text-white/20 mt-0.5">{desc}</p></div>{children}</div> }
function NumberField({ value, onChange, min, max }: { value: number; onChange: (v: number) => void; min: number; max: number }) { return <input type="number" value={value} onChange={e => onChange(Math.min(max, Math.max(min, parseInt(e.target.value) || min)))} min={min} max={max} className="w-20 h-9 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] text-[13px] text-white text-center focus:outline-none focus:ring-[#FFD600]/30" /> }
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) { return <select value={value} onChange={e => onChange(e.target.value)} className="h-9 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] text-[13px] text-white px-3 focus:outline-none focus:ring-[#FFD600]/30 appearance-none cursor-pointer">{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select> }
