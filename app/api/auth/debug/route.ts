import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const allCookies = Array.from(request.cookies.getAll()).map(c => ({ name: c.name, length: c.value.length }))
  const token = request.cookies.get('wembo_token')

  return NextResponse.json({
    hasToken: !!token?.value,
    tokenLength: token?.value?.length || 0,
    cookies: allCookies,
  })
}
