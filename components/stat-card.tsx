'use client'

import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
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
    <Card className={cn('p-6 hover:border-primary/20 transition-colors', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {Icon && (
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1">
          <span
            className={cn(
              'text-xs font-medium',
              trendUp ? 'text-green-500' : 'text-red-500'
            )}
          >
            {trend}
          </span>
          <span className="text-xs text-muted-foreground">from last week</span>
        </div>
      )}
    </Card>
  )
}
