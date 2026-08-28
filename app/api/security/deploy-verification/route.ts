import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * POST /api/security/deploy-verification
 * Sends the verification embed to the configured channel using the bot token.
 * Body: { guild_id: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { guild_id } = await request.json()

    if (!guild_id) {
      return NextResponse.json({ error: 'guild_id required' }, { status: 400 })
    }

    const botToken = process.env.DISCORD_BOT_TOKEN
    if (!botToken) {
      return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 })
    }

    // Get verification config from DB
    const supabase = getSupabase()
    const { data } = await supabase
      .from('security_modules')
      .select('config, enabled')
      .eq('guild_id', guild_id)
      .eq('module_id', 'verification')
      .single()

    if (!data || !data.enabled) {
      return NextResponse.json({ error: 'Verification module is not enabled. Enable it and save first.' }, { status: 400 })
    }

    const config = data.config || {}

    if (!config.channel_id) {
      return NextResponse.json({ error: 'No channel configured. Select a channel and save first.' }, { status: 400 })
    }

    // Build Discord embed
    const embed: any = {
      title: config.embed_title || 'Verify to Access the Server',
      description: config.embed_description || 'Click the button below to verify.',
      color: parseInt((config.embed_color || '#FFD600').replace('#', ''), 16),
    }
    if (config.embed_image) embed.image = { url: config.embed_image }
    if (config.embed_thumbnail) embed.thumbnail = { url: config.embed_thumbnail }
    if (config.embed_footer) embed.footer = { text: config.embed_footer }

    // Build button
    const styleMap: Record<string, number> = {
      Primary: 1,
      Secondary: 2,
      Success: 3,
      Danger: 4,
    }

    const component = {
      type: 1, // Action Row
      components: [{
        type: 2, // Button
        style: styleMap[config.button_style] || 3,
        label: config.button_label || '✓ Verify',
        custom_id: 'wembo_verify',
      }],
    }

    // Send to Discord
    const res = await fetch(`https://discord.com/api/v10/channels/${config.channel_id}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${botToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed],
        components: [component],
      }),
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
