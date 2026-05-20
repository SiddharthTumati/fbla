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
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.slice(0, 6).map((item) => {
          const Icon = icons[item.type]
          return (
            <div key={item.id} className="flex gap-3">
              <div className="mt-0.5 rounded-lg bg-navy-800 p-2">
                <Icon className="h-4 w-4 text-gold-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-300">{item.message}</p>
                <p className="text-xs text-slate-500 mt-0.5">{formatDate(item.timestamp)}</p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
