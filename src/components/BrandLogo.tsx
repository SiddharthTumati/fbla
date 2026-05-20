import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'
import { LogoFrame } from '@/components/LogoFrame'

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
  onDark?: boolean
}

const sizes = {
  sm: { frame: 'nav' as const, text: 'text-sm' },
  md: { frame: 'sidebar' as const, text: 'text-base' },
  lg: { frame: 'card' as const, text: 'text-lg' },
}

export function BrandLogo({ size = 'md', showText = true, className, onDark = true }: BrandLogoProps) {
  const { config, theme } = useTheme()
  const s = sizes[size]

  return (
    <div className={cn('flex items-center gap-3 min-w-0 group', className)}>
      <LogoFrame
        src={config.logo}
        alt={config.logoAlt}
        variant={s.frame}
        showGlow={false}
        className="transition-transform duration-500 ease-out group-hover:scale-105"
      />
      {showText && (
        <div className="min-w-0 leading-tight theme-crossfade" key={theme}>
          <p
            className={cn(
              s.text,
              'font-semibold truncate',
              onDark ? 'text-white' : 'text-[var(--text-primary)]',
            )}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {theme === 'marvin-ridge' ? 'Mavericks' : 'FBLA'}
          </p>
          <p
            className={cn(
              'text-[10px] truncate',
              onDark ? 'text-white/60' : 'text-[var(--text-muted)]',
            )}
          >
            Member Portal
          </p>
        </div>
      )}
    </div>
  )
}
