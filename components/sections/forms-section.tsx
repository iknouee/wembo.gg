'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Clock, X } from 'lucide-react'
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
      <div className="absolute inset-0 bg-black" />
      <div className="relative container mx-auto px-4 lg:px-8">
        <div className={`max-w-2xl mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-white">
            Conversations →<br />
            <span className="text-gradient">Workflows.</span>
          </h2>
          <p className="text-white/40 leading-relaxed">
            Applications, appeals, reports — structured and reviewable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Form */}
          <div className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}>
            <h3 className="text-sm font-semibold text-white/80 mb-5 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              Staff Application
            </h3>
            <div className="space-y-3">
              {['Name', 'Age', 'Timezone', 'Experience', 'Why you?'].map((field) => (
                <div key={field} className="h-9 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 flex items-center">
                  <span className="text-xs text-white/20">{field}</span>
                </div>
              ))}
              <Button className="w-full h-9 text-xs font-semibold bg-yellow-500 text-black hover:bg-yellow-400 mt-2">
                Submit Application
              </Button>
            </div>
          </div>

          {/* Review */}
          <div className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-white/80">Review Queue</h3>
              <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full font-medium">3 pending</span>
            </div>
            <div className="space-y-2">
              <ReviewRow name="Alex" time="2h ago" status="pending" />
              <ReviewRow name="Jordan" time="5h ago" status="approved" />
              <ReviewRow name="Casey" time="1d ago" status="denied" />
            </div>
            <div className="border-t border-white/[0.06] mt-4 pt-4">
              <p className="text-[10px] text-white/25 uppercase tracking-wider mb-3">Reviewing: Alex</p>
              <div className="flex gap-2">
                <Button size="sm" className="h-7 text-[11px] bg-green-500/10 text-green-400 hover:bg-green-500/20 border-0 gap-1">
                  <Check className="h-3 w-3" /> Approve
                </Button>
                <Button size="sm" className="h-7 text-[11px] bg-red-500/10 text-red-400 hover:bg-red-500/20 border-0 gap-1">
                  <X className="h-3 w-3" /> Deny
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ReviewRow({ name, time, status }: { name: string; time: string; status: string }) {
  const colors: Record<string, string> = { pending: 'text-yellow-500 bg-yellow-500/10', approved: 'text-green-400 bg-green-500/10', denied: 'text-red-400 bg-red-500/10' }
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-white/[0.04] bg-white/[0.01]">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-white/[0.06] flex items-center justify-center text-[10px] font-medium text-white/50">{name[0]}</div>
        <div>
          <p className="text-xs font-medium text-white/70">{name}</p>
          <p className="text-[10px] text-white/20">{time}</p>
        </div>
      </div>
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${colors[status]}`}>{status}</span>
    </div>
  )
}
