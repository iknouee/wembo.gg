'use client'

import Link from 'next/link'
import { ArrowRight, type LucideIcon } from 'lucide-react'

interface ModuleCardProps {
  href: string
  icon: LucideIcon
  iconColor?: string
  name: string
  description: string
  active?: boolean
  stat?: string
  statLabel?: string
}

export function ModuleCard({ href, icon: Icon, iconColor, name, description, active = true, stat, statLabel }: ModuleCardProps) {
  return (
    <Link
      href={href}
      className="group dash-card p-5 flex items-start gap-4 transition-all duration-300 hover:border-[rgba(255,255,255,0.11)] hover:bg-[#111214] cursor-pointer"
    >
      <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${iconColor || 'bg-[#FFD600]/[0.06] text-[#FFD600]'}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 mb-1">
          <p className="text-[14px] font-semibold text-white/90 group-hover:text-white transition-colors">{name}</p>
          {active ? (
            <span className="status-active"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Active</span>
          ) : (
            <span className="status-inactive">Inactive</span>
          )}
        </div>
        <p className="text-body-sm text-white/30 leading-relaxed">{description}</p>
        {stat && (
          <p className="text-micro text-white/20 mt-2">{stat} {statLabel}</p>
        )}
      </div>
      <ArrowRight className="h-4 w-4 text-white/10 group-hover:text-white/30 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
    </Link>
  )
}
