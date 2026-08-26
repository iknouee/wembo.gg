'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, BookOpen, FileText, HelpCircle, MessageSquare, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function KnowledgeSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [showResponse, setShowResponse] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setTimeout(() => setShowResponse(true), 1200)
        }
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-violet-500/[0.01] to-background" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Turn your Discord into a{' '}
            <span className="text-gradient">knowledge base.</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Collect, organize, and serve community knowledge automatically. Members get instant answers from approved sources.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Knowledge Sources */}
          <div className={`rounded-2xl border border-white/[0.06] bg-card/50 backdrop-blur-sm p-6 lg:p-8 hover:border-white/[0.1] transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h3 className="font-semibold text-lg mb-6">Knowledge Sources</h3>
            <div className="space-y-2.5">
              {[
                { icon: Shield, title: 'Server Rules', source: '#rules' },
                { icon: HelpCircle, title: 'FAQs', source: '#faq' },
                { icon: BookOpen, title: 'Guides', source: '#guides' },
                { icon: FileText, title: 'Documentation', source: 'docs.wembo.com' },
                { icon: MessageSquare, title: 'Important Channels', source: '#announcements' },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:border-primary/20 hover:bg-primary/[0.02] transition-all duration-300 group cursor-pointer"
                  style={{ transitionDelay: `${i * 100 + 400}ms`, opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(8px)' }}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground/40">{item.source}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Response Demo */}
          <div className={`rounded-2xl border border-white/[0.06] bg-card/50 backdrop-blur-sm p-6 lg:p-8 hover:border-white/[0.1] transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h3 className="font-semibold text-lg mb-6">AI-Powered Answers</h3>
            <div className="space-y-4">
              {/* User question */}
              <div className={`flex gap-3 transition-all duration-500 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="h-9 w-9 rounded-full bg-indigo-500/20 flex-shrink-0 flex items-center justify-center text-xs font-medium text-indigo-400">
                  U
                </div>
                <div className="flex-1 rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5">
                  <p className="text-sm">&ldquo;How do I verify my account?&rdquo;</p>
                </div>
              </div>

              {/* Typing indicator */}
              {isVisible && !showResponse && (
                <div className="flex gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">W</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-3.5">
                    <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {/* Wembo response */}
              {showResponse && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="h-9 w-9 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">W</span>
                  </div>
                  <div className="flex-1 rounded-xl border border-primary/15 bg-primary/[0.03] p-4">
                    <p className="text-sm leading-relaxed text-foreground/80">
                      To verify your account, go to the #verification channel and click the
                      &ldquo;Verify&rdquo; button. You&apos;ll need to answer a few questions
                      about the server rules. Once completed, you&apos;ll receive the Verified
                      role automatically.
                    </p>
                    <div className="flex items-center gap-3 mt-3.5 pt-3.5 border-t border-primary/10">
                      <Badge variant="secondary" className="text-xs bg-white/[0.04]">
                        Source: #verification
                      </Badge>
                      <button className="text-xs text-primary flex items-center gap-1 hover:gap-1.5 transition-all">
                        View source <ArrowRight className="h-3 w-3" />
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
