'use client'

interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  showValue?: boolean
  suffix?: string
  labels?: { left: string; right: string }
}

export function Slider({ value, onChange, min = 0, max = 100, step = 1, showValue = true, suffix = '%', labels }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-2">
      {showValue && (
        <div className="flex items-center justify-between">
          <span className="text-body-sm font-semibold text-white tabular-nums">{value}{suffix}</span>
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer slider-track"
          style={{
            background: `linear-gradient(to right, #FFD600 0%, #FFD600 ${percentage}%, rgba(255,255,255,0.06) ${percentage}%, rgba(255,255,255,0.06) 100%)`,
          }}
        />
      </div>
      {labels && (
        <div className="flex justify-between">
          <span className="text-micro text-white/20">{labels.left}</span>
          <span className="text-micro text-white/20">{labels.right}</span>
        </div>
      )}
      <style jsx>{`
        .slider-track::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #FFD600;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(255,214,0,0.3);
          border: 2px solid #0D0E10;
        }
        .slider-track::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #FFD600;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(255,214,0,0.3);
          border: 2px solid #0D0E10;
        }
      `}</style>
    </div>
  )
}
