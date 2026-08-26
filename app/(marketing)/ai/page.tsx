'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Bot,
  Brain,
  BookOpen,
  MessageSquare,
  Settings,
  FileText,
  Search,
  Sparkles,
  Lock,
  Quote,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const aiFeatures = [
  { icon: Brain, title: 'Server-Specific Knowledge', description: 'Learns from your approved sources — channels, documents, and FAQs — to answer accurately.' },
  { icon: MessageSquare, title: 'AI Q&A', description: 'Members ask questions and get instant, accurate answers sourced from your community knowledge.' },
  { icon: FileText, title: 'Channel Summaries', description: 'Catch up on channels in seconds. AI-generated summaries of conversations and decisions.' },
  { icon: BookOpen, title: 'Weekly Reports', description: 'Automatic weekly digests of community activity, trends, and important discussions.' },
  { icon: Sparkles, title: 'AI Recommendations', description: 'Proactive suggestions based on community data — from retention to engagement improvements.' },
  { icon: Search, title: 'Searchable Information', description: 'Everything in your server becomes searchable. Messages, knowledge, members, and more.' },
  { icon: Settings, title: 'Configurable Personality', description: 'Customize how Wembo speaks. Formal, casual, brief, detailed — match your server\'s vibe.' },
  { icon: Lock, title: 'Permission Controls', description: 'Control exactly who can use AI features and which channels Wembo responds in.' },
  { icon: Quote, title: 'Source Citations', description: 'Every AI answer includes sources so members know where the information came from.' },
]

export default function AIPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [showConvo, setShowConvo] = useState(false)
  const [showReply, setShowReply] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
    const t1 = setTimeout(() => setShowConvo(true), 800)
    const t2 = setTimeout(() => setShowReply(true), 2200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className="relative">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-primary/[0.04] rounded-full blur-[120px]" />

      <div className="relative py-24 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className={`text-center max-w-3xl mx-auto mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} ref={heroRef}>
            <Badge variant="secondary" className="mb-6 bg-primary/[0.06] border-primary/20 backdrop-blur-sm">
              <Bot className="h-3.5 w-3.5 mr-2 text-primary" /> Wembo AI
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              An AI assistant that{' '}
              <span className="text-gradient-hero glow-text">understands your community.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Wembo AI learns from your server&apos;s approved knowledge sources to provide accurate, helpful answers — with citations.
            </p>
          </div>

          {/* Discord Conversation Demo */}
          <div className={`max-w-2xl mx-auto mb-24 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-violet-500/5 to-indigo-500/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
              <div className="relative rounded-2xl border border-white/[0.08] bg-card/80 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/20">
                {/* Discord-style header */}
                <div className="px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02] flex items-center gap-2">
                  <span className="text-muted-foreground/60">#</span>
                  <span className="text-sm font-medium text-foreground/80">general</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground/40">2,481 online</span>
                  </div>
                </div>
                <div className="p-5 space-y-5 min-h-[280px]">
                  {/* Member message */}
                  <div className={`flex gap-3 transition-all duration-500 ${showConvo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-sm font-medium text-blue-400 flex-shrink-0">
                      M
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-semibold text-foreground/90">Member</span>
                        <span className="text-xs text-muted-foreground/40">Today at 3:42 PM</span>
                      </div>
                      <p className="text-sm text-foreground/70">How do I apply for staff?</p>
                    </div>
                  </div>

                  {/* Typing indicator */}
                  {showConvo && !showReply && (
                    <div className="flex gap-3 animate-fade-in">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">W</span>
                      </div>
                      <div className="flex items-center gap-1.5 py-2">
                        <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}

                  {/* Wembo response */}
                  {showReply && (
                    <div className="flex gap-3 animate-fade-in-up">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                        <span className="text-sm font-bold text-primary">W</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-sm font-semibold text-foreground/90">Wembo</span>
                          <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4 bg-primary/80">AI</Badge>
                          <span className="text-xs text-muted-foreground/40">Today at 3:42 PM</span>
                        </div>
                        <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-4">
                          <p className="text-sm leading-relaxed text-foreground/80">
                            Staff applications open every Friday at 7 PM EST. To apply, you must:
                          </p>
                          <ul className="text-sm mt-2.5 space-y-1.5 list-disc list-inside text-foreground/60">
                            <li>Have been a member for at least 30 days</li>
                            <li>Have no active warnings on your account</li>
                            <li>Be at least Level 10</li>
                          </ul>
                          <p className="text-sm mt-2.5 text-foreground/60">
                            Head to <span className="text-primary font-medium">#staff-applications</span> when applications open.
                          </p>
                          <div className="mt-3.5 pt-3.5 border-t border-primary/10 flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs bg-white/[0.04]">
                              Source: #staff-information
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <FeaturesGrid />

          {/* CTA */}
          <div className="text-center mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Give your community an AI that knows them.</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
              Set up Wembo AI in minutes. Add knowledge sources, configure permissions, and let your community ask away.
            </p>
            <Link href="#">
              <Button size="lg" className="gap-2.5 group shadow-lg shadow-primary/20">
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

function FeaturesGrid() {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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
    <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
      {aiFeatures.map((feature, i) => (
        <div
          key={feature.title}
          data-idx={i}
          className={`group rounded-xl border border-white/[0.06] bg-card/50 backdrop-blur-sm p-6 hover:border-primary/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 ${
            visibleCards.has(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: `${(i % 3) * 100}ms` }}
        >
          <div className="rounded-lg bg-primary/[0.06] w-10 h-10 flex items-center justify-center mb-4 group-hover:bg-primary/[0.12] transition-colors duration-300">
            <feature.icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">{feature.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  )
}
