'use client'

import { Minus, Plus } from 'lucide-react'

interface NumberStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  suffix?: string
}

export function NumberStepper({ value, onChange, min = 0, max = 999, step = 1, suffix }: NumberStepperProps) {
  return (
    <div className="stepper">
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
        className="rounded-l-lg disabled:opacity-20 disabled:cursor-not-allowed"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span>
        {value}{suffix && <span className="text-white/30 text-[11px] ml-0.5">{suffix}</span>}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + step))}
        disabled={value >= max}
        className="rounded-r-lg disabled:opacity-20 disabled:cursor-not-allowed"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
