'use client'

import { mockActivityData } from '@/lib/mock-data'

export function ActivityChart() {
  const maxMessages = Math.max(...mockActivityData.map((d) => d.messages))

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-1.5 h-[180px]">
        {mockActivityData.map((day, i) => {
          const height = (day.messages / maxMessages) * 100
          return (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-1.5 group">
              <div className="w-full flex flex-col items-center justify-end h-[150px] relative">
                {/* Tooltip */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-popover border border-border/60 rounded-md px-2 py-1 shadow-lg">
                    <span className="text-[10px] font-medium whitespace-nowrap">{day.messages.toLocaleString()}</span>
                  </div>
                </div>
                <div
                  className="w-full max-w-[32px] rounded-md bg-primary/80 group-hover:bg-primary transition-all duration-200"
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">{day.day}</span>
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1 border-t border-border/40">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-[3px] bg-primary/80" />
          <span>Messages</span>
        </div>
      </div>
    </div>
  )
}
