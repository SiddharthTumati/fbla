export type UserRole = 'member' | 'officer' | 'admin'

export interface MemberProfile {
  uid: string
  displayName: string
  email: string
  photoURL?: string
  role: UserRole
  points: number
  competitionPoints: number
  achievements: string[]
  registeredEventIds: string[]
  enteredCompetitionIds: string[]
  competitionPlacements: Record<string, 1 | 2 | 3>
  pointsHistory: { date: string; points: number }[]
}

export interface ChapterEvent {
  id: string
  title: string
  description: string
  date: string
  location: string
  capacity: number
  registeredIds: string[]
  category: 'workshop' | 'conference' | 'deadline' | 'meeting'
}

export interface Competition {
  id: string
  name: string
  category: string
  maxPoints: number
}

export interface LeaderboardEntry {
  id: string
  name: string
  points: number
  competitionPoints: number
  isCurrentUser?: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  pointsRequired: number
  type: 'points' | 'events' | 'competitions' | 'placement'
  threshold: number
}

export interface ActivityItem {
  id: string
  message: string
  timestamp: string
  type: 'event' | 'competition' | 'achievement' | 'system'
}

export interface ChapterState {
  events: ChapterEvent[]
  competitions: Competition[]
  leaderboard: LeaderboardEntry[]
  activities: ActivityItem[]
}

export interface AppData {
  profile: MemberProfile
  chapter: ChapterState
}
