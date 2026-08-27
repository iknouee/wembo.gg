import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get('wembo_session')

    if (!cookie?.value) {
      return NextResponse.json({ guilds: [] }, { status: 401 })
    }

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
    const accessToken = session.at || session.accessToken

    if (!accessToken) {
      return NextResponse.json({ guilds: [] }, { status: 401 })
    }

    // Fetch guilds from Discord
    const res = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!res.ok) {
      return NextResponse.json({ guilds: [] }, { status: 500 })
    }

    const guilds = await res.json()

    // Filter to guilds where user has MANAGE_GUILD permission (0x20)
    const manageable = guilds.filter((g: any) => {
      const perms = BigInt(g.permissions)
      return g.owner || (perms & BigInt(0x20)) !== BigInt(0)
    })

    return NextResponse.json({ guilds: manageable })
  } catch {
    return NextResponse.json({ guilds: [] }, { status: 500 })
  }
}
