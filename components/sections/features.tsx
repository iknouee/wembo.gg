'use client'

import { useEffect, useRef, useState } from 'react'
import { Bot, Shield, Zap, BarChart3, FileText, Users, Lightbulb, Bell, Trophy, Ticket, Heart, Search } from 'lucide-react'

const features = [
  { icon: Bot, title: 'AI Assistant', description: 'Answers from your approved knowledge — with citations.' },
  { icon: Shield, title: 'Smart Security', description: 'Anti-raid, phishing, threat scoring, auto-lockdown.' },
  { icon: Zap, title: 'Automations', description: 'Visual workflows. Triggers, conditions, actions.' },
  { icon: BarChart3, title: 'Analytics', description: 'Growth, engagement, and AI-powered insights.' },
  { icon: Lightbulb, title: 'Knowledge Base', description: 'Turn Discord into a searchable wiki.' },
  { icon: FileText, title: 'Forms', description: 'Applications, appeals, structured workflows.' },
  { icon: Users, title: 'Member Intel', description: 'Reputation, expertise search, contributions.' },
  { icon: Bell, title: 'Integrations', description: 'YouTube, Twitch, GitHub notifications.' },
  { icon: Ticket, title: 'Tickets', description: 'Panels, assignments, transcripts, AI summaries.' },
  { icon: Heart, title: 'Suggestions', description: 'Voting, statuses, roadmap.' },
  { icon: Trophy, title: 'Engagement', description: 'XP, levels, achievements, leaderboards.' },
  { icon: Search, title: 'Server Search', description: 'Find anything instantly.' },
]

export function FeaturesSection() {
  const [visible, setVisible] = useState<Set<number>>(new Set())
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setVisible((p) => new Set([...Array.from(p), Number(e.target.getAttribute('data-i'))])) })
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' })
    ref.current?.querySelectorAll('[data-i]').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section className="py-28 lg:py-36 relative">
      <div className="absolute inset-0 bg-[hsl(222,15%,4%)]" />
      <div className="absolute top-0 left-0 right-0 h-px line-glow opacity-30" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Everything you need.
            <span className="text-white/30"> Nothing you don&apos;t.</span>
          </h2>
          <p className="text-white/35 leading-relaxed">
            One bot. One dashboard. Every tool your community needs.
          </p>
        </div>

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              data-i={i}
              className={`group p-5 rounded-xl border border-white/[0.05] bg-white/[0.015] card-glow transition-all duration-500 ${visible.has(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${(i % 4) * 50}ms` }}
            >
              <div className="h-9 w-9 rounded-lg bg-blue-500/[0.08] border border-blue-500/[0.08] flex items-center justify-center mb-3 group-hover:bg-blue-500/[0.12] group-hover:border-blue-500/[0.15] transition-all">
                <f.icon className="h-4 w-4 text-blue-400/70 group-hover:text-blue-400 transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-white/85 mb-1">{f.title}</h3>
              <p className="text-xs text-white/30 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
