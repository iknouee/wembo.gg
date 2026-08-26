import Link from 'next/link'
import { siteConfig } from '@/config/site'

export function Footer() {
  return (
    <footer className="relative bg-[#050505] border-t border-white/[0.05]">
      <div className="max-w-content mx-auto px-4 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo + Tagline — col-span-2 */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="h-7 w-7 rounded-md bg-[#FFD600] flex items-center justify-center shadow-sm shadow-[#FFD600]/15">
                <span className="text-black font-bold text-[11px]">W</span>
              </div>
              <span className="font-bold text-[13px] text-white/50 tracking-[0.02em]">WEMBO</span>
            </Link>
            <p className="text-[12px] text-white/20 max-w-[260px] leading-relaxed">
              {siteConfig.tagline}
            </p>
          </div>

          {/* Product */}
          <FooterCol title="Product" links={siteConfig.footer.product} />

          {/* Resources */}
          <FooterCol title="Resources" links={siteConfig.footer.resources} />

          {/* Company */}
          <FooterCol title="Company" links={siteConfig.footer.company} />
        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/20">
            © {new Date().getFullYear()} Wembo. All rights reserved.
          </p>
          <Link href="/status" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <span className="text-[11px] text-white/20">System Status</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: { title: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-4">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-[12px] text-white/25 hover:text-white/50 transition-colors"
            >
              {l.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
