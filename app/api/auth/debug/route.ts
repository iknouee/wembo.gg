import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get('wembo_session')
  const testCookie = request.cookies.get('test_cookie')
  const allCookieNames = Array.from(request.cookies.getAll()).map(c => c.name)

  if (!cookie?.value) {
    return NextResponse.json({
      status: 'no_cookie',
      cookieNames: allCookieNames,
      testCookie: testCookie?.value || null,
      message: 'wembo_session cookie not found in request',
    })
  }

  return NextResponse.json({
    status: 'ok',
    cookieLength: cookie.value.length,
    cookiePreview: cookie.value.substring(0, 10) + '...',
    allCookies: allCookieNames,
  })
}
