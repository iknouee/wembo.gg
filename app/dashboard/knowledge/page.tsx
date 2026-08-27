'use client'

import { Lightbulb, Plus, Search, BookOpen, FileText, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockKnowledge } from '@/lib/mock-data'

export default function DashboardKnowledgePage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground mt-1">Manage your community&apos;s knowledge sources.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Knowledge
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search knowledge base..."
          className="w-full h-10 rounded-lg  bg-[#090A0C] pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          readOnly
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Sources</p>
          <p className="text-xl font-bold">12</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Articles</p>
          <p className="text-xl font-bold">47</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Questions Answered</p>
          <p className="text-xl font-bold">1,284</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
          <p className="text-xl font-bold text-green-500">94%</p>
        </Card>
      </div>

      {/* Knowledge Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Knowledge Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockKnowledge.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg /50  transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.category} · Source: {item.source} · Updated: {item.lastUpdated}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{item.category}</Badge>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
