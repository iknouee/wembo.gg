import { cn } from '@/lib/utils'

interface WemboLogoProps {
  className?: string
  size?: number
  /** If true, renders just the mark with no background box */
  bare?: boolean
  /** Color of the mark. Defaults to black (#1a1a1a) */
  markColor?: string
}

/**
 * Wembo logo — stylized crown-like W with a 4-point sparkle star.
 * Renders as black mark on yellow rounded square by default.
 */
export function WemboLogo({ className, size = 28, bare = false, markColor }: WemboLogoProps) {
  const mark = (
    <svg
      width={bare ? size : size * 0.62}
      height={bare ? size : size * 0.62}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Wembo logo"
    >
      {/* Crown-like W shape with rounded terminals */}
      <path
        d="M18 32C18 25 23 20 28 20C33 20 36 25 36 30L36 62L48 40L60 58L72 40L84 62L84 30C84 25 87 20 92 20C97 20 102 25 102 32L102 82C102 87 99 90 95 90C91 90 88 87 86 84L72 56L60 76L48 56L34 84C32 87 29 90 25 90C21 90 18 87 18 82Z"
        fill={markColor || '#1a1a1a'}
      />
      {/* 4-point sparkle star */}
      <path
        d="M60 6C61 14 64 18 70 19C64 20 61 24 60 32C59 24 56 20 50 19C56 18 59 14 60 6Z"
        fill={markColor || '#1a1a1a'}
      />
    </svg>
  )

  if (bare) {
    return <span className={className}>{mark}</span>
  }

  return (
    <div
      className={cn(
        'rounded-lg bg-[#FFD600] flex items-center justify-center shrink-0',
        'shadow-md shadow-[#FFD600]/20',
        className
      )}
      style={{ width: size, height: size }}
    >
      {mark}
    </div>
  )
}
