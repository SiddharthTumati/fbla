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
import { PageHeader } from '@/components/layout/PageHeader'
import { PortalPage } from '@/components/layout/PortalPage'

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

  if (loading || !data) return <PortalPage loading />

  const { profile } = data
  const unlocked = profile.achievements.length

  return (
    <PortalPage>
      <PageHeader
        title="Achievements"
        description={`${unlocked} of ${ACHIEVEMENTS.length} badges unlocked — earn points through events and competitions.`}
      />

      <Card>
        <CardHeader>
          <CardTitle>Point Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3 text-sm sm:grid-cols-2">
            {[
              ['Event registration', POINT_RULES.eventRegister],
              ['Early registration (30+ days)', POINT_RULES.earlyRegister],
              ['Enter competition', POINT_RULES.competitionEnter],
              ['1st place', POINT_RULES.placement1],
              ['2nd place', POINT_RULES.placement2],
              ['3rd place', POINT_RULES.placement3],
            ].map(([label, pts]) => (
              <li
                key={label}
                className="flex justify-between gap-4 rounded-lg border border-[rgba(255,255,255,0.05)] bg-[color-mix(in_srgb,var(--surface-muted)_30%,transparent)] px-3 py-2"
              >
                <span className="text-[var(--text-muted)]">{label}</span>
                <span className="font-semibold text-[var(--brand-accent)]">+{pts}</span>
              </li>
            ))}
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
                isUnlocked ? 'portal-achievement--unlocked' : 'portal-achievement--locked',
              )}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'portal-achievement-icon rounded-xl p-3',
                      isUnlocked ? 'portal-stat-icon' : 'bg-[color-mix(in_srgb,var(--surface-muted)_40%,transparent)]',
                    )}
                  >
                    {isUnlocked ? (
                      <Icon className="h-6 w-6 text-[var(--brand-accent)]" strokeWidth={1.75} />
                    ) : (
                      <Lock className="h-6 w-6 text-[var(--text-muted)]" strokeWidth={1.75} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3
                      className={cn(
                        'font-semibold',
                        isUnlocked ? 'text-[var(--brand-accent)]' : 'text-[var(--text-muted)]',
                      )}
                    >
                      {achievement.title}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">{achievement.description}</p>
                    {!isUnlocked && <Progress value={progress} className="mt-3 h-1.5 opacity-80" />}
                    {isUnlocked && (
                      <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-emerald-400/90">
                        Unlocked
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </PortalPage>
  )
}
