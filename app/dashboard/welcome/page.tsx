'use client'

import { useState } from 'react'
import { UserPlus, UserMinus, Send, Hash, Mail, Palette, Image, Type, AlignLeft, Eye, Copy } from 'lucide-react'
import { useAuth } from '@/components/dashboard/dashboard-shell'
import { PageHeader, SettingCard, Toggle, SaveBar } from '@/components/dashboard/ui'

const VARIABLES = [
  { name: '{user}', desc: 'Mentions the user' },
  { name: '{server}', desc: 'Server name' },
  { name: '{membercount}', desc: 'Total member count' },
]

const QUICK_COLORS = ['#5865F2', '#57F287', '#FEE75C', '#ED4245', '#EB459E', '#FFD600']

function replaceVars(text: string) {
  return text
    .replace(/\{user\}/g, 'NewMember')
    .replace(/\{server\}/g, 'My Server')
    .replace(/\{membercount\}/g, '1,234')
}

function renderMd(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />')
}

export default function WelcomePage() {
  const { guilds, selectedGuild } = useAuth()
  const guildId = selectedGuild || guilds[0]?.id || null

  const [tab, setTab] = useState<'welcome' | 'goodbye'>('welcome')
  const [testSending, setTestSending] = useState(false)
  const [dirty, setDirty] = useState(false)

  // Welcome config
  const [welcomeEnabled, setWelcomeEnabled] = useState(true)
  const [welcomeChannel, setWelcomeChannel] = useState('')
  const [welcomeTitle, setWelcomeTitle] = useState('Welcome to {server}! 🎉')
  const [welcomeDesc, setWelcomeDesc] = useState('Hey {user}, welcome to **{server}**! You are member #{membercount}.\n\nMake sure to read the rules and have fun!')
  const [welcomeColor, setWelcomeColor] = useState('#5865F2')
  const [welcomeImage, setWelcomeImage] = useState('')
  const [welcomeThumbnail, setWelcomeThumbnail] = useState('')
  const [welcomeFooter, setWelcomeFooter] = useState('Enjoy your stay!')
  const [welcomeDm, setWelcomeDm] = useState(false)
  const [welcomeDmMsg, setWelcomeDmMsg] = useState('')

  // Goodbye config
  const [goodbyeEnabled, setGoodbyeEnabled] = useState(false)
  const [goodbyeChannel, setGoodbyeChannel] = useState('')
  const [goodbyeTitle, setGoodbyeTitle] = useState('Goodbye! 👋')
  const [goodbyeDesc, setGoodbyeDesc] = useState('{user} has left **{server}**. We now have {membercount} members.')
  const [goodbyeColor, setGoodbyeColor] = useState('#ED4245')
  const [goodbyeImage, setGoodbyeImage] = useState('')
  const [goodbyeThumbnail, setGoodbyeThumbnail] = useState('')
  const [goodbyeFooter, setGoodbyeFooter] = useState("We'll miss you!")
  const [goodbyeDm, setGoodbyeDm] = useState(false)
  const [goodbyeDmMsg, setGoodbyeDmMsg] = useState('')

  // Active config based on tab
  const enabled = tab === 'welcome' ? welcomeEnabled : goodbyeEnabled
  const setEnabled = tab === 'welcome' ? setWelcomeEnabled : setGoodbyeEnabled
  const channel = tab === 'welcome' ? welcomeChannel : goodbyeChannel
  const setChannel = tab === 'welcome' ? setWelcomeChannel : setGoodbyeChannel
  const title = tab === 'welcome' ? welcomeTitle : goodbyeTitle
  const setTitle = tab === 'welcome' ? setWelcomeTitle : setGoodbyeTitle
  const desc = tab === 'welcome' ? welcomeDesc : goodbyeDesc
  const setDesc = tab === 'welcome' ? setWelcomeDesc : setGoodbyeDesc
  const color = tab === 'welcome' ? welcomeColor : goodbyeColor
  const setColor = tab === 'welcome' ? setWelcomeColor : setGoodbyeColor
  const image = tab === 'welcome' ? welcomeImage : goodbyeImage
  const setImage = tab === 'welcome' ? setWelcomeImage : setGoodbyeImage
  const thumbnail = tab === 'welcome' ? welcomeThumbnail : goodbyeThumbnail
  const setThumbnail = tab === 'welcome' ? setWelcomeThumbnail : setGoodbyeThumbnail
  const footer = tab === 'welcome' ? welcomeFooter : goodbyeFooter
  const setFooter = tab === 'welcome' ? setWelcomeFooter : setGoodbyeFooter
  const dm = tab === 'welcome' ? welcomeDm : goodbyeDm
  const setDm = tab === 'welcome' ? setWelcomeDm : setGoodbyeDm
  const dmMsg = tab === 'welcome' ? welcomeDmMsg : goodbyeDmMsg
  const setDmMsg = tab === 'welcome' ? setWelcomeDmMsg : setGoodbyeDmMsg

  const update = (fn: (v: any) => void) => (v: any) => { fn(v); setDirty(true) }

  const handleTest = async () => {
    setTestSending(true)
    await new Promise(r => setTimeout(r, 1500))
    setTestSending(false)
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-6xl">
      <PageHeader
        icon={tab === 'welcome' ? UserPlus : UserMinus}
        title="Welcome & Goodbye"
        description="Customize messages sent when members join or leave your server."
      />

      {/* Tab Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('welcome')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
            tab === 'welcome'
              ? 'bg-[#FFD600]/[0.1] text-[#FFD600] border border-[#FFD600]/20'
              : 'text-white/40 hover:text-white/60 border border-white/[0.04] hover:border-white/[0.08]'
          }`}
        >
          <UserPlus className="h-4 w-4" />
          Welcome
        </button>
        <button
          onClick={() => setTab('goodbye')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
            tab === 'goodbye'
              ? 'bg-[#FFD600]/[0.1] text-[#FFD600] border border-[#FFD600]/20'
              : 'text-white/40 hover:text-white/60 border border-white/[0.04] hover:border-white/[0.08]'
          }`}
        >
          <UserMinus className="h-4 w-4" />
          Goodbye
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column — Settings */}
        <div className="space-y-6">
          {/* Enable + Channel */}
          <div className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-white/80">Enable {tab === 'welcome' ? 'Welcome' : 'Goodbye'} Messages</p>
                <p className="text-[11px] text-white/30 mt-0.5">Send a message when a member {tab === 'welcome' ? 'joins' : 'leaves'}</p>
              </div>
              <Toggle checked={enabled} onChange={update(setEnabled)} />
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-medium text-white/50 flex items-center gap-2">
                <Hash className="h-3.5 w-3.5" /> Channel
              </label>
              <input
                type="text"
                value={channel}
                onChange={(e) => update(setChannel)(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-[13px] text-white/80 placeholder-white/20 focus:outline-none focus:border-[#FFD600]/30"
                placeholder="Channel ID (e.g. 123456789)"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-white/80 flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" /> DM the user
                </p>
                <p className="text-[11px] text-white/30 mt-0.5">Also send a direct message</p>
              </div>
              <Toggle checked={dm} onChange={update(setDm)} />
            </div>

            {dm && (
              <textarea
                value={dmMsg}
                onChange={(e) => update(setDmMsg)(e.target.value)}
                className="w-full h-20 px-3 py-2 rounded-xl border border-white/[0.06] bg-white/[0.02] text-[13px] text-white/80 placeholder-white/20 resize-none focus:outline-none focus:border-[#FFD600]/30"
                placeholder="DM message... Use {user}, {server}, {membercount}"
              />
            )}
          </div>

          {/* Embed Editor */}
          <div className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-5 space-y-5">
            <p className="text-[13px] font-medium text-white/60 flex items-center gap-2">
              <Palette className="h-4 w-4" /> Embed Editor
            </p>

            {/* Color */}
            <div className="space-y-2">
              <label className="text-[12px] font-medium text-white/50">Embed Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={color} onChange={(e) => update(setColor)(e.target.value)} className="h-9 w-12 rounded-lg border border-white/[0.06] cursor-pointer bg-transparent" />
                <input type="text" value={color} onChange={(e) => update(setColor)(e.target.value)} className="flex-1 h-9 px-3 rounded-lg border border-white/[0.06] bg-white/[0.02] text-[12px] font-mono text-white/60 focus:outline-none focus:border-[#FFD600]/30" />
                <div className="flex gap-1.5">
                  {QUICK_COLORS.map(c => (
                    <button key={c} onClick={() => update(setColor)(c)} className="h-6 w-6 rounded-full border border-white/10 hover:scale-110 transition-transform" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-[12px] font-medium text-white/50 flex items-center gap-2"><Type className="h-3.5 w-3.5" /> Title</label>
              <input type="text" value={title} onChange={(e) => update(setTitle)(e.target.value)} className="w-full h-9 px-3 rounded-lg border border-white/[0.06] bg-white/[0.02] text-[13px] text-white/80 placeholder-white/20 focus:outline-none focus:border-[#FFD600]/30" placeholder="Embed title..." />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[12px] font-medium text-white/50 flex items-center gap-2"><AlignLeft className="h-3.5 w-3.5" /> Description</label>
              <textarea value={desc} onChange={(e) => update(setDesc)(e.target.value)} className="w-full h-28 px-3 py-2 rounded-lg border border-white/[0.06] bg-white/[0.02] text-[13px] text-white/80 placeholder-white/20 resize-none focus:outline-none focus:border-[#FFD600]/30" placeholder="Supports **bold** and newlines" />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-[12px] font-medium text-white/50 flex items-center gap-2"><Image className="h-3.5 w-3.5" /> Image URL</label>
              <input type="url" value={image} onChange={(e) => update(setImage)(e.target.value)} className="w-full h-9 px-3 rounded-lg border border-white/[0.06] bg-white/[0.02] text-[13px] text-white/80 placeholder-white/20 focus:outline-none focus:border-[#FFD600]/30" placeholder="https://example.com/image.png" />
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <label className="text-[12px] font-medium text-white/50 flex items-center gap-2"><Image className="h-3.5 w-3.5" /> Thumbnail URL</label>
              <input type="url" value={thumbnail} onChange={(e) => update(setThumbnail)(e.target.value)} className="w-full h-9 px-3 rounded-lg border border-white/[0.06] bg-white/[0.02] text-[13px] text-white/80 placeholder-white/20 focus:outline-none focus:border-[#FFD600]/30" placeholder="https://example.com/thumb.png" />
            </div>

            {/* Footer */}
            <div className="space-y-2">
              <label className="text-[12px] font-medium text-white/50 flex items-center gap-2"><AlignLeft className="h-3.5 w-3.5" /> Footer</label>
              <input type="text" value={footer} onChange={(e) => update(setFooter)(e.target.value)} className="w-full h-9 px-3 rounded-lg border border-white/[0.06] bg-white/[0.02] text-[13px] text-white/80 placeholder-white/20 focus:outline-none focus:border-[#FFD600]/30" placeholder="Footer text..." />
            </div>
          </div>
        </div>

        {/* Right Column — Preview + Variables */}
        <div className="space-y-6">
          {/* Live Preview */}
          <div className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-5 space-y-4">
            <p className="text-[13px] font-medium text-white/60 flex items-center gap-2">
              <Eye className="h-4 w-4" /> Live Preview
            </p>

            <div className="rounded-xl bg-[#313338] p-4 space-y-3">
              {/* Bot header */}
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#FFD600] flex items-center justify-center">
                  <span className="text-black text-[10px] font-bold">W</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-white">Wembo</span>
                  <span className="text-[10px] px-1 py-0.5 rounded bg-[#5865F2]/30 text-[#5865F2] font-medium">BOT</span>
                  <span className="text-[11px] text-[#949ba4]">Today at 12:00 PM</span>
                </div>
              </div>

              {/* Embed */}
              <div className="ml-10">
                <div className="rounded-lg bg-[#2b2d31] p-4 max-w-sm">
                  <div className="flex gap-3">
                    <div className="w-1 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <div className="flex-1 min-w-0 space-y-2">
                      {title && <h4 className="text-[13px] font-semibold text-white">{replaceVars(title)}</h4>}
                      {desc && <p className="text-[12px] text-[#dbdee1] leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMd(replaceVars(desc)) }} />}
                      {footer && (
                        <div className="pt-2 border-t border-[#3f4147]">
                          <p className="text-[11px] text-[#949ba4]">{replaceVars(footer)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Variables */}
          <div className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-5 space-y-4">
            <p className="text-[13px] font-medium text-white/60">Variables</p>
            <p className="text-[11px] text-white/30">Use these in your messages — they get replaced with real values.</p>
            <div className="space-y-2">
              {VARIABLES.map(v => (
                <div key={v.name} className="flex items-center justify-between p-3 rounded-lg border border-white/[0.04] bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <code className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FFD600]/[0.08] text-[#FFD600]">{v.name}</code>
                    <span className="text-[12px] text-white/40">{v.desc}</span>
                  </div>
                  <button onClick={() => navigator.clipboard.writeText(v.name)} className="p-1.5 rounded-md text-white/20 hover:text-white/50 hover:bg-white/[0.04] transition-colors">
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Test Command */}
          <div className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-5 space-y-3">
            <button
              onClick={handleTest}
              disabled={testSending}
              className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[13px] text-white/50 hover:text-white/70 hover:border-white/[0.1] transition-all disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              {testSending ? 'Sending...' : `Test /${tab === 'welcome' ? 'testwelcome' : 'testgoodbye'}`}
            </button>
            <p className="text-[11px] text-white/25 text-center">Sends a test message to the configured channel</p>
          </div>
        </div>
      </div>

      {dirty && <SaveBar onSave={() => setDirty(false)} onDiscard={() => setDirty(false)} />}
    </div>
  )
}
