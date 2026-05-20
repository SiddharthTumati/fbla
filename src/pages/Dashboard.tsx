import { Link } from 'react-router-dom'
import { Star, Calendar, Trophy, TrendingUp, ArrowRight } from 'lucide-react'
import { useData } from '@/contexts/DataContext'
import { StatCard } from '@/components/dashboard/StatCard'
import { PointsChart } from '@/components/dashboard/PointsChart'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ACHIEVEMENTS } from '@/data/seed'

export function Dashboard() {
  const { data, loading, rank } = useData()

  if (loading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
      </div>
    )
  }

  const { profile, chapter } = data
  const nextAchievement = ACHIEVEMENTS.find((a) => !profile.achievements.includes(a.id))
  const progressToNext = nextAchievement
    ? Math.min(100, (profile.points / nextAchievement.threshold) * 100)
    : 100

  const upcoming = chapter.events.filter(
    (e) => new Date(e.date) >= new Date() && !profile.registeredEventIds.includes(e.id),
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 lg:text-3xl">Dashboard</h1>
        <p className="text-slate-400 mt-1">Your chapter activity at a glance</p>
      </div>

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
        <div className="lg:col-span-2 space-y-6">
          <PointsChart history={profile.pointsHistory} />
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/events">
                  Register for Event <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link to="/competitions">View Leaderboard</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/achievements">Achievements</Link>
              </Button>
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
                  <p className="font-medium text-gold-400">{nextAchievement.title}</p>
                  <p className="text-sm text-slate-500 mt-1">{nextAchievement.description}</p>
                  <Progress value={progressToNext} className="mt-4" />
                  <p className="text-xs text-slate-500 mt-2">
                    {profile.points} / {nextAchievement.threshold} pts
                  </p>
                </>
              ) : (
                <p className="text-sm text-emerald-400">All achievements unlocked!</p>
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
            <ul className="space-y-3">
              {upcoming.slice(0, 3).map((e) => (
                <li key={e.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{e.title}</span>
                  <Button size="sm" variant="ghost" asChild>
                    <Link to="/events">Register</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
