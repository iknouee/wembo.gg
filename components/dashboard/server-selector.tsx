'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { mockServers } from '@/config/dashboard'
import { ChevronDown, Check } from 'lucide-react'

export function ServerSelector() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(mockServers[0])

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 hover:bg-accent/60 transition-colors text-left"
        aria-label="Select server"
      >
        <div className="h-7 w-7 rounded-md bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 shadow-sm">
          {selected.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium truncate">{selected.name}</p>
          <p className="text-[11px] text-muted-foreground">
            {selected.memberCount.toLocaleString()} members
          </p>
        </div>
        <ChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border/60 bg-popover shadow-xl overflow-hidden z-50">
            <div className="p-1">
              {mockServers.map((server) => (
                <button
                  key={server.id}
                  onClick={() => {
                    setSelected(server)
                    setOpen(false)
                  }}
                  className={cn(
                    'w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 hover:bg-accent/60 transition-colors text-left',
                    selected.id === server.id && 'bg-accent/40'
                  )}
                >
                  <div className="h-6 w-6 rounded-md bg-muted flex items-center justify-center text-[10px] font-semibold flex-shrink-0">
                    {server.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate">{server.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {server.memberCount.toLocaleString()} members
                    </p>
                  </div>
                  {selected.id === server.id && (
                    <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
            <div className="border-t border-border/60 p-1">
              <button className="w-full rounded-md px-2.5 py-2 text-[12px] text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors text-left font-medium">
                + Add server
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
