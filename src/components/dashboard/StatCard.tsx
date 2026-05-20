import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: string
  className?: string
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={cn('portal-stat-float', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="portal-kicker">{title}</p>
          <p className="portal-stat-value mt-2">{value}</p>
          {subtitle && <p className="mt-2 text-sm text-[var(--text-muted)]">{subtitle}</p>}
          {trend && (
            <p className="mt-2 text-xs font-medium tracking-wide text-[var(--brand-accent)]">{trend}</p>
          )}
        </div>
        <Icon className="h-5 w-5 shrink-0 text-[var(--brand-accent)]/50" strokeWidth={1.5} aria-hidden />
      </div>
    </div>
  )
}
