'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
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
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const featureCategories = [
  {
    title: 'AI Assistant',
    description: 'An AI that actually understands your community. It answers questions using approved knowledge, summarizes channels, and provides weekly reports.',
    icon: Bot,
    href: '/ai',
    features: [
      'Server-specific knowledge',
      'AI Q&A with source citations',
      'Channel & conversation summaries',
      'Weekly community reports',
      'Configurable AI personality',
      'Permission controls',
    ],
  },
  {
    title: 'Smart Security',
    description: 'Detect suspicious behaviour before it becomes a problem. Protect your community with intelligent threat detection.',
    icon: Shield,
    href: '/security',
    features: [
      'Threat scoring system',
      'Anti-raid & anti-nuke protection',
      'Phishing & scam detection',
      'Impersonation detection',
      'Automatic lockdown',
      'Security event timeline',
    ],
  },
  {
    title: 'Automations',
    description: 'Visual workflow builder for any scenario. Create powerful automations without writing a single line of code.',
    icon: Zap,
    href: '/automations',
    features: [
      'Visual workflow builder',
      'Custom triggers & conditions',
      'Multi-step actions',
      'Scheduled automations',
      'Integration triggers',
      'Variable system',
    ],
  },
  {
    title: 'Analytics & Insights',
    description: 'Understand your community with real-time data. AI-powered insights help you make informed decisions.',
    icon: BarChart3,
    href: '/features',
    features: [
      'Member growth tracking',
      'Engagement metrics',
      'Channel popularity',
      'Peak activity times',
      'AI-powered insights',
      'Custom reports',
    ],
  },
  {
    title: 'Knowledge Base',
    description: 'Turn your Discord into a searchable knowledge base. Members get instant AI-powered answers from approved sources.',
    icon: Lightbulb,
    href: '/features',
    features: [
      'Approved knowledge sources',
      'AI-powered search',
      'FAQ management',
      'Version history',
      'Admin approval workflow',
      'Source citations',
    ],
  },
  {
    title: 'Forms & Workflows',
    description: 'Build applications, reports, appeals, and custom forms. Turn conversations into structured data.',
    icon: FileText,
    href: '/features',
    features: [
      'Staff applications',
      'Ban appeals',
      'Custom form builder',
      'Submission review interface',
      'Automated responses',
      'Form analytics',
    ],
  },
  {
    title: 'Member Intelligence',
    description: 'Know your members. Track contributions, expertise, and reputation across your community.',
    icon: Users,
    href: '/features',
    features: [
      'Member profiles',
      'Reputation system',
      'Expertise tracking',
      'Contribution history',
      'Member search',
      'Role recommendations',
    ],
  },
  {
    title: 'Integrations',
    description: 'Connect external platforms and deliver notifications right where your community wants them.',
    icon: Bell,
    href: '/features',
    features: [
      'YouTube notifications',
      'Twitch go-live alerts',
      'GitHub activity feeds',
      'Reddit post notifications',
      'RSS feeds',
      'Custom webhooks',
    ],
  },
  {
    title: 'Tickets',
    description: 'Manage support requests with a full ticket system. Panels, categories, assignments, and AI summaries.',
    icon: Ticket,
    href: '/features',
    features: [
      'Ticket panels & categories',
      'Staff assignment',
      'Transcript saving',
      'Internal notes',
      'Auto-close rules',
      'Ticket analytics',
    ],
  },
  {
    title: 'Suggestions',
    description: 'Collect community feedback with voting, categories, statuses, and a public roadmap.',
    icon: Heart,
    href: '/features',
    features: [
      'Community voting',
      'Category filtering',
      'Staff discussion threads',
      'Status tracking',
      'Public roadmap',
      'Duplicate detection',
    ],
  },
  {
    title: 'Engagement',
    description: 'Keep your community active with XP, levels, achievements, and custom rewards.',
    icon: Trophy,
    href: '/features',
    features: [
      'XP & leveling system',
      'Custom rewards',
      'Achievements & streaks',
      'Leaderboards',
      'Server quests',
      'Custom currency',
    ],
  },
  {
    title: 'Server Search',
    description: 'Search anything across your server instantly. Messages, members, knowledge, and more.',
    icon: Search,
    href: '/features',
    features: [
      'Full-text search',
      'Member lookup',
      'Knowledge search',
      'Message history',
      'Filter & sort',
      'Instant results',
    ],
  },
]

export default function FeaturesPage() {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())
  const [isVisible, setIsVisible] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-idx'))
            setVisibleCards((prev) => new Set([...Array.from(prev), idx]))
          }
        })
      },
      { threshold: 0.1 }
    )
    gridRef.current?.querySelectorAll('[data-idx]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative min-h-screen bg-[#050505]">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#FFD600]/[0.02] rounded-full blur-[120px]" />

      <div className="relative py-24 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className={`text-center max-w-3xl mx-auto mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-block text-[11px] font-semibold text-[#FFD600] uppercase tracking-wider mb-6">
              Features
            </span>
            <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold text-white tracking-tight mb-6">
              Everything your community needs.{' '}
              <span className="bg-gradient-to-r from-[#FFD600] to-[#FFA800] bg-clip-text text-transparent">Nothing it doesn&apos;t.</span>
            </h1>
            <p className="text-lg text-[#9A9CA3] leading-relaxed">
              Wembo combines powerful server tools with intelligence and automation so your
              staff can spend less time managing Discord and more time building the community.
            </p>
          </div>

          {/* Feature Grid */}
          <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureCategories.map((category, i) => (
              <div
                key={category.title}
                data-idx={i}
                className={`group p-6 rounded-xl bg-[#090A0C] hover:bg-[#0f1012] transition-all duration-500 flex flex-col ${
                  visibleCards.has(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${(i % 3) * 80}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-lg bg-[#141519] w-10 h-10 flex items-center justify-center group-hover:bg-[#1a1b20] transition-colors">
                    <category.icon className="h-5 w-5 text-[#9A9CA3] group-hover:text-[#FFD600] transition-colors" />
                  </div>
                  <h3 className="font-semibold text-lg text-[#F7F7F8]">{category.title}</h3>
                </div>
                <p className="text-sm text-[#9A9CA3] mb-4 leading-relaxed">
                  {category.description}
                </p>
                <ul className="space-y-2 mt-auto">
                  {category.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-[#9A9CA3]/70">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#FFD600]/40" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {(category.href === '/ai' || category.href === '/security' || category.href === '/automations') && (
                  <Link
                    href={category.href}
                    className="flex items-center gap-1 text-sm text-[#FFD600] mt-4 hover:gap-2 transition-all"
                  >
                    Learn more <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-24">
            <Link href="/invite">
              <Button size="lg" className="gap-2.5 group">
                Add Wembo to Discord
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
