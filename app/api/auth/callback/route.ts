import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const error = request.nextUrl.searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(new URL('/login?error=access_denied', request.url))
  }

  try {
    const tokenRes = await fetch('https://discord.com/api/v10/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID || '',
        client_secret: process.env.DISCORD_CLIENT_SECRET || '',
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      }),
    })

    if (!tokenRes.ok) {
      return NextResponse.redirect(new URL('/login?error=token_failed', request.url))
    }

    const tokens = await tokenRes.json()
    const response = NextResponse.redirect(new URL('/dashboard', request.url))

    // Store token as a NON-httpOnly cookie so client JS can read it
    response.headers.append(
      'Set-Cookie',
      `wembo_token=${tokens.access_token}; Path=/; Secure; SameSite=Lax; Max-Age=604800`
    )

    return response
  } catch (err: any) {
    console.error('Auth callback error:', err)
    return NextResponse.redirect(new URL('/login?error=unknown', request.url))
  }
}
