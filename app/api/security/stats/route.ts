import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * GET /api/security/stats?guild_id=xxx
 * Returns security stats for a guild.
 */
export async function GET(request: NextRequest) {
  const guildId = request.nextUrl.searchParams.get('guild_id')

  if (!guildId) {
    return NextResponse.json({ error: 'guild_id required' }, { status: 400 })
  }

  try {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('security_stats')
      .select('*')
      .eq('guild_id', guildId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows

    return NextResponse.json({
      stats: data || {
        threats_blocked_week: 0,
        threats_blocked_month: 0,
        raids_prevented_month: 0,
        links_scanned_total: 0,
        accounts_flagged: 0,
      }
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stats: null }, { status: 500 })
  }
}
