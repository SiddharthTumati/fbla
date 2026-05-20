import { Calendar, MapPin, Users, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    <section className="portal-editorial-feature relative py-10 lg:py-14">
      <div
        className="pointer-events-none absolute -right-8 top-0 h-48 w-72 bg-gradient-to-r from-[color-mix(in_srgb,var(--brand-accent)_8%,transparent)] to-transparent blur-3xl"
        aria-hidden
      />
      <div className="relative z-[1] flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-5">
          <p className="portal-kicker">Featured event</p>
          <h2 className="portal-editorial-headline">{event.title}</h2>
          <p className="max-w-xl text-base leading-relaxed text-[var(--text-muted)]">{event.description}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[var(--brand-accent)]/80" aria-hidden />
              <span className="text-[var(--text-primary)]">{formatDate(event.date)}</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 opacity-50" aria-hidden />
              {event.location}
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 opacity-50" aria-hidden />
              {event.registeredIds.length}/{event.capacity} registered
            </span>
            <span className="portal-dot-label capitalize">{event.category}</span>
          </div>
        </div>
        <div className="shrink-0">
          {isRegistered ? (
            <span className="portal-text-action portal-text-action--muted flex items-center gap-2">
              <Check className="h-4 w-4" aria-hidden /> Registered
            </span>
          ) : (
            <Button
              variant="primary"
              size="lg"
              disabled={!canRegister}
              onClick={onRegister}
            >
              {isPast ? 'Past event' : full ? 'At capacity' : 'Register — +50 pts'}
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
