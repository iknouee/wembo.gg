import { NextRequest, NextResponse } from 'next/server'
import { decodeSession } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get('wembo_session')
    if (!cookie?.value) return NextResponse.json({ guilds: [] }, { status: 401 })

    const { accessToken } = decodeSession(cookie.value)
    if (!accessToken) return NextResponse.json({ guilds: [] }, { status: 401 })

    const res = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!res.ok) return NextResponse.json({ guilds: [] }, { status: 500 })

    const guilds = await res.json()
    const manageable = guilds.filter((g: any) => {
      const perms = BigInt(g.permissions)
      return g.owner || (perms & BigInt(0x20)) !== BigInt(0)
    })

    return NextResponse.json({ guilds: manageable })
  } catch {
    return NextResponse.json({ guilds: [] }, { status: 500 })
  }
}
