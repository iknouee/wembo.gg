import Link from 'next/link'
import { siteConfig } from '@/config/site'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[hsl(220,16%,4%)]">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-black font-bold text-sm">W</span>
              </div>
              <span className="font-bold text-[15px] text-white tracking-tight">WEMBO</span>
            </Link>
            <p className="text-xs text-white/25 max-w-[250px] leading-relaxed">{siteConfig.tagline}</p>
          </div>
          <FooterCol title="Product" links={siteConfig.footer.product} />
          <FooterCol title="Resources" links={siteConfig.footer.resources} />
          <FooterCol title="Company" links={siteConfig.footer.company} />
        </div>
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex items-center justify-between">
          <p className="text-[11px] text-white/20">© {new Date().getFullYear()} Wembo. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
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
      <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}><Link href={l.href} className="text-[13px] text-white/25 hover:text-white/60 transition-colors">{l.title}</Link></li>
        ))}
      </ul>
    </div>
  )
}
