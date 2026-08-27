import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const session = request.cookies.get('wembo_session')

    if (!session || !session.value) {
      // Not logged in — redirect to login
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  // Match /dashboard and all sub-paths
  matcher: '/dashboard/:path*',
}
