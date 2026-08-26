'use client'

import { useEffect, useRef, useState } from 'react'
import { Bot, Shield, Zap, BarChart3, Lightbulb, Users } from 'lucide-react'

const featureStrip = [
  { icon: Bot, title: 'AI Assistant', desc: 'Instant intelligent support' },
  { icon: Shield, title: 'Smart Security', desc: 'Stop threats automatically' },
  { icon: Zap, title: 'Automations', desc: 'Put repetitive work on autopilot' },
  { icon: BarChart3, title: 'Analytics', desc: 'Understand your community' },
  { icon: Lightbulb, title: 'Knowledge', desc: 'Answers from your server' },
  { icon: Users, title: 'Member Intelligence', desc: 'Know your audience' },
]

export function FeaturesSection() {
  const [visible, setVisible] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const stripRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs1 = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.2 })
    const obs2 = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true) }, { threshold: 0.3 })
    if (stripRef.current) obs1.observe(stripRef.current)
    if (statsRef.current) obs2.observe(statsRef.current)
    return () => { obs1.disconnect(); obs2.disconnect() }
  }, [])

  return (
    <section className="relative py-20 lg:py-28">
      <div className="absolute inset-0 bg-[#070809]" />
      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD400]/[0.08] to-transparent" />

      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Feature Strip */}
        <div ref={stripRef} className={`rounded-2xl border border-white/[0.06] bg-[#0c0d10] p-1 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {featureStrip.map((f, i) => (
              <div
                key={f.title}
                className={`group relative flex flex-col items-center text-center p-5 lg:p-6 transition-all duration-300 hover:-translate-y-[2px] ${
                  i < featureStrip.length - 1 ? 'lg:border-r border-white/[0.04]' : ''
                } ${i < 4 ? 'border-b md:border-b lg:border-b-0 border-white/[0.04]' : ''} ${i === 2 || i === 3 ? 'md:border-b-0' : ''}`}
              >
                {/* Hover background */}
                <div className="absolute inset-0 bg-[#FFD400]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />

                <div className="relative">
                  <div className="h-10 w-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3 group-hover:border-[#FFD400]/20 group-hover:bg-[#FFD400]/[0.05] transition-all">
                    <f.icon className="h-4 w-4 text-[#8B8D93] group-hover:text-[#FFD400] transition-colors" />
                  </div>
                  <h3 className="text-[12px] font-semibold text-white/80 mb-0.5">{f.title}</h3>
                  <p className="text-[11px] text-[#8B8D93]">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div ref={statsRef} className={`mt-16 lg:mt-20 transition-all duration-700 delay-200 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 max-w-4xl mx-auto text-center">
            <StatItem value="2,500+" label="Communities" visible={statsVisible} delay={0} />
            <StatItem value="1.2M+" label="Members Protected" visible={statsVisible} delay={100} />
            <StatItem value="24/7" label="Protection" visible={statsVisible} delay={200} />
            <StatItem value="99.99%" label="Uptime" visible={statsVisible} delay={300} />
          </div>
        </div>
      </div>
    </section>
  )
}

function StatItem({ value, label, visible, delay }: { value: string; label: string; visible: boolean; delay: number }) {
  return (
    <div
      className={`transition-all duration-600`}
      style={{ transitionDelay: `${delay}ms`, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)' }}
    >
      <p className="text-3xl lg:text-4xl font-bold text-white mb-1 tracking-tight">
        {value.includes('+') || value.includes('%') ? (
          <>
            {value.replace(/[+%]/g, '')}<span className="text-[#FFD400]">{value.match(/[+%]/)?.[0]}</span>
          </>
        ) : value === '24/7' ? (
          <>24<span className="text-[#FFD400]">/</span>7</>
        ) : value}
      </p>
      <p className="text-[13px] text-[#8B8D93]">{label}</p>
    </div>
  )
}
