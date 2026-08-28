import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * GET /api/moderation/logs?guild_id=xxx&limit=50
 * Returns moderation action logs for a guild.
 */
export async function GET(request: NextRequest) {
  const guildId = request.nextUrl.searchParams.get('guild_id')
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50')
  const filter = request.nextUrl.searchParams.get('filter') // warn, mute, kick, ban, unban

  if (!guildId) {
    return NextResponse.json({ error: 'guild_id required' }, { status: 400 })
  }

  try {
    const supabase = getSupabase()
    let query = supabase
      .from('mod_logs')
      .select('*')
      .eq('guild_id', guildId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (filter) {
      query = query.eq('action', filter)
    }

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ logs: data || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message, logs: [] }, { status: 500 })
  }
}

/**
 * POST /api/moderation/logs
 * Create a mod log entry.
 * Body: { guild_id, action, user_id, user_tag, moderator_id, moderator_tag, reason, duration }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { guild_id, action, user_id, user_tag, moderator_id, moderator_tag, reason, duration } = body

    if (!guild_id || !action || !user_id || !moderator_id) {
      return NextResponse.json({ error: 'guild_id, action, user_id, and moderator_id required' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Get next case number for this guild
    const { data: lastCase } = await supabase
      .from('mod_logs')
      .select('case_number')
      .eq('guild_id', guild_id)
      .order('case_number', { ascending: false })
      .limit(1)
      .single()

    const caseNumber = (lastCase?.case_number || 0) + 1

    const { data, error } = await supabase
      .from('mod_logs')
      .insert({
        guild_id,
        case_number: caseNumber,
        action,
        user_id,
        user_tag: user_tag || 'Unknown',
        moderator_id,
        moderator_tag: moderator_tag || 'Unknown',
        reason: reason || 'No reason provided',
        duration: duration || null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, log: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
