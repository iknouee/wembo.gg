'use client'

import { type LucideIcon } from 'lucide-react'

interface SettingCardProps {
  icon?: LucideIcon
  iconColor?: string
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function SettingCard({ icon: Icon, iconColor, title, description, children, className = '' }: SettingCardProps) {
  const hasOverflowOverride = className.includes('overflow-')
  return (
    <div className={`dash-card ${hasOverflowOverride ? '' : 'overflow-hidden'} ${className}`}>
      <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-3">
        {Icon && (
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${iconColor || 'bg-white/[0.04] text-white/50'}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
        <div>
          <h3 className="text-[15px] font-semibold text-white/90">{title}</h3>
          {description && <p className="text-micro text-white/25 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="p-6 space-y-5">
        {children}
      </div>
    </div>
  )
}

interface SettingRowProps {
  label: string
  description?: string
  children: React.ReactNode
}

export function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div className="flex-1 min-w-0">
        <p className="text-body-sm font-medium text-white/70">{label}</p>
        {description && <p className="text-micro text-white/25 mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  )
}
