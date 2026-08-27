import { Sidebar, MobileSidebar } from '@/components/dashboard/sidebar'
import { DashboardProvider } from '@/components/dashboard/dashboard-provider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // DO NOT read cookies() here — it causes Next.js to clear the cookie
  // on Vercel. The dashboard page will handle auth via a different mechanism.

  return (
    <DashboardProvider accessToken={null} user={null}>
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
