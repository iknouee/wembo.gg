/**
 * Shared session decode logic.
 * Cookie value is XOR-encrypted JSON encoded as hex string (only 0-9a-f chars).
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

export function decodeSession(cookieValue: string): SessionData {
  try {
    const secret = process.env.AUTH_SECRET || 'fallback-secret-change-me'

    // Hex decode + XOR decrypt
    let decrypted = ''
    for (let i = 0; i < cookieValue.length; i += 2) {
      const byte = parseInt(cookieValue.substring(i, i + 2), 16)
      decrypted += String.fromCharCode(byte ^ secret.charCodeAt((i / 2) % secret.length))
    }

    const session = JSON.parse(decrypted)

    const accessToken = session.at || session.accessToken || null
    const userData = session.u || session.user || null
    const user = userData ? {
      id: userData.id,
      username: userData.username,
      avatar: userData.avatar || null,
      global_name: userData.gn || userData.global_name || null,
    } : null

    return { accessToken, user }
  } catch {
    return { accessToken: null, user: null }
  }
}
