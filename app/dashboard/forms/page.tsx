'use client'

import { FileText, Plus, MoreVertical } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockForms } from '@/lib/mock-data'

export default function DashboardFormsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Forms</h1>
          <p className="text-muted-foreground mt-1">Create and manage application forms and workflows.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Create Form
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Active Forms</p>
          <p className="text-2xl font-bold">{mockForms.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Submissions</p>
          <p className="text-2xl font-bold">148</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
          <p className="text-2xl font-bold text-orange-500">12</p>
        </Card>
      </div>

      {/* Forms List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockForms.map((form) => (
              <div
                key={form.id}
                className="flex items-center justify-between p-4 rounded-lg /50  transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{form.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {form.submissions} submissions · Last: {form.lastSubmission}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="success">{form.status}</Badge>
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
