'use client'

import { useEffect, useRef, useState } from 'react'
import { TrendingUp, Users, MessageSquare, Hash } from 'lucide-react'

export function CommunityIntelligence() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-28 lg:py-36 relative">
      <div className="absolute inset-0 bg-neutral-950" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className={`max-w-2xl mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-white">
            Community intelligence,<br />
            <span className="text-gradient">built in.</span>
          </h2>
          <p className="text-white/40 leading-relaxed">
            Real-time analytics and AI insights. Know exactly what&apos;s happening.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Chart */}
          <div className={`lg:col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium text-white/60">Activity — Last 7 days</span>
              <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded">+24%</span>
            </div>
            <div className="flex items-end gap-2 h-32">
              {[35, 50, 42, 68, 75, 90, 65].map((h, i) => (
                <div key={i} className="flex-1 rounded-t transition-all duration-700 ease-out bg-gradient-to-t from-yellow-500/40 to-yellow-500/80"
                  style={{ height: visible ? `${h}%` : '0%', transitionDelay: `${i * 80 + 300}ms` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-3 text-[10px] text-white/20">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          {/* Stats */}
          <div className={`space-y-4 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <StatRow icon={Users} label="New members" value="+342" sub="this week" />
            <StatRow icon={MessageSquare} label="Messages" value="84,291" sub="+24% vs last week" />
            <StatRow icon={TrendingUp} label="Retention" value="92%" sub="+3% improvement" />
            <StatRow icon={Hash} label="Top channel" value="#gaming" sub="12.4K messages" />

            {/* AI Insight */}
            <div className="rounded-xl border border-yellow-500/10 bg-yellow-500/[0.02] p-4">
              <p className="text-[10px] text-yellow-500/60 uppercase tracking-wider font-medium mb-2">AI INSIGHT</p>
              <p className="text-xs text-white/50 leading-relaxed">
                &ldquo;Activity spiked in #gaming this week. Consider hosting a community event there.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatRow({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-center gap-3">
      <Icon className="h-4 w-4 text-white/20 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/40">{label}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-white">{value}</p>
        <p className="text-[10px] text-white/25">{sub}</p>
      </div>
    </div>
  )
}
