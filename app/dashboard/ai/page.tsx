'use client'

import { Bot, MessageSquare, Settings, BookOpen, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/stat-card'

export default function DashboardAIPage() {
  return (
    <div className="p-5 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">AI Assistant</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Configure and monitor Wembo AI for your community.</p>
        </div>
        <Button size="sm" variant="outline" className="gap-1.5 text-[12px] h-8">
          <Settings className="h-3.5 w-3.5" /> Configure
        </Button>
      </div>

      {/* Status */}
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-[13px] font-medium">Wembo AI</p>
              <p className="text-[11px] text-muted-foreground">Active in 4 channels</p>
            </div>
          </div>
          <Badge variant="success" className="text-[10px]">Active</Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard title="Answered" value="1,284" icon={MessageSquare} trend="+23%" trendUp={true} />
        <StatCard title="Sources" value="12" icon={BookOpen} description="channels & docs" />
        <StatCard title="Accuracy" value="94%" icon={Sparkles} trend="+2%" trendUp={true} />
      </div>

      {/* Recent Interactions */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60">
          <h3 className="text-[13px] font-medium">Recent Interactions</h3>
        </div>
        <div className="divide-y divide-border/40">
          <AIInteraction
            user="Alex"
            question="How do I apply for staff?"
            answer="Staff applications open every Friday at 7 PM. You need 30+ days membership and no active warnings."
            source="#staff-information"
            time="5m ago"
          />
          <AIInteraction
            user="Jordan"
            question="What are the server rules about self-promotion?"
            answer="Self-promotion is only allowed in #self-promo. You can post once per day. Content must be original."
            source="#rules"
            time="12m ago"
          />
          <AIInteraction
            user="Casey"
            question="When is the next community event?"
            answer="The next event is Movie Night this Saturday at 8 PM EST in the Events voice channel."
            source="#events"
            time="34m ago"
          />
        </div>
      </div>

      {/* AI Configuration */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60">
          <h3 className="text-[13px] font-medium">Personality & Config</h3>
        </div>
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/40">
          <ConfigItem label="Tone" value="Friendly & Professional" />
          <ConfigItem label="Response Length" value="Concise (1-3 sentences)" />
          <ConfigItem label="Language" value="English" />
          <ConfigItem label="Citations" value="Always show source" />
        </div>
      </div>
    </div>
  )
}

function AIInteraction({ user, question, answer, source, time }: {
  user: string; question: string; answer: string; source: string; time: string
}) {
  return (
    <div className="px-4 py-3.5 hover:bg-accent/30 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold">
            {user[0]}
          </div>
          <span className="text-[12px] font-medium">{user}</span>
        </div>
        <span className="text-[10px] text-muted-foreground">{time}</span>
      </div>
      <p className="text-[12px] mb-1.5"><span className="text-muted-foreground font-medium">Q:</span> {question}</p>
      <p className="text-[12px] text-muted-foreground"><span className="text-foreground font-medium">A:</span> {answer}</p>
      <div className="mt-2">
        <Badge variant="secondary" className="text-[9px] px-1.5 py-0">Source: {source}</Badge>
      </div>
    </div>
  )
}

function ConfigItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3">
      <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      <p className="text-[13px] font-medium">{value}</p>
    </div>
  )
}
