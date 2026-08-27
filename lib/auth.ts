import { cookies } from 'next/headers'

const DISCORD_API = 'https://discord.com/api/v10'
const COOKIE_NAME = 'wembo_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export interface DiscordUser {
  id: string
  username: string
  discriminator: string
  avatar: string | null
  global_name: string | null
}

export interface DiscordGuild {
  id: string
  name: string
  icon: string | null
  owner: boolean
  permissions: string
}

export interface Session {
  accessToken: string
  refreshToken: string
  expiresAt: number
  user: DiscordUser
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCode(code: string): Promise<{
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}> {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    client_secret: process.env.DISCORD_CLIENT_SECRET!,
    grant_type: 'authorization_code',
    code,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
  })

  const res = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Discord token exchange failed: ${error}`)
  }

  return res.json()
}

/**
 * Fetch the authenticated user's profile
 */
export async function fetchUser(accessToken: string): Promise<DiscordUser> {
  const res = await fetch(`${DISCORD_API}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) throw new Error('Failed to fetch user')
  return res.json()
}

/**
 * Fetch the user's guilds (servers)
 */
export async function fetchGuilds(accessToken: string): Promise<DiscordGuild[]> {
  const res = await fetch(`${DISCORD_API}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) throw new Error('Failed to fetch guilds')
  return res.json()
}

/**
 * Simple encryption/decryption for session cookie.
 * Uses base64 encoding with the AUTH_SECRET as a basic XOR cipher.
 * For production, use a proper encryption library.
 */
function encryptSession(data: string): string {
  const secret = process.env.AUTH_SECRET || 'fallback-secret-change-me'
  let encrypted = ''
  for (let i = 0; i < data.length; i++) {
    encrypted += String.fromCharCode(
      data.charCodeAt(i) ^ secret.charCodeAt(i % secret.length)
    )
  }
  return Buffer.from(encrypted, 'binary').toString('base64')
}

function decryptSession(encrypted: string): string {
  const secret = process.env.AUTH_SECRET || 'fallback-secret-change-me'
  const data = Buffer.from(encrypted, 'base64').toString('binary')
  let decrypted = ''
  for (let i = 0; i < data.length; i++) {
    decrypted += String.fromCharCode(
      data.charCodeAt(i) ^ secret.charCodeAt(i % secret.length)
    )
  }
  return decrypted
}

/**
 * Set session cookie
 */
export function setSession(session: Session) {
  const cookieStore = cookies()
  const encrypted = encryptSession(JSON.stringify(session))

  cookieStore.set(COOKIE_NAME, encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

/**
 * Get session from cookie
 */
export function getSession(): Session | null {
  const cookieStore = cookies()
  const cookie = cookieStore.get(COOKIE_NAME)

  if (!cookie?.value) return null

  try {
    const decrypted = decryptSession(cookie.value)
    return JSON.parse(decrypted) as Session
  } catch {
    return null
  }
}

/**
 * Clear session cookie
 */
export function clearSession() {
  const cookieStore = cookies()
  cookieStore.delete(COOKIE_NAME)
}

/**
 * Build Discord OAuth2 authorization URL
 */
export function getAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    response_type: 'code',
    scope: 'identify guilds',
  })

  return `${DISCORD_API}/oauth2/authorize?${params.toString()}`
}
