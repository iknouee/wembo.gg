'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, Star, Trophy } from 'lucide-react'

export function MemberIntelligence() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const searchResults = [
    { name: 'Alex', expertise: 'Programming', reputation: 94 },
    { name: 'Jamie', expertise: 'Python', reputation: 98 },
    { name: 'Sam', expertise: 'Web Dev', reputation: 76 },
  ]

  const interests = ['Minecraft', 'Programming', 'Photography']

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 surface-0" />
      <div className="divider-glow absolute top-0 left-0 right-0" />
      <div className="absolute top-[40%] left-[5%] w-[500px] h-[400px] bg-[#FFD600]/[0.01] rounded-full blur-[150px]" />

      <div className="relative max-w-content mx-auto px-4 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-14 items-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* LEFT — Text + Search UI */}
          <div>
            <span className="text-[11px] font-semibold text-[#FFD600] uppercase tracking-wider mb-4 block">
              Member Intelligence
            </span>
            <h2 className="text-[clamp(2rem,4vw,2.75rem)] font-bold text-white tracking-tight leading-[1.1] mb-5">
              Know your community.
            </h2>
            <p className="text-[15px] text-[#9A9CA3] leading-relaxed mb-8 max-w-md">
              Reputation, expertise, contributions — find the right person for anything instantly with intelligent member search.
            </p>

            {/* Search card */}
            <div className="rounded-xl border border-white/[0.07] bg-[#090A0C] p-5">
              {/* Search input */}
              <div className="flex items-center gap-2 mb-4 p-3 rounded-lg border border-white/[0.05] bg-[#0a0b0d]">
                <Search className="h-4 w-4 text-white/20" />
                <span className="text-[13px] text-white/35">&ldquo;Who can help with Python?&rdquo;</span>
              </div>

              {/* Results */}
              <div className="space-y-2">
                {searchResults.map((m) => (
                  <div
                    key={m.name}
                    className="flex items-center justify-between p-3 rounded-lg border border-white/[0.04] bg-[#0a0b0d] hover:border-[#FFD600]/10 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-[#FFD600]/10 flex items-center justify-center text-[11px] font-medium text-[#FFD600]">
                        {m.name[0]}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-white/70">{m.name}</p>
                        <p className="text-[10px] text-white/25">{m.expertise}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-[#FFD600]/50" />
                      <span className="text-[12px] text-white/40 font-medium">{m.reputation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Profile Card */}
          <div className="rounded-xl border border-white/[0.07] bg-[#090A0C] p-6 lg:p-8 shadow-2xl shadow-black/50">
            {/* Profile header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#FFD600]/20 to-[#FFD600]/5 flex items-center justify-center text-lg font-bold text-[#FFD600]">
                A
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-white/90">Alex</h3>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-medium border border-emerald-500/15">
                  Trusted Member
                </span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { value: '184', label: 'Answers' },
                { value: '31', label: 'Guides' },
                { value: '94', label: 'Reputation' },
              ].map((s) => (
                <div key={s.label} className="text-center p-3 rounded-lg bg-[#0a0b0d] border border-white/[0.04]">
                  <p className="text-lg font-bold text-white/80">{s.value}</p>
                  <p className="text-[10px] text-white/25">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Interest tags */}
            <div className="mb-5">
              <p className="text-[10px] text-white/25 uppercase tracking-wider font-medium mb-2.5">Interests</p>
              <div className="flex flex-wrap gap-1.5">
                {interests.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-white/[0.06] bg-white/[0.02] text-white/35"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Top contributor note */}
            <div className="flex items-center gap-2 p-3 rounded-lg border border-[#FFD600]/10 bg-[#FFD600]/[0.03]">
              <Trophy className="h-3.5 w-3.5 text-[#FFD600]" />
              <span className="text-[11px] text-[#FFD600]/70 font-medium">Top contributor this week</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
