'use client'

import { mockActivityData } from '@/lib/mock-data'

export function ActivityChart() {
  const maxMessages = Math.max(...mockActivityData.map((d) => d.messages))

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2 h-48">
        {mockActivityData.map((day, i) => (
          <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex flex-col items-center justify-end h-40">
              <div
                className="w-full max-w-[40px] rounded-t-md bg-gradient-to-t from-primary/80 to-primary transition-all duration-500 hover:from-primary hover:to-primary/90"
                style={{
                  height: `${(day.messages / maxMessages) * 100}%`,
                  animationDelay: `${i * 100}ms`,
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{day.day}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-primary" />
          <span>Messages</span>
        </div>
      </div>
    </div>
  )
}
