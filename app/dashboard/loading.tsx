import { SkeletonCard } from '@/components/loading-state'

export default function DashboardLoading() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="h-8 bg-muted rounded w-48 animate-pulse" />
      <div className="h-4 bg-muted rounded w-72 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6 animate-pulse">
          <div className="h-4 bg-muted rounded w-32 mb-4" />
          <div className="space-y-3">
            <div className="h-12 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 animate-pulse">
          <div className="h-4 bg-muted rounded w-32 mb-4" />
          <div className="space-y-3">
            <div className="h-12 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
