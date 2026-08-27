import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Temporarily removed cookies() reading to test if it was
  // clearing the wembo_session cookie on dashboard routes
  return (
    <div className="relative min-h-screen">
      <Navbar initialUser={null} />
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  )
}
