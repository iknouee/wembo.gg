'use client'

import { useEffect, useRef, useState } from 'react'
import { TrendingUp, Users, MessageSquare, Hash, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function CommunityIntelligence() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.015] to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/[0.03] rounded-full blur-[100px]" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Know what&apos;s happening{' '}
            <span className="text-gradient">in your community.</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Real-time analytics, growth metrics, and AI-powered insights to help you make better decisions.
          </p>
        </div>

        <div className={`max-w-5xl mx-auto grid md:grid-cols-2 gap-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          {/* Graph Card */}
          <div className="md:col-span-2 rounded-2xl border border-white/[0.06] bg-card/50 backdrop-blur-sm p-6 lg:p-8 hover:border-white/[0.1] transition-all duration-500">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-semibold">Member Activity</h3>
              <Badge variant="secondary" className="bg-white/[0.05]">7 days</Badge>
            </div>
            {/* Animated chart */}
            <div className="flex items-end gap-3 h-44 mb-4">
              {[40, 55, 45, 68, 75, 90, 72].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary/60 via-primary/80 to-primary transition-all duration-1000 ease-out hover:from-primary/70 hover:to-primary group cursor-pointer relative"
                    style={{
                      height: isVisible ? `${height}%` : '0%',
                      transitionDelay: `${i * 100 + 400}ms`,
                    }}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-foreground text-background text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {Math.round(height * 100)} msgs
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground/60">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          {/* Stats */}
          <div className={`rounded-2xl border border-white/[0.06] bg-card/50 backdrop-blur-sm p-6 hover:border-white/[0.1] transition-all duration-500 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="font-semibold mb-5">This Week</h3>
            <div className="space-y-5">
              <MetricRow icon={Users} label="New Members" value="+342" trend="+12%" delay={0} visible={isVisible} />
              <MetricRow icon={MessageSquare} label="Messages" value="84,291" trend="+24%" delay={100} visible={isVisible} />
              <MetricRow icon={TrendingUp} label="Retention" value="92%" trend="+3%" delay={200} visible={isVisible} />
              <MetricRow icon={Hash} label="Top Channel" value="#gaming" delay={300} visible={isVisible} />
            </div>
          </div>

          {/* AI Insight */}
          <div className={`rounded-2xl border border-primary/10 bg-primary/[0.02] backdrop-blur-sm p-6 hover:border-primary/20 transition-all duration-500 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="h-7 w-7 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
              <h3 className="font-semibold">Wembo Insight</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              &ldquo;Activity increased 24% this week, primarily driven by #gaming. Consider creating more events in that channel to maintain momentum.&rdquo;
            </p>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">Positive Trend</Badge>
              <Badge variant="secondary" className="bg-white/[0.05]">Gaming</Badge>
            </div>
          </div>
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
  delay,
  visible,
}: {
  icon: React.ElementType
  label: string
  value: string
  trend?: string
  delay: number
  visible: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between transition-all duration-500`}
      style={{ transitionDelay: `${delay + 500}ms`, opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-10px)' }}
    >
      <div className="flex items-center gap-2.5">
        <Icon className="h-4 w-4 text-muted-foreground/60" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-sm font-semibold">{value}</span>
        {trend && (
          <span className="text-xs font-medium text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">{trend}</span>
        )}
      </div>
    </div>
  )
}
