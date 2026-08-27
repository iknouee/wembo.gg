'use client'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export function Toggle({ checked, onChange, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-checked={checked.toString()}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`toggle-switch ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className="toggle-thumb" />
    </button>
  )
}
