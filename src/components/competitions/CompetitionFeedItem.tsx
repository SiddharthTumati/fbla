import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Competition } from '@/types'

const PLACEMENTS = [
  { value: 1 as const, label: '1st' },
  { value: 2 as const, label: '2nd' },
  { value: 3 as const, label: '3rd' },
]

interface CompetitionFeedItemProps {
  competition: Competition
  entered: boolean
  placement?: 1 | 2 | 3
  selectedPlacement?: 1 | 2 | 3
  onSelectPlacement: (p: 1 | 2 | 3) => void
  onEnter: () => void
  featured?: boolean
  isLast?: boolean
}

export function CompetitionFeedItem({
  competition,
  entered,
  placement,
  selectedPlacement,
  onSelectPlacement,
  onEnter,
  featured,
  isLast,
}: CompetitionFeedItemProps) {
  return (
    <article
      className={cn(
        featured ? 'portal-editorial-feature py-10' : 'portal-feed-item',
        !featured && !isLast && 'portal-feed-item--ruled',
      )}
    >
      {featured ? (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="portal-kicker">Featured competition</p>
            <h2 className="portal-editorial-headline mt-2">{competition.name}</h2>
            <p className="portal-feed-meta mt-3 max-w-lg">
              <span className="portal-dot-label capitalize">{competition.category}</span>
              <span className="mx-2 opacity-30">·</span>
              Up to {competition.maxPoints} points
            </p>
          </div>
          <CompetitionActions
            entered={entered}
            placement={placement}
            selectedPlacement={selectedPlacement}
            onSelectPlacement={onSelectPlacement}
            onEnter={onEnter}
            enterLabel={entered ? 'Update entry' : 'Enter competition'}
          />
        </div>
      ) : (
        <>
          <div className="portal-feed-marker" aria-hidden>
            <span className="portal-feed-marker-dot" />
          </div>
          <div className="portal-feed-body min-w-0 flex-1">
            <h3 className="portal-feed-title">{competition.name}</h3>
            <p className="portal-feed-meta mt-1">
              <span className="portal-dot-label capitalize">{competition.category}</span>
              <span className="mx-2 opacity-30">·</span>
              {competition.maxPoints} pts max
              {entered && (
                <>
                  <span className="mx-2 opacity-30">·</span>
                  <span className="text-emerald-400/90">
                    <Check className="mr-1 inline h-3.5 w-3.5" aria-hidden />
                    Entered
                    {placement && ` · ${placement}${placement === 1 ? 'st' : placement === 2 ? 'nd' : 'rd'}`}
                  </span>
                </>
              )}
            </p>
            {!entered && (
              <div className="mt-4">
                <CompetitionActions
                  entered={entered}
                  placement={placement}
                  selectedPlacement={selectedPlacement}
                  onSelectPlacement={onSelectPlacement}
                  onEnter={onEnter}
                  compact
                  enterLabel="Enter →"
                />
              </div>
            )}
            {entered && (
              <div className="mt-3">
                <CompetitionActions
                  entered={entered}
                  placement={placement}
                  selectedPlacement={selectedPlacement}
                  onSelectPlacement={onSelectPlacement}
                  onEnter={onEnter}
                  compact
                  enterLabel="Update →"
                />
              </div>
            )}
          </div>
        </>
      )}
    </article>
  )
}

function CompetitionActions({
  entered,
  placement,
  selectedPlacement,
  onSelectPlacement,
  onEnter,
  compact,
  enterLabel,
}: {
  entered: boolean
  placement?: 1 | 2 | 3
  selectedPlacement?: 1 | 2 | 3
  onSelectPlacement: (p: 1 | 2 | 3) => void
  onEnter: () => void
  compact?: boolean
  enterLabel: string
}) {
  return (
    <div className={cn('flex flex-col gap-4', compact ? 'items-start' : 'shrink-0 lg:items-end')}>
      <div>
        <p className="portal-kicker mb-2">Placement</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Select placement">
          {PLACEMENTS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              disabled={entered && !!placement}
              className={cn('portal-placement-pill', `portal-placement-pill--${value}`)}
              data-selected={selectedPlacement === value ? 'true' : 'false'}
              aria-pressed={selectedPlacement === value}
              onClick={() => onSelectPlacement(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {compact ? (
        <button type="button" className="portal-text-action" onClick={onEnter}>
          {enterLabel}
        </button>
      ) : (
        <Button variant={entered ? 'outline' : 'primary'} onClick={onEnter}>
          {enterLabel}
        </Button>
      )}
    </div>
  )
}
