'use client'

import { useEffect, useState } from 'react'
import { mockActivityData } from '@/lib/mock-data'

export function ActivityChart() {
  const [animated, setAnimated] = useState(false)
  const maxMessages = Math.max(...mockActivityData.map((d) => d.messages))

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3 h-48">
        {mockActivityData.map((day, i) => {
          const height = (day.messages / maxMessages) * 100
          return (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full flex flex-col items-center justify-end h-40 relative">
                {/* Tooltip */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-foreground/90 text-background text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {day.messages.toLocaleString()}
                </div>
                <div
                  className="w-full max-w-[44px] rounded-t-lg bg-gradient-to-t from-primary/60 via-primary/80 to-primary transition-all duration-700 ease-out group-hover:from-primary/70 group-hover:to-primary cursor-pointer"
                  style={{
                    height: animated ? `${height}%` : '0%',
                    transitionDelay: `${i * 80}ms`,
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors">{day.day}</span>
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground/40">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-primary/60" />
          <span>Messages</span>
        </div>
      </div>
    </div>
  )
}
