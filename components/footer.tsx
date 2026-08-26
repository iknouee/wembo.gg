import Link from 'next/link'
import { siteConfig } from '@/config/site'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-[hsl(222,15%,4%)]">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-xs">W</span>
              </div>
              <span className="font-semibold text-sm text-white/90">Wembo</span>
            </Link>
            <p className="text-xs text-white/25 max-w-xs leading-relaxed">{siteConfig.tagline}</p>
          </div>
          <div>
            <h4 className="text-xs font-medium text-white/50 mb-4">Product</h4>
            <ul className="space-y-2.5">
              {siteConfig.footer.product.map((item) => (
                <li key={item.href}><Link href={item.href} className="text-xs text-white/25 hover:text-white/60 transition-colors">{item.title}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-medium text-white/50 mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {siteConfig.footer.resources.map((item) => (
                <li key={item.href}><Link href={item.href} className="text-xs text-white/25 hover:text-white/60 transition-colors">{item.title}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-medium text-white/50 mb-4">Company</h4>
            <ul className="space-y-2.5">
              {siteConfig.footer.company.map((item) => (
                <li key={item.href}><Link href={item.href} className="text-xs text-white/25 hover:text-white/60 transition-colors">{item.title}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/[0.04] flex items-center justify-between">
          <p className="text-[11px] text-white/15">© {new Date().getFullYear()} Wembo</p>
          <p className="text-[11px] text-white/10">Built for Discord communities.</p>
        </div>
      </div>
    </footer>
  )
}
