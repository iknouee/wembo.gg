/**
 * Session utilities.
 * The cookie value is simply the Discord access token (no encryption needed
 * since it's httpOnly and the token itself is opaque).
 */

export interface SessionData {
  accessToken: string | null
  user: {
    id: string
    username: string
    avatar: string | null
    global_name: string | null
  } | null
}

/**
 * Extract the access token from the cookie value.
 * The cookie just stores the raw Discord access token.
 */
export function getAccessToken(cookieValue: string): string | null {
  if (!cookieValue || cookieValue.length < 10) return null
  return cookieValue
}
