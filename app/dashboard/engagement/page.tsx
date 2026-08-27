'use client'

import { Trophy, Star, Flame, Award, Crown, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function DashboardEngagementPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Engagement</h1>
          <p className="text-muted-foreground mt-1">XP, levels, achievements, and rewards.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Trophy className="h-4 w-4" /> Configure
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <p className="text-xs text-muted-foreground">Total XP Earned</p>
          </div>
          <p className="text-xl font-bold">2.4M</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="h-4 w-4 text-yellow-500" />
            <p className="text-xs text-muted-foreground">Highest Level</p>
          </div>
          <p className="text-xl font-bold">47</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="h-4 w-4 text-orange-500" />
            <p className="text-xs text-muted-foreground">Active Streaks</p>
          </div>
          <p className="text-xl font-bold">892</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-1">
            <Award className="h-4 w-4 text-primary" />
            <p className="text-xs text-muted-foreground">Achievements Earned</p>
          </div>
          <p className="text-xl font-bold">4,218</p>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Crown className="h-4 w-4 text-yellow-500" /> Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <LeaderboardRow rank={1} name="Alex" level={47} xp="124,892" streak={31} />
            <LeaderboardRow rank={2} name="Jamie" level={44} xp="118,340" streak={28} />
            <LeaderboardRow rank={3} name="Sam" level={41} xp="103,221" streak={14} />
            <LeaderboardRow rank={4} name="Jordan" level={38} xp="94,102" streak={7} />
            <LeaderboardRow rank={5} name="Casey" level={36} xp="87,441" streak={21} />
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <AchievementCard title="First Message" description="Send your first message" holders={12482} />
            <AchievementCard title="Helper" description="Answer 50 questions" holders={234} />
            <AchievementCard title="Night Owl" description="Active past midnight 7 days in a row" holders={89} />
            <AchievementCard title="Event Champion" description="Attend 10 community events" holders={156} />
            <AchievementCard title="Speed Demon" description="Level up 3 times in one week" holders={412} />
            <AchievementCard title="Guide Writer" description="Create 5 community guides" holders={47} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LeaderboardRow({
  rank,
  name,
  level,
  xp,
  streak,
}: {
  rank: number
  name: string
  level: number
  xp: string
  streak: number
}) {
  const rankColors: Record<number, string> = {
    1: 'text-yellow-500',
    2: 'text-gray-400',
    3: 'text-amber-600',
  }
  return (
    <div className="flex items-center justify-between p-3 rounded-lg /50  transition-colors">
      <div className="flex items-center gap-4">
        <span className={`text-lg font-bold w-6 text-center ${rankColors[rank] || 'text-muted-foreground'}`}>
          {rank}
        </span>
        <div className="h-8 w-8 rounded-full bg-[#0a0b0d] flex items-center justify-center text-sm font-medium">
          {name[0]}
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">Level {level}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium">{xp} XP</p>
        </div>
        <div className="flex items-center gap-1 text-orange-500">
          <Flame className="h-3 w-3" />
          <span className="text-xs font-medium">{streak}</span>
        </div>
      </div>
    </div>
  )
}

function AchievementCard({
  title,
  description,
  holders,
}: {
  title: string
  description: string
  holders: number
}) {
  return (
    <div className="p-4 rounded-lg /50  transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <Award className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-medium">{title}</h4>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{description}</p>
      <Badge variant="secondary" className="text-xs">{holders} holders</Badge>
    </div>
  )
}
