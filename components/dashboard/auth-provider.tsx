'use client'

import { useState, useEffect, createContext, useContext } from 'react'

// ─── Auth Context (shared with dashboard-shell.tsx for backwards compat) ─────

interface User { id: string; username: string; avatar: string | null; global_name: string | null }
interface Guild { id: string; name: string; icon: string | null; owner: boolean; permissions: string }
interface AuthState { user: User | null; guilds: Guild[]; loading: boolean; token: string | null; selectedGuild: string | null; setSelectedGuild: (id: string) => void }

export const AuthContext = createContext<AuthState>({ user: null, guilds: [], loading: true, token: null, selectedGuild: null, setSelectedGuild: () => {} })
export const useAuth = () => useContext(AuthContext)

function getToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|; )wembo_token=([^;]*)/)
  return match ? match[1] : null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [guilds, setGuilds] = useState<Guild[]>([])
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  const [selectedGuild, setSelectedGuild] = useState<string | null>(null)

  useEffect(() => {
    const t = getToken()
    setToken(t)
    if (!t) { setLoading(false); return }

    fetch('https://discord.com/api/v10/users/@me', { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.ok ? r.json() : null)
      .then(u => { if (u) setUser(u) })
      .catch(() => {})
      .finally(() => setLoading(false))

    fetch('https://discord.com/api/v10/users/@me/guilds', { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.ok ? r.json() : [])
      .then(g => {
        setGuilds(g)
        if (g.length > 0 && !selectedGuild) setSelectedGuild(g[0].id)
      })
      .catch(() => {})
  }, [])

  return (
    <AuthContext.Provider value={{ user, guilds, loading, token, selectedGuild, setSelectedGuild }}>
      {children}
    </AuthContext.Provider>
  )
}
