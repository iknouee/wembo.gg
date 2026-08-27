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

    // Just store the access token directly — it's alphanumeric and cookie-safe
    const response = NextResponse.redirect(new URL('/dashboard', request.url))

    response.headers.append(
      'Set-Cookie',
      `wembo_session=${tokens.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`
    )

    return response
  } catch (err: any) {
    console.error('Auth callback error:', err)
    return NextResponse.redirect(new URL('/login?error=unknown', request.url))
  }
}
