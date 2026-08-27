import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get('wembo_session')
    if (!cookie?.value || cookie.value.length < 10) {
      return NextResponse.json({ user: null, guilds: [], loggedIn: false })
    }

    const accessToken = cookie.value

    // Fetch user and guilds from Discord in parallel
    const [userRes, guildsRes] = await Promise.all([
      fetch('https://discord.com/api/v10/users/@me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      fetch('https://discord.com/api/v10/users/@me/guilds', {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    ])

    const user = userRes.ok ? await userRes.json() : null
    const allGuilds = guildsRes.ok ? await guildsRes.json() : []

    // Filter to manageable guilds
    const guilds = allGuilds.filter((g: any) => {
      const perms = BigInt(g.permissions)
      return g.owner || (perms & BigInt(0x20)) !== BigInt(0)
    })

    const userData = user ? {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      global_name: user.global_name,
    } : null

    return NextResponse.json({ user: userData, guilds, loggedIn: true })
  } catch {
    return NextResponse.json({ user: null, guilds: [], loggedIn: false })
  }
}
