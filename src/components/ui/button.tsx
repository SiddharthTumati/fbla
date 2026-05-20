import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-focus)] disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        /** Single highest-priority CTA per view — solid amber */
        primary:
          'bg-[var(--brand-accent)] text-[var(--btn-primary-text)] hover:bg-[var(--brand-accent-hover)] shadow-md shadow-black/15',
        /** Default actions — outline, fills on hover */
        default:
          'border border-[color-mix(in_srgb,var(--brand-accent)_50%,transparent)] bg-transparent text-[var(--brand-accent)] hover:bg-[var(--brand-accent)] hover:text-[var(--btn-primary-text)] hover:border-[var(--brand-accent)]',
        secondary:
          'border border-[rgba(255,255,255,0.1)] bg-transparent text-[var(--text-primary)] hover:bg-[color-mix(in_srgb,var(--surface-muted)_55%,transparent)]',
        outline:
          'border border-[rgba(255,255,255,0.1)] bg-transparent text-[var(--text-muted)] hover:border-[color-mix(in_srgb,var(--brand-accent)_40%,transparent)] hover:text-[var(--brand-accent)]',
        ghost:
          'bg-transparent text-[var(--text-muted)] hover:bg-[color-mix(in_srgb,var(--surface-muted)_40%,transparent)] hover:text-[var(--text-primary)]',
        destructive: 'bg-red-600/90 text-white hover:bg-red-500 border border-red-500/30',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-lg px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
