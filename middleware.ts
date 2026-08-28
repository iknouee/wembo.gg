import { NextRequest, NextResponse } from 'next/server'

/**
 * WIP Gate — blocks public access while the site is under development.
 * Allows through: dashboard, API routes, login, and users with the wembo_token cookie.
 * 
 * To disable: delete this file or set WIP_MODE=false in env vars.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow these through
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/invite') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/wip'
  ) {
    return NextResponse.next()
  }

  // Allow authenticated users (they have the wembo_token cookie)
  const token = request.cookies.get('wembo_token')?.value
  if (token) {
    return NextResponse.next()
  }

  // Block everyone else — redirect to WIP page
  return NextResponse.rewrite(new URL('/wip', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}


