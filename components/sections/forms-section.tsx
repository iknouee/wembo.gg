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
      <div className="absolute inset-0 bg-[#070809]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className={`max-w-xl mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="text-[11px] font-semibold text-[#FFD400] uppercase tracking-wider mb-4 block">Forms & Workflows</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-4">
            Structured applications. Beautiful reviews.
          </h2>
          <p className="text-[15px] text-[#8B8D93] leading-relaxed">
            Staff apps, ban appeals, reports — built in Discord, managed in your dashboard.
          </p>
        </div>

        <div className={`grid md:grid-cols-2 gap-5 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Form */}
          <div className="card-elevated rounded-xl p-6 card-elevated-hover">
            <h3 className="text-[13px] font-medium text-white/70 mb-5 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#FFD400] shadow-sm shadow-[#FFD400]/30" /> Staff Application
            </h3>
            <div className="space-y-2.5">
              {['Discord Username','Age','Timezone','Experience','Why should we pick you?'].map((f) => (
                <div key={f} className="h-10 rounded-lg border border-white/[0.05] bg-[#0a0b0d] px-3.5 flex items-center"><span className="text-[12px] text-white/20">{f}</span></div>
              ))}
              <Button className="w-full h-10 text-[12px] mt-2">Submit Application</Button>
            </div>
          </div>

          {/* Review */}
          <div className="card-elevated rounded-xl p-6 card-elevated-hover">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[13px] font-medium text-white/70">Review Queue</h3>
              <span className="text-[10px] bg-[#FFD400]/[0.08] text-[#FFD400] px-2 py-0.5 rounded-full font-medium border border-[#FFD400]/15">3 pending</span>
            </div>
            <div className="space-y-2">
              {[{n:'Alex',t:'2h ago',s:'pending'},{n:'Jordan',t:'5h ago',s:'approved'},{n:'Casey',t:'1d ago',s:'denied'}].map((r) => (
                <div key={r.n} className="flex items-center justify-between p-3.5 rounded-lg border border-white/[0.04] bg-[#0a0b0d]">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-white/[0.04] flex items-center justify-center text-[10px] text-white/40 font-medium">{r.n[0]}</div>
                    <div><span className="text-[12px] text-white/60 block">{r.n}</span><span className="text-[10px] text-white/20">{r.t}</span></div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${r.s === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15' : r.s === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'bg-red-500/10 text-red-400 border border-red-500/15'}`}>{r.s}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/[0.04] mt-5 pt-5 flex gap-2">
              <Button size="sm" className="h-8 text-[11px] bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15 border border-emerald-500/15 shadow-none gap-1.5"><Check className="h-3 w-3" />Approve</Button>
              <Button size="sm" className="h-8 text-[11px] bg-red-500/10 text-red-400 hover:bg-red-500/15 border border-red-500/15 shadow-none gap-1.5"><X className="h-3 w-3" />Deny</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
