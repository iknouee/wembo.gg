'use client'

import { useAuth } from '@/components/dashboard/auth-provider'
import { LogOut, User } from 'lucide-react'

export function UserProfile() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center gap-2.5 px-2.5 py-2 animate-pulse">
        <div className="h-7 w-7 rounded-full bg-muted" />
        <div className="flex-1">
          <div className="h-3 w-20 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <a
        href="/api/auth/login"
        className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
      >
        <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
          <User className="h-3.5 w-3.5" />
        </div>
        <span className="font-medium">Sign in</span>
      </a>
    )
  }

  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=64`
    : null

  return (
    <div className="flex items-center justify-between px-2.5 py-2 rounded-md">
      <div className="flex items-center gap-2.5 min-w-0">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
            {(user.global_name || user.username)[0].toUpperCase()}
          </div>
        )}
        <span className="text-[12px] font-medium truncate">
          {user.global_name || user.username}
        </span>
      </div>
      <a
        href="/api/auth/logout"
        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
        title="Sign out"
      >
        <LogOut className="h-3.5 w-3.5" />
      </a>
    </div>
  )
}
