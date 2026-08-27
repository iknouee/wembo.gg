'use client'

import { useState, useEffect } from 'react'
import { UserX, Loader2, Save, ArrowLeft, X, Plus } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/dashboard/dashboard-shell'

export default function ImpersonationPage() {
  const { guilds, selectedGuild } = useAuth()
  const guildId = selectedGuild || guilds[0]?.id || null

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
  const [saved, setSaved] = useState(false)
  const [newName, setNewName] = useState('')

  useEffect(() => {
    if (!guildId) { setLoading(false); return }
    fetch(`/api/security/modules?guild_id=${guildId}`).then(r => r.json()).then(data => {
      const mod = (data.modules || []).find((m: any) => m.module_id === 'impersonation')
      if (mod) { setEnabled(mod.enabled); setConfig(c => ({ ...c, ...mod.config })) }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [guildId])

  const save = async () => {
    if (!guildId) return
    setSaving(true); setSaved(false)
    await fetch('/api/security/modules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guild_id: guildId, module_id: 'impersonation', enabled, config }) })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  const addName = () => {
    const name = newName.trim().toLowerCase()
    if (name && !config.protected_names.includes(name)) {
      setConfig({ ...config, protected_names: [...config.protected_names, name] })
      setNewName('')
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-5 w-5 text-[#FFD600] animate-spin" /></div>

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-300">
      <Link href="/dashboard/security" className="inline-flex items-center gap-2 text-[12px] text-white/25 hover:text-white/50 transition-colors"><ArrowLeft className="h-3.5 w-3.5" /> Back to Security</Link>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-purple-500/[0.08] flex items-center justify-center"><UserX className="h-5 w-5 text-purple-400" /></div>
          <div><h1 className="text-xl font-bold text-white">Impersonation Guard</h1><p className="text-[13px] text-white/25 mt-0.5">Protect identities from copycats</p></div>
        </div>
        <button onClick={() => setEnabled(!enabled)} className={`relative h-7 w-12 rounded-full transition-all duration-200 ${enabled ? 'bg-green-500/25 ring-1 ring-green-500/20' : 'bg-white/[0.04] ring-1 ring-white/[0.06]'}`}><span className={`absolute top-1.5 h-4 w-4 rounded-full transition-all duration-200 ${enabled ? 'left-7 bg-green-400 shadow-sm shadow-green-400/50' : 'left-1 bg-white/30'}`} /></button>
      </div>

      <div className="space-y-6">
        <Section title="Detection Settings">
          <Row label="Similarity Threshold" desc="How closely a name must match to trigger (lower = more strict)">
            <div className="flex items-center gap-2">
              <NI value={config.similarity_threshold} onChange={v => setConfig({ ...config, similarity_threshold: v })} min={40} max={100} />
              <span className="text-[11px] text-white/15">%</span>
            </div>
          </Row>
          <Row label="Auto-Protect Staff" desc="Automatically protect names of admins and mods">
            <TG value={config.auto_protect_staff} onChange={v => setConfig({ ...config, auto_protect_staff: v })} />
          </Row>
          <Row label="Check Nicknames" desc="Monitor server nickname changes">
            <TG value={config.check_nicknames} onChange={v => setConfig({ ...config, check_nicknames: v })} />
          </Row>
          <Row label="Check Avatars" desc="Compare profile pictures against protected users">
            <TG value={config.check_avatars} onChange={v => setConfig({ ...config, check_avatars: v })} />
          </Row>
          <Row label="Min Account Age" desc="Only flag accounts newer than this" last>
            <div className="flex items-center gap-2">
              <NI value={config.min_account_age_days} onChange={v => setConfig({ ...config, min_account_age_days: v })} min={0} max={365} />
              <span className="text-[11px] text-white/15">days</span>
            </div>
          </Row>
        </Section>

        <Section title="Response">
          <Row label="Action" desc="What to do when impersonation is detected" last>
            <AS value={config.action} onChange={v => setConfig({ ...config, action: v })} options={[{ value: 'flag', label: 'Flag' }, { value: 'rename', label: 'Reset Name' }, { value: 'kick', label: 'Kick' }, { value: 'ban', label: 'Ban' }]} />
          </Row>
        </Section>

        {/* Protected Names */}
        <div>
          <p className="text-[11px] font-medium text-white/20 uppercase tracking-widest mb-3">Protected Names</p>
          <div className="rounded-2xl bg-white/[0.015] ring-1 ring-white/[0.04] p-5 space-y-3">
            <p className="text-[11px] text-white/20">Add specific names to protect. Anyone using a similar name will be flagged.</p>
            <div className="flex gap-2">
              <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addName()} placeholder="Add a name to protect..." className="flex-1 h-9 rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06] text-[13px] text-white px-3 placeholder:text-white/15 focus:outline-none focus:ring-[#FFD600]/20 transition-all" />
              <button onClick={addName} className="flex items-center gap-1.5 px-3 h-9 rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06] text-[12px] text-white/40 hover:text-white/70 hover:ring-white/[0.1] transition-all"><Plus className="h-3 w-3" /> Add</button>
            </div>
            {config.protected_names.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {config.protected_names.map(name => (
                  <span key={name} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/[0.06] ring-1 ring-purple-500/10 text-[11px] text-purple-400/70">
                    {name}
                    <button onClick={() => setConfig({ ...config, protected_names: config.protected_names.filter(n => n !== name) })} className="text-purple-400/30 hover:text-purple-400 transition-colors"><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-white/10">No custom names added. {config.auto_protect_staff ? 'Staff names are automatically protected.' : 'Enable auto-protect staff or add names manually.'}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FFD600] text-black text-[13px] font-semibold hover:bg-[#FFD600]/90 active:scale-[0.98] transition-all disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Changes</button>
        {saved && <span className="text-[12px] text-green-400 animate-in fade-in">✓ Saved</span>}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <div><p className="text-[11px] font-medium text-white/20 uppercase tracking-widest mb-3">{title}</p><div className="rounded-2xl bg-white/[0.015] ring-1 ring-white/[0.04] overflow-hidden">{children}</div></div> }
function Row({ label, desc, children, last }: { label: string; desc: string; children: React.ReactNode; last?: boolean }) { return <div className={`flex items-center justify-between px-5 py-4 ${!last ? 'border-b border-white/[0.03]' : ''}`}><div><p className="text-[13px] text-white/60">{label}</p><p className="text-[11px] text-white/15 mt-0.5">{desc}</p></div><div className="flex-shrink-0 ml-4">{children}</div></div> }
function NI({ value, onChange, min, max }: { value: number; onChange: (v: number) => void; min: number; max: number }) { return <input type="number" value={value} onChange={e => onChange(Math.min(max, Math.max(min, parseInt(e.target.value) || min)))} min={min} max={max} className="w-16 h-9 rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06] text-[13px] text-white text-center tabular-nums focus:outline-none focus:ring-[#FFD600]/20 transition-all" /> }
function AS({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) { return <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06]">{options.map(o => <button key={o.value} onClick={() => onChange(o.value)} className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200 ${value === o.value ? 'bg-[#FFD600]/10 text-[#FFD600]' : 'text-white/30 hover:text-white/60'}`}>{o.label}</button>)}</div> }
function TG({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) { return <button onClick={() => onChange(!value)} className={`relative h-6 w-11 rounded-full transition-all duration-200 ${value ? 'bg-[#FFD600]/25 ring-1 ring-[#FFD600]/20' : 'bg-white/[0.04] ring-1 ring-white/[0.06]'}`}><span className={`absolute top-1 h-4 w-4 rounded-full transition-all duration-200 ${value ? 'left-6 bg-[#FFD600]' : 'left-1 bg-white/30'}`} /></button> }
