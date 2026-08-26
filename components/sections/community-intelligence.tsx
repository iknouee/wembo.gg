'use client'

import { useEffect, useRef, useState } from 'react'
import { TrendingUp, Users, MessageSquare, Hash, Bot } from 'lucide-react'

export function CommunityIntelligence() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-28 lg:py-36 relative overflow-hidden">
      <div className="absolute inset-0 bg-[hsl(222,15%,4%)]" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-500/[0.02] rounded-full blur-[150px]" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className={`max-w-2xl mb-14 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Community intelligence,<br /><span className="text-gradient">built in.</span>
          </h2>
          <p className="text-white/35 leading-relaxed">Real-time analytics and AI insights.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Chart */}
          <div className={`lg:col-span-2 rounded-xl border border-white/[0.05] bg-white/[0.015] p-6 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm text-white/50 font-medium">Activity — 7 days</span>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">+24%</span>
            </div>
            <div className="flex items-end gap-2 h-36">
              {[35, 50, 42, 68, 75, 90, 65].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-blue-500/30 to-blue-400/70 transition-all duration-700 ease-out hover:to-blue-400 cursor-pointer"
                  style={{ height: visible ? `${h}%` : '0%', transitionDelay: `${i * 70 + 200}ms` }} />
              ))}
            </div>
            <div className="flex justify-between mt-3 text-[10px] text-white/15">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          {/* Sidebar */}
          <div className={`space-y-3 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <MetricCard icon={Users} label="New members" value="+342" />
            <MetricCard icon={MessageSquare} label="Messages" value="84,291" />
            <MetricCard icon={TrendingUp} label="Retention" value="92%" />
            <MetricCard icon={Hash} label="Top channel" value="#gaming" />

            {/* Insight */}
            <div className="rounded-xl border border-blue-500/10 bg-blue-500/[0.03] p-4 glow-border">
              <div className="flex items-center gap-1.5 mb-2">
                <Bot className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-[10px] text-blue-400/60 uppercase tracking-wider font-medium">AI Insight</span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed">
                &ldquo;#gaming drove 24% of this week&apos;s activity. Host an event there.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MetricCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-3.5 flex items-center justify-between card-glow">
      <div className="flex items-center gap-2.5">
        <Icon className="h-3.5 w-3.5 text-white/20" />
        <span className="text-xs text-white/35">{label}</span>
      </div>
      <span className="text-sm font-semibold text-white/80">{value}</span>
    </div>
  )
}
