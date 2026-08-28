import { NextRequest, NextResponse } from 'next/server'

// POST /api/welcome — handles /testwelcome and /testgoodbye commands
// This endpoint would be called by the Discord bot interaction handler
// or from the dashboard to trigger a test message

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

    // In production, this would:
    // 1. Fetch the welcome/goodbye config for the guild from the database
    // 2. Replace variables ({user}, {server}, {membercount}) with real values
    // 3. Send the embed message to the configured channel via Discord API
    // 4. Optionally DM the user if dmEnabled is true

    // For now, simulate success
    return NextResponse.json({
      success: true,
      message: `Test ${type} message sent to channel ${channelId}`,
      type,
      guildId,
      channelId,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/welcome — fetch welcome/goodbye config for a guild
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const guildId = searchParams.get('guildId')
  const type = searchParams.get('type') // 'welcome' | 'goodbye'

  if (!guildId) {
    return NextResponse.json(
      { error: 'Missing required parameter: guildId' },
      { status: 400 }
    )
  }

  // In production, this would fetch from the database
  // For now, return mock config structure
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

// PUT /api/welcome — update welcome/goodbye config for a guild
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

    // In production, this would save to the database
    // Validate the config structure
    const requiredEmbedFields = ['title', 'description', 'color']
    for (const field of requiredEmbedFields) {
      if (config.embed && config.embed[field] === undefined) {
        return NextResponse.json(
          { error: `Missing embed field: ${field}` },
          { status: 400 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: `${type} config updated successfully`,
      guildId,
      type,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
