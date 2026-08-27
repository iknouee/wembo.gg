import { NextRequest, NextResponse } from 'next/server'
import {
  exchangeCodeForToken,
  fetchDiscordUser,
  fetchDiscordGuilds,
  signJWT,
  getSessionCookieConfig,
} from '@/lib/auth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  // Handle OAuth errors (user denied, etc.)
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, request.url)
    )
  }

  // Code is required
  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=no_code', request.url)
    )
  }

  try {
    // Step 1: Exchange the authorization code for an access token
    const tokenData = await exchangeCodeForToken(code)

    // Step 2: Fetch the user's Discord profile
    const discordUser = await fetchDiscordUser(tokenData.access_token)

    // Step 3: Fetch the user's guilds (servers)
    let guilds: Array<{ id: string; name: string; icon: string | null; owner: boolean; permissions: number }> = []
    try {
      guilds = await fetchDiscordGuilds(tokenData.access_token)
    } catch {
      // Non-fatal: guilds scope might not be granted
      console.warn('Failed to fetch guilds, continuing without them')
    }

    // Step 4: Create a signed JWT session token
    const token = signJWT({
      sub: discordUser.id,
      username: discordUser.global_name || discordUser.username,
      discriminator: discordUser.discriminator,
      avatar: discordUser.avatar,
      email: discordUser.email || null,
      guilds: guilds.slice(0, 100), // Limit to prevent cookie overflow
    })

    // Step 5: Set the cookie and redirect to dashboard
    const cookieConfig = getSessionCookieConfig(token)
    const response = NextResponse.redirect(new URL('/dashboard', request.url))

    response.cookies.set(cookieConfig.name, cookieConfig.value, {
      httpOnly: cookieConfig.httpOnly,
      secure: cookieConfig.secure,
      sameSite: cookieConfig.sameSite,
      path: cookieConfig.path,
      maxAge: cookieConfig.maxAge,
    })

    return response
  } catch (err) {
    console.error('Auth callback error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorMessage)}`, request.url)
    )
  }
}
