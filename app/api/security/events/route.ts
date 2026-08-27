import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * GET /api/security/events?guild_id=xxx&limit=20
 * Returns recent security events for a guild.
 */
export async function GET(request: NextRequest) {
  const guildId = request.nextUrl.searchParams.get('guild_id')
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20')

  if (!guildId) {
    return NextResponse.json({ error: 'guild_id required' }, { status: 400 })
  }

  try {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('security_events')
      .select('*')
      .eq('guild_id', guildId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return NextResponse.json({ events: data || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message, events: [] }, { status: 500 })
  }
}
