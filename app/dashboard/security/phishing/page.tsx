'use client'

import { useState, useEffect } from 'react'
import { Link2, Loader2, Save } from 'lucide-react'
import { useAuth } from '@/components/dashboard/dashboard-shell'

export default function PhishingPage() {
  const { guilds } = useAuth()
  const guildId = guilds[0]?.id || null

  const [enabled, setEnabled] = useState(false)
  const [config, setConfig] = useState({ auto_delete: true, quarantine_user: false, warn_in_channel: true, scan_embeds: true, custom_blocklist: [] as string[] })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newDomain, setNewDomain] = useState('')

  useEffect(() => {
    if (!guildId) { setLoading(false); return }
    fetch(`/api/security/modules?guild_id=${guildId}`).then(r => r.json()).then(data => {
      const mod = (data.modules || []).find((m: any) => m.module_id === 'phishing')
      if (mod) { setEnabled(mod.enabled); setConfig({ ...config, ...mod.config }) }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [guildId])

  const save = async () => {
    if (!guildId) return
    setSaving(true)
    await fetch('/api/security/modules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guild_id: guildId, module_id: 'phishing', enabled, config }) }).catch(() => {})
    setSaving(false)
  }

  const addDomain = () => {
    if (newDomain && !config.custom_blocklist.includes(newDomain)) {
      setConfig({ ...config, custom_blocklist: [...config.custom_blocklist, newDomain.toLowerCase().trim()] })
      setNewDomain('')
    }
  }

  const removeDomain = (d: string) => setConfig({ ...config, custom_blocklist: config.custom_blocklist.filter(x => x !== d) })

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-6 w-6 text-[#FFD600] animate-spin" /></div>

  return (
    <div className="p-8 lg:p-10 max-w-3xl space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/[0.06] flex items-center justify-center"><Link2 className="h-6 w-6 text-blue-400" /></div>
          <div><h1 className="text-xl font-bold text-white">Phishing Detection</h1><p className="text-[13px] text-white/30 mt-0.5">Scan and block malicious links automatically</p></div>
        </div>
        <button onClick={() => setEnabled(!enabled)} className={`relative h-7 w-12 rounded-full transition-colors ${enabled ? 'bg-green-500/30' : 'bg-white/[0.06]'}`}><span className={`absolute top-1.5 h-4 w-4 rounded-full transition-all ${enabled ? 'left-7 bg-green-400' : 'left-1 bg-white/30'}`} /></button>
      </div>

      <div className="space-y-6">
        <Section title="Behavior">
          <Row label="Auto-Delete" desc="Instantly remove messages with malicious links"><Toggle value={config.auto_delete} onChange={v => setConfig({ ...config, auto_delete: v })} /></Row>
          <Row label="Quarantine User" desc="Timeout the user for 1 hour on detection"><Toggle value={config.quarantine_user} onChange={v => setConfig({ ...config, quarantine_user: v })} /></Row>
          <Row label="Warn in Channel" desc="Post a public warning when a link is removed"><Toggle value={config.warn_in_channel} onChange={v => setConfig({ ...config, warn_in_channel: v })} /></Row>
          <Row label="Scan Embeds" desc="Also check link previews and rich embeds"><Toggle value={config.scan_embeds} onChange={v => setConfig({ ...config, scan_embeds: v })} /></Row>
        </Section>

        <Section title="Custom Blocklist">
          <div className="px-5 py-4 space-y-3">
            <div className="flex gap-2">
              <input value={newDomain} onChange={e => setNewDomain(e.target.value)} onKeyDown={e => e.key === 'Enter' && addDomain()} placeholder="Add domain (e.g. scam-site.com)" className="flex-1 h-9 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] text-[13px] text-white px-3 placeholder:text-white/15 focus:outline-none focus:ring-[#FFD600]/30" />
              <button onClick={addDomain} className="px-3 h-9 rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06] text-[12px] text-white/50 hover:text-white/80 transition-colors">Add</button>
            </div>
            {config.custom_blocklist.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {config.custom_blocklist.map(d => (
                  <span key={d} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/[0.06] text-[11px] text-red-400/70">
                    {d}
                    <button onClick={() => removeDomain(d)} className="text-red-400/40 hover:text-red-400">×</button>
                  </span>
                ))}
              </div>
            )}
            {config.custom_blocklist.length === 0 && <p className="text-[11px] text-white/15">No custom domains added. Built-in blocklist is always active.</p>}
          </div>
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
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) { return <button onClick={() => onChange(!value)} className={`relative h-6 w-11 rounded-full transition-colors ${value ? 'bg-[#FFD600]/25' : 'bg-white/[0.06]'}`}><span className={`absolute top-1 h-4 w-4 rounded-full transition-all ${value ? 'left-6 bg-[#FFD600]' : 'left-1 bg-white/30'}`} /></button> }
