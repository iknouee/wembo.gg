'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, Star, Users } from 'lucide-react'

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
      <div className="absolute inset-0 bg-[hsl(220,16%,4%)]" />
      <div className="absolute top-[30%] left-[5%] w-[180px] h-[180px] border border-yellow-500/[0.05] rounded-3xl rotate-12 animate-float" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Left */}
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 block">Members</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Know your community.</h2>
            <p className="text-white/35 leading-relaxed mb-8">
              Reputation, expertise, contributions — find the right person for anything.
            </p>

            {/* Search demo */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-4 w-4 text-white/20" />
                <span className="text-sm text-white/40">Who can help with Python?</span>
              </div>
              <div className="space-y-2">
                {[{n:'Alex',s:'Programming',r:94},{n:'Jamie',s:'Python',r:98},{n:'Sam',s:'Web Dev',r:76}].map((m) => (
                  <div key={m.n} className="flex items-center justify-between p-3 rounded-lg border border-white/[0.04] bg-white/[0.01] hover:border-primary/15 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">{m.n[0]}</div>
                      <div><p className="text-sm font-medium text-white/70">{m.n}</p><p className="text-[10px] text-white/25">{m.s}</p></div>
                    </div>
                    <div className="flex items-center gap-1"><Star className="h-3 w-3 text-primary/60" /><span className="text-xs text-white/40 font-medium">{m.r}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Profile card */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-lg font-bold text-primary">A</div>
              <div>
                <h3 className="font-semibold text-white/90">Alex</h3>
                <span className="text-[11px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">Trusted Member</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[{v:'184',l:'Answers'},{v:'31',l:'Guides'},{v:'94',l:'Rep'}].map((s) => (
                <div key={s.l} className="text-center p-3 rounded-lg border border-white/[0.04] bg-white/[0.01]">
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
