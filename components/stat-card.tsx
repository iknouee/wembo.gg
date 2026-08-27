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
      'relative rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-border',
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
        {Icon && (
          <div className="h-8 w-8 rounded-lg bg-primary/8 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      {(trend || description) && (
        <div className="mt-1.5 flex items-center gap-1.5">
          {trend && (
            <span className={cn(
              'text-[11px] font-medium px-1.5 py-0.5 rounded-full',
              trendUp 
                ? 'text-emerald-500 bg-emerald-500/10' 
                : 'text-red-500 bg-red-500/10'
            )}>
              {trend}
            </span>
          )}
          {description && (
            <span className="text-[11px] text-muted-foreground">{description}</span>
          )}
          {trend && !description && (
            <span className="text-[11px] text-muted-foreground">vs last week</span>
          )}
        </div>
      )}
    </div>
  )
}
