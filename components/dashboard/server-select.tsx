'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useAuth } from '@/components/dashboard/dashboard-shell'
import { ChevronDown } from 'lucide-react'

export function ServerSelect() {
  const { guilds } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentGuildId = searchParams.get('guild') || guilds[0]?.id || ''

  const currentGuild = guilds.find(g => g.id === currentGuildId)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGuildId = e.target.value
    router.push(`${pathname}?guild=${newGuildId}`)
  }

  if (guilds.length <= 1) return null

  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-white/20">Server:</span>
      <div className="relative">
        <select
          value={currentGuildId}
          onChange={handleChange}
          className="h-8 pl-3 pr-8 rounded-lg bg-white/[0.03] ring-1 ring-white/[0.06] text-[12px] text-white/70 appearance-none cursor-pointer focus:outline-none focus:ring-[#FFD600]/20 transition-colors"
        >
          {guilds.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-white/20 pointer-events-none" />
      </div>
    </div>
  )
}

export function useSelectedGuild(): string | null {
  const { guilds } = useAuth()
  const searchParams = useSearchParams()
  return searchParams.get('guild') || guilds[0]?.id || null
}
