'use client'

import { useState, useEffect, useRef } from 'react'
import { ScrollText, Loader2, Hash, Send, CheckCircle2, Shield, Zap, Ban, Link2, UserX, Lock } from 'lucide-react'
import { useAuth } from '@/components/dashboard/dashboard-shell'
import { PageHeader, SettingCard, SaveBar, useToast } from '@/components/dashboard/ui'

interface Channel {
  id: string
  name: string
  type: number
}

export default function LogsPage() {
  const { guilds, selectedGuild, token } = useAuth()
  const guildId = selectedGuild || guilds[0]?.id || null
  const { toast } = useToast()

  const [channels, setChannels] = useState<Channel[]>([])
  const [logChannelId, setLogChannelId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [testSending, setTestSending] = useState(false)
  const initialChannelId = useRef<string>('')

  // ─── Data Fetching (PRESERVED) ───────────────────────────────────────
  useEffect(() => {
    if (!guildId || !token) { setLoading(false); return }

    Promise.all([
      fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
        headers: { Authorization: `Bot ${undefined}` },
      }).catch(() => null),
      fetch(`/api/security/settings?guild_id=${guildId}`).then(r => r.json()),
    ]).then(([, settingsData]) => {
      if (settingsData?.settings?.log_channel_id) {
        setLogChannelId(settingsData.settings.log_channel_id)
        initialChannelId.current = settingsData.settings.log_channel_id
      }
      setLoading(false)
    }).catch(() => setLoading(false))

    fetch(`/api/security/channels?guild_id=${guildId}`).then(r => r.json()).then(data => {
      setChannels(data.channels || [])
    }).catch(() => {})
  }, [guildId, token])

  // ─── Dirty Detection ─────────────────────────────────────────────────
  useEffect(() => {
    setHasChanges(logChannelId !== initialChannelId.current)
  }, [logChannelId])

  // ─── Save (PRESERVED) ────────────────────────────────────────────────
  const save = async () => {
    if (!guildId) return
    setSaving(true)
    await fetch('/api/security/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guild_id: guildId, log_channel_id: logChannelId || null }),
    })
    setSaving(false)
    setHasChanges(false)
    initialChannelId.current = logChannelId
    toast('Log channel settings saved', 'success')
  }

  const reset = () => {
    setLogChannelId(initialChannelId.current)
  }

  // ─── Test Log ────────────────────────────────────────────────────────
  const sendTest = async () => {
    if (!guildId || !logChannelId) return
    setTestSending(true)
    try {
      const res = await fetch('/api/security/test-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel_id: logChannelId, guild_id: guildId }),
      })
      const data = await res.json()
      if (data.success) {
        toast('Test message sent to channel', 'success')
      } else {
        toast(data.error || 'Failed to send test message', 'error')
      }
    } catch {
      toast('Failed to send test message', 'error')
    }
    setTestSending(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-5 w-5 text-[#FFD600] animate-spin" />
      </div>
    )
  }

  const selectedChannel = channels.find(c => c.id === logChannelId)

  return (
    <div className="p-6 lg:p-8 dash-content space-y-8 animate-fade-in">

      {/* Header */}
      <PageHeader
        icon={ScrollText}
        iconColor="bg-emerald-500/[0.08] text-emerald-400"
        title="Security Logs"
        description="Configure where security alerts are sent in Discord."
      />

      {/* Discord Logging Channel */}
      <SettingCard
        icon={Hash}
        iconColor="bg-blue-500/[0.06] text-blue-400"
        title="Log Channel"
        description="Select where Wembo posts security alerts"
      >
        <div className="space-y-4">
          <p className="text-caption text-white/30">
            Wembo will send embed messages to this channel for raids, spam, blocked links, impersonation, and lockdown events.
          </p>

          {channels.length > 0 ? (
            <div className="space-y-1.5 max-h-[280px] overflow-y-auto rounded-xl p-1 bg-white/[0.01]">
              {/* Disabled option */}
              <button
                onClick={() => setLogChannelId('')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                  !logChannelId
                    ? 'bg-[#FFD600]/[0.06] border border-[#FFD600]/15 text-white/70'
                    : 'border border-white/[0.04] text-white/30 hover:border-white/[0.08] hover:text-white/50'
                }`}
              >
                <span className="h-4 w-4 rounded bg-white/[0.06] flex items-center justify-center text-[9px]">—</span>
                <span className="text-body-sm">Disabled — no logging</span>
                {!logChannelId && <CheckCircle2 className="h-3.5 w-3.5 text-[#FFD600] ml-auto" />}
              </button>

              {/* Channel list */}
              {channels.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => setLogChannelId(ch.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                    logChannelId === ch.id
                      ? 'bg-[#FFD600]/[0.06] border border-[#FFD600]/15 text-white/70'
                      : 'border border-white/[0.04] text-white/30 hover:border-white/[0.08] hover:text-white/50'
                  }`}
                >
                  <Hash className="h-4 w-4 flex-shrink-0 text-white/20" />
                  <span className="text-body-sm">{ch.name}</span>
                  {logChannelId === ch.id && <CheckCircle2 className="h-3.5 w-3.5 text-[#FFD600] ml-auto" />}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-caption text-white/20">
                Enter your log channel ID manually (right-click a channel in Discord → Copy Channel ID):
              </p>
              <input
                value={logChannelId}
                onChange={e => setLogChannelId(e.target.value)}
                placeholder="Channel ID (e.g. 1234567890123456)"
                className="dash-input font-mono"
              />
            </div>
          )}

          {/* Test button */}
          {logChannelId && (
            <button
              onClick={sendTest}
              disabled={testSending}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-caption font-medium text-white/40 hover:text-white/70 hover:border-white/[0.1] transition-all disabled:opacity-50"
            >
              {testSending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              Send Test Log Message
            </button>
          )}
        </div>
      </SettingCard>

      {/* Embed Previews */}
      {logChannelId && (
        <div className="dash-card overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.04]">
            <h3 className="text-[15px] font-semibold text-white/90">Embed Previews</h3>
            <p className="text-micro text-white/25 mt-0.5">What security alerts look like in your Discord channel</p>
          </div>
          <div className="p-6 space-y-4">

            {/* Raid Detection */}
            <EmbedPreview
              color="#f87171"
              title="🔴 Raid Detected"
              description="Mass join attempt detected — 23 accounts joined within 10 seconds."
              fields={[
                { name: 'Action', value: 'All accounts kicked' },
                { name: 'Accounts', value: '23' },
                { name: 'Time Window', value: '10 seconds' },
              ]}
              timestamp="Today at 14:23"
            />

            {/* Spam Detection */}
            <EmbedPreview
              color="#fb923c"
              title="🟠 Spam Detected"
              description="User **SpamBot#4821** triggered anti-spam in #general."
              fields={[
                { name: 'Action', value: 'Muted (10 minutes)' },
                { name: 'Reason', value: '8 messages in 3 seconds' },
                { name: 'Messages Deleted', value: 'Yes' },
              ]}
              timestamp="Today at 12:07"
            />

            {/* Link Blocked */}
            <EmbedPreview
              color="#60a5fa"
              title="🔵 Link Blocked"
              description="Blocked link from **NewUser#9012** in #general."
              fields={[
                { name: 'Action', value: 'Message deleted' },
                { name: 'Link', value: 'discord.gg/scamserver' },
                { name: 'Rule', value: 'Invite links blocked' },
              ]}
              timestamp="Today at 11:42"
            />

            {/* Impersonation */}
            <EmbedPreview
              color="#a78bfa"
              title="🟣 Impersonation Detected"
              description={'User **Renamed_4903** matched protected name "panto" with 100% similarity.'}
              fields={[
                { name: 'Action', value: 'Name Reset' },
                { name: 'Similarity', value: '100%' },
                { name: 'Account Age', value: '2 days' },
              ]}
              timestamp="Today at 08:41"
            />

            {/* Lockdown */}
            <EmbedPreview
              color="#FFD600"
              title="🔒 Server Lockdown Activated"
              description="Emergency lockdown was activated by a server administrator."
              fields={[
                { name: 'Channels Affected', value: '27' },
                { name: 'Reason', value: 'Manual activation' },
                { name: 'Status', value: 'Active' },
              ]}
              timestamp="Today at 06:15"
            />

          </div>
        </div>
      )}

      {/* What Gets Logged */}
      <div className="dash-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.04]">
          <h3 className="text-[15px] font-semibold text-white/90">What Gets Logged</h3>
          <p className="text-micro text-white/25 mt-0.5">All security events are sent to the configured channel</p>
        </div>
        <div className="divide-y divide-white/[0.03]">
          <LogEventRow icon={Zap} color="text-[#FFD600]" title="Raid Attempts" description="Mass join detections and actions taken" />
          <LogEventRow icon={Ban} color="text-red-400" title="Spam Detection" description="Users muted or banned for spamming" />
          <LogEventRow icon={Link2} color="text-blue-400" title="Blocked Links" description="Links removed and user actions" />
          <LogEventRow icon={UserX} color="text-purple-400" title="Impersonation" description="Name similarity detections and resets" />
          <LogEventRow icon={Lock} color="text-orange-400" title="Lockdown" description="Server lockdown activations and deactivations" />
        </div>
      </div>

      {/* Save Bar */}
      <SaveBar show={hasChanges} saving={saving} onSave={save} onReset={reset} />
    </div>
  )
}

function LogEventRow({ icon: Icon, color, title, description }: { icon: any; color: string; title: string; description: string }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className={`h-8 w-8 rounded-lg flex items-center justify-center bg-white/[0.03] ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-body-sm font-medium text-white/60">{title}</p>
        <p className="text-micro text-white/20">{description}</p>
      </div>
      <span className="ml-auto status-active"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Enabled</span>
    </div>
  )
}

function EmbedPreview({ color, title, description, fields, timestamp }: {
  color: string
  title: string
  description: string
  fields: { name: string; value: string }[]
  timestamp: string
}) {
  return (
    <div className="max-w-lg rounded overflow-hidden bg-[#2b2d31]" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-5 w-5 rounded-full bg-[#FFD600] flex items-center justify-center flex-shrink-0">
            <span className="text-[8px] font-bold text-black">W</span>
          </div>
          <span className="text-[12px] font-semibold text-white">Wembo Security</span>
        </div>
        <p className="text-[13px] font-semibold text-white mb-1">{title}</p>
        <p className="text-[12px] text-[#dcddde] leading-relaxed">{description}</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {fields.map(f => (
            <div key={f.name}>
              <p className="text-[10px] text-[#72767d] uppercase font-semibold">{f.name}</p>
              <p className="text-[12px] text-[#dcddde]">{f.value}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#72767d] mt-3">{timestamp}</p>
      </div>
    </div>
  )
}
