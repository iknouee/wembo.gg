'use client'

import { useState, useEffect } from 'react'
import { ScrollText, Loader2, Save, ArrowLeft, Hash } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/dashboard/dashboard-shell'

interface Channel {
  id: string
  name: string
  type: number
}

export default function LogsPage() {
  const { guilds, selectedGuild, token } = useAuth()
  const guildId = selectedGuild || guilds[0]?.id || null

  const [channels, setChannels] = useState<Channel[]>([])
  const [logChannelId, setLogChannelId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!guildId || !token) { setLoading(false); return }

    // Fetch guild channels from Discord + current log channel from DB
    Promise.all([
      fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
        headers: { Authorization: `Bot ${undefined}` }, // Can't use bot token from client
      }).catch(() => null),
      fetch(`/api/security/settings?guild_id=${guildId}`).then(r => r.json()),
    ]).then(([, settingsData]) => {
      if (settingsData?.settings?.log_channel_id) {
        setLogChannelId(settingsData.settings.log_channel_id)
      }
      setLoading(false)
    }).catch(() => setLoading(false))

    // Fetch channels via our API route (bot has access)
    fetch(`/api/security/channels?guild_id=${guildId}`).then(r => r.json()).then(data => {
      setChannels(data.channels || [])
    }).catch(() => {})
  }, [guildId, token])

  const save = async () => {
    if (!guildId) return
    setSaving(true); setSaved(false)
    await fetch('/api/security/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guild_id: guildId, log_channel_id: logChannelId || null }),
    })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-5 w-5 text-[#FFD600] animate-spin" /></div>

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-300">
      <Link href="/dashboard/security" className="inline-flex items-center gap-2 text-[12px] text-white/25 hover:text-white/50 transition-colors"><ArrowLeft className="h-3.5 w-3.5" /> Back to Security</Link>

      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-emerald-500/[0.08] flex items-center justify-center"><ScrollText className="h-5 w-5 text-emerald-400" /></div>
        <div><h1 className="text-xl font-bold text-white">Security Logs</h1><p className="text-[13px] text-white/25 mt-0.5">Configure where security alerts are sent</p></div>
      </div>

      <div className="space-y-6">
        <Section title="Log Channel">
          <div className="px-5 py-5 space-y-4">
            <p className="text-[12px] text-white/30">Select a channel where Wembo will post security alerts (raids, spam, blocked links, impersonation attempts).</p>

            {channels.length > 0 ? (
              <div className="space-y-2">
                {/* No channel option */}
                <button
                  onClick={() => setLogChannelId('')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${!logChannelId ? 'bg-[#FFD600]/[0.06] ring-1 ring-[#FFD600]/20 text-white/70' : 'bg-white/[0.02] ring-1 ring-white/[0.04] text-white/30 hover:ring-white/[0.08]'}`}
                >
                  <span className="text-[13px]">Disabled — no logging</span>
                </button>

                {/* Channel list */}
                <div className="max-h-64 overflow-y-auto space-y-1 rounded-xl p-1">
                  {channels.map(ch => (
                    <button
                      key={ch.id}
                      onClick={() => setLogChannelId(ch.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${logChannelId === ch.id ? 'bg-[#FFD600]/[0.06] ring-1 ring-[#FFD600]/20 text-white/70' : 'bg-white/[0.02] ring-1 ring-white/[0.04] text-white/30 hover:ring-white/[0.08] hover:text-white/50'}`}
                    >
                      <Hash className="h-4 w-4 flex-shrink-0" />
                      <span className="text-[13px]">{ch.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[12px] text-white/20">Enter your log channel ID (right-click a channel in Discord → Copy Channel ID):</p>
                <input
                  value={logChannelId}
                  onChange={e => setLogChannelId(e.target.value)}
                  placeholder="Channel ID (e.g. 1234567890)"
                  className="w-full h-10 rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06] text-[13px] text-white px-4 placeholder:text-white/15 focus:outline-none focus:ring-[#FFD600]/20 transition-all"
                />
              </div>
            )}
          </div>
        </Section>

        <Section title="What Gets Logged">
          <Row label="Raid Attempts" desc="Mass join detections and actions taken" />
          <Row label="Spam Detection" desc="Users muted/banned for spamming" />
          <Row label="Blocked Links" desc="Links removed and user actions" />
          <Row label="Impersonation" desc="Name similarity detections" />
          <Row label="Lockdown" desc="Server lockdown activations/deactivations" last />
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
function Row({ label, desc, last }: { label: string; desc: string; last?: boolean }) { return <div className={`flex items-center gap-3 px-5 py-3.5 ${!last ? 'border-b border-white/[0.03]' : ''}`}><span className="h-1.5 w-1.5 rounded-full bg-green-400/50 flex-shrink-0" /><div><p className="text-[13px] text-white/60">{label}</p><p className="text-[11px] text-white/15">{desc}</p></div></div> }
