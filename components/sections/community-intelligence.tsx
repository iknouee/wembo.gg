'use client'

import { useEffect, useRef, useState } from 'react'
import { TrendingUp, Users, MessageSquare, Bot, ArrowRight } from 'lucide-react'

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
      <div className="absolute inset-0 bg-[#070809]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
      <div className="absolute top-[40%] right-[10%] w-[500px] h-[400px] bg-[#FFD400]/[0.01] rounded-full blur-[150px]" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-14 items-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Left */}
          <div>
            <span className="text-[11px] font-semibold text-[#FFD400] uppercase tracking-wider mb-4 block">Analytics & Insights</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-5">
              Understand your community at a glance.
            </h2>
            <p className="text-[15px] text-[#8B8D93] leading-relaxed mb-8 max-w-md">
              Real-time metrics, AI-powered insights, and recommendations to help you grow.
            </p>

            <div className="space-y-3">
              <InsightRow icon={Users} label="New members this week" value="+342" badge="+12%" />
              <InsightRow icon={MessageSquare} label="Messages today" value="3,219" badge="+24%" />
              <InsightRow icon={TrendingUp} label="Retention rate" value="92%" badge="+3%" />
            </div>
          </div>

          {/* Right — AI Card */}
          <div className="card-elevated rounded-xl p-6 lg:p-8 card-elevated-hover">
            <div className="flex items-center gap-2 mb-5">
              <Bot className="h-4 w-4 text-[#FFD400]" />
              <span className="text-[11px] font-semibold text-[#FFD400] uppercase tracking-wider">AI Insight</span>
            </div>
            <p className="text-[15px] text-white/60 leading-relaxed mb-6">
              &ldquo;Activity increased 24% this week, primarily driven by #gaming. Member engagement peaks at 9 PM EST. Consider scheduling events during this window.&rdquo;
            </p>
            {/* Chart */}
            <div className="rounded-lg bg-[#0a0b0d] border border-white/[0.04] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-white/25 uppercase tracking-wider font-medium">Weekly Activity</span>
                <span className="text-[10px] text-emerald-400 font-medium">+24%</span>
              </div>
              <div className="flex items-end gap-1.5 h-20">
                {[30, 45, 38, 62, 70, 85, 58].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-[#FFD400]/20 to-[#FFD400]/60 hover:to-[#FFD400]/80 transition-colors cursor-pointer"
                    style={{ height: visible ? `${h}%` : '0%', transition: 'height 0.7s ease-out', transitionDelay: `${i * 60 + 300}ms` }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[9px] text-white/15">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function InsightRow({ icon: Icon, label, value, badge }: { icon: React.ElementType; label: string; value: string; badge: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-white/[0.06] bg-[#0c0d10] hover:border-[#FFD400]/10 transition-colors">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-white/20" />
        <span className="text-[13px] text-[#8B8D93]">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[14px] font-semibold text-white">{value}</span>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-full font-medium">{badge}</span>
      </div>
    </div>
  )
}
