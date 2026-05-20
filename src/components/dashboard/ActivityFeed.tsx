import { Calendar, Trophy, Award, Bell } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import type { ActivityItem } from '@/types'

const icons = {
  event: Calendar,
  competition: Trophy,
  achievement: Award,
  system: Bell,
}

export function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {activities.slice(0, 6).map((item) => {
          const Icon = icons[item.type]
          return (
            <div
              key={item.id}
              className="flex gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-[var(--surface-muted)]/40"
            >
              <div className="portal-stat-icon mt-0.5 !p-2">
                <Icon className="h-4 w-4 text-[var(--brand-accent)]" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-[var(--text-primary)]">{item.message}</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{formatDate(item.timestamp)}</p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
