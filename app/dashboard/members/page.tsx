'use client'

import { Users, Search, Star, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockMembers } from '@/lib/mock-data'

export default function DashboardMembersPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Members</h1>
          <p className="text-muted-foreground mt-1">Understand and manage your community members.</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search members..."
            className="w-full h-10 rounded-lg  bg-[#090A0C] pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            readOnly
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Total Members</p>
          <p className="text-xl font-bold">12,482</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Online Now</p>
          <p className="text-xl font-bold text-green-500">1,247</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">New (7 days)</p>
          <p className="text-xl font-bold">342</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Avg. Reputation</p>
          <p className="text-xl font-bold">72</p>
        </Card>
      </div>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-lg /50  transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 flex items-center justify-center text-sm font-bold">
                      {member.name[0]}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${
                      member.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium">{member.name}</h4>
                      <Badge variant="secondary" className="text-xs">{member.role}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {member.interests.join(', ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="text-sm font-medium">{member.reputation}</span>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-muted-foreground">{member.contributions.answers} answers</p>
                    <p className="text-xs text-muted-foreground">{member.contributions.guides} guides</p>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
