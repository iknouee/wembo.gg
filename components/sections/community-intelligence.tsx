'use client'

import { useEffect, useRef, useState } from 'react'
import { TrendingUp, Users, MessageSquare, Bot } from 'lucide-react'

export function CommunityIntelligence() {
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

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden section-glow">
      <div className="absolute inset-0 surface-0" />
      <div className="divider-glow absolute top-0 left-0 right-0" />

      {/* Background glow */}
      <div className="absolute top-[30%] right-[5%] w-[600px] h-[500px] bg-[#FFD600]/[0.012] rounded-full blur-[180px]" />

      <div className="relative max-w-content mx-auto px-4 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-14 items-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* LEFT — Text + Stats */}
          <div>
            <span className="text-[11px] font-semibold text-[#FFD600] uppercase tracking-wider mb-4 block">
              Analytics & Insights
            </span>
            <h2 className="text-[clamp(2rem,4vw,2.75rem)] font-bold text-white tracking-tight leading-[1.1] mb-5">
              Understand your community at a glance.
            </h2>
            <p className="text-[15px] text-[#9A9CA3] leading-relaxed mb-8 max-w-md">
              Real-time metrics, AI-powered insights, and actionable recommendations to help you grow and retain members.
            </p>

            {/* Stat rows */}
            <div className="space-y-3">
              <StatRow icon={Users} label="Members" value="+342" badge="+12% this week" />
              <StatRow icon={MessageSquare} label="Messages" value="3,219" badge="Today" />
              <StatRow icon={TrendingUp} label="Retention" value="92%" badge="+3% vs last month" />
            </div>
          </div>

          {/* RIGHT — Analytics Dashboard Card */}
          <div className="rounded-xl border border-white/[0.07] bg-[#090A0C] shadow-2xl shadow-black/50 overflow-hidden">
            {/* Card header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05] bg-[#080909]">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-[#FFD600]/60" />
                <span className="text-[12px] font-semibold text-white/70">Community Dashboard</span>
              </div>
              <span className="text-[9px] text-white/15 uppercase tracking-wider">Example</span>
            </div>

            <div className="p-5 space-y-4">
              {/* Member growth chart */}
              <div className="rounded-lg bg-[#0a0b0d] border border-white/[0.04] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-white/25 uppercase tracking-wider font-medium">Member Growth</span>
                  <span className="text-[10px] text-emerald-400 font-medium">+12% ↑</span>
                </div>
                <div className="flex items-end gap-[3px] h-24">
                  {[20, 28, 32, 25, 38, 42, 35, 50, 55, 48, 60, 68, 72, 65, 80, 85, 78, 90, 95].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-[#FFD600]/20 to-[#FFD600]/50"
                      style={{
                        height: visible ? `${h}%` : '0%',
                        transition: 'height 0.8s ease-out',
                        transitionDelay: `${i * 50 + 300}ms`,
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[9px] text-white/15">2 weeks ago</span>
                  <span className="text-[9px] text-white/15">Today</span>
                </div>
              </div>

              {/* Activity summary */}
              <div className="grid grid-cols-3 gap-2">
                <MiniStat label="Active Now" value="284" change="+18%" />
                <MiniStat label="New Today" value="47" change="+8%" />
                <MiniStat label="Engagement" value="73%" change="+5%" />
              </div>

              {/* AI Insight quote */}
              <div className="rounded-lg border border-white/[0.06] bg-[#0c0d10] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="h-3.5 w-3.5 text-[#FFD600]" />
                  <span className="text-[10px] font-semibold text-[#FFD600]/80 uppercase tracking-wider">AI Insight</span>
                </div>
                <p className="text-[12px] text-white/50 leading-relaxed italic">
                  &ldquo;Activity increased 24% this week, primarily driven by #gaming. Peak engagement at 9 PM EST — consider scheduling events during this window.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatRow({ icon: Icon, label, value, badge }: { icon: React.ElementType; label: string; value: string; badge: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-white/[0.07] bg-[#090A0C] hover:border-[#FFD600]/10 transition-colors">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-white/20" />
        <span className="text-[13px] text-[#9A9CA3]">{label}</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-[14px] font-semibold text-white">{value}</span>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-full font-medium">{badge}</span>
      </div>
    </div>
  )
}

function MiniStat({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <div className="rounded-md bg-[#090a0c] border border-white/[0.04] p-2.5 text-center">
      <p className="text-[9px] text-white/25 mb-0.5">{label}</p>
      <p className="text-[14px] font-bold text-white">{value}</p>
      <p className="text-[9px] text-emerald-400/80">{change}</p>
    </div>
  )
}
