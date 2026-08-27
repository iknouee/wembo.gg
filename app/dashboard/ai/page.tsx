'use client'

import { Bot, MessageSquare, Settings, BookOpen, Brain, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function DashboardAIPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Assistant</h1>
          <p className="text-muted-foreground mt-1">Configure Wembo AI for your community.</p>
        </div>
        <Button className="gap-2">
          <Settings className="h-4 w-4" /> Configure
        </Button>
      </div>

      {/* Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Wembo AI</h3>
              <p className="text-sm text-muted-foreground">Active in 4 channels</p>
            </div>
          </div>
          <Badge variant="success">Active</Badge>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Questions Answered</span>
          </div>
          <p className="text-2xl font-bold">1,284</p>
          <p className="text-xs text-green-500 mt-1">+23% this week</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Knowledge Sources</span>
          </div>
          <p className="text-2xl font-bold">12</p>
          <p className="text-xs text-muted-foreground mt-1">channels & documents</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Accuracy Rate</span>
          </div>
          <p className="text-2xl font-bold">94%</p>
          <p className="text-xs text-green-500 mt-1">+2% this month</p>
        </Card>
      </div>

      {/* Recent Interactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent AI Interactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AIInteraction
            user="Alex"
            question="How do I apply for staff?"
            answer="Staff applications open every Friday at 7 PM. You need 30+ days membership and no active warnings."
            source="#staff-information"
            time="5 min ago"
          />
          <AIInteraction
            user="Jordan"
            question="What are the server rules about self-promotion?"
            answer="Self-promotion is only allowed in #self-promo. You can post once per day. Content must be original."
            source="#rules"
            time="12 min ago"
          />
          <AIInteraction
            user="Casey"
            question="When is the next community event?"
            answer="The next event is Movie Night this Saturday at 8 PM EST in the Events voice channel."
            source="#events"
            time="34 min ago"
          />
        </CardContent>
      </Card>

      {/* AI Personality */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI Personality</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg ">
              <h4 className="text-sm font-medium mb-2">Tone</h4>
              <p className="text-sm text-muted-foreground">Friendly & Professional</p>
            </div>
            <div className="p-4 rounded-lg ">
              <h4 className="text-sm font-medium mb-2">Response Length</h4>
              <p className="text-sm text-muted-foreground">Concise (1-3 sentences)</p>
            </div>
            <div className="p-4 rounded-lg ">
              <h4 className="text-sm font-medium mb-2">Language</h4>
              <p className="text-sm text-muted-foreground">English</p>
            </div>
            <div className="p-4 rounded-lg ">
              <h4 className="text-sm font-medium mb-2">Citations</h4>
              <p className="text-sm text-muted-foreground">Always show source</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AIInteraction({
  user,
  question,
  answer,
  source,
  time,
}: {
  user: string
  question: string
  answer: string
  source: string
  time: string
}) {
  return (
    <div className="p-4 rounded-lg /50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
            {user[0]}
          </div>
          <span className="text-sm font-medium">{user}</span>
        </div>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
      <p className="text-sm mb-2"><span className="text-muted-foreground">Q:</span> {question}</p>
      <p className="text-sm text-muted-foreground"><span className="text-foreground">A:</span> {answer}</p>
      <Badge variant="secondary" className="mt-2 text-xs">Source: {source}</Badge>
    </div>
  )
}
