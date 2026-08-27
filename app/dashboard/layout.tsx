import { cookies } from 'next/headers'
import { Sidebar, MobileSidebar } from '@/components/dashboard/sidebar'
import { getSessionFromCookie, COOKIE_NAME_EXPORT } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side auth check as a fallback (middleware handles the redirect,
  // but this provides defense-in-depth)
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(COOKIE_NAME_EXPORT)?.value
  const user = getSessionFromCookie(sessionCookie)

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileSidebar />
      <main className="lg:pl-64">
        <div className="pt-14 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  )
}
