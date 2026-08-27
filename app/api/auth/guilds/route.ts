import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get('wembo_session')
    if (!cookie?.value || cookie.value.length < 10) {
      return NextResponse.json({ guilds: [] })
    }

    const res = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bearer ${cookie.value}` },
    })

    if (!res.ok) return NextResponse.json({ guilds: [] })

    const guilds = await res.json()
    const manageable = guilds.filter((g: any) => {
      const perms = BigInt(g.permissions)
      return g.owner || (perms & BigInt(0x20)) !== BigInt(0)
    })

    return NextResponse.json({ guilds: manageable })
  } catch {
    return NextResponse.json({ guilds: [] })
  }
}
