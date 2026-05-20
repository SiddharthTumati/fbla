import {
  Footprints,
  Zap,
  Crown,
  Calendar,
  Ticket,
  Trophy,
  Medal,
  Sunrise,
  BarChart,
  Target,
  Users,
  MapPin,
  Shield,
  Flame,
  Star,
  Lock,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useData } from '@/hooks/useData'
import { ACHIEVEMENTS } from '@/data/seed'
import { POINT_RULES } from '@/lib/points'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const iconMap: Record<string, LucideIcon> = {
  footprints: Footprints,
  zap: Zap,
  crown: Crown,
  calendar: Calendar,
  ticket: Ticket,
  trophy: Trophy,
  medal: Medal,
  sunrise: Sunrise,
  'bar-chart': BarChart,
  target: Target,
  users: Users,
  'map-pin': MapPin,
  shield: Shield,
  flame: Flame,
  star: Star,
}

function getProgress(
  achievement: (typeof ACHIEVEMENTS)[0],
  profile: NonNullable<ReturnType<typeof useData>['data']>['profile'],
): number {
  switch (achievement.type) {
    case 'points':
      return Math.min(100, (profile.points / achievement.threshold) * 100)
    case 'events':
      return Math.min(100, (profile.registeredEventIds.length / achievement.threshold) * 100)
    case 'competitions':
      return Math.min(100, (profile.enteredCompetitionIds.length / achievement.threshold) * 100)
    case 'placement':
      return Math.min(
        100,
        (Object.keys(profile.competitionPlacements).length / achievement.threshold) * 100,
      )
    default:
      return 0
  }
}

export function Achievements() {
  const { data, loading } = useData()

  if (loading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--brand-accent)] border-t-transparent" />
      </div>
    )
  }

  const { profile } = data
  const unlocked = profile.achievements.length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Achievements</h1>
        <p className="text-slate-400 mt-1">
          {unlocked} of {ACHIEVEMENTS.length} unlocked
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Point Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2 text-sm text-slate-400">
            <li>Event registration: <span className="text-gold-400">+{POINT_RULES.eventRegister}</span></li>
            <li>Early registration (30+ days): <span className="text-gold-400">+{POINT_RULES.earlyRegister}</span></li>
            <li>Enter competition: <span className="text-gold-400">+{POINT_RULES.competitionEnter}</span></li>
            <li>1st place: <span className="text-gold-400">+{POINT_RULES.placement1}</span></li>
            <li>2nd place: <span className="text-gold-400">+{POINT_RULES.placement2}</span></li>
            <li>3rd place: <span className="text-gold-400">+{POINT_RULES.placement3}</span></li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = profile.achievements.includes(achievement.id)
          const Icon = iconMap[achievement.icon] ?? Star
          const progress = getProgress(achievement, profile)

          return (
            <Card
              key={achievement.id}
              className={cn(
                'transition-all duration-300',
                isUnlocked && 'border-gold-500/40 shadow-lg shadow-gold-500/5 achievement-unlock',
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'rounded-xl p-3',
                      isUnlocked ? 'bg-gold-500/20' : 'bg-navy-800',
                    )}
                  >
                    {isUnlocked ? (
                      <Icon className="h-6 w-6 text-gold-400" />
                    ) : (
                      <Lock className="h-6 w-6 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={cn('font-semibold', isUnlocked ? 'text-gold-400' : 'text-slate-400')}>
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">{achievement.description}</p>
                    {!isUnlocked && (
                      <Progress value={progress} className="mt-3 h-1.5" />
                    )}
                    {isUnlocked && (
                      <p className="text-xs text-emerald-400 mt-2 font-medium">Unlocked</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
