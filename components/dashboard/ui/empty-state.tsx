'use client'

import { type LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="dash-card py-16 px-6 text-center">
      <div className="h-14 w-14 rounded-2xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-center mx-auto mb-4">
        <Icon className="h-6 w-6 text-white/15" />
      </div>
      <h3 className="text-[15px] font-semibold text-white/60 mb-1">{title}</h3>
      {description && <p className="text-body-sm text-white/25 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
