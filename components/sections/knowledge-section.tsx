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
      <div className="absolute inset-0 bg-[#070809]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-14 items-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Discord chat demo */}
          <div className="order-2 lg:order-1 card-elevated rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/[0.04] bg-[#0c0d10] flex items-center gap-2">
              <span className="text-white/20">#</span>
              <span className="text-[13px] text-white/60 font-medium">general</span>
            </div>
            <div className="p-5 space-y-4">
              {/* User */}
              <div className="flex gap-3">
                <div className="h-9 w-9 rounded-full bg-indigo-500/15 flex-shrink-0 flex items-center justify-center text-[11px] font-medium text-indigo-400">M</div>
                <div>
                  <div className="flex items-center gap-2 mb-1"><span className="text-[13px] font-semibold text-white/80">Member</span><span className="text-[10px] text-white/20">Today at 3:42 PM</span></div>
                  <p className="text-[13px] text-white/50">How do I apply for staff?</p>
                </div>
              </div>

              {/* Typing */}
              {visible && !showReply && (
                <div className="flex gap-3 items-center">
                  <div className="h-9 w-9 rounded-full bg-[#FFD400]/10 flex-shrink-0 flex items-center justify-center"><Bot className="h-4 w-4 text-[#FFD400]" /></div>
                  <div className="flex gap-1"><div className="h-2 w-2 rounded-full bg-[#FFD400]/40 animate-bounce" /><div className="h-2 w-2 rounded-full bg-[#FFD400]/40 animate-bounce" style={{animationDelay:'150ms'}} /><div className="h-2 w-2 rounded-full bg-[#FFD400]/40 animate-bounce" style={{animationDelay:'300ms'}} /></div>
                </div>
              )}

              {/* Reply */}
              {showReply && (
                <div className="flex gap-3 animate-fade-up">
                  <div className="h-9 w-9 rounded-full bg-[#FFD400]/10 flex-shrink-0 flex items-center justify-center"><Bot className="h-4 w-4 text-[#FFD400]" /></div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[13px] font-semibold text-white/80">Wembo</span>
                      <span className="text-[9px] bg-[#5865F2] text-white px-1.5 py-[1px] rounded font-medium">BOT</span>
                    </div>
                    <div className="border-l-[3px] border-[#FFD400] rounded-r bg-[#141519] p-3 mt-1">
                      <p className="text-[13px] text-white/55 leading-relaxed">Staff applications open every Friday at 7 PM EST. Requirements: 30+ days membership, no warnings, Level 10+.</p>
                      <p className="text-[10px] text-white/20 mt-2">Source: #staff-information</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right text */}
          <div className="order-1 lg:order-2">
            <span className="text-[11px] font-semibold text-[#FFD400] uppercase tracking-wider mb-4 block">Knowledge Base</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-5">
              AI that knows your server.
            </h2>
            <p className="text-[15px] text-[#8B8D93] leading-relaxed mb-8 max-w-md">
              Answers questions using your approved knowledge with source citations. Rules, FAQs, guides — searchable by AI.
            </p>
            <div className="space-y-2">
              {[{icon: Shield, name: 'Server Rules'},{icon: HelpCircle, name: 'FAQs'},{icon: BookOpen, name: 'Guides'},{icon: FileText, name: 'Documentation'},{icon: MessageSquare, name: 'Announcements'}].map((s) => (
                <div key={s.name} className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.06] bg-[#0c0d10] hover:border-[#FFD400]/10 transition-colors">
                  <s.icon className="h-4 w-4 text-[#FFD400]/40" />
                  <span className="text-[13px] text-[#8B8D93]">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
