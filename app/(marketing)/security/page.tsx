import { Metadata } from 'next'
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
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Security',
  description: 'Detect suspicious behaviour before it becomes a problem. Smart security for Discord communities.',
}

const securityFeatures = [
  { icon: Siren, title: 'Anti-Raid', description: 'Automatically detect and block mass join attempts.' },
  { icon: ShieldAlert, title: 'Anti-Nuke', description: 'Prevent server destruction by rogue admins or compromised bots.' },
  { icon: Ban, title: 'Anti-Spam', description: 'Intelligent spam detection that adapts to your community.' },
  { icon: Link2, title: 'Phishing Detection', description: 'Block malicious links and known phishing domains.' },
  { icon: AlertTriangle, title: 'Scam Detection', description: 'Identify and remove scam messages before members are affected.' },
  { icon: UserX, title: 'Impersonation Detection', description: 'Detect accounts impersonating staff or well-known members.' },
  { icon: Eye, title: 'Suspicious Account Detection', description: 'Flag new or suspicious accounts based on multiple signals.' },
  { icon: Activity, title: 'Threat Scoring', description: 'Every account gets a dynamic threat score based on behaviour.' },
  { icon: Lock, title: 'Automatic Lockdown', description: 'Server locks down automatically during active threats.' },
  { icon: Users, title: 'Mass Mention Protection', description: 'Prevent @everyone spam and mass mention abuse.' },
  { icon: Siren, title: 'Mass Join Detection', description: 'Alert staff when unusual join patterns are detected.' },
  { icon: Clock, title: 'Security Event Timeline', description: 'Full audit trail of every security event and action taken.' },
]

export default function SecurityPage() {
  return (
    <div className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Badge variant="secondary" className="mb-4">
            <Shield className="h-3 w-3 mr-1" /> Smart Security
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Security that{' '}
            <span className="text-gradient">thinks ahead.</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Detect suspicious behaviour before it becomes a problem. Wembo&apos;s intelligent security system
            protects your community around the clock.
          </p>
        </div>

        {/* Threat Score Demo */}
        <div className="max-w-3xl mx-auto mb-20">
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Threat Assessment
              </h3>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Score */}
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50" cy="50" r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="50" cy="50" r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${94 * 2.51} ${100 * 2.51}`}
                        className="text-red-500"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">94</span>
                      <span className="text-xs text-muted-foreground">/100</span>
                    </div>
                  </div>
                  <Badge variant="danger" className="mt-3">🔴 High Risk</Badge>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Threat Indicators</h4>
                    <div className="space-y-2">
                      <ThreatItem severity="high" text="Newly created account (< 24 hours)" />
                      <ThreatItem severity="high" text="Suspicious URL shared in first message" />
                      <ThreatItem severity="medium" text="Mass mentions in multiple channels" />
                      <ThreatItem severity="medium" text="Unusual message frequency pattern" />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline">Review</Button>
                    <Button size="sm" variant="outline">Restrict</Button>
                    <Button size="sm" variant="destructive">Ban</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Security Event Timeline */}
        <div className="max-w-3xl mx-auto mb-20">
          <Card className="p-6">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Security Event Timeline
            </h3>
            <div className="space-y-4">
              <TimelineEvent
                time="2 min ago"
                event="Mass join attempt blocked"
                detail="23 accounts flagged — matching creation pattern"
                severity="high"
              />
              <TimelineEvent
                time="14 min ago"
                event="Phishing link removed"
                detail="Nitro scam link detected in #general"
                severity="medium"
              />
              <TimelineEvent
                time="1 hr ago"
                event="Spam account banned"
                detail="suspicious_user#0001 — automated action"
                severity="low"
              />
              <TimelineEvent
                time="3 hrs ago"
                event="Impersonation attempt"
                detail="Account mimicking staff member detected"
                severity="high"
              />
            </div>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {securityFeatures.map((feature) => (
            <Card key={feature.title} className="p-5 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2 mt-0.5">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Protect your community before threats arrive.</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Smart security runs 24/7 so your moderators don&apos;t have to.
          </p>
          <a href={siteConfig.links.invite} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="gap-2">
              Add Wembo to Discord
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}

function ThreatItem({ severity, text }: { severity: 'high' | 'medium' | 'low'; text: string }) {
  const colors = {
    high: 'bg-red-500',
    medium: 'bg-orange-500',
    low: 'bg-yellow-500',
  }
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${colors[severity]}`} />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  )
}

function TimelineEvent({
  time,
  event,
  detail,
  severity,
}: {
  time: string
  event: string
  detail: string
  severity: 'high' | 'medium' | 'low'
}) {
  const colors = {
    high: 'border-red-500/50 bg-red-500/5',
    medium: 'border-orange-500/50 bg-orange-500/5',
    low: 'border-border bg-muted/20',
  }
  return (
    <div className={`relative pl-4 border-l-2 ${colors[severity]} p-3 rounded-r-lg`}>
      <span className="text-xs text-muted-foreground">{time}</span>
      <p className="text-sm font-medium mt-0.5">{event}</p>
      <p className="text-xs text-muted-foreground">{detail}</p>
    </div>
  )
}
