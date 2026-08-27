import { NextRequest, NextResponse } from 'next/server'
import { generateOAuthState, getStateCookieConfig } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const redirectUri = encodeURIComponent(`${appUrl}/api/auth/callback`)
  const clientId = process.env.DISCORD_CLIENT_ID || ''
  const scopes = encodeURIComponent('identify guilds email')

  // Generate a random state token for CSRF protection
  const state = generateOAuthState()

  const discordOAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}&state=${state}`

  const response = NextResponse.redirect(discordOAuthUrl)

  // Store state in an httpOnly cookie so it can be verified in the callback
  const stateCookieConfig = getStateCookieConfig(state)
  response.cookies.set(stateCookieConfig.name, stateCookieConfig.value, {
    httpOnly: stateCookieConfig.httpOnly,
    secure: stateCookieConfig.secure,
    sameSite: stateCookieConfig.sameSite,
    path: stateCookieConfig.path,
    maxAge: stateCookieConfig.maxAge,
  })

  return response
}
