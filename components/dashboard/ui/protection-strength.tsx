'use client'

interface ProtectionStrengthProps {
  /** 0–100 */
  level: number
}

export function ProtectionStrength({ level }: ProtectionStrengthProps) {
  const label = level >= 80 ? 'HIGH' : level >= 50 ? 'MEDIUM' : 'LOW'
  const color = level >= 80 ? '#4ade80' : level >= 50 ? '#fb923c' : '#f87171'
  const segments = 10
  const filledSegments = Math.round((level / 100) * segments)

  return (
    <div className="dash-card p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-body-sm font-medium text-white/50">Protection Strength</p>
        <span className="text-caption font-bold tracking-wider" style={{ color }}>{label}</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-2 rounded-full transition-all duration-500"
            style={{
              backgroundColor: i < filledSegments ? color : 'rgba(255,255,255,0.04)',
              boxShadow: i < filledSegments ? `0 0 4px ${color}30` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  )
}
