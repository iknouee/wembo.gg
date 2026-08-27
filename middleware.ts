import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'wembo_session'

// Routes that require authentication
const PROTECTED_PATHS = ['/dashboard']

// Routes that should redirect to dashboard if already authenticated
const AUTH_PATHS = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value

  // Check if the path is protected (starts with any protected path)
  const isProtectedPath = PROTECTED_PATHS.some((path) => pathname.startsWith(path))
  const isAuthPath = AUTH_PATHS.some((path) => pathname.startsWith(path))

  // Redirect unauthenticated users away from protected routes
  if (isProtectedPath && !sessionCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from auth pages (e.g., /login)
  if (isAuthPath && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all dashboard routes
    '/dashboard/:path*',
    // Match auth routes
    '/login',
  ],
}
