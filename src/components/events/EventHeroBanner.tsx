import { Calendar, MapPin, Users, Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { ChapterEvent } from '@/types'

interface EventHeroBannerProps {
  event: ChapterEvent
  isRegistered: boolean
  onRegister: () => void
}

export function EventHeroBanner({ event, isRegistered, onRegister }: EventHeroBannerProps) {
  const isPast = new Date(event.date) < new Date()
  const full = event.registeredIds.length >= event.capacity
  const canRegister = !isPast && !isRegistered && !full

  return (
    <section className="portal-event-hero relative z-[1]">
      <div className="relative z-[1] flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <p className="portal-event-hero-label flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Next up
          </p>
          <h2 className="portal-event-hero-title">{event.title}</h2>
          <p className="max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">{event.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[var(--brand-accent)]" />
              <span className="font-medium text-[var(--text-primary)]">{formatDate(event.date)}</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[var(--brand-accent)]/80" />
              {event.location}
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-[var(--brand-accent)]/80" />
              {event.registeredIds.length}/{event.capacity} registered
            </span>
            <Badge variant="default" className="capitalize">
              {event.category}
            </Badge>
          </div>
        </div>
        <div className="shrink-0 lg:pb-1">
          {isRegistered ? (
            <Button variant="secondary" disabled className="min-w-[11rem]">
              <Check className="h-4 w-4" /> Registered
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              disabled={!canRegister}
              onClick={onRegister}
              className="min-w-[11rem]"
            >
              {isPast ? 'Past Event' : full ? 'At Capacity' : 'Register — +50 pts'}
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
