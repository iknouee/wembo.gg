import Link from 'next/link'
import { siteConfig } from '@/config/site'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-black">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-md bg-yellow-500 flex items-center justify-center">
                <span className="text-black font-bold text-xs">W</span>
              </div>
              <span className="font-semibold text-sm text-white/90">Wembo</span>
            </Link>
            <p className="text-xs text-white/25 max-w-xs leading-relaxed mb-6">
              {siteConfig.tagline}
            </p>
            <div className="flex items-center gap-3">
              {['Discord', 'X', 'GitHub'].map((label) => (
                <a key={label} href="#" className="h-8 w-8 rounded-md border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-white/30 hover:text-white/70 hover:border-white/10 transition-all text-[10px] font-medium">
                  {label[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-white/50 mb-4 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2.5">
              {siteConfig.footer.product.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-xs text-white/25 hover:text-white/60 transition-colors">{item.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold text-white/50 mb-4 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2.5">
              {siteConfig.footer.resources.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-xs text-white/25 hover:text-white/60 transition-colors">{item.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-white/50 mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              {siteConfig.footer.company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-xs text-white/25 hover:text-white/60 transition-colors">{item.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/15">© {new Date().getFullYear()} Wembo. All rights reserved.</p>
          <p className="text-[11px] text-white/10">Built for Discord communities.</p>
        </div>
      </div>
    </footer>
  )
}
