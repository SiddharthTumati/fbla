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
import { PageHeader } from '@/components/layout/PageHeader'
import { PortalPage } from '@/components/layout/PortalPage'
import { PortalSection } from '@/components/layout/PortalSection'

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
  const unlockedList = ACHIEVEMENTS.filter((a) => profile.achievements.includes(a.id))
  const lockedList = ACHIEVEMENTS.filter((a) => !profile.achievements.includes(a.id))

  return (
    <PortalPage>
      <PageHeader
        title="Achievements"
        description={`${unlocked} of ${ACHIEVEMENTS.length} badges unlocked — earn points through events and competitions.`}
      />

      <PortalSection kicker="Scoring" title="Point rules" glow="none">
        <dl className="portal-rules-inline">
          {[
            ['Registration', POINT_RULES.eventRegister],
            ['Early bird', POINT_RULES.earlyRegister],
            ['Competition', POINT_RULES.competitionEnter],
            ['1st place', POINT_RULES.placement1],
            ['2nd place', POINT_RULES.placement2],
            ['3rd place', POINT_RULES.placement3],
          ].map(([label, pts]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>+{pts}</dd>
            </div>
          ))}
        </dl>
      </PortalSection>

      {unlockedList.length > 0 && (
        <PortalSection kicker="Earned" title="Unlocked" glow="accent">
          <div className="portal-achievement-list">
            {unlockedList.map((achievement) => {
              const Icon = iconMap[achievement.icon] ?? Star
              return (
                <div
                  key={achievement.id}
                  className="portal-achievement-row portal-achievement-row--unlocked"
                >
                  <Icon className="h-5 w-5 text-[var(--brand-accent)]" strokeWidth={1.75} aria-hidden />
                  <div>
                    <p className="portal-achievement-row-title">{achievement.title}</p>
                    <p className="portal-achievement-row-desc">{achievement.description}</p>
                  </div>
                  <span className="portal-achievement-status portal-achievement-status--unlocked">
                    Unlocked
                  </span>
                </div>
              )
            })}
          </div>
        </PortalSection>
      )}

      <PortalSection kicker="In progress" title="Locked" glow="cool">
        <div className="portal-achievement-list">
          {lockedList.map((achievement) => {
            const progress = getProgress(achievement, profile)
            return (
              <div
                key={achievement.id}
                className="portal-achievement-row portal-achievement-row--locked"
              >
                <Lock className="h-5 w-5 text-[var(--text-muted)]" strokeWidth={1.5} aria-hidden />
                <div>
                  <p className="portal-achievement-row-title">{achievement.title}</p>
                  <p className="portal-achievement-row-desc">{achievement.description}</p>
                  <div className="portal-progress-line mt-2 max-w-xs">
                    <div
                      className="portal-progress-line-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <span className="portal-achievement-status portal-achievement-status--locked">
                  {Math.round(progress)}%
                </span>
              </div>
            )
          })}
        </div>
      </PortalSection>
    </PortalPage>
  )
}
