'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, Star } from 'lucide-react'

export function MemberIntelligence() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-24 lg:py-32 relative">
      <div className="absolute inset-0 bg-[#070809]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-14 items-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Left */}
          <div>
            <span className="text-[11px] font-semibold text-[#FFD400] uppercase tracking-wider mb-4 block">Member Intelligence</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-5">
              Know your community.
            </h2>
            <p className="text-[15px] text-[#8B8D93] leading-relaxed mb-8 max-w-md">
              Reputation, expertise, contributions — find the right person for anything instantly.
            </p>

            {/* Search */}
            <div className="card-elevated rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-4 w-4 text-white/20" />
                <span className="text-[13px] text-white/35">&ldquo;Who can help with Python?&rdquo;</span>
              </div>
              <div className="space-y-2">
                {[{n:'Alex',s:'Programming',r:94},{n:'Jamie',s:'Python',r:98},{n:'Sam',s:'Web Dev',r:76}].map((m) => (
                  <div key={m.n} className="flex items-center justify-between p-3 rounded-lg border border-white/[0.04] bg-[#0a0b0d] hover:border-[#FFD400]/10 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-[#FFD400]/[0.08] flex items-center justify-center text-[11px] font-medium text-[#FFD400]">{m.n[0]}</div>
                      <div><p className="text-[13px] font-medium text-white/70">{m.n}</p><p className="text-[10px] text-white/25">{m.s}</p></div>
                    </div>
                    <div className="flex items-center gap-1"><Star className="h-3 w-3 text-[#FFD400]/50" /><span className="text-[12px] text-white/40 font-medium">{m.r}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Profile */}
          <div className="card-elevated rounded-xl p-6 lg:p-8 card-elevated-hover">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#FFD400]/20 to-[#FFD400]/5 flex items-center justify-center text-lg font-bold text-[#FFD400]">A</div>
              <div>
                <h3 className="text-[15px] font-semibold text-white/90">Alex</h3>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-medium">Trusted Member</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[{v:'184',l:'Answers'},{v:'31',l:'Guides'},{v:'94',l:'Reputation'}].map((s) => (
                <div key={s.l} className="text-center p-3 rounded-lg bg-[#0a0b0d] border border-white/[0.04]">
                  <p className="text-lg font-bold text-white/80">{s.v}</p>
                  <p className="text-[10px] text-white/25">{s.l}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Minecraft','Programming','Photography'].map((t) => (
                <span key={t} className="text-[11px] px-2.5 py-1 rounded-full border border-white/[0.06] bg-white/[0.02] text-white/35">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
