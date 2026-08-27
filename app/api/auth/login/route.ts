import { redirect } from 'next/navigation'
import { getAuthUrl } from '@/lib/auth'

export async function GET() {
  const url = getAuthUrl()
  redirect(url)
}
