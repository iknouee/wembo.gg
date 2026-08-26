import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground glow-btn hover:brightness-110 hover:-translate-y-[1px] btn-shimmer',
        outline: 'border border-white/[0.1] bg-white/[0.03] text-white/80 hover:bg-white/[0.06] hover:border-white/[0.15] hover:text-white hover:-translate-y-[1px]',
        secondary: 'bg-white/[0.05] text-white/70 border border-white/[0.06] hover:bg-white/[0.08]',
        ghost: 'text-[#9A9CA3] hover:text-white hover:bg-white/[0.04]',
        destructive: 'bg-red-500/10 text-red-400 hover:bg-red-500/20',
        link: 'text-primary underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-10 px-5',
        sm: 'h-8 px-3.5 text-xs rounded-md',
        lg: 'h-11 px-6',
        xl: 'h-[50px] px-7 text-[15px] rounded-xl',
        icon: 'h-9 w-9 rounded-md',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
)
Button.displayName = 'Button'
export { Button, buttonVariants }
