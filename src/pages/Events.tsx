import { useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useData } from '@/hooks/useData'
import { EventCard } from '@/components/events/EventCard'
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

  if (loading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--brand-accent)] border-t-transparent" />
      </div>
    )
  }

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

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Events</h1>
          <p className="text-slate-400 mt-1">Register for chapter events and workshops</p>
        </div>
        {canManage && (
          <Dialog open={manageOpen} onOpenChange={setManageOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" /> Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Event</DialogTitle>
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
                    className="flex h-10 w-full rounded-lg border border-slate-700 bg-navy-800 px-3 text-sm text-slate-100"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as ChapterEvent['category'] })}
                  >
                    <option value="workshop">Workshop</option>
                    <option value="conference">Conference</option>
                    <option value="meeting">Meeting</option>
                    <option value="deadline">Deadline</option>
                  </select>
                </div>
                <Button onClick={handleCreate}>Create Event</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="registered">My Events</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        {(['upcoming', 'registered', 'past', 'all'] as const).map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filterEvents(tab).map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isRegistered={profile.registeredEventIds.includes(event.id)}
                  onRegister={() => handleRegister(event.id)}
                />
              ))}
            </div>
            {filterEvents(tab).length === 0 && (
              <p className="text-center text-slate-500 py-12">No events in this category.</p>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
