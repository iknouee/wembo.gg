import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie, COOKIE_NAME_EXPORT } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const cookieValue = request.cookies.get(COOKIE_NAME_EXPORT)?.value
  const user = getSessionFromCookie(cookieValue)

  return NextResponse.json({ user })
}
