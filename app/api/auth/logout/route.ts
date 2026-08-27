import { NextRequest, NextResponse } from 'next/server'
import { getDeleteCookieConfig } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const cookieConfig = getDeleteCookieConfig()
  const response = NextResponse.redirect(new URL('/', request.url))

  response.cookies.set(cookieConfig.name, cookieConfig.value, {
    httpOnly: cookieConfig.httpOnly,
    secure: cookieConfig.secure,
    sameSite: cookieConfig.sameSite,
    path: cookieConfig.path,
    maxAge: cookieConfig.maxAge,
  })

  return response
}

export async function POST(request: NextRequest) {
  // Also support POST for CSRF-safe logout
  return GET(request)
}
