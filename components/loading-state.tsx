import { cn } from '@/lib/utils'

interface LoadingStateProps {
  className?: string
  text?: string
}

export function LoadingState({ className, text = 'Loading...' }: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16', className)}>
      <div className="relative">
        <div className="h-10 w-10 rounded-full border-2 border-muted" />
        <div className="absolute inset-0 h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-pulse">
      <div className="h-4 bg-muted rounded w-1/3 mb-3" />
      <div className="h-8 bg-muted rounded w-1/2 mb-2" />
      <div className="h-3 bg-muted rounded w-2/3" />
    </div>
  )
}
