import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:brightness-110 hover:-translate-y-[1px] hover:shadow-primary/30 shimmer',
        outline: 'border border-white/[0.1] bg-white/[0.03] text-white/80 hover:bg-white/[0.06] hover:border-white/[0.15] hover:text-white',
        secondary: 'bg-secondary text-secondary-foreground border border-white/[0.06] hover:bg-white/[0.06]',
        ghost: 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]',
        destructive: 'bg-red-500/10 text-red-400 hover:bg-red-500/20',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 px-3.5 text-xs rounded-md',
        lg: 'h-11 px-7',
        xl: 'h-12 px-8 text-[15px]',
        icon: 'h-9 w-9',
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
