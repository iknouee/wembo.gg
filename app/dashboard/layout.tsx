import { Sidebar, MobileSidebar } from '@/components/dashboard/sidebar'
import { AuthProvider } from '@/components/dashboard/auth-provider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <MobileSidebar />
        <main className="lg:pl-[260px]">
          <div className="pt-14 lg:pt-0 min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  )
}
