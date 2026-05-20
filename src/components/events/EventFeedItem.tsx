import { MapPin, Check } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import type { ChapterEvent } from '@/types'

interface EventFeedItemProps {
  event: ChapterEvent
  isRegistered: boolean
  onRegister: () => void
  isLast?: boolean
}

export function EventFeedItem({ event, isRegistered, onRegister, isLast }: EventFeedItemProps) {
  const isPast = new Date(event.date) < new Date()
  const full = event.registeredIds.length >= event.capacity
  const canRegister = !isPast && !isRegistered && !full

  return (
    <article className={cn('portal-feed-item', !isLast && 'portal-feed-item--ruled')}>
      <div className="portal-feed-date">
        <time dateTime={event.date} className="portal-feed-date-day">
          {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric' })}
        </time>
        <span className="portal-feed-date-month">
          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
        </span>
      </div>
      <div className="portal-feed-body min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="portal-feed-title">{event.title}</h3>
          <span className="portal-dot-label capitalize">{event.category}</span>
          {isRegistered && (
            <span className="portal-dot-label portal-dot-label--success">
              <Check className="inline h-3 w-3" aria-hidden /> Registered
            </span>
          )}
        </div>
        <p className="portal-feed-meta mt-1 line-clamp-2">{event.description}</p>
        <p className="portal-feed-meta mt-2 flex flex-wrap gap-x-4 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 opacity-50" aria-hidden />
            {event.location}
          </span>
          <span>
            {event.registeredIds.length}/{event.capacity} seats
          </span>
          <span>{formatDate(event.date)}</span>
        </p>
      </div>
      <div className="portal-feed-action shrink-0">
        {isRegistered ? (
          <span className="portal-text-action portal-text-action--muted">Registered</span>
        ) : (
          <button
            type="button"
            className="portal-text-action"
            disabled={!canRegister}
            onClick={onRegister}
          >
            {isPast ? 'Ended' : full ? 'Full' : 'Register →'}
          </button>
        )}
      </div>
    </article>
  )
}
