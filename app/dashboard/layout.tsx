import { cookies } from 'next/headers'
import { Sidebar, MobileSidebar } from '@/components/dashboard/sidebar'
import { DashboardProvider } from '@/components/dashboard/dashboard-provider'
import { decodeSession } from '@/lib/session'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const cookie = cookieStore.get('wembo_session')
  const { accessToken, user } = cookie?.value ? decodeSession(cookie.value) : { accessToken: null, user: null }

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
