'use client'

import { useState, useEffect } from 'react'
import { Zap, Loader2, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/dashboard/dashboard-shell'

export default function AntiRaidPage() {
  const { guilds, selectedGuild } = useAuth()
  const guildId = selectedGuild || guilds[0]?.id || null

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
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!guildId) { setLoading(false); return }
    fetch(`/api/security/modules?guild_id=${guildId}`).then(r => r.json()).then(data => {
      const mod = (data.modules || []).find((m: any) => m.module_id === 'antiraid')
      if (mod) { setEnabled(mod.enabled); setConfig(c => ({ ...c, ...mod.config })) }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [guildId])

  const save = async () => {
    if (!guildId) return
    setSaving(true); setSaved(false)
    await fetch('/api/security/modules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guild_id: guildId, module_id: 'antiraid', enabled, config }) })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-5 w-5 text-[#FFD600] animate-spin" /></div>

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-300">
      <Link href="/dashboard/security" className="inline-flex items-center gap-2 text-[12px] text-white/25 hover:text-white/50 transition-colors"><ArrowLeft className="h-3.5 w-3.5" /> Back to Security</Link>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[#FFD600]/[0.08] flex items-center justify-center"><Zap className="h-5 w-5 text-[#FFD600]" /></div>
          <div><h1 className="text-xl font-bold text-white">Anti-Raid</h1><p className="text-[13px] text-white/25 mt-0.5">Detect and block mass join attacks</p></div>
        </div>
        <button onClick={() => setEnabled(!enabled)} className={`relative h-7 w-12 rounded-full transition-all duration-200 ${enabled ? 'bg-green-500/25 ring-1 ring-green-500/20' : 'bg-white/[0.04] ring-1 ring-white/[0.06]'}`}><span className={`absolute top-1.5 h-4 w-4 rounded-full transition-all duration-200 ${enabled ? 'left-7 bg-green-400 shadow-sm shadow-green-400/50' : 'left-1 bg-white/30'}`} /></button>
      </div>

      <div className="space-y-6">
        <Section title="Detection">
          <Row label="Join Threshold" desc="Number of joins within time window to trigger">
            <NI value={config.join_threshold} onChange={v => setConfig({ ...config, join_threshold: v })} min={3} max={50} />
          </Row>
          <Row label="Time Window" desc="Seconds to count joins within">
            <div className="flex items-center gap-2"><NI value={config.time_window_seconds} onChange={v => setConfig({ ...config, time_window_seconds: v })} min={5} max={60} /><span className="text-[11px] text-white/15">sec</span></div>
          </Row>
          <Row label="Min Account Age" desc="Flag accounts created less than this ago">
            <div className="flex items-center gap-2"><NI value={config.min_account_age_hours} onChange={v => setConfig({ ...config, min_account_age_hours: v })} min={0} max={720} /><span className="text-[11px] text-white/15">hrs</span></div>
          </Row>
          <Row label="Whitelist Verified Email" desc="Skip accounts with verified email" last>
            <TG value={config.whitelist_verified_email} onChange={v => setConfig({ ...config, whitelist_verified_email: v })} />
          </Row>
        </Section>

        <Section title="Response">
          <Row label="Action" desc="What to do with raiding accounts">
            <AS value={config.action} onChange={v => setConfig({ ...config, action: v })} options={[{ value: 'kick', label: 'Kick' }, { value: 'ban', label: 'Ban' }, { value: 'lockdown', label: 'Lockdown' }]} />
          </Row>
          <Row label="Notify Log Channel" desc="Post an alert when a raid is detected">
            <TG value={config.notify_channel} onChange={v => setConfig({ ...config, notify_channel: v })} />
          </Row>
          <Row label="Auto-Lockdown" desc="Automatically lock the server at a higher threshold">
            <TG value={config.auto_lockdown_enabled} onChange={v => setConfig({ ...config, auto_lockdown_enabled: v })} />
          </Row>
          {config.auto_lockdown_enabled && (
            <Row label="Auto-Lockdown At" desc="Joins count to auto-lock the server" last>
              <NI value={config.auto_lockdown_threshold} onChange={v => setConfig({ ...config, auto_lockdown_threshold: v })} min={10} max={100} />
            </Row>
          )}
          {!config.auto_lockdown_enabled && <Row label="" desc="" last><span /></Row>}
        </Section>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FFD600] text-black text-[13px] font-semibold hover:bg-[#FFD600]/90 active:scale-[0.98] transition-all disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Changes</button>
        {saved && <span className="text-[12px] text-green-400 animate-in fade-in">✓ Saved</span>}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <div><p className="text-[11px] font-medium text-white/20 uppercase tracking-widest mb-3">{title}</p><div className="rounded-2xl bg-white/[0.015] ring-1 ring-white/[0.04] overflow-hidden">{children}</div></div> }
function Row({ label, desc, children, last }: { label: string; desc: string; children: React.ReactNode; last?: boolean }) { return <div className={`flex items-center justify-between px-5 py-4 ${!last ? 'border-b border-white/[0.03]' : ''}`}><div><p className="text-[13px] text-white/60">{label}</p>{desc && <p className="text-[11px] text-white/15 mt-0.5">{desc}</p>}</div><div className="flex-shrink-0 ml-4">{children}</div></div> }
function NI({ value, onChange, min, max }: { value: number; onChange: (v: number) => void; min: number; max: number }) { return <input type="number" value={value} onChange={e => onChange(Math.min(max, Math.max(min, parseInt(e.target.value) || min)))} min={min} max={max} className="w-16 h-9 rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06] text-[13px] text-white text-center tabular-nums focus:outline-none focus:ring-[#FFD600]/20 transition-all" /> }
function AS({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) { return <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06]">{options.map(o => <button key={o.value} onClick={() => onChange(o.value)} className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200 ${value === o.value ? 'bg-[#FFD600]/10 text-[#FFD600]' : 'text-white/30 hover:text-white/60'}`}>{o.label}</button>)}</div> }
function TG({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) { return <button onClick={() => onChange(!value)} className={`relative h-6 w-11 rounded-full transition-all duration-200 ${value ? 'bg-[#FFD600]/25 ring-1 ring-[#FFD600]/20' : 'bg-white/[0.04] ring-1 ring-white/[0.06]'}`}><span className={`absolute top-1 h-4 w-4 rounded-full transition-all duration-200 ${value ? 'left-6 bg-[#FFD600]' : 'left-1 bg-white/30'}`} /></button> }
