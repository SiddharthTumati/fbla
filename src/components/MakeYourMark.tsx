import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'

interface MakeYourMarkProps {
  className?: string
  size?: 'sm' | 'lg'
}

/** FBLA "MAKE YOUR MARK" typographic treatment; Marvin Ridge uses athletic display type */
export function MakeYourMark({ className, size = 'lg' }: MakeYourMarkProps) {
  const { theme, config } = useTheme()

  if (theme === 'fbla' && config.markImage) {
    return (
      <img
        src={config.markImage}
        alt="Make Your Mark — FBLA 2025-2026"
        className={cn(
          'w-full max-w-md object-contain',
          size === 'sm' ? 'max-h-16' : 'max-h-28 sm:max-h-36',
          className,
        )}
      />
    )
  }

  return (
    <div className={cn('leading-none', className)}>
      <p
        className={cn(
          'font-bold uppercase italic tracking-tight text-[var(--brand-primary)]',
          size === 'lg' ? 'text-5xl sm:text-6xl' : 'text-3xl',
        )}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <span className="block sm:inline">MARVIN</span>{' '}
        <span
          className="text-[var(--brand-accent)] not-italic"
          style={{ fontFamily: 'var(--font-script)' }}
        >
          RIDGE
        </span>
      </p>
      <p
        className={cn(
          'mt-1 font-semibold uppercase tracking-[0.2em] text-[var(--brand-secondary)]',
          size === 'lg' ? 'text-sm' : 'text-xs',
        )}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        FBLA · {config.year}
      </p>
    </div>
  )
}
