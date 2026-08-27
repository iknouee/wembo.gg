'use client'

import { useState, useEffect } from 'react'
import { UserX, Loader2, Save } from 'lucide-react'
import { useAuth } from '@/components/dashboard/dashboard-shell'
import { ServerSelect, useSelectedGuild } from '@/components/dashboard/server-select'

export default function ImpersonationPage() {
  const { guilds } = useAuth()
  const guildId = useSelectedGuild()

  const [enabled, setEnabled] = useState(false)
  const [config, setConfig] = useState({ similarity_threshold: 80, action: 'flag', check_avatars: true, check_nicknames: true })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!guildId) { setLoading(false); return }
    fetch(`/api/security/modules?guild_id=${guildId}`).then(r => r.json()).then(data => {
      const mod = (data.modules || []).find((m: any) => m.module_id === 'impersonation')
      if (mod) { setEnabled(mod.enabled); setConfig({ ...config, ...mod.config }) }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [guildId])

  const save = async () => {
    if (!guildId) return
    setSaving(true)
    await fetch('/api/security/modules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guild_id: guildId, module_id: 'impersonation', enabled, config }) }).catch(() => {})
    setSaving(false)
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-6 w-6 text-[#FFD600] animate-spin" /></div>

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-purple-500/[0.06] flex items-center justify-center"><UserX className="h-6 w-6 text-purple-400" /></div>
          <div><h1 className="text-xl font-bold text-white">Impersonation Guard</h1><p className="text-[13px] text-white/30 mt-0.5">Protect staff identities from copycats</p></div>
        </div>
        
        <div className="flex items-center gap-3"><ServerSelect /><button onClick={() => setEnabled(!enabled)} className={`relative h-7 w-12 rounded-full transition-colors ${enabled ? 'bg-green-500/30' : 'bg-white/[0.06]'}`}><span className={`absolute top-1.5 h-4 w-4 rounded-full transition-all ${enabled ? 'left-7 bg-green-400' : 'left-1 bg-white/30'}`} /></button></div>
      </div>

      <div className="space-y-6">
        <Section title="Detection">
          <Row label="Similarity Threshold" desc="How closely a name must match to flag (higher = more strict)">
            <div className="flex items-center gap-2">
              <NumberField value={config.similarity_threshold} onChange={v => setConfig({ ...config, similarity_threshold: v })} min={50} max={100} />
              <span className="text-[11px] text-white/20">%</span>
            </div>
          </Row>
          <Row label="Check Nicknames" desc="Compare server nicknames against protected names"><Toggle value={config.check_nicknames} onChange={v => setConfig({ ...config, check_nicknames: v })} /></Row>
          <Row label="Check Avatars" desc="Compare profile pictures against staff avatars"><Toggle value={config.check_avatars} onChange={v => setConfig({ ...config, check_avatars: v })} /></Row>
        </Section>

        <Section title="Response">
          <Row label="Action" desc="What to do when impersonation is detected">
            <Select value={config.action} onChange={v => setConfig({ ...config, action: v })} options={[{ value: 'flag', label: 'Flag for review' }, { value: 'rename', label: 'Reset nickname' }, { value: 'kick', label: 'Kick user' }]} />
          </Row>
        </Section>
      </div>

      <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FFD600] text-black text-[13px] font-semibold hover:bg-[#FFD600]/90 transition-colors disabled:opacity-50">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Changes
      </button>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <div><h2 className="text-[11px] font-medium text-white/25 uppercase tracking-wider mb-4">{title}</h2><div className="rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.04] divide-y divide-white/[0.03] overflow-hidden">{children}</div></div> }
function Row({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) { return <div className="flex items-center justify-between px-5 py-4"><div><p className="text-[13px] text-white/70">{label}</p><p className="text-[11px] text-white/20 mt-0.5">{desc}</p></div>{children}</div> }
function NumberField({ value, onChange, min, max }: { value: number; onChange: (v: number) => void; min: number; max: number }) { return <input type="number" value={value} onChange={e => onChange(Math.min(max, Math.max(min, parseInt(e.target.value) || min)))} min={min} max={max} className="w-20 h-9 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] text-[13px] text-white text-center focus:outline-none focus:ring-[#FFD600]/30" /> }
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) { return <select value={value} onChange={e => onChange(e.target.value)} className="h-9 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] text-[13px] text-white px-3 focus:outline-none focus:ring-[#FFD600]/30 appearance-none cursor-pointer">{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select> }
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) { return <button onClick={() => onChange(!value)} className={`relative h-6 w-11 rounded-full transition-colors ${value ? 'bg-[#FFD600]/25' : 'bg-white/[0.06]'}`}><span className={`absolute top-1 h-4 w-4 rounded-full transition-all ${value ? 'left-6 bg-[#FFD600]' : 'left-1 bg-white/30'}`} /></button> }
