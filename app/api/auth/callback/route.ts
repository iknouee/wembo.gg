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

    // Store session as simple JSON, then hex-encode it (safe for cookies, no special chars)
    const session = JSON.stringify({
      at: tokens.access_token,
      rt: tokens.refresh_token,
      u: { id: user.id, username: user.username, avatar: user.avatar, gn: user.global_name },
    })

    // Simple XOR + hex encoding (produces only 0-9a-f chars — guaranteed cookie-safe)
    const secret = process.env.AUTH_SECRET || 'fallback-secret-change-me'
    let hex = ''
    for (let i = 0; i < session.length; i++) {
      const byte = session.charCodeAt(i) ^ secret.charCodeAt(i % secret.length)
      hex += byte.toString(16).padStart(2, '0')
    }

    const response = NextResponse.redirect(new URL('/dashboard', request.url))

    response.cookies.set('wembo_session', hex, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (err: any) {
    console.error('Auth callback error:', err)
    return NextResponse.redirect(new URL('/login?error=unknown', request.url))
  }
}
