'use client'

import { useState, useEffect, useRef } from 'react'
import { ShieldCheck, Loader2, Hash, Eye, Palette, RefreshCw, ChevronDown, Check } from 'lucide-react'
import { useAuth } from '@/components/dashboard/dashboard-shell'
import { PageHeader, SettingCard, SettingRow, Toggle, SegmentedControl, SaveBar, useToast } from '@/components/dashboard/ui'

const BUTTON_STYLES = [
  { value: 'Primary', label: 'Blue' },
  { value: 'Secondary', label: 'Grey' },
  { value: 'Success', label: 'Green' },
  { value: 'Danger', label: 'Red' },
]

const DEFAULT_CONFIG = {
  // Embed
  embed_title: 'Verify to Access the Server',
  embed_description: 'Click the button below to verify that you are a human and gain access to the server.',
  embed_color: '#FFD600',
  embed_image: '',
  embed_thumbnail: '',
  embed_footer: 'Wembo Verification',
  // Button
  button_label: '✓ Verify',
  button_style: 'Success',
  // Behavior
  verified_role_id: '',
  unverified_role_id: '',
  channel_id: '',
  remove_unverified_role: true,
  log_verifications: true,
  // Timeout
  kick_unverified_after: 0, // 0 = disabled, otherwise minutes
}

export default function VerificationPage() {
  const { guilds, selectedGuild, token } = useAuth()
  const guildId = selectedGuild || guilds[0]?.id || null
  const { toast } = useToast()

  const [enabled, setEnabled] = useState(false)
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [channels, setChannels] = useState<{ id: string; name: string }[]>([])
  const [channelDropdownOpen, setChannelDropdownOpen] = useState(false)
  const [channelSearch, setChannelSearch] = useState('')
  const [refreshingChannels, setRefreshingChannels] = useState(false)
  const initialState = useRef<{ enabled: boolean; config: typeof DEFAULT_CONFIG } | null>(null)

  // ─── Data Fetching ───────────────────────────────────────────────────
  const fetchChannels = async () => {
    if (!guildId) return
    try {
      const res = await fetch(`/api/security/channels?guild_id=${guildId}`)
      const data = await res.json()
      setChannels(data.channels || [])
    } catch {}
  }

  const refreshChannels = async () => {
    setRefreshingChannels(true)
    await fetchChannels()
    setRefreshingChannels(false)
    toast('Channel list refreshed', 'success')
  }

  useEffect(() => {
    if (!guildId) { setLoading(false); return }

    Promise.all([
      fetch(`/api/security/modules?guild_id=${guildId}`).then(r => r.json()),
      fetchChannels(),
    ]).then(([moduleData]) => {
      const mod = (moduleData.modules || []).find((m: any) => m.module_id === 'verification')
      if (mod) { setEnabled(mod.enabled); setConfig(c => ({ ...c, ...mod.config })) }
      setLoading(false)
      setTimeout(() => {
        initialState.current = { enabled: mod?.enabled ?? false, config: { ...DEFAULT_CONFIG, ...(mod?.config || {}) } }
      }, 0)
    }).catch(() => setLoading(false))
  }, [guildId])

  // ─── Dirty Detection ─────────────────────────────────────────────────
  useEffect(() => {
    if (!initialState.current) return
    const changed = enabled !== initialState.current.enabled ||
      JSON.stringify(config) !== JSON.stringify(initialState.current.config)
    setHasChanges(changed)
  }, [enabled, config])

  // ─── Save ────────────────────────────────────────────────────────────
  const save = async () => {
    if (!guildId) return
    setSaving(true)
    await fetch('/api/security/modules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guild_id: guildId, module_id: 'verification', enabled, config }) })
    setSaving(false)
    setHasChanges(false)
    initialState.current = { enabled, config: { ...config } }
    toast('Verification Gate settings saved', 'success')
  }

  const reset = () => {
    if (!initialState.current) return
    setEnabled(initialState.current.enabled)
    setConfig({ ...initialState.current.config })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-5 w-5 text-[#FFD600] animate-spin" />
      </div>
    )
  }

  // Button color for preview
  const buttonColors: Record<string, string> = {
    Primary: '#5865F2',
    Secondary: '#4f545c',
    Success: '#57F287',
    Danger: '#ED4245',
  }

  return (
    <div className="p-6 lg:p-8 dash-content space-y-8 animate-fade-in">

      {/* Header */}
      <PageHeader
        icon={ShieldCheck}
        iconColor="bg-cyan-500/[0.08] text-cyan-400"
        title="Verification Gate"
        description="Require new members to verify before accessing the server."
        badge={
          enabled ? (
            <span className="status-active"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Active</span>
          ) : (
            <span className="status-inactive">Disabled</span>
          )
        }
        actions={<Toggle checked={enabled} onChange={setEnabled} />}
      />

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Settings Column */}
        <div className="lg:col-span-3 space-y-6">

          {/* Embed Customization */}
          <SettingCard
            icon={Palette}
            iconColor="bg-purple-500/[0.06] text-purple-400"
            title="Embed Appearance"
            description="Customize how the verification message looks"
          >
            <div className="space-y-4">
              <div>
                <label className="text-caption text-white/40 block mb-1.5">Title</label>
                <input
                  value={config.embed_title}
                  onChange={e => setConfig({ ...config, embed_title: e.target.value })}
                  placeholder="Verify to Access the Server"
                  className="dash-input"
                />
              </div>
              <div>
                <label className="text-caption text-white/40 block mb-1.5">Description</label>
                <textarea
                  value={config.embed_description}
                  onChange={e => setConfig({ ...config, embed_description: e.target.value })}
                  placeholder="Click the button below to verify..."
                  rows={3}
                  className="dash-input resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-caption text-white/40 block mb-1.5">Embed Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.embed_color}
                      onChange={e => setConfig({ ...config, embed_color: e.target.value })}
                      className="h-9 w-9 rounded-lg border border-white/[0.06] cursor-pointer bg-transparent"
                    />
                    <input
                      value={config.embed_color}
                      onChange={e => setConfig({ ...config, embed_color: e.target.value })}
                      placeholder="#FFD600"
                      className="dash-input flex-1 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-caption text-white/40 block mb-1.5">Footer Text</label>
                  <input
                    value={config.embed_footer}
                    onChange={e => setConfig({ ...config, embed_footer: e.target.value })}
                    placeholder="Wembo Verification"
                    className="dash-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-caption text-white/40 block mb-1.5">Image URL</label>
                  <input
                    value={config.embed_image}
                    onChange={e => setConfig({ ...config, embed_image: e.target.value })}
                    placeholder="https://..."
                    className="dash-input"
                  />
                </div>
                <div>
                  <label className="text-caption text-white/40 block mb-1.5">Thumbnail URL</label>
                  <input
                    value={config.embed_thumbnail}
                    onChange={e => setConfig({ ...config, embed_thumbnail: e.target.value })}
                    placeholder="https://..."
                    className="dash-input"
                  />
                </div>
              </div>
            </div>
          </SettingCard>

          {/* Button Customization */}
          <SettingCard
            icon={ShieldCheck}
            iconColor="bg-cyan-500/[0.06] text-cyan-400"
            title="Button"
            description="Customize the verify button"
          >
            <SettingRow label="Button Text" description="What the button says.">
              <input
                value={config.button_label}
                onChange={e => setConfig({ ...config, button_label: e.target.value })}
                placeholder="✓ Verify"
                className="dash-input w-40 text-center"
              />
            </SettingRow>
            <SettingRow label="Button Color" description="The button style in Discord.">
              <SegmentedControl
                options={BUTTON_STYLES}
                value={config.button_style}
                onChange={v => setConfig({ ...config, button_style: v })}
              />
            </SettingRow>
          </SettingCard>

          {/* Behavior */}
          <SettingCard
            icon={Hash}
            iconColor="bg-blue-500/[0.06] text-blue-400"
            title="Behavior"
            description="How verification works"
          >
            <SettingRow label="Verification Channel" description="Where the verification embed is posted.">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => { setChannelDropdownOpen(!channelDropdownOpen); setChannelSearch('') }}
                    className="dash-input w-52 flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span className="truncate text-left">
                      {config.channel_id
                        ? `# ${stripEmoji(channels.find(c => c.id === config.channel_id)?.name || config.channel_id)}`
                        : 'Select or type ID'}
                    </span>
                    <ChevronDown className={`h-3.5 w-3.5 text-white/20 transition-transform flex-shrink-0 ${channelDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {channelDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setChannelDropdownOpen(false)} />
                      <div className="absolute top-full right-0 mt-1 z-50 w-72 rounded-xl bg-[#111214] border border-white/[0.06] shadow-2xl shadow-black/60 overflow-hidden">
                        {/* Search input */}
                        <div className="p-2.5 border-b border-white/[0.04]">
                          <input
                            value={channelSearch}
                            onChange={e => setChannelSearch(e.target.value)}
                            placeholder="Search or paste channel ID..."
                            className="w-full h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 text-[13px] text-white/80 placeholder:text-white/25 focus:outline-none focus:border-[#FFD600]/30"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-[220px] overflow-y-auto p-1">
                          {/* Paste ID option */}
                          {channelSearch && /^\d{17,20}$/.test(channelSearch.trim()) && (
                            <button
                              onClick={() => { setConfig({ ...config, channel_id: channelSearch.trim() }); setChannelDropdownOpen(false); setChannelSearch('') }}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-body-sm text-[#FFD600]/80 hover:bg-[#FFD600]/[0.04] transition-colors"
                            >
                              <Hash className="h-3.5 w-3.5 flex-shrink-0" />
                              <span>Use ID: {channelSearch.trim()}</span>
                            </button>
                          )}
                          {/* None option */}
                          {!channelSearch && (
                            <button
                              onClick={() => { setConfig({ ...config, channel_id: '' }); setChannelDropdownOpen(false) }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-body-sm transition-colors ${!config.channel_id ? 'bg-[#FFD600]/[0.04] text-white/70' : 'text-white/40 hover:bg-white/[0.03]'}`}
                            >
                              <span className="text-white/20 w-3.5 text-center">—</span>
                              <span>None</span>
                              {!config.channel_id && <Check className="h-3 w-3 text-[#FFD600] ml-auto" />}
                            </button>
                          )}
                          {/* Channel list */}
                          {channels
                            .filter(ch => !channelSearch || stripEmoji(ch.name).toLowerCase().includes(channelSearch.toLowerCase()) || ch.name.toLowerCase().includes(channelSearch.toLowerCase()))
                            .map(ch => (
                              <button
                                key={ch.id}
                                onClick={() => { setConfig({ ...config, channel_id: ch.id }); setChannelDropdownOpen(false); setChannelSearch('') }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-body-sm transition-colors ${config.channel_id === ch.id ? 'bg-[#FFD600]/[0.04] text-white/70' : 'text-white/40 hover:bg-white/[0.03]'}`}
                              >
                                <Hash className="h-3.5 w-3.5 text-white/20 flex-shrink-0" />
                                <span className="truncate">{stripEmoji(ch.name)}</span>
                                {config.channel_id === ch.id && <Check className="h-3 w-3 text-[#FFD600] ml-auto flex-shrink-0" />}
                              </button>
                            ))}
                          {channels.filter(ch => !channelSearch || stripEmoji(ch.name).toLowerCase().includes(channelSearch.toLowerCase()) || ch.name.toLowerCase().includes(channelSearch.toLowerCase())).length === 0 && channelSearch && !/^\d{17,20}$/.test(channelSearch.trim()) && (
                            <p className="px-3 py-4 text-[12px] text-white/20 text-center">No channels found. Paste a channel ID instead.</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={refreshChannels}
                  disabled={refreshingChannels}
                  className="h-[42px] w-[42px] flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/30 hover:text-white/60 hover:border-white/[0.1] transition-all disabled:opacity-50"
                  title="Refresh channels"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${refreshingChannels ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </SettingRow>
            <SettingRow label="Verified Role ID" description="Role to give after verification. Paste the role ID.">
              <input
                value={config.verified_role_id}
                onChange={e => setConfig({ ...config, verified_role_id: e.target.value })}
                placeholder="Role ID"
                className="dash-input w-48 font-mono"
              />
            </SettingRow>
            <SettingRow label="Unverified Role ID" description="Role to assign on join (optional). Removed after verify.">
              <input
                value={config.unverified_role_id}
                onChange={e => setConfig({ ...config, unverified_role_id: e.target.value })}
                placeholder="Role ID (optional)"
                className="dash-input w-48 font-mono"
              />
            </SettingRow>
            <SettingRow label="Remove Unverified Role" description="Strip the unverified role after they click verify.">
              <Toggle checked={config.remove_unverified_role} onChange={v => setConfig({ ...config, remove_unverified_role: v })} />
            </SettingRow>
            <SettingRow label="Log Verifications" description="Log each verification to the security log channel.">
              <Toggle checked={config.log_verifications} onChange={v => setConfig({ ...config, log_verifications: v })} />
            </SettingRow>
          </SettingCard>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-2">
          <div className="sticky top-[80px]">
            <div className="dash-card overflow-hidden">
              <div className="px-5 py-3 border-b border-white/[0.04] flex items-center gap-2">
                <Eye className="h-3.5 w-3.5 text-white/30" />
                <p className="text-caption font-medium text-white/50">Live Preview</p>
              </div>
              <div className="p-5">
                {/* Discord-style embed preview */}
                <div className="rounded overflow-hidden bg-[#2b2d31]" style={{ borderLeft: `4px solid ${config.embed_color || '#FFD600'}` }}>
                  <div className="p-4">
                    {config.embed_thumbnail && (
                      <div className="float-right ml-3 mb-2">
                        <div className="h-16 w-16 rounded bg-white/5 flex items-center justify-center overflow-hidden">
                          <img src={config.embed_thumbnail} alt="" className="h-full w-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                        </div>
                      </div>
                    )}
                    {config.embed_title && (
                      <p className="text-[14px] font-semibold text-white mb-1">{config.embed_title}</p>
                    )}
                    {config.embed_description && (
                      <p className="text-[13px] text-[#dcddde] leading-relaxed whitespace-pre-wrap">{config.embed_description}</p>
                    )}
                    {config.embed_image && (
                      <div className="mt-3 rounded overflow-hidden max-h-[200px]">
                        <img src={config.embed_image} alt="" className="w-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                      </div>
                    )}
                    {config.embed_footer && (
                      <p className="text-[10px] text-[#72767d] mt-3">{config.embed_footer}</p>
                    )}
                  </div>
                </div>
                {/* Button preview */}
                <div className="mt-2">
                  <button
                    className="px-4 py-2 rounded text-[13px] font-medium text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: buttonColors[config.button_style] || '#57F287' }}
                  >
                    {config.button_label || '✓ Verify'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Bar */}
      <SaveBar show={hasChanges} saving={saving} onSave={save} onReset={reset} />
    </div>
  )
}


// Strip emoji and separator characters from channel names
function stripEmoji(name: string): string {
  return name
    .replace(/[\u{1F600}-\u{1F9FF}]/gu, '') // emoticons
    .replace(/[\u{2600}-\u{26FF}]/gu, '')   // misc symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, '')   // dingbats
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')   // variation selectors
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, '') // extended
    .replace(/[·•|]/g, '')                   // separators
    .replace(/\s{2,}/g, ' ')                 // collapse spaces
    .trim()
}
