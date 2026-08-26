'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Bot, Shield, Zap, BarChart3, FileText, Users,
  Lightbulb, Bell, Trophy, Ticket, Heart, Search,
} from 'lucide-react'

const features = [
  { icon: Bot, title: 'AI Assistant', description: 'Answers questions using your server\'s approved knowledge — with source citations.' },
  { icon: Shield, title: 'Smart Security', description: 'Anti-raid, phishing detection, threat scoring, and automatic lockdown.' },
  { icon: Zap, title: 'Automations', description: 'Visual workflow builder. Triggers, conditions, actions — no code needed.' },
  { icon: BarChart3, title: 'Analytics', description: 'Real-time growth metrics, engagement data, and AI-powered insights.' },
  { icon: Lightbulb, title: 'Knowledge Base', description: 'Turn Discord into a searchable wiki with AI-powered answers.' },
  { icon: FileText, title: 'Forms', description: 'Applications, appeals, reports — structured workflows in Discord.' },
  { icon: Users, title: 'Member Intel', description: 'Reputation tracking, expertise search, contribution history.' },
  { icon: Bell, title: 'Integrations', description: 'YouTube, Twitch, GitHub, Reddit — notifications where they belong.' },
  { icon: Ticket, title: 'Tickets', description: 'Support panels, assignments, transcripts, and AI summaries.' },
  { icon: Heart, title: 'Suggestions', description: 'Community voting, statuses, and a public roadmap.' },
  { icon: Trophy, title: 'Engagement', description: 'XP, levels, achievements, leaderboards, custom rewards.' },
  { icon: Search, title: 'Server Search', description: 'Find anything — messages, members, knowledge — instantly.' },
]

export function FeaturesSection() {
  const [visible, setVisible] = useState<Set<number>>(new Set())
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const i = Number(entry.target.getAttribute('data-i'))
            setVisible((prev) => new Set([...Array.from(prev), i]))
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    gridRef.current?.querySelectorAll('[data-i]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-28 lg:py-36 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-white">
            Everything you need.<br />
            <span className="text-white/40">Nothing you don&apos;t.</span>
          </h2>
          <p className="text-white/40 leading-relaxed">
            One bot. One dashboard. Every tool your community needs to thrive.
          </p>
        </div>

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              data-i={i}
              className={`group p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] card-hover transition-all duration-500 ${
                visible.has(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${(i % 4) * 60}ms` }}
            >
              <f.icon className="h-5 w-5 text-yellow-500/70 mb-3 group-hover:text-yellow-500 transition-colors" />
              <h3 className="text-sm font-semibold text-white/90 mb-1">{f.title}</h3>
              <p className="text-xs text-white/35 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
