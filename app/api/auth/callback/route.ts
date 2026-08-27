import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return Response.redirect(new URL('/login?error=no_code', request.url))
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
      return new Response(`Token exchange failed: ${errText}`, { status: 400 })
    }

    const tokens = await tokenRes.json()

    // Fetch user
    const userRes = await fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    if (!userRes.ok) {
      return new Response('User fetch failed', { status: 400 })
    }

    const user = await userRes.json()

    // Build session
    const session = JSON.stringify({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
      user,
    })

    // Encrypt
    const secret = process.env.AUTH_SECRET || 'fallback-secret-change-me'
    let encrypted = ''
    for (let i = 0; i < session.length; i++) {
      encrypted += String.fromCharCode(
        session.charCodeAt(i) ^ secret.charCodeAt(i % secret.length)
      )
    }
    const cookieValue = btoa(encrypted)

    // Return HTML that sets cookie and redirects
    return new Response(
      `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=/dashboard"></head><body>Redirecting...</body></html>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          'Set-Cookie': `wembo_session=${cookieValue}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`,
        },
      }
    )
  } catch (err: any) {
    return new Response(`Error: ${err?.message || 'Unknown'}`, { status: 500 })
  }
}
