'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Bot, Shield, Zap, BarChart3, FileText, Users, Lightbulb, Bell, Trophy, Ticket, Heart, Search } from 'lucide-react'

const features = [
  { icon: Bot, title: 'AI Assistant', description: 'Answers questions using your server\'s approved knowledge with source citations. Configurable personality and permissions.' },
  { icon: Shield, title: 'Smart Security', description: 'Anti-raid, phishing detection, threat scoring, impersonation detection, and automatic lockdown protection.' },
  { icon: Zap, title: 'Automations', description: 'Visual workflow builder with triggers, conditions, and actions. No coding required.' },
  { icon: BarChart3, title: 'Analytics', description: 'Real-time growth metrics, engagement data, channel stats, and AI-powered community insights.' },
  { icon: Lightbulb, title: 'Knowledge Base', description: 'Turn your Discord into a searchable wiki. AI-powered answers from approved sources.' },
  { icon: FileText, title: 'Forms & Workflows', description: 'Staff applications, ban appeals, reports — structured and reviewable in a clean dashboard.' },
  { icon: Users, title: 'Member Intelligence', description: 'Reputation tracking, expertise search, contribution history, and member profiles.' },
  { icon: Bell, title: 'Integrations', description: 'YouTube, Twitch, GitHub, Reddit, RSS — notifications delivered exactly where they belong.' },
  { icon: Ticket, title: 'Tickets', description: 'Support panels, staff assignment, transcripts, internal notes, and AI-generated summaries.' },
]

export function FeaturesSection() {
  const [visible, setVisible] = useState<Set<number>>(new Set())
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setVisible((p) => new Set([...Array.from(p), Number(e.target.getAttribute('data-i'))])) })
    }, { threshold: 0.1 })
    ref.current?.querySelectorAll('[data-i]').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section className="py-24 lg:py-32 relative">
      <div className="absolute inset-0 bg-[hsl(220,14%,5%)]" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="max-w-xl mb-14">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 block">Features</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything your community needs.
          </h2>
          <p className="text-white/35 leading-relaxed">
            One bot, one dashboard. Powerful tools without the complexity.
          </p>
        </div>

        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              data-i={i}
              className={`group p-6 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-primary/20 hover:bg-primary/[0.02] transition-all duration-500 ${visible.has(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${(i % 3) * 60}ms` }}
            >
              <div className="h-10 w-10 rounded-lg bg-primary/[0.08] border border-primary/[0.1] flex items-center justify-center mb-4 group-hover:bg-primary/[0.15] group-hover:border-primary/20 transition-all">
                <f.icon className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-[15px] font-semibold text-white/90 mb-2">{f.title}</h3>
              <p className="text-[13px] text-white/35 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/features" className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors">
            See all features <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
