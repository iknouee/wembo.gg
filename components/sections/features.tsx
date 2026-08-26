'use client'

import { useEffect, useRef, useState } from 'react'
import { Bot, Shield, Zap, BarChart3, Lightbulb, Users } from 'lucide-react'

const features = [
  { icon: Bot, title: 'AI Assistant', desc: 'Instant intelligent support' },
  { icon: Shield, title: 'Smart Security', desc: 'Stop threats automatically' },
  { icon: Zap, title: 'Automations', desc: 'Put repetitive work on autopilot' },
  { icon: BarChart3, title: 'Analytics', desc: 'Understand your community' },
  { icon: Lightbulb, title: 'Knowledge', desc: 'Answers from your server' },
  { icon: Users, title: 'Member Intel', desc: 'Know your audience deeply' },
]

export function FeaturesSection() {
  const [visible, setVisible] = useState(false)
  const [statsVis, setStatsVis] = useState(false)
  const stripRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const o1 = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.2 })
    const o2 = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVis(true) }, { threshold: 0.3 })
    if (stripRef.current) o1.observe(stripRef.current)
    if (statsRef.current) o2.observe(statsRef.current)
    return () => { o1.disconnect(); o2.disconnect() }
  }, [])

  return (
    <section className="relative py-16 lg:py-20 section-glow">
      <div className="absolute inset-0 surface-0" />
      <div className="divider-glow absolute top-0 left-0 right-0" />

      <div className="relative max-w-content mx-auto px-4 lg:px-8">
        {/* Feature Strip */}
        <div ref={stripRef} className={`rounded-2xl border border-white/[0.07] bg-[#090A0C] overflow-hidden transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-y lg:divide-y-0 divide-white/[0.05]">
            {features.map((f, i) => (
              <div key={f.title} className="group relative p-5 lg:p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-[2px] cursor-pointer">
                <div className="absolute inset-0 bg-[#FFD600]/[0.015] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="h-10 w-10 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-3 group-hover:border-[#FFD600]/20 group-hover:bg-[#FFD600]/[0.06] transition-all duration-300">
                    <f.icon className="h-[18px] w-[18px] text-[#9A9CA3] group-hover:text-[#FFD600] transition-colors duration-300" />
                  </div>
                  <h3 className="text-[12px] font-semibold text-white/85 mb-0.5">{f.title}</h3>
                  <p className="text-[11px] text-[#9A9CA3]/70 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Capabilities */}
        <div ref={statsRef} className="mt-14 lg:mt-16">
          <p className="text-[11px] text-[#9A9CA3]/50 uppercase tracking-widest font-semibold text-center mb-8">Everything your community needs, working together</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-3xl mx-auto text-center">
            <StatNum value="AI" suffix="" label="Powered Assistance" vis={statsVis} delay={0} />
            <StatNum value="24" suffix="/7" label="Protection" vis={statsVis} delay={100} />
            <StatNum value="0" suffix=" code" label="Required" vis={statsVis} delay={200} />
            <StatNum value="1" suffix=" dashboard" label="For Everything" vis={statsVis} delay={300} />
          </div>
        </div>
      </div>
    </section>
  )
}

function StatNum({ value, suffix, label, vis, delay }: { value: string; suffix: string; label: string; vis: boolean; delay: number }) {
  return (
    <div className="transition-all duration-600" style={{ transitionDelay: `${delay}ms`, opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(12px)' }}>
      <p className="text-3xl lg:text-[2.5rem] font-bold text-white tracking-tight mb-1">
        {value}<span className="text-[#FFD600]">{suffix}</span>
      </p>
      <p className="text-[12px] text-[#9A9CA3]">{label}</p>
    </div>
  )
}
