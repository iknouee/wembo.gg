import { NextRequest, NextResponse } from 'next/server'
import { exchangeCode, fetchUser, encryptSessionData } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  // User denied access or something went wrong
  if (error || !code) {
    return NextResponse.redirect(new URL('/login?error=access_denied', request.url))
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCode(code)

    // Fetch user profile
    const user = await fetchUser(tokens.access_token)

    // Build session data
    const session = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
      user,
    }

    // Encrypt session
    const encrypted = encryptSessionData(JSON.stringify(session))

    // Create redirect response and set cookie on it
    const response = NextResponse.redirect(new URL('/dashboard', request.url))
    response.cookies.set('wembo_session', encrypted, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (err) {
    console.error('OAuth callback error:', err)
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
  }
}
