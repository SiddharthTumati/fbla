import { Link } from 'react-router-dom'
import { Star, Calendar, Trophy, TrendingUp, ArrowRight, Award } from 'lucide-react'
import { useData } from '@/hooks/useData'
import { StatCard } from '@/components/dashboard/StatCard'
import { PointsChart } from '@/components/dashboard/PointsChart'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { ACHIEVEMENTS } from '@/data/seed'
import { PageHeader } from '@/components/layout/PageHeader'
import { PortalPage } from '@/components/layout/PortalPage'
import { PortalSection } from '@/components/layout/PortalSection'

export function Dashboard() {
  const { data, loading, rank } = useData()

  if (loading || !data) return <PortalPage loading />

  const { profile, chapter } = data
  const nextAchievement = ACHIEVEMENTS.find((a) => !profile.achievements.includes(a.id))
  const progressToNext = nextAchievement
    ? Math.min(100, (profile.points / nextAchievement.threshold) * 100)
    : 100

  const upcoming = chapter.events.filter(
    (e) => new Date(e.date) >= new Date() && !profile.registeredEventIds.includes(e.id),
  )

  return (
    <PortalPage>
      <PageHeader
        spacious
        title="Dashboard"
        description="Your chapter activity, points, and upcoming events at a glance."
      />

      <div className="grid gap-8 border-b border-white/5 pb-10 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Points"
          value={profile.points.toLocaleString()}
          subtitle="Events + competitions"
          icon={Star}
          trend="+50 per registration"
        />
        <StatCard
          title="Chapter Rank"
          value={`#${rank}`}
          subtitle={`of ${chapter.leaderboard.length + 1} members`}
          icon={TrendingUp}
        />
        <StatCard
          title="Events Registered"
          value={profile.registeredEventIds.length}
          icon={Calendar}
        />
        <StatCard
          title="Competitions"
          value={profile.enteredCompetitionIds.length}
          subtitle={`${profile.competitionPoints} comp. pts`}
          icon={Trophy}
        />
      </div>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,17rem)] lg:items-start">
        <PointsChart history={profile.pointsHistory} />

        <PortalSection kicker="Shortcuts" title="Quick actions" glow="none">
          <nav className="portal-action-list" aria-label="Quick actions">
            <Link to="/events" className="portal-action-list-item">
              <Calendar className="h-4 w-4" aria-hidden />
              Register for event
              <ArrowRight className="ml-auto h-4 w-4" aria-hidden />
            </Link>
            <Link to="/competitions" className="portal-action-list-item">
              <Trophy className="h-4 w-4" aria-hidden />
              View leaderboard
              <ArrowRight className="ml-auto h-4 w-4" aria-hidden />
            </Link>
            <Link to="/achievements" className="portal-action-list-item">
              <Award className="h-4 w-4" aria-hidden />
              Achievements
              <ArrowRight className="ml-auto h-4 w-4" aria-hidden />
            </Link>
          </nav>
        </PortalSection>
      </div>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start">
        {upcoming.length > 0 && (
          <PortalSection kicker="Calendar" title="Upcoming events">
            <ul>
              {upcoming.slice(0, 4).map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between gap-6 border-b border-white/5 py-4 last:border-0"
                >
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{e.title}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      {new Date(e.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <Link to="/events" className="portal-text-action shrink-0">
                    Register →
                  </Link>
                </li>
              ))}
            </ul>
          </PortalSection>
        )}

        <div className="flex flex-col gap-12">
          <ActivityFeed activities={chapter.activities} />

          <PortalSection kicker="Progress" title="Next achievement" glow="cool">
            {nextAchievement ? (
              <>
                <p className="text-lg font-semibold tracking-tight text-[var(--brand-accent)]">
                  {nextAchievement.title}
                </p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{nextAchievement.description}</p>
                <div className="portal-progress-line">
                  <div
                    className="portal-progress-line-fill"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-[var(--text-muted)]">
                  {profile.points} / {nextAchievement.threshold} pts
                </p>
              </>
            ) : (
              <p className="text-sm font-medium text-emerald-400/90">All achievements unlocked</p>
            )}
          </PortalSection>
        </div>
      </div>
    </PortalPage>
  )
}
