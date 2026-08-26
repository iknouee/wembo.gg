import Link from 'next/link'
import { siteConfig } from '@/config/site'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#070809]">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="h-7 w-7 rounded-md bg-[#FFD400] flex items-center justify-center shadow-md shadow-[#FFD400]/15">
                <span className="text-black font-bold text-[11px]">W</span>
              </div>
              <span className="font-bold text-[14px] text-white tracking-[0.02em]">WEMBO</span>
            </Link>
            <p className="text-[13px] text-[#8B8D93]/60 max-w-[260px] leading-relaxed">{siteConfig.tagline}</p>
          </div>
          <FooterCol title="Product" links={siteConfig.footer.product} />
          <FooterCol title="Resources" links={siteConfig.footer.resources} />
          <FooterCol title="Company" links={siteConfig.footer.company} />
        </div>
        <div className="mt-14 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/20">© {new Date().getFullYear()} Wembo. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <div className="h-[5px] w-[5px] rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/40" />
            <span className="text-[11px] text-white/20">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: { title: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}><Link href={l.href} className="text-[13px] text-[#8B8D93]/50 hover:text-white/70 transition-colors">{l.title}</Link></li>
        ))}
      </ul>
    </div>
  )
}
