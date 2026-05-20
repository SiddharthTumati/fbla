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

export function Competitions() {
  const { data, loading, enterComp, rank } = useData()
  const [selectedPlacement, setSelectedPlacement] = useState<Record<string, 1 | 2 | 3 | undefined>>({})

  if (loading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--brand-accent)] border-t-transparent" />
      </div>
    )
  }

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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Competitions</h1>
        <p className="text-slate-400 mt-1">Track events and climb the chapter leaderboard</p>
      </div>

      <Tabs defaultValue="events">
        <TabsList>
          <TabsTrigger value="events">Competitive Events</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {chapter.competitions.map((comp) => {
              const entered = profile.enteredCompetitionIds.includes(comp.id)
              const placement = profile.competitionPlacements[comp.id]
              return (
                <Card key={comp.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{comp.name}</CardTitle>
                      <Badge variant="secondary">{comp.category}</Badge>
                    </div>
                    <CardDescription>Up to {comp.maxPoints} points</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {entered && (
                      <p className="text-sm text-emerald-400 flex items-center gap-1">
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
                <Medal className="h-5 w-5 text-gold-400" />
                Chapter Leaderboard
              </CardTitle>
              <CardDescription>
                Your rank: <span className="text-gold-400 font-semibold">#{rank}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {leaderboard.map((entry) => (
                  <li
                    key={entry.id}
                    className={cn(
                      'flex items-center gap-4 rounded-lg p-3 transition',
                      entry.isCurrentUser || entry.id === profile.uid
                        ? 'bg-gold-500/10 border border-gold-500/20'
                        : 'bg-navy-800/50',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
                        entry.rank === 1 && 'bg-gold-500 text-navy-950',
                        entry.rank === 2 && 'bg-slate-400 text-navy-950',
                        entry.rank === 3 && 'bg-amber-700 text-white',
                        entry.rank > 3 && 'bg-navy-800 text-slate-400',
                      )}
                    >
                      {entry.rank}
                    </span>
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        {entry.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-200 truncate">
                        {entry.name}
                        {(entry.isCurrentUser || entry.id === profile.uid) && (
                          <span className="ml-2 text-xs text-gold-400">(You)</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500">{entry.competitionPoints} competition pts</p>
                    </div>
                    <span className="font-bold text-gold-400">{entry.points.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
