import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Set a simple test cookie and redirect to debug endpoint
  const response = NextResponse.redirect(new URL('/api/auth/debug', request.url))

  response.headers.set(
    'Set-Cookie',
    'test_cookie=hello123; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600'
  )

  return response
}
