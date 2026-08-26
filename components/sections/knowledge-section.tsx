'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, BookOpen, FileText, HelpCircle, MessageSquare, Shield, Bot } from 'lucide-react'

export function KnowledgeSection() {
  const [visible, setVisible] = useState(false)
  const [showReply, setShowReply] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); setTimeout(() => setShowReply(true), 1400) }
    }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-28 lg:py-36 relative">
      <div className="absolute inset-0 bg-[hsl(222,15%,4%)]" />
      <div className="absolute top-0 left-0 right-0 h-px line-glow opacity-20" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className={`max-w-2xl mb-14 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Your Discord as a<br /><span className="text-gradient">knowledge base.</span>
          </h2>
          <p className="text-white/35 leading-relaxed">AI answers sourced from your approved content.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Sources */}
          <div className={`rounded-xl border border-white/[0.05] bg-white/[0.015] p-6 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-sm font-medium text-white/60 mb-4">Knowledge Sources</h3>
            <div className="space-y-2">
              {[
                { icon: Shield, name: 'Rules', src: '#rules' },
                { icon: HelpCircle, name: 'FAQs', src: '#faq' },
                { icon: BookOpen, name: 'Guides', src: '#guides' },
                { icon: FileText, name: 'Docs', src: 'docs.wembo.com' },
                { icon: MessageSquare, name: 'Announcements', src: '#news' },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between p-3 rounded-lg border border-white/[0.04] bg-white/[0.01] card-glow">
                  <div className="flex items-center gap-2"><s.icon className="h-3.5 w-3.5 text-blue-400/40" /><span className="text-xs text-white/50">{s.name}</span></div>
                  <span className="text-[10px] text-white/20">{s.src}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className={`rounded-xl border border-white/[0.05] bg-white/[0.015] p-6 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-sm font-medium text-white/60 mb-4">AI-Powered Answers</h3>
            <div className="space-y-3">
              <div className="flex gap-2.5">
                <div className="h-7 w-7 rounded-full bg-indigo-500/10 flex-shrink-0 flex items-center justify-center text-[10px] font-medium text-indigo-400">U</div>
                <div className="rounded-lg bg-white/[0.03] border border-white/[0.05] p-3 flex-1">
                  <p className="text-xs text-white/50">&ldquo;How do I verify my account?&rdquo;</p>
                </div>
              </div>

              {!showReply && visible && (
                <div className="flex gap-2.5 items-center">
                  <div className="h-7 w-7 rounded-full bg-blue-500/10 flex-shrink-0 flex items-center justify-center"><Bot className="h-3 w-3 text-blue-400" /></div>
                  <div className="flex gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {showReply && (
                <div className="flex gap-2.5 animate-fade-up">
                  <div className="h-7 w-7 rounded-full bg-blue-500/10 flex-shrink-0 flex items-center justify-center"><Bot className="h-3 w-3 text-blue-400" /></div>
                  <div className="rounded-lg border border-blue-500/10 bg-blue-500/[0.02] p-3 flex-1 glow-border">
                    <p className="text-xs text-white/50 leading-relaxed">
                      Go to #verification, click &ldquo;Verify&rdquo;, answer the rules quiz, and you&apos;ll get the role automatically.
                    </p>
                    <div className="mt-2 pt-2 border-t border-blue-500/10 flex items-center gap-2">
                      <span className="text-[10px] text-white/20 bg-white/[0.02] border border-white/[0.04] px-2 py-0.5 rounded">Source: #verification</span>
                      <button className="text-[10px] text-blue-400/60 flex items-center gap-0.5 hover:text-blue-400 transition-colors">View <ArrowRight className="h-2.5 w-2.5" /></button>
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
