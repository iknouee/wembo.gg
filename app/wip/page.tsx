import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wembo — Coming Soon',
  description: 'Wembo is under development. Check back soon.',
}

export default function WIPPage() {
  return (
    <div className="min-h-screen bg-[#070708] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="h-14 w-14 rounded-2xl bg-[#FFD600] flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[#FFD600]/20">
          <span className="text-black font-bold text-xl">W</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-3">Coming Soon</h1>
        <p className="text-[15px] text-white/40 leading-relaxed mb-8">
          Wembo is currently under development. We&apos;re building something powerful for Discord communities.
        </p>

        {/* Status */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06]">
          <span className="h-2 w-2 rounded-full bg-[#FFD600] animate-pulse" />
          <span className="text-[13px] text-white/50 font-medium">In Development</span>
        </div>

        {/* Links */}
        <div className="mt-10 flex items-center justify-center gap-6">
          <a href="https://discord.gg/wembo" target="_blank" rel="noopener noreferrer" className="text-[13px] text-white/25 hover:text-white/50 transition-colors">
            Discord
          </a>
          <span className="text-white/10">•</span>
          <a href="/login" className="text-[13px] text-white/25 hover:text-[#FFD600] transition-colors">
            Staff Login
          </a>
        </div>
      </div>
    </div>
  )
}
