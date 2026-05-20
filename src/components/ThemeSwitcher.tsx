import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'
import type { AppTheme } from '@/lib/themes'

const options: { id: AppTheme; label: string }[] = [
  { id: 'fbla', label: 'FBLA' },
  { id: 'marvin-ridge', label: 'Marvin Ridge' },
]

interface ThemeSwitcherProps {
  variant?: 'glass' | 'portal' | 'pill'
  className?: string
}

export function ThemeSwitcher({ variant = 'glass', className }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme()

  const wrapperClass =
    variant === 'pill'
      ? 'bg-neutral-900/90 backdrop-blur rounded-full px-2 py-1.5'
      : variant === 'glass'
        ? 'liquid-glass'
        : 'bg-[var(--surface-muted)] border border-[var(--border-default)]'

  return (
    <div
      className={cn('flex items-center gap-0.5 rounded-full p-0.5', wrapperClass, className)}
      role="group"
      aria-label="Choose theme"
    >
      {options.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => setTheme(id)}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200',
            theme === id
              ? variant === 'portal'
                ? 'bg-[var(--brand-primary)] text-white'
                : 'bg-white/20 text-white'
              : variant === 'portal'
                ? 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                : 'text-neutral-400 hover:text-white hover:scale-105',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
