import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, MessageSquare, Hash } from 'lucide-react'

export function CommunityIntelligence() {
  return (
    <section className="py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Know what&apos;s happening in your community.
          </h2>
          <p className="text-lg text-muted-foreground">
            Real-time analytics, growth metrics, and AI-powered insights to help you make better decisions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Graph Card */}
          <Card className="p-6 md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Member Activity</h3>
              <div className="flex gap-2">
                <Badge variant="secondary">7 days</Badge>
              </div>
            </div>
            {/* Simulated chart */}
            <div className="flex items-end gap-2 h-40 mb-4">
              {[40, 55, 45, 68, 75, 90, 72].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-primary/70 to-primary"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </Card>

          {/* Stats */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">This Week</h3>
            <div className="space-y-4">
              <MetricRow icon={Users} label="New Members" value="+342" trend="+12%" />
              <MetricRow icon={MessageSquare} label="Messages" value="84,291" trend="+24%" />
              <MetricRow icon={TrendingUp} label="Retention" value="92%" trend="+3%" />
              <MetricRow icon={Hash} label="Top Channel" value="#gaming" />
            </div>
          </Card>

          {/* Insight */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary">AI</span>
              </div>
              <h3 className="font-semibold">Wembo Insight</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              &ldquo;Activity increased 24% this week, primarily driven by #gaming. Consider creating more events in that channel to maintain momentum.&rdquo;
            </p>
            <div className="flex gap-2">
              <Badge variant="success">Positive Trend</Badge>
              <Badge variant="secondary">Gaming</Badge>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

function MetricRow({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: React.ElementType
  label: string
  value: string
  trend?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{value}</span>
        {trend && (
          <span className="text-xs text-green-500">{trend}</span>
        )}
      </div>
    </div>
  )
}
