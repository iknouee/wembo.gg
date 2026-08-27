'use client'

interface SecurityScoreProps {
  score: number
  label?: string
}

export function SecurityScore({ score, label }: SecurityScoreProps) {
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const color = score >= 80 ? '#4ade80' : score >= 50 ? '#fb923c' : '#f87171'

  return (
    <div className="flex items-center gap-5">
      <div className="relative w-[110px] h-[110px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="7"
          />
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[26px] font-bold text-white tabular-nums">{score}</span>
          <span className="text-micro text-white/25">/100</span>
        </div>
      </div>
      {label && (
        <div>
          <p className="text-[15px] font-semibold text-white/90">Security Score</p>
          <p className="text-body-sm mt-0.5" style={{ color }}>{label}</p>
        </div>
      )}
    </div>
  )
}
