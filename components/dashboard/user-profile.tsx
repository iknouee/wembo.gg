'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LogOut, Settings, User } from 'lucide-react'

interface UserData {
  id: string
  username: string
  discriminator: string
  avatar: string | null
  email?: string | null
}

export function UserProfile() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        setUser(data.user)
      } catch (err) {
        console.error('Failed to fetch user:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-3 p-2 animate-pulse">
        <div className="h-8 w-8 rounded-full bg-muted" />
        <div className="flex-1">
          <div className="h-3 w-20 bg-muted rounded" />
          <div className="h-2 w-14 bg-muted rounded mt-1.5" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-3 p-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          <User className="h-4 w-4" />
        </div>
        <span>Sign in</span>
      </Link>
    )
  }

  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=64`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator || '0') % 5}.png`

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="w-full flex items-center gap-3 p-2 rounded-lg text-sm hover:bg-accent transition-colors"
      >
        <Image
          src={avatarUrl}
          alt={user.username}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover"
        />
        <div className="flex-1 text-left min-w-0">
          <p className="font-medium text-foreground truncate">{user.username}</p>
          <p className="text-xs text-muted-foreground truncate">Online</p>
        </div>
      </button>

      {/* Dropdown menu */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute bottom-full left-0 right-0 mb-1 z-50 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
            <Link
              href="/dashboard/settings"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <a
              href="/api/auth/logout"
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-accent transition-colors border-t border-border"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </a>
          </div>
        </>
      )}
    </div>
  )
}
