'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Bot, BookOpen, Shield, HelpCircle, FileText, MessageSquare } from 'lucide-react'

export function KnowledgeSection() {
  const [visible, setVisible] = useState(false)
  const [showReply, setShowReply] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); setTimeout(() => setShowReply(true), 1200) }
    }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-24 lg:py-32 relative">
      <div className="absolute inset-0 bg-[hsl(220,14%,5%)]" />
      <div className="relative container mx-auto px-4 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Chat demo */}
          <div className="order-2 lg:order-1 rounded-xl border border-white/[0.06] bg-[#1e1f22] p-5">
            <div className="space-y-4">
              {/* User message */}
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex-shrink-0 flex items-center justify-center text-[11px] font-medium text-indigo-400">M</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[13px] font-semibold text-white/80">Member</span>
                    <span className="text-[10px] text-white/20">Today at 3:42 PM</span>
                  </div>
                  <p className="text-[13px] text-white/50">How do I apply for staff?</p>
                </div>
              </div>

              {/* Typing */}
              {visible && !showReply && (
                <div className="flex gap-3 items-center">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center"><Bot className="h-3.5 w-3.5 text-primary" /></div>
                  <div className="flex gap-1"><div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" /><div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{animationDelay:'150ms'}} /><div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{animationDelay:'300ms'}} /></div>
                </div>
              )}

              {/* Bot reply */}
              {showReply && (
                <div className="flex gap-3 animate-fade-up">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center"><Bot className="h-3.5 w-3.5 text-primary" /></div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[13px] font-semibold text-white/80">Wembo</span>
                      <span className="text-[9px] bg-[#5865f2] text-white px-1.5 py-0.5 rounded font-medium">BOT</span>
                    </div>
                    <div className="border-l-4 border-primary rounded-r bg-[#2b2d31] p-3 mt-1">
                      <p className="text-[13px] text-white/50 leading-relaxed">
                        Staff applications open every Friday at 7 PM EST. You need 30+ days membership, no active warnings, and Level 10+.
                      </p>
                      <p className="text-[11px] text-white/20 mt-2">Source: #staff-information</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right text */}
          <div className="order-1 lg:order-2">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 block">Knowledge Base</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              AI that knows your server.
            </h2>
            <p className="text-white/35 leading-relaxed mb-8">
              Wembo answers questions using your approved knowledge — rules, FAQs, guides, docs — with source citations.
            </p>
            <div className="space-y-2">
              {[
                { icon: Shield, name: 'Server Rules' },
                { icon: HelpCircle, name: 'FAQs' },
                { icon: BookOpen, name: 'Guides' },
                { icon: FileText, name: 'Documentation' },
                { icon: MessageSquare, name: 'Announcements' },
              ].map((s) => (
                <div key={s.name} className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:border-primary/15 transition-colors">
                  <s.icon className="h-4 w-4 text-primary/50" />
                  <span className="text-sm text-white/50">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
