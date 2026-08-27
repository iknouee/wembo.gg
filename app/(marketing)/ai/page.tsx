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
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
    const t1 = setTimeout(() => setShowConvo(true), 800)
    const t2 = setTimeout(() => setShowReply(true), 2200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

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
    <div className="relative min-h-screen bg-[#050505]">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#FFD600]/[0.02] rounded-full blur-[120px]" />

      <div className="relative py-24 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className={`text-center max-w-3xl mx-auto mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#FFD600] uppercase tracking-wider mb-6 bg-[#FFD600]/[0.04] border border-[#FFD600]/20 rounded-full px-3 py-1.5">
              <Bot className="h-3.5 w-3.5 text-[#FFD600]" /> Wembo AI
            </span>
            <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold text-white tracking-tight mb-6">
              An AI assistant that{' '}
              <span className="bg-gradient-to-r from-[#FFD600] to-[#FFA800] bg-clip-text text-transparent">understands your community.</span>
            </h1>
            <p className="text-lg text-[#9A9CA3] leading-relaxed">
              Wembo AI learns from your server&apos;s approved knowledge sources to provide accurate, helpful answers — with citations.
            </p>
          </div>

          {/* Discord Conversation Demo */}
          <div className={`max-w-2xl mx-auto mb-24 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="rounded-2xl bg-[#0a0b0d] overflow-hidden">
              {/* Discord-style header */}
              <div className="px-5 py-3.5 border-b border-white/[0.03] bg-[#0D0E11] flex items-center gap-2">
                <span className="text-[#9A9CA3]/60">#</span>
                <span className="text-sm font-medium text-[#F7F7F8]/80">general</span>
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-[#9A9CA3]/40">2,481 online</span>
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
                      <span className="text-sm font-semibold text-[#F7F7F8]/90">Member</span>
                      <span className="text-xs text-[#9A9CA3]/40">Today at 3:42 PM</span>
                    </div>
                    <p className="text-sm text-[#F7F7F8]/70">How do I apply for staff?</p>
                  </div>
                </div>

                {/* Typing indicator */}
                {showConvo && !showReply && (
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#FFD600]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-[#FFD600]">W</span>
                    </div>
                    <div className="flex items-center gap-1.5 py-2">
                      <div className="h-2 w-2 rounded-full bg-[#FFD600]/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="h-2 w-2 rounded-full bg-[#FFD600]/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="h-2 w-2 rounded-full bg-[#FFD600]/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}

                {/* Wembo response */}
                {showReply && (
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#FFD600]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-[#FFD600]">W</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-semibold text-[#F7F7F8]/90">Wembo</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#5865F2] text-white font-medium">BOT</span>
                        <span className="text-xs text-[#9A9CA3]/40">Today at 3:42 PM</span>
                      </div>
                      <div className="rounded-lg border-l-[3px] border-l-[#FFD600] bg-[#1e1f22] p-4">
                        <p className="text-sm leading-relaxed text-[#F7F7F8]/80">
                          Staff applications open every Friday at 7 PM EST. To apply, you must:
                        </p>
                        <ul className="text-sm mt-2.5 space-y-1.5 list-disc list-inside text-[#F7F7F8]/60">
                          <li>Have been a member for at least 30 days</li>
                          <li>Have no active warnings on your account</li>
                          <li>Be at least Level 10</li>
                        </ul>
                        <p className="text-sm mt-2.5 text-[#F7F7F8]/60">
                          Head to <span className="text-[#FFD600] font-medium">#staff-applications</span> when applications open.
                        </p>
                        <div className="mt-3.5 pt-3.5 border-t border-white/[0.06] flex items-center gap-2">
                          <span className="text-xs text-[#9A9CA3]/50 bg-white/[0.04] px-2 py-1 rounded">
                            Source: #staff-information
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {aiFeatures.map((feature, i) => (
              <div
                key={feature.title}
                data-idx={i}
                className={`group rounded-xl bg-[#090A0C] hover:bg-[#0f1012] p-6 transition-all duration-500 ${
                  visibleCards.has(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${(i % 3) * 100}ms` }}
              >
                <div className="rounded-lg bg-[#141519] w-10 h-10 flex items-center justify-center mb-4 group-hover:bg-[#1a1b20] transition-colors duration-300">
                  <feature.icon className="h-5 w-5 text-[#9A9CA3] group-hover:text-[#FFD600] transition-colors" />
                </div>
                <h3 className="font-semibold mb-2 text-[#F7F7F8]">{feature.title}</h3>
                <p className="text-sm text-[#9A9CA3] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Give your community an AI that knows them.</h2>
            <p className="text-[#9A9CA3] mb-8 max-w-lg mx-auto leading-relaxed">
              Set up Wembo AI in minutes. Add knowledge sources, configure permissions, and let your community ask away.
            </p>
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
