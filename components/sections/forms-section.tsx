'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FormsSection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-24 lg:py-32 relative">
      <div className="absolute inset-0 bg-[hsl(220,14%,5%)]" />
      <div className="relative container mx-auto px-4 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-12 items-start transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Left text */}
          <div className="lg:sticky lg:top-32">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 block">Forms</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Conversations → Workflows.</h2>
            <p className="text-white/35 leading-relaxed mb-6">
              Staff applications, ban appeals, reports — structured, reviewable, and beautifully managed.
            </p>
            <div className="space-y-2">
              {['Staff Applications','Ban Appeals','Partner Applications','Bug Reports','Event Registration'].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-white/35">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Right — form cards */}
          <div className="space-y-4">
            {/* Form */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-sm font-medium text-white/70 mb-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" /> Staff Application
              </h3>
              <div className="space-y-2.5">
                {['Discord Username', 'Age', 'Timezone', 'Experience', 'Why should we pick you?'].map((f) => (
                  <div key={f} className="h-9 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 flex items-center">
                    <span className="text-[11px] text-white/20">{f}</span>
                  </div>
                ))}
                <Button className="w-full h-9 text-xs mt-1">Submit Application</Button>
              </div>
            </div>

            {/* Review */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white/70">Review Queue</h3>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">3 pending</span>
              </div>
              <div className="space-y-2">
                {[{n:'Alex',s:'pending'},{n:'Jordan',s:'approved'},{n:'Casey',s:'denied'}].map((r) => (
                  <div key={r.n} className="flex items-center justify-between p-3 rounded-lg border border-white/[0.04] bg-white/[0.01]">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-white/[0.04] flex items-center justify-center text-[10px] text-white/40 font-medium">{r.n[0]}</div>
                      <span className="text-xs text-white/60">{r.n}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${r.s === 'pending' ? 'bg-amber-500/10 text-amber-400' : r.s === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{r.s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
