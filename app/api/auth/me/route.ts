import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get('wembo_session')

    if (!cookie?.value) {
      return NextResponse.json({ user: null })
    }

    const secret = process.env.AUTH_SECRET || 'fallback-secret-change-me'

    // Decode from base64 (handles both standard base64 and base64url)
    // Replace base64url chars with standard base64 chars for compatibility
    const cookieValue = cookie.value.replace(/-/g, '+').replace(/_/g, '/')
    const raw = atob(cookieValue)

    // Decrypt with XOR cipher
    let decrypted = ''
    for (let i = 0; i < raw.length; i++) {
      decrypted += String.fromCharCode(
        raw.charCodeAt(i) ^ secret.charCodeAt(i % secret.length)
      )
    }

    const session = JSON.parse(decrypted)

    if (!session?.user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user: session.user })
  } catch (e) {
    // Any error — return null user, don't crash
    return NextResponse.json({ user: null })
  }
}
