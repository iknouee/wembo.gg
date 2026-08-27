'use client'

interface SegmentedControlProps {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  size?: 'sm' | 'md'
}

export function SegmentedControl({ options, value, onChange, size = 'md' }: SegmentedControlProps) {
  return (
    <div className="segmented-control">
      {options.map(option => (
        <button
          key={option.value}
          data-active={value === option.value}
          onClick={() => onChange(option.value)}
          className={size === 'sm' ? '!px-2.5 !py-1 !text-[11px]' : ''}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
