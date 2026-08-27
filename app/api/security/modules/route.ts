import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * GET /api/security/modules?guild_id=xxx
 * Returns security module settings for a guild.
 */
export async function GET(request: NextRequest) {
  const guildId = request.nextUrl.searchParams.get('guild_id')

  if (!guildId) {
    return NextResponse.json({ error: 'guild_id required' }, { status: 400 })
  }

  try {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('security_modules')
      .select('*')
      .eq('guild_id', guildId)

    if (error) throw error

    return NextResponse.json({ modules: data || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message, modules: [] }, { status: 500 })
  }
}

/**
 * POST /api/security/modules
 * Toggle a security module on/off.
 * Body: { guild_id, module_id, enabled }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { guild_id, module_id, enabled, config } = body

    if (!guild_id || !module_id || typeof enabled !== 'boolean') {
      return NextResponse.json({ error: 'guild_id, module_id, and enabled required' }, { status: 400 })
    }

    const supabase = getSupabase()

    const updateData: any = {
      guild_id,
      module_id,
      enabled,
      updated_at: new Date().toISOString(),
    }

    if (config) {
      updateData.config = config
    }

    const { error } = await supabase
      .from('security_modules')
      .upsert(updateData, { onConflict: 'guild_id,module_id' })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
