import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const which = request.nextUrl.searchParams.get('which') || 'both'
  
  const response = NextResponse.redirect(new URL('/api/auth/debug', request.url))

  if (which === 'short' || which === 'both') {
    // Set wembo_session with a SHORT value
    response.headers.append(
      'Set-Cookie',
      'wembo_session=short_test_value; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600'
    )
  }

  if (which === 'long' || which === 'both') {
    // Set test_cookie as control
    response.headers.append(
      'Set-Cookie',
      'test_cookie=hello123; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600'
    )
  }

  return response
}
