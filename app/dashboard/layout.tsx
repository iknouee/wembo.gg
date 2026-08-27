import { cookies } from 'next/headers'
import { Sidebar, MobileSidebar } from '@/components/dashboard/sidebar'
import { DashboardProvider } from '@/components/dashboard/dashboard-provider'

export const dynamic = 'force-dynamic'

function getSessionData() {
  try {
    const cookieStore = cookies()
    const cookie = cookieStore.get('wembo_session')
    if (!cookie?.value) return { accessToken: null, user: null }

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
    const accessToken = session.at || session.accessToken || null
    const userData = session.u || session.user || null
    const user = userData ? {
      id: userData.id,
      username: userData.username,
      avatar: userData.avatar,
      global_name: userData.gn || userData.global_name || null,
    } : null

    return { accessToken, user }
  } catch {
    return { accessToken: null, user: null }
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { accessToken, user } = getSessionData()

  return (
    <DashboardProvider accessToken={accessToken} user={user}>
      <div className="min-h-screen bg-[#050505]">
        <Sidebar />
        <MobileSidebar />
        <main className="lg:pl-64">
          <div className="pt-14 lg:pt-0">
            {children}
          </div>
        </main>
      </div>
    </DashboardProvider>
  )
}
