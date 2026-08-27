'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Server, Plus, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Guild {
  id: string
  name: string
  icon: string | null
}

export default function DashboardOverview() {
  const [guilds, setGuilds] = useState<Guild[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ username: string; global_name: string | null } | null>(null)

  useEffect(() => {
    // Fetch user
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => { if (data.user) setUser(data.user) })
      .catch(() => {})

    // Fetch guilds
    fetch('/api/auth/guilds')
      .then((r) => r.json())
      .then((data) => { setGuilds(data.guilds || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const greeting = getGreeting()
  const displayName = user?.global_name || user?.username || ''

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          {greeting}{displayName ? `, ${displayName}` : ''} 👋
        </h1>
        <p className="text-[#9A9CA3] mt-1">
          Select a server to manage.
        </p>
      </div>

      {/* Server list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 text-[#FFD600] animate-spin" />
        </div>
      ) : guilds.length === 0 ? (
        /* No servers */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-5">
            <Server className="h-7 w-7 text-white/20" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">No servers found</h2>
          <p className="text-[#9A9CA3] text-sm max-w-sm mb-6">
            You don&apos;t have any servers where you can manage Wembo. Add Wembo to a server to get started.
          </p>
          <Link href="/invite">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Wembo to a Server
            </Button>
          </Link>
        </div>
      ) : (
        /* Server grid */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guilds.map((guild) => (
            <Link
              key={guild.id}
              href={`/dashboard/${guild.id}`}
              className="group flex items-center gap-4 p-5 rounded-xl border border-white/[0.06] bg-[#0a0b0d] hover:border-[#FFD600]/15 hover:bg-[#FFD600]/[0.02] transition-all duration-300"
            >
              {/* Server icon */}
              {guild.icon ? (
                <img
                  src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=64`}
                  alt={guild.name}
                  className="h-12 w-12 rounded-xl object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-xl bg-white/[0.05] flex items-center justify-center text-white/40 font-semibold text-sm">
                  {guild.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              {/* Server info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/90 truncate group-hover:text-white transition-colors">{guild.name}</p>
                <p className="text-xs text-[#9A9CA3] mt-0.5">Click to manage</p>
              </div>
              <ArrowRight className="h-4 w-4 text-white/10 group-hover:text-[#FFD600]/60 transition-colors" />
            </Link>
          ))}

          {/* Add server card */}
          <Link
            href="#"
            className="flex items-center justify-center gap-3 p-5 rounded-xl border border-dashed border-white/[0.08] hover:border-[#FFD600]/20 hover:bg-[#FFD600]/[0.02] transition-all duration-300"
          >
            <Plus className="h-5 w-5 text-white/20" />
            <span className="text-sm text-white/30">Add Wembo to a server</span>
          </Link>
        </div>
      )}
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
