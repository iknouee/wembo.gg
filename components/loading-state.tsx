export function LoadingState({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin mb-3" />
      <p className="text-[12px] text-muted-foreground">{text}</p>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 animate-pulse">
      <div className="h-2.5 w-16 rounded bg-muted mb-3" />
      <div className="h-6 w-20 rounded bg-muted" />
    </div>
  )
}
