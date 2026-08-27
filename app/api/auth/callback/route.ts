import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(new URL('/login?error=access_denied', request.url))
  }

  try {
    // Exchange code for tokens
    const tokenParams = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID || '',
      client_secret: process.env.DISCORD_CLIENT_SECRET || '',
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    })

    const tokenRes = await fetch('https://discord.com/api/v10/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString(),
    })

    if (!tokenRes.ok) {
      const errText = await tokenRes.text()
      console.error('Token exchange failed:', errText)
      return NextResponse.redirect(new URL('/login?error=token_failed', request.url))
    }

    const tokens = await tokenRes.json()

    // Fetch user profile
    const userRes = await fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    if (!userRes.ok) {
      console.error('User fetch failed:', userRes.status)
      return NextResponse.redirect(new URL('/login?error=user_failed', request.url))
    }

    const user = await userRes.json()

    // Build session data
    const session = JSON.stringify({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
      user,
    })

    // Encrypt session using XOR cipher (same as lib/auth.ts)
    const secret = process.env.AUTH_SECRET || 'fallback-secret-change-me'
    let encrypted = ''
    for (let i = 0; i < session.length; i++) {
      encrypted += String.fromCharCode(
        session.charCodeAt(i) ^ secret.charCodeAt(i % secret.length)
      )
    }
    const cookieValue = Buffer.from(encrypted, 'binary').toString('base64url')

    // Use a proper 302 redirect with the cookie set on the response.
    // This is the critical fix: browsers reliably persist cookies on redirect
    // responses, but NOT on 200 OK HTML responses that navigate via meta refresh.
    const response = NextResponse.redirect(new URL('/dashboard', request.url))

    response.cookies.set('wembo_session', cookieValue, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (err: any) {
    console.error('Auth callback error:', err)
    return NextResponse.redirect(new URL('/login?error=unknown', request.url))
  }
}
