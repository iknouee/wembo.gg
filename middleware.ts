import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only handle login page redirect for logged-in users
  if (pathname === '/login') {
    const sessionCookie = request.cookies.get('wembo_session')?.value
    if (sessionCookie) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login'],
}
