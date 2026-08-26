'use client'

import { useEffect, useRef, useState } from 'react'
import { TrendingUp, Users, MessageSquare, Bot } from 'lucide-react'

export function CommunityIntelligence() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[hsl(220,16%,4%)]" />
      <div className="absolute top-[50%] right-[10%] w-[300px] h-[300px] border border-yellow-500/[0.05] rounded-3xl rotate-12 animate-float" />
      <div className="absolute bottom-[20%] left-[5%] w-[200px] h-[200px] border border-yellow-500/[0.04] rounded-2xl -rotate-6 animate-float-reverse" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Left */}
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 block">Analytics</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Know what&apos;s happening.
            </h2>
            <p className="text-white/35 leading-relaxed mb-8">
              Real-time community metrics, AI-powered insights, and actionable recommendations.
            </p>

            <div className="space-y-3">
              <StatRow icon={Users} label="New members this week" value="+342" badge="+12%" />
              <StatRow icon={MessageSquare} label="Messages today" value="3,219" badge="+24%" />
              <StatRow icon={TrendingUp} label="Member retention" value="92%" badge="+3%" />
            </div>
          </div>

          {/* Right — AI Insight Card */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-5">
              <Bot className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI Insight</span>
            </div>
            <p className="text-[15px] text-white/60 leading-relaxed mb-6">
              &ldquo;Activity increased 24% this week, primarily driven by #gaming. Member engagement peaks at 9 PM EST. Consider scheduling events at that time.&rdquo;
            </p>
            {/* Mini chart */}
            <div className="flex items-end gap-1.5 h-20">
              {[30, 45, 38, 62, 70, 85, 58].map((h, i) => (
                <div key={i} className="flex-1 rounded-t bg-primary/40 hover:bg-primary/60 transition-colors cursor-pointer"
                  style={{ height: visible ? `${h}%` : '0%', transition: 'height 0.7s ease-out', transitionDelay: `${i * 60 + 300}ms` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-white/15">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatRow({ icon: Icon, label, value, badge }: { icon: React.ElementType; label: string; value: string; badge: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:border-primary/15 transition-colors">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-white/25" />
        <span className="text-sm text-white/50">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-white">{value}</span>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-full font-medium">{badge}</span>
      </div>
    </div>
  )
}
