export default function DashboardLoading() {
  return (
    <div className="p-5 lg:p-8 space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-5 w-40 rounded-md bg-muted animate-pulse" />
        <div className="h-3 w-64 rounded-md bg-muted/60 animate-pulse" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/60 bg-card p-4">
            <div className="h-2.5 w-16 rounded bg-muted animate-pulse mb-3" />
            <div className="h-6 w-20 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60">
          <div className="h-3 w-32 rounded bg-muted animate-pulse" />
        </div>
        <div className="divide-y divide-border/40">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-48 rounded bg-muted animate-pulse" />
                <div className="h-2.5 w-32 rounded bg-muted/60 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
