'use client'

import { Trophy, Star, Flame, Award, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/stat-card'

export default function DashboardEngagementPage() {
  return (
    <div className="p-5 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Engagement</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">XP, levels, achievements, and rewards.</p>
        </div>
        <Button size="sm" variant="outline" className="gap-1.5 text-[12px] h-8">
          <Trophy className="h-3.5 w-3.5" /> Configure
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title="Total XP" value="2.4M" icon={Star} />
        <StatCard title="Max Level" value="47" icon={Crown} />
        <StatCard title="Streaks" value="892" icon={Flame} trend="+34" trendUp={true} />
        <StatCard title="Achievements" value="4,218" icon={Award} />
      </div>

      {/* Leaderboard */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60 flex items-center gap-2">
          <Crown className="h-3.5 w-3.5 text-amber-500" />
          <h3 className="text-[13px] font-medium">Leaderboard</h3>
        </div>
        <div className="divide-y divide-border/40">
          <LeaderboardRow rank={1} name="Alex" level={47} xp="124,892" streak={31} />
          <LeaderboardRow rank={2} name="Jamie" level={44} xp="118,340" streak={28} />
          <LeaderboardRow rank={3} name="Sam" level={41} xp="103,221" streak={14} />
          <LeaderboardRow rank={4} name="Jordan" level={38} xp="94,102" streak={7} />
          <LeaderboardRow rank={5} name="Casey" level={36} xp="87,441" streak={21} />
        </div>
      </div>

      {/* Achievements */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60">
          <h3 className="text-[13px] font-medium">Recent Achievements</h3>
        </div>
        <div className="p-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <AchievementCard title="First Message" description="Send your first message" holders={12482} />
          <AchievementCard title="Helper" description="Answer 50 questions" holders={234} />
          <AchievementCard title="Night Owl" description="Active past midnight 7 days" holders={89} />
          <AchievementCard title="Event Champion" description="Attend 10 community events" holders={156} />
          <AchievementCard title="Speed Demon" description="Level up 3 times in one week" holders={412} />
          <AchievementCard title="Guide Writer" description="Create 5 community guides" holders={47} />
        </div>
      </div>
    </div>
  )
}

function LeaderboardRow({ rank, name, level, xp, streak }: {
  rank: number; name: string; level: number; xp: string; streak: number
}) {
  const rankColors: Record<number, string> = { 1: 'text-amber-500', 2: 'text-zinc-400', 3: 'text-amber-700' }
  return (
    <div className="flex items-center justify-between px-4 py-2.5 hover:bg-accent/30 transition-colors">
      <div className="flex items-center gap-3">
        <span className={`text-[14px] font-bold w-5 text-center ${rankColors[rank] || 'text-muted-foreground'}`}>
          {rank}
        </span>
        <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-[11px] font-semibold">
          {name[0]}
        </div>
        <div>
          <p className="text-[13px] font-medium">{name}</p>
          <p className="text-[10px] text-muted-foreground">Lv. {level}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[12px] font-medium hidden sm:block">{xp} XP</span>
        <div className="flex items-center gap-0.5 text-amber-500">
          <Flame className="h-3 w-3" />
          <span className="text-[11px] font-semibold">{streak}</span>
        </div>
      </div>
    </div>
  )
}

function AchievementCard({ title, description, holders }: {
  title: string; description: string; holders: number
}) {
  return (
    <div className="p-3 rounded-lg border border-border/40 hover:border-primary/20 transition-colors">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Award className="h-3.5 w-3.5 text-primary" />
        <p className="text-[12px] font-medium">{title}</p>
      </div>
      <p className="text-[11px] text-muted-foreground mb-2">{description}</p>
      <span className="text-[10px] text-muted-foreground">{holders.toLocaleString()} holders</span>
    </div>
  )
}
