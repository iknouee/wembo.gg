import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get('wembo_session')

    if (!cookie?.value) {
      return NextResponse.json({ user: null })
    }

    const secret = process.env.AUTH_SECRET || 'fallback-secret-change-me'
    const cookieValue = cookie.value.replace(/-/g, '+').replace(/_/g, '/')
    const raw = atob(cookieValue)

    let decrypted = ''
    for (let i = 0; i < raw.length; i++) {
      decrypted += String.fromCharCode(
        raw.charCodeAt(i) ^ secret.charCodeAt(i % secret.length)
      )
    }

    const session = JSON.parse(decrypted)

    // Support both old format and new compact format
    const userData = session.u || session.user
    if (!userData) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: userData.id,
        username: userData.username,
        avatar: userData.avatar,
        global_name: userData.gn || userData.global_name || null,
      }
    })
  } catch (e) {
    return NextResponse.json({ user: null })
  }
}
