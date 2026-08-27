import { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  Bot,
  Brain,
  BookOpen,
  MessageSquare,
  Shield,
  Settings,
  FileText,
  Search,
  Sparkles,
  Lock,
  Quote,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'AI',
  description: 'An AI assistant that actually understands your community. Server-specific knowledge, Q&A, summaries, and insights.',
}

const aiFeatures = [
  {
    icon: Brain,
    title: 'Server-Specific Knowledge',
    description: 'Wembo learns from your approved sources — channels, documents, and FAQs — to answer questions accurately.',
  },
  {
    icon: MessageSquare,
    title: 'AI Q&A',
    description: 'Members ask questions and get instant, accurate answers sourced from your community knowledge.',
  },
  {
    icon: FileText,
    title: 'Channel Summaries',
    description: 'Catch up on channels in seconds. AI-generated summaries of conversations and decisions.',
  },
  {
    icon: BookOpen,
    title: 'Weekly Reports',
    description: 'Automatic weekly digests of community activity, trends, and important discussions.',
  },
  {
    icon: Sparkles,
    title: 'AI Recommendations',
    description: 'Proactive suggestions based on community data — from retention to engagement improvements.',
  },
  {
    icon: Search,
    title: 'Searchable Information',
    description: 'Everything in your server becomes searchable. Messages, knowledge, members, and more.',
  },
  {
    icon: Settings,
    title: 'Configurable Personality',
    description: 'Customize how Wembo speaks. Formal, casual, brief, detailed — match your server\'s vibe.',
  },
  {
    icon: Lock,
    title: 'Permission Controls',
    description: 'Control exactly who can use AI features and which channels Wembo responds in.',
  },
  {
    icon: Quote,
    title: 'Source Citations',
    description: 'Every AI answer includes sources so members know where the information came from.',
  },
]

export default function AIPage() {
  return (
    <div className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Badge variant="secondary" className="mb-4">
            <Bot className="h-3 w-3 mr-1" /> Wembo AI
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            An AI assistant that actually{' '}
            <span className="text-gradient">understands your community.</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Wembo AI learns from your server&apos;s approved knowledge sources to provide accurate, helpful answers — with citations.
          </p>
        </div>

        {/* Discord Conversation Demo */}
        <div className="max-w-2xl mx-auto mb-20">
          <Card className="overflow-hidden">
            {/* Discord-style header */}
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <span className="text-muted-foreground">#</span>
              <span className="text-sm font-medium">general</span>
            </div>
            <div className="p-4 space-y-4">
              {/* Member message */}
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-sm font-medium text-blue-400 flex-shrink-0">
                  M
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold">Member</span>
                    <span className="text-xs text-muted-foreground">Today at 3:42 PM</span>
                  </div>
                  <p className="text-sm">How do I apply for staff?</p>
                </div>
              </div>

              {/* Wembo response */}
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">W</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold">Wembo</span>
                    <Badge variant="default" className="text-[10px] px-1.5 py-0">AI</Badge>
                    <span className="text-xs text-muted-foreground">Today at 3:42 PM</span>
                  </div>
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <p className="text-sm leading-relaxed">
                      Staff applications open every Friday at 7 PM EST. To apply, you must:
                    </p>
                    <ul className="text-sm mt-2 space-y-1 list-disc list-inside text-muted-foreground">
                      <li>Have been a member for at least 30 days</li>
                      <li>Have no active warnings on your account</li>
                      <li>Be at least Level 10</li>
                    </ul>
                    <p className="text-sm mt-2 text-muted-foreground">
                      Head to <span className="text-primary">#staff-applications</span> when applications open to fill out the form.
                    </p>
                    <div className="mt-3 pt-3 border-t border-primary/10 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Source: #staff-information
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {aiFeatures.map((feature) => (
            <Card key={feature.title} className="p-6 hover:border-primary/30 transition-all duration-300">
              <div className="rounded-lg bg-primary/10 w-10 h-10 flex items-center justify-center mb-4">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Give your community an AI that knows them.</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Set up Wembo AI in minutes. Add knowledge sources, configure permissions, and let your community ask away.
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
