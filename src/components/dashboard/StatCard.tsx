import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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
    <Card className={cn('portal-stat', className)}>
      <CardContent className="p-6 pt-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{title}</p>
            <p className="portal-stat-value mt-2">{value}</p>
            {subtitle && <p className="mt-1.5 text-xs text-[var(--text-muted)]">{subtitle}</p>}
            {trend && <p className="mt-2 text-xs font-medium text-[var(--brand-accent)]">{trend}</p>}
          </div>
          <div className="portal-stat-icon shrink-0">
            <Icon className="h-5 w-5 text-[var(--brand-accent)]" strokeWidth={1.75} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
