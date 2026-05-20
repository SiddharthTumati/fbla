import { Link } from 'react-router-dom'
import { Star, Calendar, Trophy, TrendingUp, ArrowRight } from 'lucide-react'
import { useData } from '@/hooks/useData'
import { StatCard } from '@/components/dashboard/StatCard'
import { PointsChart } from '@/components/dashboard/PointsChart'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { ACHIEVEMENTS } from '@/data/seed'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PageHeader } from '@/components/layout/PageHeader'
import { PortalPage } from '@/components/layout/PortalPage'

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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2">
          <PointsChart history={profile.pointsHistory} />
        </div>

        <div className="flex flex-col gap-5 lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="portal-quick-actions" aria-label="Quick actions">
                <Link to="/events" className="portal-quick-link">
                  Register for Event <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/competitions" className="portal-quick-link portal-quick-link--ghost">
                  View Leaderboard
                </Link>
                <Link to="/achievements" className="portal-quick-link portal-quick-link--ghost">
                  Achievements
                </Link>
              </nav>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2">
          {upcoming.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-[rgba(255,255,255,0.06)]">
                  {upcoming.slice(0, 3).map((e) => (
                    <li key={e.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{e.title}</p>
                        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                          {new Date(e.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <Link to="/events" className="portal-quick-link !w-auto shrink-0 !py-2 !px-4 text-xs">
                        Register
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-5 lg:col-span-1">
          <ActivityFeed activities={chapter.activities} />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Next Achievement</CardTitle>
            </CardHeader>
            <CardContent>
              {nextAchievement ? (
                <>
                  <p className="font-semibold text-[var(--brand-accent)]">{nextAchievement.title}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{nextAchievement.description}</p>
                  <Progress value={progressToNext} className="mt-4 h-2" />
                  <p className="mt-2 text-xs text-[var(--text-muted)]">
                    {profile.points} / {nextAchievement.threshold} pts
                  </p>
                </>
              ) : (
                <p className="text-sm font-medium text-emerald-400">All achievements unlocked!</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalPage>
  )
}
