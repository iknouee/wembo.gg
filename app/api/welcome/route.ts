import { NextRequest, NextResponse } from 'next/server'

interface TestMessagePayload {
  type: 'welcome' | 'goodbye'
  guildId: string
  channelId: string
  userId?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: TestMessagePayload = await request.json()
    const { type, guildId, channelId } = body

    if (!type || !guildId || !channelId) {
      return NextResponse.json(
        { error: 'Missing required fields: type, guildId, channelId' },
        { status: 400 }
      )
    }

    if (type !== 'welcome' && type !== 'goodbye') {
      return NextResponse.json(
        { error: 'Invalid type. Must be "welcome" or "goodbye"' },
        { status: 400 }
      )
    }

    // In production: fetch config from Supabase, replace variables, send via Discord API
    return NextResponse.json({
      success: true,
      message: `Test ${type} message sent to channel ${channelId}`,
      type,
      guildId,
      channelId,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const guildId = searchParams.get('guildId')
  const type = searchParams.get('type')

  if (!guildId) {
    return NextResponse.json({ error: 'Missing required parameter: guildId' }, { status: 400 })
  }

  const mockConfig = {
    welcome: {
      enabled: true,
      channelId: '1234567890',
      embed: {
        title: 'Welcome to {server}! 🎉',
        description: 'Hey {user}, welcome to **{server}**! You are member #{membercount}.',
        color: '#5865F2',
        imageUrl: '',
        thumbnailUrl: '',
        footerText: 'Enjoy your stay!',
      },
      dmEnabled: false,
      dmMessage: '',
    },
    goodbye: {
      enabled: true,
      channelId: '1234567890',
      embed: {
        title: 'Goodbye! 👋',
        description: '{user} has left **{server}**. We now have {membercount} members.',
        color: '#ED4245',
        imageUrl: '',
        thumbnailUrl: '',
        footerText: "We'll miss you!",
      },
      dmEnabled: false,
      dmMessage: '',
    },
  }

  if (type && (type === 'welcome' || type === 'goodbye')) {
    return NextResponse.json(mockConfig[type])
  }

  return NextResponse.json(mockConfig)
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { guildId, type, config } = body

    if (!guildId || !type || !config) {
      return NextResponse.json(
        { error: 'Missing required fields: guildId, type, config' },
        { status: 400 }
      )
    }

    if (type !== 'welcome' && type !== 'goodbye') {
      return NextResponse.json(
        { error: 'Invalid type. Must be "welcome" or "goodbye"' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `${type} config updated successfully`,
      guildId,
      type,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
