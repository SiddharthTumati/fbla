import { useState } from 'react'
import { toast } from 'sonner'
import { useData } from '@/hooks/useData'
import { CompetitionFeedItem } from '@/components/competitions/CompetitionFeedItem'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/layout/PageHeader'
import { PortalPage } from '@/components/layout/PortalPage'
import { PortalSection } from '@/components/layout/PortalSection'

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

  const togglePlacement = (compId: string, p: 1 | 2 | 3) => {
    setSelectedPlacement((s) => ({
      ...s,
      [compId]: s[compId] === p ? undefined : p,
    }))
  }

  const featuredId =
    chapter.competitions.find((c) => !profile.enteredCompetitionIds.includes(c.id))?.id ??
    chapter.competitions[0]?.id

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

        <TabsContent value="events" className="space-y-2">
          <div className="portal-feed-list">
            {chapter.competitions.map((comp, i) => {
              const entered = profile.enteredCompetitionIds.includes(comp.id)
              const placement = profile.competitionPlacements[comp.id]
              const featured = comp.id === featuredId

              return (
                <CompetitionFeedItem
                  key={comp.id}
                  competition={comp}
                  entered={entered}
                  placement={placement}
                  selectedPlacement={selectedPlacement[comp.id]}
                  onSelectPlacement={(p) => togglePlacement(comp.id, p)}
                  onEnter={() => handleEnter(comp.id)}
                  featured={featured}
                  isLast={i === chapter.competitions.length - 1}
                />
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard">
          <PortalSection
            kicker="Standings"
            title="Chapter leaderboard"
            glow="accent"
          >
            <p className="mb-6 text-sm text-[var(--text-muted)]">
              Your rank{' '}
              <span
                className="font-semibold text-[var(--brand-accent)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                #{rank}
              </span>
            </p>
            <div>
              {leaderboard.map((entry, i) => {
                const isYou = entry.isCurrentUser || entry.id === profile.uid
                const isLast = i === leaderboard.length - 1
                return (
                  <div
                    key={entry.id}
                    className={cn(
                      'portal-leaderboard-row',
                      isYou && 'portal-leaderboard-row--you',
                      !isLast && 'border-b border-white/5',
                    )}
                  >
                    <span
                      className={cn(
                        'portal-rank-num',
                        entry.rank <= 3 && 'portal-rank-num--top',
                      )}
                    >
                      {entry.rank}
                    </span>
                    <Avatar className="h-9 w-9 border-0 bg-[color-mix(in_srgb,var(--surface-muted)_50%,transparent)]">
                      <AvatarFallback className="text-xs font-semibold">
                        {entry.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="portal-leaderboard-name truncate font-medium text-[var(--text-primary)]">
                        {entry.name}
                        {isYou && (
                          <span className="ml-2 text-xs font-normal text-[var(--brand-accent)]">you</span>
                        )}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {entry.competitionPoints} competition pts
                      </p>
                    </div>
                    <span
                      className="font-bold tabular-nums text-[var(--brand-accent)]"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {entry.points.toLocaleString()}
                    </span>
                  </div>
                )
              })}
            </div>
          </PortalSection>
        </TabsContent>
      </Tabs>
    </PortalPage>
  )
}
