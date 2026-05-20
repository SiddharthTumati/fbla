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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <PointsChart history={profile.pointsHistory} />
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Link to="/events" className="portal-quick-link">
                Register for Event <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/competitions" className="portal-quick-link portal-quick-link--secondary">
                View Leaderboard
              </Link>
              <Link to="/achievements" className="portal-quick-link portal-quick-link--ghost">
                Achievements
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
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

      {upcoming.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-[var(--border-default)]">
              {upcoming.slice(0, 3).map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{e.title}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <Link to="/events" className="portal-quick-link !py-2 !px-4 text-xs shrink-0">
                    Register
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </PortalPage>
  )
}
