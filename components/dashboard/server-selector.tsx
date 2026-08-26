'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { mockServers } from '@/config/dashboard'
import { ChevronDown, Check, Users } from 'lucide-react'

export function ServerSelector() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(mockServers[0])

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-accent transition-colors text-left"
        aria-label="Select server"
      >
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
          {selected.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{selected.name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Users className="h-3 w-3" />
            {selected.memberCount.toLocaleString()} members
          </p>
        </div>
        <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-1 rounded-lg border border-border bg-card shadow-lg overflow-hidden z-50">
          <div className="p-1">
            {mockServers.map((server) => (
              <button
                key={server.id}
                onClick={() => {
                  setSelected(server)
                  setOpen(false)
                }}
                className="w-full flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-accent transition-colors text-left"
              >
                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium flex-shrink-0">
                  {server.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{server.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {server.memberCount.toLocaleString()} members
                  </p>
                </div>
                {selected.id === server.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </div>
          <div className="border-t border-border p-2">
            <button className="w-full rounded-md px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-left">
              + Add another server
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
