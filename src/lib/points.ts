import { ACHIEVEMENTS } from '@/data/seed'
import type { Achievement, ChapterEvent, MemberProfile } from '@/types'

export const POINT_RULES = {
  eventRegister: 50,
  earlyRegister: 25,
  competitionEnter: 75,
  placement1: 200,
  placement2: 150,
  placement3: 100,
} as const

export function isEarlyRegistration(eventDate: string): boolean {
  const days = (new Date(eventDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  return days >= 30
}

export function calculateCompetitionPoints(
  placements: Record<string, 1 | 2 | 3>,
): number {
  return Object.values(placements).reduce((sum, p) => {
    if (p === 1) return sum + POINT_RULES.placement1
    if (p === 2) return sum + POINT_RULES.placement2
    return sum + POINT_RULES.placement3
  }, 0)
}

export function calculateEventPoints(
  registeredEventIds: string[],
  events: ChapterEvent[],
): number {
  let total = registeredEventIds.length * POINT_RULES.eventRegister
  for (const id of registeredEventIds) {
    const evt = events.find((e) => e.id === id)
    if (evt && isEarlyRegistration(evt.date)) {
      total += POINT_RULES.earlyRegister
    }
    if (id === 'evt-slc') total += 25
    if (evt?.id === 'evt-network') total += 15
  }
  return total
}

export function checkAchievement(
  achievement: Achievement,
  profile: MemberProfile,
): boolean {
  switch (achievement.type) {
    case 'points':
      return profile.points >= achievement.threshold
    case 'events':
      return profile.registeredEventIds.length >= achievement.threshold
    case 'competitions':
      return profile.enteredCompetitionIds.length >= achievement.threshold
    case 'placement':
      return Object.keys(profile.competitionPlacements).length >= achievement.threshold
    default:
      return false
  }
}

export function computeAchievements(profile: MemberProfile): string[] {
  return ACHIEVEMENTS.filter((a) => checkAchievement(a, profile)).map((a) => a.id)
}

export function recalculateProfile(
  profile: MemberProfile,
  events: ChapterEvent[],
): MemberProfile {
  const competitionPoints =
    profile.enteredCompetitionIds.length * POINT_RULES.competitionEnter +
    calculateCompetitionPoints(profile.competitionPlacements)

  const eventPoints = calculateEventPoints(profile.registeredEventIds, events)
  const basePoints = 120
  const points = basePoints + eventPoints + competitionPoints
  const achievements = computeAchievements({
    ...profile,
    points,
    competitionPoints,
  })

  const lastHistory = profile.pointsHistory[profile.pointsHistory.length - 1]
  const today = new Date().toISOString().slice(0, 10)
  const lastDate = lastHistory?.date.slice(0, 10)
  const pointsHistory =
    lastDate !== today
      ? [
          ...profile.pointsHistory.slice(-11),
          { date: new Date().toISOString(), points },
        ]
      : profile.pointsHistory.map((h, i) =>
          i === profile.pointsHistory.length - 1 ? { ...h, points } : h,
        )

  return {
    ...profile,
    points,
    competitionPoints,
    achievements,
    pointsHistory,
  }
}
