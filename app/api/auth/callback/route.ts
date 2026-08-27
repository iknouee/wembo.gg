import { NextRequest } from 'next/server'
import { exchangeCode, fetchUser, encryptSessionData } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return Response.redirect(new URL('/login?error=access_denied', request.url))
  }

  try {
    const tokens = await exchangeCode(code)
    const user = await fetchUser(tokens.access_token)

    const session = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
      user,
    }

    const encrypted = encryptSessionData(JSON.stringify(session))

    // Return HTML page that sets cookie via Set-Cookie header and redirects
    const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=/dashboard"></head><body></body></html>`

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Set-Cookie': `wembo_session=${encrypted}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`,
      },
    })
  } catch (err) {
    console.error('OAuth callback error:', err)
    return Response.redirect(new URL('/login?error=auth_failed', request.url))
  }
}
