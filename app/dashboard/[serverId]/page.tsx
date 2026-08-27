import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, Shield, Hash, Crown, Globe, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface GuildInfo {
  id: string
  name: string
  icon: string | null
  owner: boolean
  approximate_member_count?: number
  approximate_presence_count?: number
  description?: string | null
}

function getAccessToken(): string | null {
  try {
    const cookieStore = cookies()
    const cookie = cookieStore.get('wembo_session')
    if (!cookie?.value) return null

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
    return session.accessToken || null
  } catch {
    return null
  }
}

async function fetchGuild(accessToken: string, serverId: string): Promise<GuildInfo | null> {
  try {
    // Fetch user's guilds and find the matching one
    const res = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { revalidate: 60 },
    })

    if (!res.ok) return null

    const guilds = await res.json()
    const guild = guilds.find((g: any) => g.id === serverId)

    return guild || null
  } catch {
    return null
  }
}

export default async function ServerDashboard({
  params,
}: {
  params: { serverId: string }
}) {
  const accessToken = getAccessToken()
  if (!accessToken) redirect('/login')

  const guild = await fetchGuild(accessToken, params.serverId)

  if (!guild) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-[#9A9CA3] hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to servers
        </Link>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-[#0d0e11] border border-white/[0.04] flex items-center justify-center mb-5">
            <Globe className="h-7 w-7 text-white/15" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Server not found</h2>
          <p className="text-[#9A9CA3] text-sm max-w-sm">
            This server doesn&apos;t exist or you don&apos;t have permission to manage it.
          </p>
        </div>
      </div>
    )
  }

  const iconUrl = guild.icon
    ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`
    : null

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Back link */}
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-[#9A9CA3] hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to servers
      </Link>

      {/* Server Header */}
      <div className="flex items-center gap-5 p-6 rounded-xl bg-[#0a0b0d] border border-white/[0.04]">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={guild.name}
            className="h-16 w-16 rounded-xl object-cover ring-1 ring-white/[0.06]"
          />
        ) : (
          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] flex items-center justify-center text-white/50 font-bold text-lg ring-1 ring-white/[0.06]">
            {guild.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-white truncate">{guild.name}</h1>
            {guild.owner && (
              <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FFD600]/10 text-[#FFD600]">
                <Crown className="h-3 w-3" />
                Owner
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-white/30">
              <span className="h-2 w-2 rounded-full bg-green-500/60" />
              Connected
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/30">
              <Shield className="h-3 w-3" />
              Protected
            </span>
          </div>
        </div>
      </div>

      {/* Server ID */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#0a0b0d] border border-white/[0.04] w-fit">
        <span className="text-xs text-white/20">Server ID:</span>
        <code className="text-xs text-white/50 font-mono">{guild.id}</code>
      </div>

      {/* Coming soon */}
      <div className="rounded-xl border border-[#FFD600]/10 bg-[#FFD600]/[0.02] p-5">
        <p className="text-sm text-[#FFD600]/80 font-medium">🚧 Server features are being built</p>
        <p className="text-xs text-[#9A9CA3] mt-1">
          Modules like AI, Security, Automations, and Analytics will appear here as they&apos;re added.
        </p>
      </div>
    </div>
  )
}
