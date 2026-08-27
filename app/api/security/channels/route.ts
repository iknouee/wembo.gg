import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Fetch text channels for a guild using the bot token.
 */
export async function GET(request: NextRequest) {
  const guildId = request.nextUrl.searchParams.get('guild_id')
  if (!guildId) return NextResponse.json({ error: 'guild_id required', channels: [] }, { status: 400 })

  const botToken = process.env.DISCORD_BOT_TOKEN
  if (!botToken) return NextResponse.json({ channels: [] })

  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      headers: { Authorization: `Bot ${botToken}` },
    })

    if (!res.ok) return NextResponse.json({ channels: [] })

    const allChannels = await res.json()

    // Filter to text channels only (type 0 = text, type 5 = announcement)
    const textChannels = allChannels
      .filter((ch: any) => ch.type === 0 || ch.type === 5)
      .map((ch: any) => ({ id: ch.id, name: ch.name, type: ch.type }))
      .sort((a: any, b: any) => a.name.localeCompare(b.name))

    return NextResponse.json({ channels: textChannels })
  } catch {
    return NextResponse.json({ channels: [] })
  }
}
