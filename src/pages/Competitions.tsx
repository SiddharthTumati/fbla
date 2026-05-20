import { useState } from 'react'
import { Medal, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useData } from '@/hooks/useData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/layout/PageHeader'
import { PortalPage } from '@/components/layout/PortalPage'

export function Competitions() {
  const { data, loading, enterComp, rank } = useData()
  const [selectedPlacement, setSelectedPlacement] = useState<Record<string, 1 | 2 | 3 | undefined>>({})

  if (loading || !data) return <PortalPage loading />

  const { profile, chapter } = data

  const handleEnter = (compId: string) => {
    const placement = selectedPlacement[compId]
    enterComp(compId, placement)
    const comp = chapter.competitions.find((c) => c.id === compId)
    toast.success(
      placement
        ? `Recorded ${placement}${placement === 1 ? 'st' : placement === 2 ? 'nd' : 'rd'} in ${comp?.name}!`
        : `Entered ${comp?.name}! +75 points`,
    )
  }

  const leaderboard = [...chapter.leaderboard]
    .filter((e) => !e.isCurrentUser || e.id === profile.uid)
    .concat(
      chapter.leaderboard.some((e) => e.id === profile.uid)
        ? []
        : [{
            id: profile.uid,
            name: profile.displayName,
            points: profile.points,
            competitionPoints: profile.competitionPoints,
            isCurrentUser: true,
          }],
    )
    .sort((a, b) => b.points - a.points)
    .slice(0, 10)
    .map((e, i) => ({ ...e, rank: i + 1 }))

  return (
    <PortalPage>
      <PageHeader
        title="Competitions"
        description="Enter competitive events and track your standing on the chapter leaderboard."
      />

      <Tabs defaultValue="events">
        <TabsList>
          <TabsTrigger value="events">Competitive Events</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <div className="grid gap-5 sm:grid-cols-2">
            {chapter.competitions.map((comp) => {
              const entered = profile.enteredCompetitionIds.includes(comp.id)
              const placement = profile.competitionPlacements[comp.id]
              return (
                <Card key={comp.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{comp.name}</CardTitle>
                      <Badge variant="secondary" className="shrink-0 capitalize">
                        {comp.category}
                      </Badge>
                    </div>
                    <CardDescription>Up to {comp.maxPoints} points</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-4">
                    {entered && (
                      <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-400">
                        <Check className="h-4 w-4" /> Entered
                        {placement && ` — ${placement}${placement === 1 ? 'st' : placement === 2 ? 'nd' : 'rd'} place`}
                      </p>
                    )}
                    <div className="flex gap-2">
                      {([1, 2, 3] as const).map((p) => (
                        <Button
                          key={p}
                          size="sm"
                          variant={selectedPlacement[comp.id] === p ? 'default' : 'outline'}
                          onClick={() =>
                            setSelectedPlacement((s) => ({
                              ...s,
                              [comp.id]: s[comp.id] === p ? undefined : p,
                            }))
                          }
                        >
                          {p === 1 ? '1st' : p === 2 ? '2nd' : '3rd'}
                        </Button>
                      ))}
                    </div>
                    <Button className="w-full" onClick={() => handleEnter(comp.id)}>
                      {entered ? 'Update Entry' : 'Enter Competition'}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-[var(--brand-accent)]" />
                Chapter Leaderboard
              </CardTitle>
              <CardDescription>
                Your rank:{' '}
                <span className="font-semibold text-[var(--brand-accent)]" style={{ fontFamily: 'var(--font-display)' }}>
                  #{rank}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {leaderboard.map((entry) => {
                  const isYou = entry.isCurrentUser || entry.id === profile.uid
                  return (
                    <li
                      key={entry.id}
                      className={cn(
                        'portal-list-row flex items-center gap-4',
                        isYou ? 'portal-list-row--highlight' : 'portal-list-row--default',
                      )}
                    >
                      <span
                        className={cn(
                          'portal-rank-badge',
                          entry.rank === 1 && 'portal-rank-1',
                          entry.rank === 2 && 'portal-rank-2',
                          entry.rank === 3 && 'portal-rank-3',
                          entry.rank > 3 && 'portal-rank-n',
                        )}
                      >
                        {entry.rank}
                      </span>
                      <Avatar className="h-9 w-9 border border-[var(--border-default)]">
                        <AvatarFallback className="text-xs font-semibold">
                          {entry.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-[var(--text-primary)]">
                          {entry.name}
                          {isYou && (
                            <span className="ml-2 text-xs font-semibold text-[var(--brand-accent)]">(You)</span>
                          )}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">{entry.competitionPoints} competition pts</p>
                      </div>
                      <span
                        className="font-bold tabular-nums text-[var(--brand-accent)]"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {entry.points.toLocaleString()}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PortalPage>
  )
}
