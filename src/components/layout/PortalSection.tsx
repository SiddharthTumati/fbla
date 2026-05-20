import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PortalSectionProps {
  kicker?: string
  title?: string
  children: ReactNode
  className?: string
  glow?: 'accent' | 'cool' | 'none'
}

export function PortalSection({ kicker, title, children, className, glow = 'accent' }: PortalSectionProps) {
  return (
    <section className={cn('portal-section relative', className)}>
      {glow !== 'none' && (
        <div className={cn('portal-ambient', glow === 'cool' && 'portal-ambient--cool')} aria-hidden />
      )}
      <div className="relative z-[1]">
        {(kicker || title) && (
          <header className="mb-6">
            {kicker && <p className="portal-kicker">{kicker}</p>}
            {title && <h2 className="portal-section-title">{title}</h2>}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}
