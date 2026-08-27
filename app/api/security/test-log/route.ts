import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/security/test-log
 * Sends a test security embed to the specified Discord channel.
 * Body: { channel_id: string, guild_id: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { channel_id, guild_id } = await request.json()

    if (!channel_id) {
      return NextResponse.json({ error: 'channel_id required' }, { status: 400 })
    }

    const botToken = process.env.DISCORD_BOT_TOKEN
    if (!botToken) {
      return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 })
    }

    const embed = {
      title: '🧪 Test Log Message',
      description: 'This is a test security log from Wembo. If you can see this message, security logging is working correctly.',
      color: 0xFFD600, // Wembo yellow
      fields: [
        { name: 'Module', value: 'Test', inline: true },
        { name: 'Action', value: 'None — this is a test', inline: true },
        { name: 'Server', value: guild_id || 'Unknown', inline: true },
      ],
      footer: {
        text: 'Wembo Security • Test Message',
      },
      timestamp: new Date().toISOString(),
    }

    const res = await fetch(`https://discord.com/api/v10/channels/${channel_id}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${botToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ embeds: [embed] }),
    })

    if (!res.ok) {
      const error = await res.text()
      return NextResponse.json({ error: `Discord API error: ${res.status} — ${error}` }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
