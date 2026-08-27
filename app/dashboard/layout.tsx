import { Sidebar, MobileSidebar } from '@/components/dashboard/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Auth is handled by middleware.ts — if we get here, the user has a valid session cookie.
  // No client-side auth check needed (it was causing redirect loops because
  // client-side fetch to /api/auth/me doesn't reliably send the cookie).

  return (
    <div className="min-h-screen bg-[#050505]">
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
