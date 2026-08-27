import { cookies } from 'next/headers'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { decodeSession } from '@/lib/session'

export const dynamic = 'force-dynamic'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const cookie = cookieStore.get('wembo_session')
  const { user } = cookie?.value ? decodeSession(cookie.value) : { user: null }

  return (
    <div className="relative min-h-screen">
      <Navbar initialUser={user} />
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  )
}
