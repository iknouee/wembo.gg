import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get('wembo_session')

  if (!cookie?.value) {
    return new Response(JSON.stringify({ user: null }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  }

  try {
    const secret = process.env.AUTH_SECRET || 'fallback-secret-change-me'

    // Decode from base64url (cookie-safe encoding)
    const raw = Buffer.from(cookie.value, 'base64url').toString('binary')

    // Decrypt with XOR cipher
    let decrypted = ''
    for (let i = 0; i < raw.length; i++) {
      decrypted += String.fromCharCode(
        raw.charCodeAt(i) ^ secret.charCodeAt(i % secret.length)
      )
    }

    const session = JSON.parse(decrypted)

    return new Response(JSON.stringify({ user: session.user }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  } catch {
    // Cookie is corrupted or from an old session — clear it
    return new Response(JSON.stringify({ user: null }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Set-Cookie': 'wembo_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
      },
    })
  }
}
