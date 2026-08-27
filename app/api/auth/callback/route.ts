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

    // Build minimal session and hex-encode
    const session = JSON.stringify({
      at: tokens.access_token,
      rt: tokens.refresh_token,
      u: { id: user.id, username: user.username, avatar: user.avatar, gn: user.global_name },
    })

    const secret = process.env.AUTH_SECRET || 'fallback-secret-change-me'
    let hex = ''
    for (let i = 0; i < session.length; i++) {
      const byte = session.charCodeAt(i) ^ secret.charCodeAt(i % secret.length)
      hex += byte.toString(16).padStart(2, '0')
    }

    // Set cookie using raw Set-Cookie header to have full control
    const redirectUrl = new URL('/api/auth/debug', request.url)
    const response = NextResponse.redirect(redirectUrl)

    // Use the raw header — no framework magic
    response.headers.set(
      'Set-Cookie',
      `wembo_session=${hex}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`
    )

    return response
  } catch (err: any) {
    console.error('Auth callback error:', err)
    return NextResponse.redirect(new URL('/login?error=unknown', request.url))
  }
}
