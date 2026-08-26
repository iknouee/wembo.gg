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
      <div className="absolute inset-0 bg-neutral-950" />
      <div className="relative container mx-auto px-4 lg:px-8">
        <div className={`max-w-2xl mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-white">
            Know your<br /><span className="text-gradient">members.</span>
          </h2>
          <p className="text-white/40 leading-relaxed">
            Reputation, expertise, contributions — find the right person for anything.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Profile */}
          <div className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-lg font-bold text-yellow-500">A</div>
              <div>
                <h3 className="font-semibold text-white/90">Alex</h3>
                <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">Trusted Member</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <MiniBox value="184" label="Answers" />
              <MiniBox value="31" label="Guides" />
              <MiniBox value="94" label="Rep Score" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Minecraft', 'Programming', 'Photography'].map((t) => (
                <span key={t} className="text-[10px] px-2 py-1 rounded border border-white/[0.06] bg-white/[0.02] text-white/40">{t}</span>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-2 mb-5">
              <Search className="h-4 w-4 text-white/30" />
              <span className="text-sm font-medium text-white/60">Find someone</span>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 mb-5">
              <p className="text-xs text-white/50">&ldquo;Who can help with Python?&rdquo;</p>
            </div>
            <div className="space-y-2">
              <ResultRow name="Alex" skill="Programming" score={94} />
              <ResultRow name="Jamie" skill="Python" score={98} />
              <ResultRow name="Sam" skill="Web Dev" score={76} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MiniBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center p-3 rounded-lg border border-white/[0.04] bg-white/[0.01]">
      <p className="text-base font-bold text-white/80">{value}</p>
      <p className="text-[9px] text-white/25">{label}</p>
    </div>
  )
}

function ResultRow({ name, skill, score }: { name: string; skill: string; score: number }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-white/[0.04] bg-white/[0.01] hover:border-yellow-500/10 transition-colors">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-full bg-white/[0.05] flex items-center justify-center text-[10px] font-medium text-white/50">{name[0]}</div>
        <div>
          <p className="text-xs font-medium text-white/70">{name}</p>
          <p className="text-[10px] text-white/25">{skill}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Star className="h-3 w-3 text-yellow-500/60" />
        <span className="text-xs font-medium text-white/50">{score}</span>
      </div>
    </div>
  )
}
