'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Bot,
  Shield,
  Zap,
  BarChart3,
  FileText,
  Users,
  Lightbulb,
  Bell,
  Trophy,
  Ticket,
  Heart,
  Search,
} from 'lucide-react'

const features = [
  {
    icon: Bot,
    title: 'AI Assistant',
    description: 'An AI that understands your community. Answers questions, summarizes channels, provides insights.',
    gradient: 'from-violet-500/20 to-purple-500/20',
    iconColor: 'text-violet-400',
  },
  {
    icon: Shield,
    title: 'Smart Security',
    description: 'Detect threats before they happen. Anti-raid, phishing detection, threat scoring, auto-lockdown.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: Zap,
    title: 'Automations',
    description: 'Visual workflow builder for any scenario. Triggers, conditions, and actions — no coding required.',
    gradient: 'from-amber-500/20 to-orange-500/20',
    iconColor: 'text-amber-400',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Real-time community metrics, growth data, and AI-powered insights for better decisions.',
    gradient: 'from-emerald-500/20 to-green-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Lightbulb,
    title: 'Knowledge Base',
    description: 'Turn your Discord into a searchable knowledge base with AI-powered answers from approved sources.',
    gradient: 'from-yellow-500/20 to-amber-500/20',
    iconColor: 'text-yellow-400',
  },
  {
    icon: FileText,
    title: 'Forms & Workflows',
    description: 'Build applications, appeals, and custom forms. Turn conversations into structured workflows.',
    gradient: 'from-pink-500/20 to-rose-500/20',
    iconColor: 'text-pink-400',
  },
  {
    icon: Users,
    title: 'Member Intelligence',
    description: 'Track reputation, interests, contributions, and find experts in your community instantly.',
    gradient: 'from-indigo-500/20 to-blue-500/20',
    iconColor: 'text-indigo-400',
  },
  {
    icon: Bell,
    title: 'Integrations',
    description: 'Connect YouTube, Twitch, GitHub, Reddit, and more. Notifications right where they belong.',
    gradient: 'from-red-500/20 to-rose-500/20',
    iconColor: 'text-red-400',
  },
  {
    icon: Ticket,
    title: 'Tickets',
    description: 'Full support system with panels, categories, assignments, transcripts, and AI summaries.',
    gradient: 'from-teal-500/20 to-emerald-500/20',
    iconColor: 'text-teal-400',
  },
  {
    icon: Heart,
    title: 'Suggestions',
    description: 'Community feedback with voting, categories, statuses, and a public roadmap.',
    gradient: 'from-rose-500/20 to-pink-500/20',
    iconColor: 'text-rose-400',
  },
  {
    icon: Trophy,
    title: 'Engagement',
    description: 'XP, levels, achievements, streaks, leaderboards, and custom rewards for active members.',
    gradient: 'from-orange-500/20 to-amber-500/20',
    iconColor: 'text-orange-400',
  },
  {
    icon: Search,
    title: 'Server Search',
    description: 'Search anything across your server instantly. Messages, members, knowledge — all in one place.',
    gradient: 'from-sky-500/20 to-blue-500/20',
    iconColor: 'text-sky-400',
  },
]

export function FeaturesSection() {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'))
            setVisibleCards((prev) => new Set([...prev, index]))
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    const cards = sectionRef.current?.querySelectorAll('[data-index]')
    cards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative py-32 lg:py-40 overflow-hidden" ref={sectionRef}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Everything your community needs.{' '}
            <span className="text-muted-foreground">Nothing it doesn&apos;t.</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Wembo combines powerful server tools with intelligence and automation so your
            staff can spend less time managing and more time building.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              data-index={i}
              className={`group relative rounded-xl border border-white/[0.06] bg-card/50 backdrop-blur-sm p-6 transition-all duration-500 hover:border-white/[0.12] hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 ${
                visibleCards.has(i)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${(i % 4) * 75}ms` }}
            >
              {/* Hover gradient */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative">
                <div className={`rounded-lg bg-white/[0.05] w-11 h-11 flex items-center justify-center mb-4 group-hover:bg-white/[0.08] transition-colors duration-300 ${feature.iconColor}`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground/90 group-hover:text-foreground transition-colors">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-muted-foreground/80 transition-colors">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
