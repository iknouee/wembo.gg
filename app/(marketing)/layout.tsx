import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen">
      <Navbar initialUser={null} />
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  )
}
