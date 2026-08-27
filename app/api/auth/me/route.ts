import { NextRequest, NextResponse } from 'next/server'

// Force dynamic — never cache this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get('wembo_session')

  if (!cookie?.value) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  try {
    const secret = process.env.AUTH_SECRET || 'fallback-secret-change-me'
    const data = Buffer.from(cookie.value, 'base64').toString('binary')
    let decrypted = ''
    for (let i = 0; i < data.length; i++) {
      decrypted += String.fromCharCode(
        data.charCodeAt(i) ^ secret.charCodeAt(i % secret.length)
      )
    }
    const session = JSON.parse(decrypted)
    return NextResponse.json({ user: session.user })
  } catch {
    return NextResponse.json({ user: null }, { status: 401 })
  }
}
