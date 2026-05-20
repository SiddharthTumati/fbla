import { useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useData } from '@/hooks/useData'
import { EventCard } from '@/components/events/EventCard'
import { EventHeroBanner } from '@/components/events/EventHeroBanner'
import { getNextUpcomingEvent } from '@/lib/events'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ChapterEvent } from '@/types'
import { PageHeader } from '@/components/layout/PageHeader'
import { PortalPage } from '@/components/layout/PortalPage'

export function Events() {
  const { data, loading, registerEvent, createEvent } = useData()
  const [manageOpen, setManageOpen] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: '40',
    category: 'workshop' as ChapterEvent['category'],
  })

  if (loading || !data) return <PortalPage loading />

  const { profile, chapter } = data
  const now = new Date()
  const canManage = profile.role === 'officer' || profile.role === 'admin'

  const filterEvents = (tab: string) => {
    return chapter.events.filter((e) => {
      const past = new Date(e.date) < now
      const registered = profile.registeredEventIds.includes(e.id)
      if (tab === 'upcoming') return !past
      if (tab === 'registered') return registered
      if (tab === 'past') return past
      return true
    })
  }

  const handleRegister = (eventId: string) => {
    registerEvent(eventId)
    const evt = chapter.events.find((e) => e.id === eventId)
    toast.success(`Registered for ${evt?.title ?? 'event'}! +50 points`)
  }

  const handleCreate = () => {
    if (!form.title || !form.date) {
      toast.error('Title and date are required')
      return
    }
    createEvent({
      title: form.title,
      description: form.description || 'Chapter event',
      date: new Date(form.date).toISOString(),
      location: form.location || 'TBD',
      capacity: parseInt(form.capacity, 10) || 40,
      category: form.category,
    })
    toast.success('Event created!')
    setManageOpen(false)
    setForm({ title: '', description: '', date: '', location: '', capacity: '40', category: 'workshop' })
  }

  const renderEventGrid = (events: ChapterEvent[], heroId?: string | null) => {
    const gridEvents = heroId ? events.filter((e) => e.id !== heroId) : events
    if (gridEvents.length === 0 && !heroId) {
      return <p className="portal-empty">No events in this category.</p>
    }
    return (
      <>
        {gridEvents.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {gridEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isRegistered={profile.registeredEventIds.includes(event.id)}
                onRegister={() => handleRegister(event.id)}
              />
            ))}
          </div>
        )}
        {gridEvents.length === 0 && heroId && (
          <p className="portal-empty mt-6">No other events in this category.</p>
        )}
      </>
    )
  }

  return (
    <PortalPage>
      <PageHeader
        title="Events"
        description="Register for chapter events and workshops."
        action={
          canManage ? (
            <Dialog open={manageOpen} onOpenChange={setManageOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4" /> Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="portal-card border-[rgba(255,255,255,0.08)] bg-[color-mix(in_srgb,var(--surface-raised)_55%,transparent)]">
                <DialogHeader>
                  <DialogTitle className="portal-card-title">Create Event</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label>Title</Label>
                    <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                  </div>
                  <div>
                    <Label>Capacity</Label>
                    <Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <select
                      className="flex h-10 w-full rounded-lg border border-[rgba(255,255,255,0.1)] bg-[color-mix(in_srgb,var(--surface-muted)_50%,transparent)] px-3 text-sm text-[var(--text-primary)]"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value as ChapterEvent['category'] })}
                    >
                      <option value="workshop">Workshop</option>
                      <option value="conference">Conference</option>
                      <option value="meeting">Meeting</option>
                      <option value="deadline">Deadline</option>
                    </select>
                  </div>
                  <Button variant="outline" onClick={handleCreate}>
                    Create Event
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : undefined
        }
      />

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="registered">My Events</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-8">
          {(() => {
            const upcoming = filterEvents('upcoming')
            const hero = getNextUpcomingEvent(upcoming)
            if (upcoming.length === 0) {
              return <p className="portal-empty">No events in this category.</p>
            }
            return (
              <>
                {hero && (
                  <EventHeroBanner
                    event={hero}
                    isRegistered={profile.registeredEventIds.includes(hero.id)}
                    onRegister={() => handleRegister(hero.id)}
                  />
                )}
                {renderEventGrid(upcoming, hero?.id ?? null)}
              </>
            )
          })()}
        </TabsContent>

        {(['registered', 'past', 'all'] as const).map((tab) => (
          <TabsContent key={tab} value={tab}>
            {filterEvents(tab).length === 0 ? (
              <p className="portal-empty">No events in this category.</p>
            ) : (
              renderEventGrid(filterEvents(tab))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </PortalPage>
  )
}
