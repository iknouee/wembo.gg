'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, BookOpen, FileText, HelpCircle, MessageSquare, Shield } from 'lucide-react'

export function KnowledgeSection() {
  const [visible, setVisible] = useState(false)
  const [showReply, setShowReply] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); setTimeout(() => setShowReply(true), 1500) }
    }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-28 lg:py-36 relative">
      <div className="absolute inset-0 bg-black" />
      <div className="relative container mx-auto px-4 lg:px-8">
        <div className={`max-w-2xl mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-white">
            Your Discord,<br /><span className="text-gradient">as a knowledge base.</span>
          </h2>
          <p className="text-white/40 leading-relaxed">
            AI-powered answers sourced from your approved content.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Sources */}
          <div className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-sm font-semibold text-white/70 mb-4">Sources</h3>
            <div className="space-y-2">
              {[
                { icon: Shield, name: 'Rules', src: '#rules' },
                { icon: HelpCircle, name: 'FAQs', src: '#faq' },
                { icon: BookOpen, name: 'Guides', src: '#guides' },
                { icon: FileText, name: 'Docs', src: 'docs.wembo.com' },
                { icon: MessageSquare, name: 'Announcements', src: '#news' },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-lg border border-white/[0.04] bg-white/[0.01] hover:border-yellow-500/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-3.5 w-3.5 text-white/20" />
                    <span className="text-xs font-medium text-white/60">{item.name}</span>
                  </div>
                  <span className="text-[10px] text-white/20">{item.src}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Conversation */}
          <div className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-sm font-semibold text-white/70 mb-4">AI Answers</h3>
            <div className="space-y-3">
              {/* Question */}
              <div className="flex gap-2">
                <div className="h-7 w-7 rounded-full bg-blue-500/10 flex-shrink-0 flex items-center justify-center text-[10px] font-medium text-blue-400">U</div>
                <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 flex-1">
                  <p className="text-xs text-white/60">&ldquo;How do I verify my account?&rdquo;</p>
                </div>
              </div>

              {/* Reply */}
              {!showReply && visible && (
                <div className="flex gap-2 items-center">
                  <div className="h-7 w-7 rounded-full bg-yellow-500/10 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-yellow-500">W</div>
                  <div className="flex gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-yellow-500/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-yellow-500/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-yellow-500/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {showReply && (
                <div className="flex gap-2 animate-fade-up">
                  <div className="h-7 w-7 rounded-full bg-yellow-500/10 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-yellow-500">W</div>
                  <div className="rounded-lg border border-yellow-500/10 bg-yellow-500/[0.02] p-3 flex-1">
                    <p className="text-xs text-white/60 leading-relaxed">
                      Go to #verification and click &ldquo;Verify&rdquo;. Answer the rules quiz and you&apos;ll get the role automatically.
                    </p>
                    <div className="mt-2 pt-2 border-t border-yellow-500/10 flex items-center gap-2">
                      <span className="text-[10px] text-white/20 bg-white/[0.03] px-2 py-0.5 rounded">Source: #verification</span>
                      <button className="text-[10px] text-yellow-500/60 flex items-center gap-0.5 hover:text-yellow-500 transition-colors">
                        View <ArrowRight className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
