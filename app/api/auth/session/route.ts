import { NextRequest, NextResponse } from 'next/server'
import { decodeSession } from '@/lib/session'

export const dynamic = 'force-dynamic'

/**
 * Returns user info + guilds in a single API call.
 * Uses request.cookies (NOT cookies() from next/headers) which doesn't
 * trigger the cookie-clearing behavior seen with Server Components.
 */
export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get('wembo_session')
    if (!cookie?.value) {
      return NextResponse.json({ user: null, guilds: [], accessToken: null })
    }

    const { accessToken, user } = decodeSession(cookie.value)

    if (!accessToken) {
      return NextResponse.json({ user: null, guilds: [], accessToken: null })
    }

    // Fetch guilds from Discord
    let guilds: any[] = []
    try {
      const res = await fetch('https://discord.com/api/v10/users/@me/guilds', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (res.ok) {
        const allGuilds = await res.json()
        guilds = allGuilds.filter((g: any) => {
          const perms = BigInt(g.permissions)
          return g.owner || (perms & BigInt(0x20)) !== BigInt(0)
        })
      }
    } catch {}

    return NextResponse.json({ user, guilds, accessToken })
  } catch {
    return NextResponse.json({ user: null, guilds: [], accessToken: null })
  }
}
