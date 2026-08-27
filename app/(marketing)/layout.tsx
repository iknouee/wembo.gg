import { cookies } from 'next/headers'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const dynamic = 'force-dynamic'

function getUser() {
  try {
    const cookieStore = cookies()
    const cookie = cookieStore.get('wembo_session')
    if (!cookie?.value) return null

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
    return session?.user || null
  } catch {
    return null
  }
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = getUser()

  return (
    <div className="relative min-h-screen">
      <Navbar initialUser={user} />
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  )
}
