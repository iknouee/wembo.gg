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
    <section ref={ref} className="py-28 lg:py-36 relative">
      <div className="absolute inset-0 bg-[hsl(222,15%,4%)]" />
      <div className="absolute bottom-0 left-[30%] w-[500px] h-[400px] bg-blue-500/[0.02] rounded-full blur-[120px]" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className={`max-w-2xl mb-14 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Know your <span className="text-gradient">members.</span>
          </h2>
          <p className="text-white/35 leading-relaxed">Reputation, expertise, contributions — find the right person.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Profile */}
          <div className={`rounded-xl border border-white/[0.05] bg-white/[0.015] p-6 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-500/30 to-blue-500/10 flex items-center justify-center text-sm font-bold text-blue-400">A</div>
              <div>
                <h3 className="text-sm font-semibold text-white/85">Alex</h3>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">Trusted</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[{v:'184',l:'Answers'},{v:'31',l:'Guides'},{v:'94',l:'Reputation'}].map((s) => (
                <div key={s.l} className="text-center p-3 rounded-lg border border-white/[0.04] bg-white/[0.01]">
                  <p className="text-sm font-bold text-white/80">{s.v}</p>
                  <p className="text-[9px] text-white/20">{s.l}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Minecraft','Programming','Photography'].map((t) => (
                <span key={t} className="text-[10px] px-2 py-1 rounded border border-white/[0.05] bg-white/[0.02] text-white/35">{t}</span>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className={`rounded-xl border border-white/[0.05] bg-white/[0.015] p-6 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-2 mb-5">
              <Search className="h-4 w-4 text-white/25" />
              <span className="text-sm font-medium text-white/50">Find someone</span>
            </div>
            <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 mb-5">
              <p className="text-xs text-white/40">&ldquo;Who can help with Python?&rdquo;</p>
            </div>
            <div className="space-y-2">
              {[{n:'Alex',s:'Programming',r:94},{n:'Jamie',s:'Python',r:98},{n:'Sam',s:'Web Dev',r:76}].map((m) => (
                <div key={m.n} className="flex items-center justify-between p-3 rounded-lg border border-white/[0.04] bg-white/[0.01] card-glow">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-blue-500/10 flex items-center justify-center text-[10px] font-medium text-blue-400">{m.n[0]}</div>
                    <div><p className="text-xs font-medium text-white/65">{m.n}</p><p className="text-[10px] text-white/20">{m.s}</p></div>
                  </div>
                  <div className="flex items-center gap-1"><Star className="h-3 w-3 text-blue-400/60" /><span className="text-xs font-medium text-white/40">{m.r}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
