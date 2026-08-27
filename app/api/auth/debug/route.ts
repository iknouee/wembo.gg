import { NextRequest, NextResponse } from 'next/server'
import { decodeSession } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get('wembo_session')
  const allCookieNames = Array.from(request.cookies.getAll()).map(c => c.name)

  if (!cookie?.value) {
    return NextResponse.json({
      status: 'no_cookie',
      cookieNames: allCookieNames,
      message: 'wembo_session cookie not found in request',
    })
  }

  try {
    const { accessToken, user } = decodeSession(cookie.value)

    return NextResponse.json({
      status: 'ok',
      cookieLength: cookie.value.length,
      hasUser: !!user,
      username: user?.username || null,
      hasToken: !!accessToken,
    })
  } catch (e: any) {
    return NextResponse.json({
      status: 'decode_error',
      cookieLength: cookie.value.length,
      cookiePreview: cookie.value.substring(0, 30) + '...',
      error: e?.message || 'unknown',
    })
  }
}
