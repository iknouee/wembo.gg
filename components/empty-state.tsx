'use client'

import { Button } from '@/components/ui/button'
import { type LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-4">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="text-[14px] font-medium mb-1">{title}</h3>
      <p className="text-[12px] text-muted-foreground max-w-xs mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="h-8 text-[12px]">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
