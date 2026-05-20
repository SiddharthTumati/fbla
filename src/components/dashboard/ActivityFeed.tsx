import { Calendar, Trophy, Award, Bell } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { PortalSection } from '@/components/layout/PortalSection'
import type { ActivityItem } from '@/types'

const icons = {
  event: Calendar,
  competition: Trophy,
  achievement: Award,
  system: Bell,
}

export function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  return (
    <PortalSection kicker="Live feed" title="Recent activity" glow="cool">
      <div>
        {activities.slice(0, 6).map((item) => {
          const Icon = icons[item.type]
          return (
            <div key={item.id} className="portal-activity-item">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-accent)]/60" strokeWidth={1.5} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-[var(--text-primary)]">{item.message}</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{formatDate(item.timestamp)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </PortalSection>
  )
}
