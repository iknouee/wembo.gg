'use client'

import { useState, useEffect } from 'react'
import { Link2, Loader2, Save, ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/dashboard/dashboard-shell'

export default function PhishingPage() {
  const { guilds, selectedGuild } = useAuth()
  const guildId = selectedGuild || guilds[0]?.id || null

  const [enabled, setEnabled] = useState(false)
  const [config, setConfig] = useState({ auto_delete: true, quarantine_user: false, warn_in_channel: true, scan_embeds: true, custom_blocklist: [] as string[] })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newDomain, setNewDomain] = useState('')

  useEffect(() => {
    if (!guildId) { setLoading(false); return }
    fetch(`/api/security/modules?guild_id=${guildId}`).then(r => r.json()).then(data => {
      const mod = (data.modules || []).find((m: any) => m.module_id === 'phishing')
      if (mod) { setEnabled(mod.enabled); setConfig(c => ({ ...c, ...mod.config })) }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [guildId])

  const save = async () => {
    if (!guildId) return
    setSaving(true); setSaved(false)
    await fetch('/api/security/modules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guild_id: guildId, module_id: 'phishing', enabled, config }) })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  const addDomain = () => { if (newDomain && !config.custom_blocklist.includes(newDomain.toLowerCase().trim())) { setConfig({ ...config, custom_blocklist: [...config.custom_blocklist, newDomain.toLowerCase().trim()] }); setNewDomain('') } }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-5 w-5 text-[#FFD600] animate-spin" /></div>

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-300">
      <Link href="/dashboard/security" className="inline-flex items-center gap-2 text-[12px] text-white/25 hover:text-white/50 transition-colors"><ArrowLeft className="h-3.5 w-3.5" /> Back to Security</Link>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/[0.08] flex items-center justify-center"><Link2 className="h-5 w-5 text-blue-400" /></div>
          <div><h1 className="text-xl font-bold text-white">Phishing Detection</h1><p className="text-[13px] text-white/25 mt-0.5">Scan and block malicious links</p></div>
        </div>
        <button onClick={() => setEnabled(!enabled)} className={`relative h-7 w-12 rounded-full transition-all duration-200 ${enabled ? 'bg-green-500/25 ring-1 ring-green-500/20' : 'bg-white/[0.04] ring-1 ring-white/[0.06]'}`}><span className={`absolute top-1.5 h-4 w-4 rounded-full transition-all duration-200 ${enabled ? 'left-7 bg-green-400 shadow-sm shadow-green-400/50' : 'left-1 bg-white/30'}`} /></button>
      </div>

      <div className="space-y-6">
        <Section title="Behavior">
          <Row label="Auto-Delete" desc="Remove messages with malicious links"><TG value={config.auto_delete} onChange={v => setConfig({ ...config, auto_delete: v })} /></Row>
          <Row label="Quarantine User" desc="Timeout user for 1 hour"><TG value={config.quarantine_user} onChange={v => setConfig({ ...config, quarantine_user: v })} /></Row>
          <Row label="Warn in Channel" desc="Post a warning message"><TG value={config.warn_in_channel} onChange={v => setConfig({ ...config, warn_in_channel: v })} /></Row>
          <Row label="Scan Embeds" desc="Check link previews too" last><TG value={config.scan_embeds} onChange={v => setConfig({ ...config, scan_embeds: v })} /></Row>
        </Section>

        <div>
          <p className="text-[11px] font-medium text-white/20 uppercase tracking-widest mb-3">Custom Blocklist</p>
          <div className="rounded-2xl bg-white/[0.015] ring-1 ring-white/[0.04] p-5 space-y-3">
            <div className="flex gap-2">
              <input value={newDomain} onChange={e => setNewDomain(e.target.value)} onKeyDown={e => e.key === 'Enter' && addDomain()} placeholder="Enter domain..." className="flex-1 h-9 rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06] text-[13px] text-white px-3 placeholder:text-white/15 focus:outline-none focus:ring-[#FFD600]/20 transition-all" />
              <button onClick={addDomain} className="px-4 h-9 rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06] text-[12px] text-white/40 hover:text-white/70 hover:ring-white/[0.1] transition-all">Add</button>
            </div>
            {config.custom_blocklist.length > 0 ? (
              <div className="flex flex-wrap gap-2">{config.custom_blocklist.map(d => (
                <span key={d} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/[0.06] ring-1 ring-red-500/10 text-[11px] text-red-400/70">
                  {d}<button onClick={() => setConfig({ ...config, custom_blocklist: config.custom_blocklist.filter(x => x !== d) })} className="text-red-400/30 hover:text-red-400"><X className="h-3 w-3" /></button>
                </span>
              ))}</div>
            ) : <p className="text-[11px] text-white/10">No custom domains. Built-in blocklist is always active.</p>}
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
function TG({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) { return <button onClick={() => onChange(!value)} className={`relative h-6 w-11 rounded-full transition-all duration-200 ${value ? 'bg-[#FFD600]/25 ring-1 ring-[#FFD600]/20' : 'bg-white/[0.04] ring-1 ring-white/[0.06]'}`}><span className={`absolute top-1 h-4 w-4 rounded-full transition-all duration-200 ${value ? 'left-6 bg-[#FFD600]' : 'left-1 bg-white/30'}`} /></button> }
