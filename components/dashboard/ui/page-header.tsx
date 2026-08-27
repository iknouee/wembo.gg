'use client'

import { type LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  icon?: LucideIcon
  iconColor?: string
  title: string
  description?: string
  badge?: React.ReactNode
  actions?: React.ReactNode
}

export function PageHeader({ icon: Icon, iconColor, title, description, badge, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColor || 'bg-[#FFD600]/[0.08] text-[#FFD600]'}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-heading text-white">{title}</h1>
            {badge}
          </div>
          {description && (
            <p className="text-body-sm text-white/40 mt-1">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  )
}
