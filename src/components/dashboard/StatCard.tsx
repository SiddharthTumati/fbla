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
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[var(--text-muted)]">{title}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
            {subtitle && <p className="mt-1 text-xs text-[var(--text-muted)]">{subtitle}</p>}
            {trend && <p className="mt-2 text-xs text-[var(--brand-accent)]">{trend}</p>}
          </div>
          <div className="rounded-lg bg-[var(--brand-accent)]/10 p-3">
            <Icon className="h-5 w-5 text-[var(--brand-accent)]" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
