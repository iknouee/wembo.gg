import { NextRequest, NextResponse } from 'next/server'
import { decodeSession } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get('wembo_session')
    if (!cookie?.value) return NextResponse.json({ user: null })

    const { user } = decodeSession(cookie.value)
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null })
  }
}
