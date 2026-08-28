import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * GET /api/moderation/warns?guild_id=xxx&user_id=xxx (optional)
 * Returns warnings for a guild, optionally filtered by user.
 */
export async function GET(request: NextRequest) {
  const guildId = request.nextUrl.searchParams.get('guild_id')
  const userId = request.nextUrl.searchParams.get('user_id')
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50')

  if (!guildId) {
    return NextResponse.json({ error: 'guild_id required' }, { status: 400 })
  }

  try {
    const supabase = getSupabase()
    let query = supabase
      .from('warnings')
      .select('*')
      .eq('guild_id', guildId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ warnings: data || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message, warnings: [] }, { status: 500 })
  }
}

/**
 * POST /api/moderation/warns
 * Create a new warning.
 * Body: { guild_id, user_id, user_tag, moderator_id, moderator_tag, reason }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { guild_id, user_id, user_tag, moderator_id, moderator_tag, reason } = body

    if (!guild_id || !user_id || !moderator_id) {
      return NextResponse.json({ error: 'guild_id, user_id, and moderator_id required' }, { status: 400 })
    }

    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('warnings')
      .insert({
        guild_id,
        user_id,
        user_tag: user_tag || 'Unknown',
        moderator_id,
        moderator_tag: moderator_tag || 'Unknown',
        reason: reason || 'No reason provided',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, warning: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

/**
 * DELETE /api/moderation/warns
 * Delete a warning by ID.
 * Body: { id, guild_id }
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, guild_id } = body

    if (!id || !guild_id) {
      return NextResponse.json({ error: 'id and guild_id required' }, { status: 400 })
    }

    const supabase = getSupabase()

    const { error } = await supabase
      .from('warnings')
      .delete()
      .eq('id', id)
      .eq('guild_id', guild_id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
