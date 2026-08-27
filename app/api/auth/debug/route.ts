import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Debug endpoint — shows what the server sees regarding the session cookie.
 * Returns info about whether the cookie exists, its length, and decode status.
 * Remove this in production.
 */
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
    const secret = process.env.AUTH_SECRET || 'fallback-secret-change-me'
    const cookieValue = cookie.value.replace(/-/g, '+').replace(/_/g, '/')
    const raw = atob(cookieValue)

    let decrypted = ''
    for (let i = 0; i < raw.length; i++) {
      decrypted += String.fromCharCode(
        raw.charCodeAt(i) ^ secret.charCodeAt(i % secret.length)
      )
    }

    const session = JSON.parse(decrypted)

    return NextResponse.json({
      status: 'ok',
      cookieLength: cookie.value.length,
      cookieBytes: Buffer.byteLength(cookie.value, 'utf8'),
      hasUser: !!(session?.u || session?.user),
      username: session?.u?.username || session?.user?.username || null,
      hasToken: !!(session?.at || session?.accessToken),
      secretUsed: secret.substring(0, 4) + '...',
    })
  } catch (e: any) {
    return NextResponse.json({
      status: 'decode_error',
      cookieLength: cookie.value.length,
      cookiePreview: cookie.value.substring(0, 20) + '...',
      error: e?.message || 'unknown',
    })
  }
}
