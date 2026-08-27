'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Shield,
  AlertTriangle,
  Lock,
  Eye,
  Ban,
  Siren,
  Clock,
  UserX,
  ShieldAlert,
  Link2,
  Users,
  Activity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const securityFeatures = [
  { icon: Siren, title: 'Anti-Raid', description: 'Automatically detect and block mass join attempts.' },
  { icon: ShieldAlert, title: 'Anti-Nuke', description: 'Prevent server destruction by rogue admins or compromised bots.' },
  { icon: Ban, title: 'Anti-Spam', description: 'Intelligent spam detection that adapts to your community.' },
  { icon: Link2, title: 'Phishing Detection', description: 'Block malicious links and known phishing domains.' },
  { icon: AlertTriangle, title: 'Scam Detection', description: 'Identify and remove scam messages before members are affected.' },
  { icon: UserX, title: 'Impersonation Detection', description: 'Detect accounts impersonating staff or well-known members.' },
  { icon: Eye, title: 'Suspicious Accounts', description: 'Flag new or suspicious accounts based on multiple signals.' },
  { icon: Activity, title: 'Threat Scoring', description: 'Every account gets a dynamic threat score based on behaviour.' },
  { icon: Lock, title: 'Automatic Lockdown', description: 'Server locks down automatically during active threats.' },
  { icon: Users, title: 'Mass Mention Protection', description: 'Prevent @everyone spam and mass mention abuse.' },
  { icon: Siren, title: 'Mass Join Detection', description: 'Alert staff when unusual join patterns are detected.' },
  { icon: Clock, title: 'Event Timeline', description: 'Full audit trail of every security event and action taken.' },
]

export default function SecurityPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [scoreAnimated, setScoreAnimated] = useState(false)
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
    const t = setTimeout(() => setScoreAnimated(true), 600)
    return () => clearTimeout(t)
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
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-500/[0.02] rounded-full blur-[120px]" />

      <div className="relative py-24 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className={`text-center max-w-3xl mx-auto mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#FFD600] uppercase tracking-wider mb-6 bg-[#FFD600]/[0.04] border border-[#FFD600]/20 rounded-full px-3 py-1.5">
              <Shield className="h-3.5 w-3.5 text-[#FFD600]" /> Smart Security
            </span>
            <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold text-white tracking-tight mb-6">
              Security that{' '}
              <span className="bg-gradient-to-r from-[#FFD600] to-[#FFA800] bg-clip-text text-transparent">thinks ahead.</span>
            </h1>
            <p className="text-lg text-[#9A9CA3] leading-relaxed">
              Detect suspicious behaviour before it becomes a problem. Wembo&apos;s intelligent security
              protects your community around the clock.
            </p>
          </div>

          {/* Threat Score Demo */}
          <div className={`max-w-3xl mx-auto mb-24 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="rounded-2xl bg-[#090A0C] overflow-hidden">
              <div className="p-6 lg:p-8 border-b border-white/[0.03]">
                <h3 className="font-semibold text-[#F7F7F8] flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#FFD600]" />
                  Threat Assessment
                </h3>
              </div>
              <div className="p-6 lg:p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                  {/* Animated Score Ring */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="relative w-36 h-36">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" fill="none" className="text-white/[0.04]" />
                        <circle
                          cx="50" cy="50" r="40"
                          stroke="currentColor" strokeWidth="6" fill="none"
                          strokeDasharray={`${251}`}
                          strokeDashoffset={scoreAnimated ? `${251 - (94 / 100) * 251}` : '251'}
                          className="text-red-500 transition-all duration-[2s] ease-out"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-4xl font-bold text-red-400 transition-all duration-1000 ${scoreAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>94</span>
                        <span className="text-xs text-[#9A9CA3]/50">/100</span>
                      </div>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full animate-pulse">
                      🔴 High Risk
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-5">
                    <div>
                      <h4 className="text-sm font-medium mb-3 text-[#F7F7F8]/80">Threat Indicators</h4>
                      <div className="space-y-2.5">
                        <ThreatItem severity="high" text="Newly created account (< 24 hours)" delay={800} visible={isVisible} />
                        <ThreatItem severity="high" text="Suspicious URL shared in first message" delay={1000} visible={isVisible} />
                        <ThreatItem severity="medium" text="Mass mentions in multiple channels" delay={1200} visible={isVisible} />
                        <ThreatItem severity="medium" text="Unusual message frequency pattern" delay={1400} visible={isVisible} />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="border-white/[0.03]">Review</Button>
                      <Button size="sm" variant="outline" className="border-white/[0.03] hover:border-orange-500/30 hover:text-orange-400">Restrict</Button>
                      <Button size="sm" className="bg-red-500/80 hover:bg-red-500 text-white">Ban</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Timeline */}
          <div className={`max-w-3xl mx-auto mb-24 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="rounded-2xl bg-[#090A0C] p-6 lg:p-8">
              <h3 className="font-semibold mb-6 flex items-center gap-2 text-[#F7F7F8]">
                <Clock className="h-4 w-4 text-[#9A9CA3]/60" />
                Security Event Timeline
              </h3>
              <div className="space-y-4">
                <TimelineEvent time="2 min ago" event="Mass join attempt blocked" detail="23 accounts flagged — matching creation pattern" severity="high" delay={600} visible={isVisible} />
                <TimelineEvent time="14 min ago" event="Phishing link removed" detail="Nitro scam link detected in #general" severity="medium" delay={800} visible={isVisible} />
                <TimelineEvent time="1 hr ago" event="Spam account banned" detail="suspicious_user#0001 — automated action" severity="low" delay={1000} visible={isVisible} />
                <TimelineEvent time="3 hrs ago" event="Impersonation attempt" detail="Account mimicking staff member detected" severity="high" delay={1200} visible={isVisible} />
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {securityFeatures.map((feature, i) => (
              <div
                key={`${feature.title}-${i}`}
                data-idx={i}
                className={`group p-5 rounded-xl bg-[#090A0C] hover:bg-[#0f1012] transition-all duration-500 ${
                  visibleCards.has(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${(i % 3) * 80}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-[#141519] p-2 mt-0.5 group-hover:bg-[#1a1b20] transition-colors">
                    <feature.icon className="h-4 w-4 text-[#9A9CA3] group-hover:text-[#FFD600] transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1 text-[#F7F7F8]">{feature.title}</h4>
                    <p className="text-xs text-[#9A9CA3]/70 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Protect your community before threats arrive.</h2>
            <p className="text-[#9A9CA3] mb-8 max-w-lg mx-auto leading-relaxed">
              Smart security runs 24/7 so your moderators don&apos;t have to.
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

function ThreatItem({ severity, text, delay, visible }: { severity: 'high' | 'medium' | 'low'; text: string; delay: number; visible: boolean }) {
  const colors = { high: 'bg-red-500', medium: 'bg-amber-500', low: 'bg-yellow-500' }
  return (
    <div
      className="flex items-center gap-3 transition-all duration-500"
      style={{ transitionDelay: `${delay}ms`, opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-10px)' }}
    >
      <div className={`h-2 w-2 rounded-full ${colors[severity]}`} />
      <span className="text-sm text-[#9A9CA3]/70">{text}</span>
    </div>
  )
}

function TimelineEvent({ time, event, detail, severity, delay, visible }: { time: string; event: string; detail: string; severity: 'high' | 'medium' | 'low'; delay: number; visible: boolean }) {
  const borderColors = { high: 'border-l-red-500/60', medium: 'border-l-amber-500/60', low: 'border-l-yellow-500/40' }
  return (
    <div
      className={`relative pl-5 border-l-2 ${borderColors[severity]} p-4 rounded-r-xl bg-[#090A0C] hover:bg-[#0f1012] transition-all duration-500`}
      style={{ transitionDelay: `${delay}ms`, opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-15px)' }}
    >
      <span className="text-xs text-[#9A9CA3]/40">{time}</span>
      <p className="text-sm font-medium mt-0.5 text-[#F7F7F8]/80">{event}</p>
      <p className="text-xs text-[#9A9CA3]/50 mt-0.5">{detail}</p>
    </div>
  )
}
