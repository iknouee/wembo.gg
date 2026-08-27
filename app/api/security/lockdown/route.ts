import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * GET /api/security/lockdown?guild_id=xxx
 * Returns lockdown status for a guild.
 */
export async function GET(request: NextRequest) {
  const guildId = request.nextUrl.searchParams.get('guild_id')

  if (!guildId) {
    return NextResponse.json({ error: 'guild_id required' }, { status: 400 })
  }

  try {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('server_settings')
      .select('lockdown_active, lockdown_activated_at')
      .eq('guild_id', guildId)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return NextResponse.json({
      lockdown: data?.lockdown_active || false,
      activatedAt: data?.lockdown_activated_at || null,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message, lockdown: false }, { status: 500 })
  }
}

/**
 * POST /api/security/lockdown
 * Toggle lockdown on/off.
 * Body: { guild_id, active }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { guild_id, active } = body

    if (!guild_id || typeof active !== 'boolean') {
      return NextResponse.json({ error: 'guild_id and active required' }, { status: 400 })
    }

    const supabase = getSupabase()

    const { error } = await supabase
      .from('server_settings')
      .upsert({
        guild_id,
        lockdown_active: active,
        lockdown_activated_at: active ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'guild_id' })

    if (error) throw error

    return NextResponse.json({ success: true, lockdown: active })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
