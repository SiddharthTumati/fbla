import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'

type LogoFrameVariant = 'nav' | 'hero' | 'card' | 'sidebar'

interface LogoFrameProps {
  src: string
  alt: string
  variant?: LogoFrameVariant
  className?: string
  float?: boolean
  showGlow?: boolean
}

const variantStyles: Record<LogoFrameVariant, { frame: string; img: string }> = {
  nav: {
    frame: 'h-9 w-9 rounded-full p-1.5',
    img: 'h-full w-full',
  },
  hero: {
    frame: 'h-28 w-28 sm:h-36 sm:w-36 rounded-2xl p-3 sm:p-4',
    img: 'h-full w-full',
  },
  card: {
    frame: 'h-24 w-24 sm:h-32 sm:w-32 rounded-2xl p-3 sm:p-4',
    img: 'h-full w-full',
  },
  sidebar: {
    frame: 'h-10 w-10 rounded-xl p-1.5',
    img: 'h-full w-full',
  },
}

export function LogoFrame({
  src,
  alt,
  variant = 'nav',
  className,
  float = false,
  showGlow = true,
}: LogoFrameProps) {
  const { theme } = useTheme()
  const [loaded, setLoaded] = useState(false)
  const styles = variantStyles[variant]

  return (
    <div
      className={cn(
        'logo-frame relative flex items-center justify-center shrink-0',
        styles.frame,
        float && 'animate-logo-float',
        showGlow && 'logo-frame-glow',
        !loaded && 'logo-frame-loading',
        className,
      )}
      data-theme-logo={theme}
    >
      <img
        key={`${theme}-${src}`}
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={cn(
          'logo-frame-img object-contain transition-all duration-700 ease-out',
          styles.img,
          loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
        )}
        draggable={false}
      />
    </div>
  )
}
