import { MapPin, Users, Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { ChapterEvent } from '@/types'

interface EventCardProps {
  event: ChapterEvent
  isRegistered: boolean
  onRegister: () => void
}

const categoryColors: Record<ChapterEvent['category'], string> = {
  conference: 'default',
  workshop: 'success',
  deadline: 'secondary',
  meeting: 'secondary',
}

export function EventCard({ event, isRegistered, onRegister }: EventCardProps) {
  const isPast = new Date(event.date) < new Date()
  const full = event.registeredIds.length >= event.capacity
  const canRegister = !isPast && !isRegistered && !full

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{event.title}</CardTitle>
          <Badge variant={categoryColors[event.category] as 'default'} className="capitalize shrink-0">
            {event.category}
          </Badge>
        </div>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        <div className="space-y-2 text-sm text-slate-400">
          <p className="flex items-center gap-2">
            <span className="text-gold-400 font-medium">{formatDate(event.date)}</span>
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" /> {event.location}
          </p>
          <p className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0" />
            {event.registeredIds.length}/{event.capacity} registered
          </p>
        </div>
        {isRegistered ? (
          <Button variant="secondary" disabled className="w-full">
            <Check className="h-4 w-4" /> Registered
          </Button>
        ) : (
          <Button
            className="w-full"
            disabled={!canRegister}
            onClick={onRegister}
          >
            {isPast ? 'Past Event' : full ? 'Full' : 'Register (+50 pts)'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
