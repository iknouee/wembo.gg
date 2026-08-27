import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check if env vars exist
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      return NextResponse.json({
        status: 'missing_env',
        hasUrl: !!url,
        hasKey: !!key,
        message: 'NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set on Vercel'
      })
    }

    // Try to connect
    const { getSupabase } = await import('@/lib/supabase')
    const supabase = getSupabase()

    const { data, error } = await supabase.from('security_modules').select('count').limit(1)

    if (error) {
      return NextResponse.json({ status: 'db_error', error: error.message })
    }

    return NextResponse.json({ status: 'ok', message: 'Supabase connected', data })
  } catch (err: any) {
    return NextResponse.json({ status: 'error', error: err.message })
  }
}
