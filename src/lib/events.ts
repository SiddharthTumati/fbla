import type { ChapterEvent } from '@/types'

/** Featured upcoming event for hero — prefers conferences (e.g. SLC), else soonest by date */
export function getNextUpcomingEvent(events: ChapterEvent[]): ChapterEvent | null {
  const now = Date.now()
  const upcoming = events
    .filter((e) => new Date(e.date).getTime() >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const conference = upcoming.find((e) => e.category === 'conference')
  return conference ?? upcoming[0] ?? null
}
