import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get('wembo_session')
    if (!cookie?.value || cookie.value.length < 10) {
      return NextResponse.json({ user: null })
    }

    const res = await fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${cookie.value}` },
    })

    if (!res.ok) return NextResponse.json({ user: null })

    const user = await res.json()
    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        global_name: user.global_name,
      }
    })
  } catch {
    return NextResponse.json({ user: null })
  }
}
