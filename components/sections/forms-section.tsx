'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FormsSection() {
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

  const formFields = [
    'Discord Username',
    'Age',
    'Timezone',
    'Experience',
    'Why should we pick you?',
  ]

  const reviews = [
    { name: 'Alex', time: '2h ago', status: 'pending' as const },
    { name: 'Jordan', time: '5h ago', status: 'approved' as const },
    { name: 'Casey', time: '1d ago', status: 'denied' as const },
  ]

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 surface-0" />
      <div className="divider-glow absolute top-0 left-0 right-0" />
      <div className="absolute top-[50%] right-[10%] w-[500px] h-[400px] bg-[#FFD600]/[0.01] rounded-full blur-[150px]" />

      <div className="relative max-w-content mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className={`max-w-xl mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="text-[11px] font-semibold text-[#FFD600] uppercase tracking-wider mb-4 block">
            Forms & Workflows
          </span>
          <h2 className="text-[clamp(2rem,4vw,2.75rem)] font-bold text-white tracking-tight leading-[1.1] mb-4">
            Structured applications. Beautiful reviews.
          </h2>
          <p className="text-[15px] text-[#9A9CA3] leading-relaxed">
            Staff apps, ban appeals, reports — built in Discord, managed in your dashboard with one-click approvals.
          </p>
        </div>

        {/* Two columns */}
        <div className={`grid md:grid-cols-2 gap-5 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* LEFT — Form Builder */}
          <div className="rounded-xl border border-white/[0.07] bg-[#090A0C] p-6">
            <h3 className="text-[13px] font-medium text-white/70 mb-5 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#FFD600] shadow-sm shadow-[#FFD600]/30" />
              Staff Application
            </h3>
            <div className="space-y-2.5">
              {formFields.map((f) => (
                <div
                  key={f}
                  className="h-10 rounded-lg border border-white/[0.05] bg-[#0a0b0d] px-3.5 flex items-center"
                >
                  <span className="text-[12px] text-white/20">{f}</span>
                </div>
              ))}
              <Button className="w-full h-10 text-[12px] mt-2">
                Submit Application
              </Button>
            </div>
          </div>

          {/* RIGHT — Review Queue */}
          <div className="rounded-xl border border-white/[0.07] bg-[#090A0C] p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[13px] font-medium text-white/70">Review Queue</h3>
              <span className="text-[10px] bg-[#FFD600]/[0.08] text-[#FFD600] px-2 py-0.5 rounded-full font-medium border border-[#FFD600]/15">
                3 pending
              </span>
            </div>

            <div className="space-y-2">
              {reviews.map((r) => (
                <div
                  key={r.name}
                  className="flex items-center justify-between p-3.5 rounded-lg border border-white/[0.04] bg-[#0a0b0d]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-medium ${
                      r.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                      r.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {r.name[0]}
                    </div>
                    <div>
                      <span className="text-[12px] text-white/60 block">{r.name}</span>
                      <span className="text-[10px] text-white/20">{r.time}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    r.status === 'pending'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15'
                      : r.status === 'approved'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                      : 'bg-red-500/10 text-red-400 border border-red-500/15'
                  }`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="border-t border-white/[0.04] mt-5 pt-5 flex gap-2">
              <Button
                size="sm"
                className="h-8 text-[11px] bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15 border border-emerald-500/15 shadow-none gap-1.5"
              >
                <Check className="h-3 w-3" />
                Approve
              </Button>
              <Button
                size="sm"
                className="h-8 text-[11px] bg-red-500/10 text-red-400 hover:bg-red-500/15 border border-red-500/15 shadow-none gap-1.5"
              >
                <X className="h-3 w-3" />
                Deny
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
