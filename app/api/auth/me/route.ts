import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get('wembo_session')

  if (!cookie?.value) {
    return NextResponse.json(
      { user: null },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
        },
      }
    )
  }

  try {
    const secret = process.env.AUTH_SECRET || 'fallback-secret-change-me'

    // Try base64url first (new encoding), fall back to standard base64 (old encoding)
    let raw: string
    try {
      raw = Buffer.from(cookie.value, 'base64url').toString('binary')
    } catch {
      raw = Buffer.from(cookie.value, 'base64').toString('binary')
    }

    // Decrypt with XOR cipher
    let decrypted = ''
    for (let i = 0; i < raw.length; i++) {
      decrypted += String.fromCharCode(
        raw.charCodeAt(i) ^ secret.charCodeAt(i % secret.length)
      )
    }

    const session = JSON.parse(decrypted)

    if (!session?.user) {
      throw new Error('No user in session')
    }

    return NextResponse.json(
      { user: session.user },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
        },
      }
    )
  } catch {
    // Cookie is corrupted or from an old session — clear it
    const response = NextResponse.json(
      { user: null },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
        },
      }
    )

    response.cookies.set('wembo_session', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })

    return response
  }
}
