'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Shield, Crown, Globe, Loader2 } from 'lucide-react'

interface GuildInfo {
  id: string
  name: string
  icon: string | null
  owner: boolean
}

export default function ServerDashboard() {
  const params = useParams()
  const serverId = params.serverId as string
  const [guild, setGuild] = useState<GuildInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [debug, setDebug] = useState('')

  useEffect(() => {
    // Fetch guilds from our API route which reads the cookie server-side
    fetch('/api/auth/guilds')
      .then((r) => r.json())
      .then((data) => {
        const guilds: GuildInfo[] = data.guilds || []
        const found = guilds.find((g) => g.id === serverId) || null
        setGuild(found)
        if (!found) {
          setDebug(`Guilds returned: ${guilds.length}. IDs: ${guilds.map(g => g.id).join(', ')}`)
        }
        setLoading(false)
      })
      .catch((err) => {
        setDebug(`Fetch error: ${err.message}`)
        setLoading(false)
      })
  }, [serverId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-6 w-6 text-[#FFD600] animate-spin" />
      </div>
    )
  }

  if (!guild) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <a href="/dashboard" className="inline-flex items-center gap-2 text-sm text-[#9A9CA3] hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to servers
        </a>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-[#0d0e11] border border-white/[0.04] flex items-center justify-center mb-5">
            <Globe className="h-7 w-7 text-white/15" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Server not found</h2>
          <p className="text-[#9A9CA3] text-sm max-w-sm">
            This server doesn&apos;t exist or you don&apos;t have permission to manage it.
          </p>
          {debug && (
            <p className="text-[10px] text-white/20 font-mono mt-4">{debug}</p>
          )}
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
      <a href="/dashboard" className="inline-flex items-center gap-2 text-sm text-[#9A9CA3] hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to servers
      </a>

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
