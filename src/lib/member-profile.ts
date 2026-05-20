import { createInitialProfile } from '@/data/seed'
import { parseEmails } from '@/lib/utils'
import type { MemberProfile, UserRole } from '@/types'

export type MemberProfileRow = {
  id: string
  display_name: string
  email: string
  role: string
  photo_url: string | null
  points: number
  competition_points: number
  achievements: string[]
  registered_event_ids: string[]
  entered_competition_ids: string[]
  competition_placements: Record<string, 1 | 2 | 3>
  points_history: { date: string; points: number }[]
}

export function resolveRoleFromEmail(email: string): UserRole {
  const normalized = email.toLowerCase()
  const admins = parseEmails(import.meta.env.VITE_ADMIN_EMAILS)
  const officers = parseEmails(import.meta.env.VITE_OFFICER_EMAILS)
  if (admins.includes(normalized)) return 'admin'
  if (officers.includes(normalized)) return 'officer'
  return 'member'
}

export function resolveRoleForUser(email: string, storedRole: string): UserRole {
  const fromEnv = resolveRoleFromEmail(email)
  if (fromEnv !== 'member') return fromEnv
  if (storedRole === 'admin' || storedRole === 'officer' || storedRole === 'member') {
    return storedRole
  }
  return 'member'
}

export function rowToMemberProfile(row: MemberProfileRow): MemberProfile {
  const role = resolveRoleForUser(row.email, row.role)
  return {
    uid: row.id,
    displayName: row.display_name,
    email: row.email,
    photoURL: row.photo_url ?? undefined,
    role,
    points: row.points,
    competitionPoints: row.competition_points,
    achievements: row.achievements ?? [],
    registeredEventIds: row.registered_event_ids ?? [],
    enteredCompetitionIds: row.entered_competition_ids ?? [],
    competitionPlacements: row.competition_placements ?? {},
    pointsHistory: row.points_history ?? [],
  }
}

export function memberProfileToRow(profile: MemberProfile): Omit<MemberProfileRow, 'id'> & { id: string } {
  return {
    id: profile.uid,
    display_name: profile.displayName,
    email: profile.email,
    role: profile.role,
    photo_url: profile.photoURL ?? null,
    points: profile.points,
    competition_points: profile.competitionPoints,
    achievements: profile.achievements,
    registered_event_ids: profile.registeredEventIds,
    entered_competition_ids: profile.enteredCompetitionIds,
    competition_placements: profile.competitionPlacements,
    points_history: profile.pointsHistory,
  }
}

export function seedProfileRow(
  uid: string,
  displayName: string,
  email: string,
  role: UserRole,
  photoURL?: string,
): MemberProfileRow {
  const profile = createInitialProfile(uid, displayName, email, role, photoURL)
  const row = memberProfileToRow(profile)
  return {
    ...row,
    points: profile.points,
    competition_points: profile.competitionPoints,
    achievements: profile.achievements,
    registered_event_ids: profile.registeredEventIds,
    entered_competition_ids: profile.enteredCompetitionIds,
    competition_placements: profile.competitionPlacements,
    points_history: profile.pointsHistory,
  }
}
