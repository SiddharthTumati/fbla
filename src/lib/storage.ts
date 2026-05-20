import { createInitialProfile, createSeedChapter } from '@/data/seed'
import { recalculateProfile } from '@/lib/points'
import type { AppData, ChapterEvent, MemberProfile, UserRole } from '@/types'

const CHAPTER_KEY = 'fbla:chapter'
const profileKey = (uid: string) => `fbla:${uid}:profile`
const initializedKey = (uid: string) => `fbla:${uid}:initialized`

export function getChapter(): ReturnType<typeof createSeedChapter> {
  const raw = localStorage.getItem(CHAPTER_KEY)
  if (!raw) {
    const seed = createSeedChapter()
    localStorage.setItem(CHAPTER_KEY, JSON.stringify(seed))
    return seed
  }
  return JSON.parse(raw) as ReturnType<typeof createSeedChapter>
}

export function saveChapter(chapter: ReturnType<typeof createSeedChapter>): void {
  localStorage.setItem(CHAPTER_KEY, JSON.stringify(chapter))
  window.dispatchEvent(new Event('fbla-storage'))
}

export function getProfile(uid: string): MemberProfile | null {
  const raw = localStorage.getItem(profileKey(uid))
  return raw ? (JSON.parse(raw) as MemberProfile) : null
}

export function saveProfile(profile: MemberProfile): void {
  localStorage.setItem(profileKey(profile.uid), JSON.stringify(profile))
  window.dispatchEvent(new Event('fbla-storage'))
}

export function initializeUser(
  uid: string,
  displayName: string,
  email: string,
  role: UserRole,
  photoURL?: string,
): AppData {
  const chapter = getChapter()
  let profile = getProfile(uid)

  if (!localStorage.getItem(initializedKey(uid)) || !profile) {
    profile = createInitialProfile(uid, displayName, email, role, photoURL)
    profile = recalculateProfile(profile, chapter.events)
    saveProfile(profile)
    localStorage.setItem(initializedKey(uid), 'true')
    const chapterWithUser = {
      ...chapter,
      leaderboard: updateLeaderboard(chapter.leaderboard, profile),
    }
    saveChapter(chapterWithUser)
    return { profile, chapter: chapterWithUser }
  } else if (profile.role !== role) {
    profile = { ...profile, role }
    saveProfile(profile)
  }

  return { profile: recalculateProfile(profile, chapter.events), chapter }
}

export function loadAppData(uid: string): AppData | null {
  const profile = getProfile(uid)
  if (!profile) return null
  const chapter = getChapter()
  return { profile: recalculateProfile(profile, chapter.events), chapter }
}

export function registerForEvent(uid: string, eventId: string): AppData | null {
  const data = loadAppData(uid)
  if (!data) return null
  const { profile, chapter } = data

  if (profile.registeredEventIds.includes(eventId)) return data

  const event = chapter.events.find((e) => e.id === eventId)
  if (!event || event.registeredIds.length >= event.capacity) return data

  const updatedEvents = chapter.events.map((e) =>
    e.id === eventId
      ? { ...e, registeredIds: [...e.registeredIds, uid] }
      : e,
  )

  const updatedProfile = recalculateProfile(
    {
      ...profile,
      registeredEventIds: [...profile.registeredEventIds, eventId],
    },
    updatedEvents,
  )

  const updatedChapter = {
    ...chapter,
    events: updatedEvents,
    activities: [
      {
        id: `act-${Date.now()}`,
        message: `${profile.displayName} registered for ${event.title}`,
        timestamp: new Date().toISOString(),
        type: 'event' as const,
      },
      ...chapter.activities.slice(0, 19),
    ],
  }

  saveChapter(updatedChapter)
  saveProfile(updatedProfile)
  return { profile: updatedProfile, chapter: updatedChapter }
}

export function enterCompetition(
  uid: string,
  competitionId: string,
  placement?: 1 | 2 | 3,
): AppData | null {
  const data = loadAppData(uid)
  if (!data) return null
  const { profile, chapter } = data

  const comp = chapter.competitions.find((c) => c.id === competitionId)
  if (!comp) return data

  const entered = profile.enteredCompetitionIds.includes(competitionId)
    ? profile.enteredCompetitionIds
    : [...profile.enteredCompetitionIds, competitionId]

  const placements = { ...profile.competitionPlacements }
  if (placement) placements[competitionId] = placement
  else delete placements[competitionId]

  let updatedProfile = recalculateProfile(
    { ...profile, enteredCompetitionIds: entered, competitionPlacements: placements },
    chapter.events,
  )

  const leaderboard = updateLeaderboard(chapter.leaderboard, updatedProfile)
  const updatedChapter = {
    ...chapter,
    leaderboard,
    activities: [
      {
        id: `act-${Date.now()}`,
        message: placement
          ? `${profile.displayName} placed ${placement}${placement === 1 ? 'st' : placement === 2 ? 'nd' : 'rd'} in ${comp.name}`
          : `${profile.displayName} entered ${comp.name}`,
        timestamp: new Date().toISOString(),
        type: 'competition' as const,
      },
      ...chapter.activities.slice(0, 19),
    ],
  }

  saveChapter(updatedChapter)
  saveProfile(updatedProfile)
  return { profile: updatedProfile, chapter: updatedChapter }
}

function updateLeaderboard(
  leaderboard: AppData['chapter']['leaderboard'],
  profile: MemberProfile,
) {
  const existing = leaderboard.find((e) => e.id === profile.uid)
  const entry = {
    id: profile.uid,
    name: profile.displayName,
    points: profile.points,
    competitionPoints: profile.competitionPoints,
    isCurrentUser: true,
  }

  const without = leaderboard.filter((e) => e.id !== profile.uid && !e.isCurrentUser)
  const merged = existing
    ? without.map((e) => (e.id === profile.uid ? entry : e))
    : [...without, entry]

  return merged
    .sort((a, b) => b.points - a.points)
    .map((e) => ({ ...e, isCurrentUser: e.id === profile.uid }))
}

export function updateDisplayName(uid: string, displayName: string): AppData | null {
  const data = loadAppData(uid)
  if (!data) return null
  const profile = { ...data.profile, displayName }
  const chapter = {
    ...data.chapter,
    leaderboard: updateLeaderboard(data.chapter.leaderboard, profile),
  }
  saveProfile(profile)
  saveChapter(chapter)
  return { profile, chapter }
}

export function addEvent(uid: string, event: Omit<ChapterEvent, 'id' | 'registeredIds'>): AppData | null {
  const data = loadAppData(uid)
  if (!data || (data.profile.role !== 'officer' && data.profile.role !== 'admin')) return null

  const newEvent: ChapterEvent = {
    ...event,
    id: `evt-${Date.now()}`,
    registeredIds: [],
  }

  const chapter = { ...data.chapter, events: [...data.chapter.events, newEvent] }
  saveChapter(chapter)
  return { ...data, chapter }
}

export function resetDemoData(
  uid: string,
  displayName: string,
  email: string,
  role: UserRole,
  photoURL?: string,
): AppData {
  localStorage.removeItem(CHAPTER_KEY)
  localStorage.removeItem(profileKey(uid))
  localStorage.removeItem(initializedKey(uid))
  return initializeUser(uid, displayName, email, role, photoURL)
}

export function resetAllDemo(): void {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith('fbla:'))
  keys.forEach((k) => localStorage.removeItem(k))
  window.dispatchEvent(new Event('fbla-storage'))
}
