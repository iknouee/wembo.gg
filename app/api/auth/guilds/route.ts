import { NextResponse } from 'next/server'
import { getSession, fetchGuilds } from '@/lib/auth'

export async function GET() {
  const session = getSession()

  if (!session) {
    return NextResponse.json({ guilds: [] }, { status: 401 })
  }

  try {
    const guilds = await fetchGuilds(session.accessToken)

    // Filter to guilds where user has MANAGE_GUILD permission (0x20)
    const manageable = guilds.filter((g) => {
      const perms = BigInt(g.permissions)
      return g.owner || (perms & BigInt(0x20)) !== BigInt(0)
    })

    return NextResponse.json({ guilds: manageable })
  } catch (err) {
    console.error('Failed to fetch guilds:', err)
    return NextResponse.json({ guilds: [] }, { status: 500 })
  }
}
