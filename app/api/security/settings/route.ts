import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const guildId = request.nextUrl.searchParams.get('guild_id')
  if (!guildId) return NextResponse.json({ error: 'guild_id required' }, { status: 400 })

  try {
    const supabase = getSupabase()
    const { data } = await supabase.from('server_settings').select('*').eq('guild_id', guildId).single()
    return NextResponse.json({ settings: data || null })
  } catch (err: any) {
    return NextResponse.json({ error: err.message, settings: null }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { guild_id, log_channel_id } = body
    if (!guild_id) return NextResponse.json({ error: 'guild_id required' }, { status: 400 })

    const supabase = getSupabase()
    await supabase.from('server_settings').upsert({
      guild_id,
      log_channel_id: log_channel_id || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'guild_id' })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
