'use client'

import { useEffect, useRef, useState } from 'react'
import { Shield, HelpCircle, BookOpen, FileText, MessageSquare, Bot, Database } from 'lucide-react'
import { WemboLogo } from '@/components/wembo-logo'

export function KnowledgeSection() {
  const [visible, setVisible] = useState(false)
  const [showReply, setShowReply] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          setTimeout(() => setShowReply(true), 1200)
        }
      },
      { threshold: 0.15 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const sources = [
    { icon: Shield, name: 'Server Rules' },
    { icon: HelpCircle, name: 'FAQs' },
    { icon: BookOpen, name: 'Guides' },
    { icon: FileText, name: 'Documentation' },
    { icon: MessageSquare, name: 'Announcements' },
  ]

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 surface-0" />
      <div className="divider-glow absolute top-0 left-0 right-0" />
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[400px] bg-[#FFD600]/[0.01] rounded-full blur-[150px]" />

      <div className="relative max-w-content mx-auto px-4 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-14 items-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* LEFT — Text + Sources */}
          <div>
            <span className="text-[11px] font-semibold text-[#FFD600] uppercase tracking-wider mb-4 block">
              Knowledge Base
            </span>
            <h2 className="text-[clamp(2rem,4vw,2.75rem)] font-bold text-white tracking-tight leading-[1.1] mb-5">
              AI that actually knows your server.
            </h2>
            <p className="text-[15px] text-[#9A9CA3] leading-relaxed mb-8 max-w-md">
              Answers questions using your approved knowledge with source citations. Rules, FAQs, guides — all searchable by AI in real time.
            </p>

            {/* Knowledge sources list */}
            <div className="space-y-2 mb-5">
              {sources.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.07] bg-[#090A0C] hover:border-[#FFD600]/10 transition-colors"
                >
                  <s.icon className="h-4 w-4 text-[#FFD600]/40" />
                  <span className="text-[13px] text-[#9A9CA3]">{s.name}</span>
                </div>
              ))}
            </div>

            {/* Example status indicators */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-white/20" />
                <span className="text-[11px] text-[#9A9CA3]">Indexes your server&apos;s knowledge automatically</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Discord Chat Card */}
          <div className="rounded-xl border border-white/[0.07] bg-[#0a0b0d] shadow-2xl shadow-black/50 overflow-hidden">
            {/* Channel header */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.05] bg-[#080909]">
              <span className="text-white/20">#</span>
              <span className="text-[13px] text-white/60 font-medium">general</span>
              <span className="text-[11px] text-white/15 ml-auto">Community Server</span>
            </div>

            {/* Messages */}
            <div className="p-5 space-y-4 min-h-[280px]">
              {/* User message */}
              <div className="flex gap-3">
                <div className="h-9 w-9 rounded-full bg-indigo-500/15 flex-shrink-0 flex items-center justify-center text-[11px] font-medium text-indigo-400">
                  M
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[13px] font-semibold text-white/80">Member</span>
                    <span className="text-[10px] text-white/20">Today at 3:42 PM</span>
                  </div>
                  <p className="text-[13px] text-white/50">When do staff applications open?</p>
                </div>
              </div>

              {/* Typing indicator */}
              {visible && !showReply && (
                <div className="flex gap-3 items-center">
                  <div className="h-9 w-9 rounded-full bg-[#FFD600] flex-shrink-0 flex items-center justify-center">
                    <WemboLogo size={22} bare markColor="#1a1a1a" />
                  </div>
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-[#FFD600]/40 animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-[#FFD600]/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 rounded-full bg-[#FFD600]/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {/* Bot reply */}
              {showReply && (
                <div className="flex gap-3 animate-fade-up">
                  <div className="h-9 w-9 rounded-full bg-[#FFD600] flex-shrink-0 flex items-center justify-center">
                    <WemboLogo size={22} bare markColor="#1a1a1a" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[13px] font-semibold text-white/80">Wembo</span>
                      <span className="text-[9px] bg-[#5865F2] text-white px-1.5 py-[1px] rounded font-bold uppercase">BOT</span>
                      <span className="text-[10px] text-white/20">Today at 3:42 PM</span>
                    </div>
                    {/* Embed with gold left border */}
                    <div className="border-l-[3px] border-[#FFD600] rounded-r-lg bg-[#111215] p-4 mt-1">
                      <p className="text-[13px] text-white/60 leading-relaxed mb-3">
                        Staff applications open every Friday at 7 PM EST. Requirements include 30+ days of membership, no active warnings, and Level 10 or higher.
                      </p>
                      {/* Source chip */}
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] bg-white/[0.04] border border-white/[0.06] text-white/40 px-2 py-0.5 rounded-full">
                          <FileText className="h-2.5 w-2.5" />
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
      </div>
    </section>
  )
}
