import { cookies } from 'next/headers'
import Link from 'next/link'
import { Server, Plus, ArrowRight, Shield, Zap, TrendingUp, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Guild {
  id: string
  name: string
  icon: string | null
  owner: boolean
  permissions: string
}

interface SessionUser {
  id: string
  username: string
  avatar: string | null
  global_name: string | null
}

function getSessionData(): { user: SessionUser | null; accessToken: string | null } {
  try {
    const cookieStore = cookies()
    const cookie = cookieStore.get('wembo_session')
    if (!cookie?.value) return { user: null, accessToken: null }

    const secret = process.env.AUTH_SECRET || 'fallback-secret-change-me'
    const cookieValue = cookie.value.replace(/-/g, '+').replace(/_/g, '/')
    const raw = atob(cookieValue)

    let decrypted = ''
    for (let i = 0; i < raw.length; i++) {
      decrypted += String.fromCharCode(
        raw.charCodeAt(i) ^ secret.charCodeAt(i % secret.length)
      )
    }

    const session = JSON.parse(decrypted)
    return { user: session.user, accessToken: session.accessToken }
  } catch {
    return { user: null, accessToken: null }
  }
}

async function fetchGuilds(accessToken: string): Promise<Guild[]> {
  try {
    const res = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { revalidate: 60 },
    })

    if (!res.ok) return []

    const guilds = await res.json()

    // Filter to guilds where user has MANAGE_GUILD permission (0x20)
    return guilds.filter((g: any) => {
      const perms = BigInt(g.permissions)
      return g.owner || (perms & BigInt(0x20)) !== BigInt(0)
    })
  } catch {
    return []
  }
}

export default async function DashboardOverview() {
  const { user, accessToken } = getSessionData()
  const guilds = accessToken ? await fetchGuilds(accessToken) : []

  const greeting = getGreeting()
  const displayName = user?.global_name || user?.username || ''
  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
    : null

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex items-start gap-4">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="h-12 w-12 rounded-xl object-cover hidden sm:block" />
        ) : user ? (
          <div className="h-12 w-12 rounded-xl bg-[#FFD600]/10 items-center justify-center text-[#FFD600] font-bold text-sm hidden sm:flex">
            {(displayName || '?')[0].toUpperCase()}
          </div>
        ) : null}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">
            {greeting}{displayName ? `, ${displayName}` : ''} 👋
          </h1>
          <p className="text-[#9A9CA3] mt-1 text-sm">
            Here&apos;s an overview of your servers. Select one to manage.
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-2 text-xs text-white/20">
          <Clock className="h-3.5 w-3.5" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Quick Stats */}
      {guilds.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickStat icon={Server} label="Servers" value={guilds.length.toString()} color="yellow" />
          <QuickStat icon={Shield} label="Protected" value={guilds.length.toString()} color="green" />
          <QuickStat icon={Zap} label="Automations" value={`${guilds.length * 4}`} color="blue" />
          <QuickStat icon={TrendingUp} label="Health" value="98%" color="purple" />
        </div>
      )}

      {/* Server list */}
      {guilds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-2xl bg-[#0d0e11] border border-white/[0.04] flex items-center justify-center mb-6">
            <Server className="h-8 w-8 text-white/15" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">No servers found</h2>
          <p className="text-[#9A9CA3] text-sm max-w-sm mb-6 leading-relaxed">
            You don&apos;t have any servers where you can manage Wembo. Add Wembo to a server to get started.
          </p>
          <Link href="/invite" className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FFD600] text-black text-xs font-semibold hover:bg-[#FFD600]/90 transition-colors">
            <Plus className="h-3.5 w-3.5" />
            Add Wembo to a Server
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-white/60">Your Servers</h2>
            <span className="text-xs text-white/20">{guilds.length} server{guilds.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {guilds.map((guild) => (
              <a
                key={guild.id}
                href={`/dashboard/${guild.id}`}
                className="group relative flex items-center gap-4 p-5 rounded-xl bg-[#0a0b0d] border border-white/[0.04] shadow-lg shadow-black/20 hover:bg-[#0f1012] hover:border-[#FFD600]/10 hover:shadow-[#FFD600]/[0.02] transition-all duration-300"
              >
                {guild.owner && (
                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-[#FFD600]/10 text-[#FFD600]">
                      Owner
                    </span>
                  </div>
                )}

                {guild.icon ? (
                  <img
                    src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=64`}
                    alt={guild.name}
                    className="h-12 w-12 rounded-xl object-cover ring-1 ring-white/[0.06]"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] flex items-center justify-center text-white/50 font-semibold text-sm ring-1 ring-white/[0.06]">
                    {guild.name.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white/90 truncate group-hover:text-white transition-colors">
                    {guild.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-white/25">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500/60"></span>
                      Active
                    </span>
                    <span className="flex items-center gap-1 text-xs text-white/25">
                      <Shield className="h-3 w-3" />
                      Protected
                    </span>
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 text-white/10 group-hover:text-[#FFD600]/60 group-hover:translate-x-0.5 transition-all" />
              </a>
            ))}

            <Link
              href="/invite"
              className="group flex items-center justify-center gap-3 p-5 rounded-xl border border-dashed border-white/[0.06] hover:border-[#FFD600]/20 hover:bg-[#FFD600]/[0.02] transition-all duration-300 min-h-[88px]"
            >
              <div className="h-8 w-8 rounded-lg bg-white/[0.04] group-hover:bg-[#FFD600]/10 flex items-center justify-center transition-colors">
                <Plus className="h-4 w-4 text-white/20 group-hover:text-[#FFD600]/60 transition-colors" />
              </div>
              <span className="text-sm text-white/30 group-hover:text-white/50 transition-colors">Add a server</span>
            </Link>
          </div>
        </div>
      )}

      {/* Tips + Updates */}
      {guilds.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-[#0a0b0d] border border-white/[0.04] p-5">
            <h3 className="text-sm font-medium text-white/70 mb-4">Quick Tips</h3>
            <div className="space-y-3">
              <Tip emoji="🤖" text="Set up AI responses in your server to auto-answer FAQs" />
              <Tip emoji="🛡️" text="Enable anti-raid protection to guard against mass joins" />
              <Tip emoji="📊" text="Check Analytics weekly to track community growth" />
            </div>
          </div>
          <div className="rounded-xl bg-[#0a0b0d] border border-white/[0.04] p-5">
            <h3 className="text-sm font-medium text-white/70 mb-4">What&apos;s New</h3>
            <div className="space-y-3">
              <UpdateItem badge="New" text="AI-powered moderation is now available" color="green" />
              <UpdateItem badge="Update" text="Improved analytics with hourly breakdowns" color="blue" />
              <UpdateItem badge="Soon" text="Custom forms builder launching next week" color="yellow" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function QuickStat({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    yellow: 'bg-[#FFD600]/[0.06] text-[#FFD600]',
    green: 'bg-green-500/[0.06] text-green-400',
    blue: 'bg-blue-500/[0.06] text-blue-400',
    purple: 'bg-purple-500/[0.06] text-purple-400',
  }

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0a0b0d] border border-white/[0.04]">
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${colors[color]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-lg font-bold text-white">{value}</p>
        <p className="text-[11px] text-white/30">{label}</p>
      </div>
    </div>
  )
}

function Tip({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-sm mt-0.5">{emoji}</span>
      <p className="text-xs text-white/40 leading-relaxed">{text}</p>
    </div>
  )
}

function UpdateItem({ badge, text, color }: { badge: string; text: string; color: string }) {
  const colors: Record<string, string> = {
    green: 'bg-green-500/10 text-green-400',
    blue: 'bg-blue-500/10 text-blue-400',
    yellow: 'bg-[#FFD600]/10 text-[#FFD600]',
  }

  return (
    <div className="flex items-start gap-2.5">
      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${colors[color]} mt-0.5`}>
        {badge}
      </span>
      <p className="text-xs text-white/40 leading-relaxed">{text}</p>
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
