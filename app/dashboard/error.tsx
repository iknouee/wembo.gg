'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="p-5 lg:p-8 flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-sm">
        <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        <h2 className="text-[15px] font-semibold mb-1">Something went wrong</h2>
        <p className="text-[13px] text-muted-foreground mb-5">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={reset} size="sm" variant="outline" className="gap-1.5 text-[12px] h-8">
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </Button>
      </div>
    </div>
  )
}
