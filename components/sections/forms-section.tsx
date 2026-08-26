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
    <section ref={ref} className="py-28 lg:py-36 relative">
      <div className="absolute inset-0 bg-[hsl(222,15%,4%)]" />
      <div className="relative container mx-auto px-4 lg:px-8">
        <div className={`max-w-2xl mb-14 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Conversations →<br /><span className="text-gradient">Workflows.</span>
          </h2>
          <p className="text-white/35 leading-relaxed">Applications, appeals, reports — structured and reviewable.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className={`rounded-xl border border-white/[0.05] bg-white/[0.015] p-6 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}>
            <h3 className="text-sm font-medium text-white/70 mb-5 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/30" /> Staff Application
            </h3>
            <div className="space-y-2.5">
              {['Name', 'Age', 'Timezone', 'Experience', 'Why you?'].map((f) => (
                <div key={f} className="h-9 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 flex items-center"><span className="text-[11px] text-white/20">{f}</span></div>
              ))}
              <Button className="w-full h-9 text-xs mt-2">Submit</Button>
            </div>
          </div>

          <div className={`rounded-xl border border-white/[0.05] bg-white/[0.015] p-6 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-medium text-white/70">Review Queue</h3>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">3 pending</span>
            </div>
            <div className="space-y-2">
              {[{n:'Alex',s:'pending'},{n:'Jordan',s:'approved'},{n:'Casey',s:'denied'}].map((r) => (
                <div key={r.n} className="flex items-center justify-between p-3 rounded-lg border border-white/[0.04] bg-white/[0.01]">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-white/[0.04] flex items-center justify-center text-[10px] text-white/40">{r.n[0]}</div>
                    <span className="text-xs text-white/60">{r.n}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${r.s === 'pending' ? 'bg-amber-500/10 text-amber-400' : r.s === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{r.s}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/[0.04] mt-4 pt-4 flex gap-2">
              <Button size="sm" className="h-7 text-[11px] bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-0 shadow-none gap-1"><Check className="h-3 w-3" />Approve</Button>
              <Button size="sm" className="h-7 text-[11px] bg-red-500/10 text-red-400 hover:bg-red-500/20 border-0 shadow-none gap-1"><X className="h-3 w-3" />Deny</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
