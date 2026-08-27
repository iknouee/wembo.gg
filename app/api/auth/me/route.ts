import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie, COOKIE_NAME_EXPORT } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const cookieValue = request.cookies.get(COOKIE_NAME_EXPORT)?.value
  const user = getSessionFromCookie(cookieValue)

  const response = NextResponse.json({ user })

  // Prevent caching of authenticated responses
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')

  return response
}
