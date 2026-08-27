'use client'

import { cn } from '@/lib/utils'
import { type LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: string
  trendUp?: boolean
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendUp,
  className,
}: StatCardProps) {
  return (
    <div className={cn(
      'rounded-xl border border-white/[0.06] bg-card/50 p-5 hover:border-primary/15 hover:bg-primary/[0.02] transition-all duration-300 group',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-sm text-muted-foreground/50">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground/40">{description}</p>
          )}
        </div>
        {Icon && (
          <div className="rounded-lg bg-primary/[0.06] p-2.5 group-hover:bg-primary/[0.12] transition-colors">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={cn(
            'text-xs font-medium px-1.5 py-0.5 rounded',
            trendUp ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
          )}>
            {trend}
          </span>
          <span className="text-xs text-muted-foreground/40">from last week</span>
        </div>
      )}
    </div>
  )
}
