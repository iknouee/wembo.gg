import { cookies } from 'next/headers'
import crypto from 'crypto'

// ─── Configuration ───────────────────────────────────────────────────────────

const COOKIE_NAME = 'wembo_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

function getSecret(): string {
  const secret = process.env.AUTH_SECRET
  if (!secret || secret === 'generate_a_random_secret_here') {
    // Fallback for development — in production AUTH_SECRET must be set
    return 'wembo-dev-secret-do-not-use-in-production'
  }
  return secret
}

// ─── JWT Utilities (HMAC-SHA256, no external deps) ───────────────────────────

function base64UrlEncode(data: string | Buffer): string {
  const buf = typeof data === 'string' ? Buffer.from(data) : data
  return buf.toString('base64url')
}

function base64UrlDecode(str: string): string {
  return Buffer.from(str, 'base64url').toString('utf-8')
}

interface JWTPayload {
  sub: string
  username: string
  discriminator: string
  avatar: string | null
  email?: string | null
  guilds?: Array<{ id: string; name: string; icon?: string | null; owner: boolean; permissions: number }>
  iat: number
  exp: number
}

export function signJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  const secret = getSecret()
  const now = Math.floor(Date.now() / 1000)

  const header = { alg: 'HS256', typ: 'JWT' }
  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + COOKIE_MAX_AGE,
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload))
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url')

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    const secret = getSecret()
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [encodedHeader, encodedPayload, signature] = parts

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url')

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null
    }

    // Decode and check expiry
    const payload: JWTPayload = JSON.parse(base64UrlDecode(encodedPayload))
    const now = Math.floor(Date.now() / 1000)

    if (payload.exp && payload.exp < now) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

// ─── Cookie Helpers ──────────────────────────────────────────────────────────

export function getSessionCookieConfig(token: string) {
  const isProduction = process.env.NODE_ENV === 'production'

  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  }
}

export function getDeleteCookieConfig() {
  return {
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  }
}

// ─── Session Reader ──────────────────────────────────────────────────────────

export interface SessionUser {
  id: string
  username: string
  discriminator: string
  avatar: string | null
  email?: string | null
  guilds?: Array<{ id: string; name: string; icon?: string | null; owner: boolean; permissions: number }>
}

export function getSessionFromCookie(cookieValue: string | undefined): SessionUser | null {
  if (!cookieValue) return null

  const payload = verifyJWT(cookieValue)
  if (!payload) return null

  return {
    id: payload.sub,
    username: payload.username,
    discriminator: payload.discriminator,
    avatar: payload.avatar,
    email: payload.email,
    guilds: payload.guilds,
  }
}

// ─── Discord API Helpers ─────────────────────────────────────────────────────

export interface DiscordTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
}

export interface DiscordUser {
  id: string
  username: string
  discriminator: string
  avatar: string | null
  email?: string | null
  global_name?: string | null
}

export interface DiscordGuild {
  id: string
  name: string
  icon: string | null
  owner: boolean
  permissions: number
}

export async function exchangeCodeForToken(code: string): Promise<DiscordTokenResponse> {
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/callback`

  const response = await fetch('https://discord.com/api/v10/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID || '',
      client_secret: process.env.DISCORD_CLIENT_SECRET || '',
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Discord token exchange failed: ${response.status} ${error}`)
  }

  return response.json()
}

export async function fetchDiscordUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch('https://discord.com/api/v10/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Discord user fetch failed: ${response.status}`)
  }

  return response.json()
}

export async function fetchDiscordGuilds(accessToken: string): Promise<DiscordGuild[]> {
  const response = await fetch('https://discord.com/api/v10/users/@me/guilds', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Discord guilds fetch failed: ${response.status}`)
  }

  return response.json()
}

// ─── OAuth State (CSRF Protection) ───────────────────────────────────────────

const STATE_COOKIE_NAME = 'wembo_oauth_state'
const STATE_MAX_AGE = 60 * 10 // 10 minutes

export function generateOAuthState(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function getStateCookieConfig(state: string) {
  const isProduction = process.env.NODE_ENV === 'production'
  return {
    name: STATE_COOKIE_NAME,
    value: state,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: STATE_MAX_AGE,
  }
}

export function getDeleteStateCookieConfig() {
  return {
    name: STATE_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  }
}

export const STATE_COOKIE_NAME_EXPORT = STATE_COOKIE_NAME
export const COOKIE_NAME_EXPORT = COOKIE_NAME
