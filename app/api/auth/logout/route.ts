import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/', request.url))
  response.headers.append(
    'Set-Cookie',
    'wembo_token=; Path=/; Secure; SameSite=Lax; Max-Age=0'
  )
  return response
}
