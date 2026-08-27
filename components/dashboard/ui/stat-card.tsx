'use client'

import { type LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon?: LucideIcon
  iconColor?: string
  value: string | number
  label: string
  sub?: string
  trend?: { value: string; up: boolean }
  className?: string
}

export function StatCard({ icon: Icon, iconColor, value, label, sub, trend, className = '' }: StatCardProps) {
  return (
    <div className={`dash-card p-5 transition-all duration-200 hover:border-[rgba(255,255,255,0.11)] group ${className}`}>
      <div className="flex items-start justify-between mb-3">
        {Icon && (
          <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${iconColor || 'bg-[#FFD600]/[0.06] text-[#FFD600]'}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
        {trend && (
          <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${trend.up ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
            {trend.up ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <p className="text-stat text-white tabular-nums">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      <p className="text-caption text-white/30 mt-1.5">{label}</p>
      {sub && <p className="text-micro text-white/15 mt-0.5">{sub}</p>}
    </div>
  )
}
