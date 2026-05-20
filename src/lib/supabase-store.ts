import type { AuthUser } from '@/contexts/AuthContext'
import { createSeedChapter } from '@/data/seed'
import { getDemoSessionId } from '@/lib/demo-session'
import {
  memberProfileToRow,
  rowToMemberProfile,
  seedProfileRow,
  type MemberProfileRow,
} from '@/lib/member-profile'
import { recalculateProfile } from '@/lib/points'
import { getSupabase } from '@/lib/supabase'
import type { AppData, ChapterEvent, ChapterState, MemberProfile, UserRole } from '@/types'

const DEFAULT_CHAPTER_KEY = 'default'

function sb() {
  const client = getSupabase()
  if (!client) throw new Error('Supabase is not configured')
  return client
}

function chapterSessionId(forDemo: boolean): string {
  return forDemo ? getDemoSessionId() : DEFAULT_CHAPTER_KEY
}

export async function sbGetChapter(forDemo = false): Promise<ChapterState> {
  const sid = chapterSessionId(forDemo)
  const { data, error } = await sb()
    .from('chapters')
    .select('payload')
    .eq('session_id', sid)
    .maybeSingle()

  if (error) throw error
  if (data?.payload) return data.payload as ChapterState

  const seed = createSeedChapter()
  await sbSaveChapter(seed, forDemo)
  return seed
}

export async function sbSaveChapter(chapter: ChapterState, forDemo = false): Promise<void> {
  const sid = chapterSessionId(forDemo)
  const { error } = await sb()
    .from('chapters')
    .upsert({
      session_id: sid,
      chapter_key: sid,
      payload: chapter,
      updated_at: new Date().toISOString(),
    })
  if (error) throw error
}

export async function sbGetMemberProfile(uid: string): Promise<MemberProfile | null> {
  const { data, error } = await sb().from('member_profiles').select('*').eq('id', uid).maybeSingle()
  if (error) throw error
  if (!data) return null
  return rowToMemberProfile(data as MemberProfileRow)
}

export async function sbSaveMemberProfile(profile: MemberProfile): Promise<void> {
  const row = memberProfileToRow(profile)
  const { error } = await sb()
    .from('member_profiles')
    .upsert({
      ...row,
      updated_at: new Date().toISOString(),
    })
  if (error) throw error
}

function updateLeaderboard(
  leaderboard: ChapterState['leaderboard'],
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

export async function ensureMemberProfile(
  uid: string,
  displayName: string,
  email: string,
  role: UserRole,
  photoURL?: string,
): Promise<MemberProfile> {
  let profile = await sbGetMemberProfile(uid)
  if (profile) return profile

  const row = seedProfileRow(uid, displayName, email, role, photoURL)
  const { error } = await sb().from('member_profiles').insert({
    ...row,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
  profile = rowToMemberProfile(row)
  return profile
}

export async function sbInitializeUser(
  uid: string,
  displayName: string,
  email: string,
  role: UserRole,
  photoURL?: string,
  forDemo = false,
): Promise<AppData> {
  const chapter = await sbGetChapter(forDemo)
  let profile = await sbGetMemberProfile(uid)

  if (!profile) {
    profile = await ensureMemberProfile(uid, displayName, email, role, photoURL)
    profile = recalculateProfile(profile, chapter.events)
    await sbSaveMemberProfile(profile)
    const chapterWithUser = {
      ...chapter,
      leaderboard: updateLeaderboard(chapter.leaderboard, profile),
    }
    await sbSaveChapter(chapterWithUser, forDemo)
    return { profile, chapter: chapterWithUser }
  }

  if (profile.role !== role) {
    profile = { ...profile, role }
    await sbSaveMemberProfile(profile)
  }

  return { profile: recalculateProfile(profile, chapter.events), chapter }
}

export async function sbLoadAppData(uid: string, forDemo = false): Promise<AppData | null> {
  const profile = await sbGetMemberProfile(uid)
  if (!profile) return null
  const chapter = await sbGetChapter(forDemo)
  return { profile: recalculateProfile(profile, chapter.events), chapter }
}

export async function sbLoadUserData(user: AuthUser): Promise<AppData> {
  const forDemo = Boolean(user.isDemo)
  return (
    (await sbLoadAppData(user.uid, forDemo)) ??
    (await sbInitializeUser(
      user.uid,
      user.displayName,
      user.email,
      user.role,
      user.photoURL,
      forDemo,
    ))
  )
}

export async function sbRegisterForEvent(uid: string, eventId: string, forDemo = false): Promise<AppData | null> {
  const data = await sbLoadAppData(uid, forDemo)
  if (!data) return null
  const { profile, chapter } = data

  if (profile.registeredEventIds.includes(eventId)) return data

  const event = chapter.events.find((e) => e.id === eventId)
  if (!event || event.registeredIds.length >= event.capacity) return data

  const updatedEvents = chapter.events.map((e) =>
    e.id === eventId ? { ...e, registeredIds: [...e.registeredIds, uid] } : e,
  )

  const updatedProfile = recalculateProfile(
    { ...profile, registeredEventIds: [...profile.registeredEventIds, eventId] },
    updatedEvents,
  )

  const updatedChapter: ChapterState = {
    ...chapter,
    events: updatedEvents,
    activities: [
      {
        id: `act-${Date.now()}`,
        message: `${profile.displayName} registered for ${event.title}`,
        timestamp: new Date().toISOString(),
        type: 'event',
      },
      ...chapter.activities.slice(0, 19),
    ],
  }

  await sbSaveChapter(updatedChapter, forDemo)
  await sbSaveMemberProfile(updatedProfile)
  return { profile: updatedProfile, chapter: updatedChapter }
}

export async function sbEnterCompetition(
  uid: string,
  competitionId: string,
  placement?: 1 | 2 | 3,
  forDemo = false,
): Promise<AppData | null> {
  const data = await sbLoadAppData(uid, forDemo)
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

  const updatedProfile = recalculateProfile(
    { ...profile, enteredCompetitionIds: entered, competitionPlacements: placements },
    chapter.events,
  )

  const updatedChapter: ChapterState = {
    ...chapter,
    leaderboard: updateLeaderboard(chapter.leaderboard, updatedProfile),
    activities: [
      {
        id: `act-${Date.now()}`,
        message: placement
          ? `${profile.displayName} placed ${placement}${placement === 1 ? 'st' : placement === 2 ? 'nd' : 'rd'} in ${comp.name}`
          : `${profile.displayName} entered ${comp.name}`,
        timestamp: new Date().toISOString(),
        type: 'competition',
      },
      ...chapter.activities.slice(0, 19),
    ],
  }

  await sbSaveChapter(updatedChapter, forDemo)
  await sbSaveMemberProfile(updatedProfile)
  return { profile: updatedProfile, chapter: updatedChapter }
}

export async function sbUpdateDisplayName(
  uid: string,
  displayName: string,
  forDemo = false,
): Promise<AppData | null> {
  const data = await sbLoadAppData(uid, forDemo)
  if (!data) return null
  const profile = { ...data.profile, displayName }
  const chapter = {
    ...data.chapter,
    leaderboard: updateLeaderboard(data.chapter.leaderboard, profile),
  }
  await sbSaveMemberProfile(profile)
  await sbSaveChapter(chapter, forDemo)
  return { profile, chapter }
}

export async function sbAddEvent(
  uid: string,
  event: Omit<ChapterEvent, 'id' | 'registeredIds'>,
  forDemo = false,
): Promise<AppData | null> {
  const data = await sbLoadAppData(uid, forDemo)
  if (!data || (data.profile.role !== 'officer' && data.profile.role !== 'admin')) return null

  const newEvent: ChapterEvent = {
    ...event,
    id: `evt-${Date.now()}`,
    registeredIds: [],
  }

  const chapter = { ...data.chapter, events: [...data.chapter.events, newEvent] }
  await sbSaveChapter(chapter, forDemo)
  return { ...data, chapter }
}

export async function sbResetDemoData(
  uid: string,
  displayName: string,
  email: string,
  role: UserRole,
  photoURL?: string,
): Promise<AppData> {
  await sb().from('chapters').delete().eq('session_id', getDemoSessionId())
  await sb().from('member_profiles').delete().eq('id', uid)
  return sbInitializeUser(uid, displayName, email, role, photoURL, true)
}

export async function sbResetAllDemo(): Promise<void> {
  await sb().from('chapters').delete().neq('session_id', DEFAULT_CHAPTER_KEY)
}
