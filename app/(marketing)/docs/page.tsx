'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  BookOpen, Bot, Zap, Shield, FileText, Lightbulb,
  BarChart3, Puzzle, Code, HelpCircle, Rocket, Settings, Search,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const docsSections = [
  { icon: Rocket, title: 'Getting Started', description: 'Set up Wembo in under 5 minutes.', articles: ['Quick Start Guide', 'Adding Wembo', 'Initial Config', 'Permissions'] },
  { icon: Settings, title: 'Dashboard', description: 'Navigate and configure your server.', articles: ['Overview', 'Server Settings', 'Staff Permissions', 'Notifications'] },
  { icon: Bot, title: 'AI', description: 'Configure AI to assist your community.', articles: ['Knowledge Sources', 'AI Personality', 'Permissions', 'Channels'] },
  { icon: Zap, title: 'Automations', description: 'Build workflows with the visual builder.', articles: ['First Automation', 'Triggers & Conditions', 'Actions', 'Best Practices'] },
  { icon: Shield, title: 'Security', description: 'Configure smart security protection.', articles: ['Overview', 'Anti-Raid', 'Threat Scoring', 'Lockdown'] },
  { icon: FileText, title: 'Forms', description: 'Build custom forms and workflows.', articles: ['Creating Forms', 'Fields', 'Submissions', 'Review Interface'] },
  { icon: Lightbulb, title: 'Knowledge', description: 'Searchable knowledge base setup.', articles: ['Sources', 'FAQs', 'Approval Workflow', 'AI Integration'] },
  { icon: BarChart3, title: 'Analytics', description: 'Community data and insights.', articles: ['Dashboard', 'Growth', 'Engagement', 'Reports'] },
  { icon: Puzzle, title: 'Integrations', description: 'Connect external services.', articles: ['YouTube', 'Twitch', 'GitHub', 'Webhooks'] },
  { icon: Code, title: 'API', description: 'Programmatic access for developers.', articles: ['Overview', 'Authentication', 'Endpoints', 'Rate Limits'] },
  { icon: HelpCircle, title: 'Troubleshooting', description: 'Common issues and solutions.', articles: ['Common Issues', 'Permissions', 'Bot Offline', 'Support'] },
]

export default function DocsPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setVisibleCards((prev) => new Set([...Array.from(prev), Number(entry.target.getAttribute('data-idx'))])) }) },
      { threshold: 0.1 }
    )
    gridRef.current?.querySelectorAll('[data-idx]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative py-24 lg:py-32">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/[0.02] rounded-full blur-[100px]" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className={`mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Badge variant="secondary" className="mb-5 bg-primary/[0.06] border-primary/20">
              <BookOpen className="h-3.5 w-3.5 mr-2 text-primary" /> Documentation
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Wembo Documentation
            </h1>
            <p className="text-lg text-muted-foreground/60 max-w-2xl leading-relaxed">
              Everything you need to set up, configure, and get the most out of Wembo.
            </p>
          </div>

          {/* Search */}
          <div className={`mb-14 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="relative max-w-xl group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30 group-focus-within:text-primary/50 transition-colors" />
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full h-12 rounded-xl border border-white/[0.06] bg-white/[0.02] pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/20 transition-all placeholder:text-muted-foreground/30"
                readOnly
              />
            </div>
          </div>

          {/* Doc Sections */}
          <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {docsSections.map((section, i) => (
              <div
                key={section.title}
                data-idx={i}
                className={`group rounded-xl border border-white/[0.06] bg-card/50 backdrop-blur-sm p-6 hover:border-primary/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500 ${
                  visibleCards.has(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${(i % 3) * 80}ms` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-lg bg-primary/[0.06] p-2 group-hover:bg-primary/[0.12] transition-colors">
                    <section.icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold">{section.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground/50 mb-4">{section.description}</p>
                <ul className="space-y-2">
                  {section.articles.map((article) => (
                    <li key={article}>
                      <Link href="#" className="text-sm text-muted-foreground/40 hover:text-foreground/80 transition-colors flex items-center gap-2 group/link">
                        <div className="h-1 w-1 rounded-full bg-muted-foreground/20 group-hover/link:bg-primary transition-colors" />
                        {article}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Help CTA */}
          <div className={`mt-14 rounded-2xl border border-white/[0.06] bg-card/50 backdrop-blur-sm p-8 lg:p-10 text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h3 className="text-xl font-bold mb-2">Need help?</h3>
            <p className="text-muted-foreground/50 mb-5">Can&apos;t find what you&apos;re looking for? Join our Discord for support.</p>
            <Link href="https://discord.gg/Hgvs5WnZaK">
              <button className="inline-flex items-center gap-2.5 rounded-xl bg-[#5865F2] px-6 py-3 text-sm font-medium text-white hover:bg-[#4752C4] hover:shadow-lg hover:shadow-[#5865F2]/20 hover:-translate-y-0.5 transition-all duration-300">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Join Discord
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
