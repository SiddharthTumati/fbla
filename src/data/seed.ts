import type { Achievement, ChapterState, Competition, MemberProfile } from '@/types'

export const CHAPTER_NAME =
  import.meta.env.VITE_CHAPTER_NAME || 'Marvin Ridge High School FBLA'

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-step', title: 'First Step', description: 'Earn your first 100 points', icon: 'footprints', pointsRequired: 0, type: 'points', threshold: 100 },
  { id: 'go-getter', title: 'Go Getter', description: 'Reach 500 total points', icon: 'zap', pointsRequired: 0, type: 'points', threshold: 500 },
  { id: 'elite', title: 'Elite Member', description: 'Reach 1,000 total points', icon: 'crown', pointsRequired: 0, type: 'points', threshold: 1000 },
  { id: 'event-goer', title: 'Event Goer', description: 'Register for 3 events', icon: 'calendar', pointsRequired: 0, type: 'events', threshold: 3 },
  { id: 'conference-pro', title: 'Conference Pro', description: 'Register for 5 events', icon: 'ticket', pointsRequired: 0, type: 'events', threshold: 5 },
  { id: 'competitor', title: 'Competitor', description: 'Enter 2 competitions', icon: 'trophy', pointsRequired: 0, type: 'competitions', threshold: 2 },
  { id: 'champion', title: 'Champion', description: 'Place top 3 in a competition', icon: 'medal', pointsRequired: 0, type: 'placement', threshold: 1 },
  { id: 'early-bird', title: 'Early Bird', description: 'Register for an event 30+ days ahead', icon: 'sunrise', pointsRequired: 0, type: 'events', threshold: 1 },
  { id: 'leaderboard', title: 'Top 10', description: 'Reach top 10 on chapter leaderboard', icon: 'bar-chart', pointsRequired: 0, type: 'points', threshold: 800 },
  { id: 'dedicated', title: 'Dedicated', description: 'Enter 5 competitions', icon: 'target', pointsRequired: 0, type: 'competitions', threshold: 5 },
  { id: 'networker', title: 'Networker', description: 'Attend a networking workshop', icon: 'users', pointsRequired: 0, type: 'events', threshold: 1 },
  { id: 'state-bound', title: 'State Bound', description: 'Register for State Leadership Conference', icon: 'map-pin', pointsRequired: 0, type: 'events', threshold: 1 },
  { id: 'officer-ready', title: 'Officer Ready', description: 'Earn 750+ points', icon: 'shield', pointsRequired: 0, type: 'points', threshold: 750 },
  { id: 'triple-threat', title: 'Triple Threat', description: 'Points from events and competitions', icon: 'flame', pointsRequired: 0, type: 'competitions', threshold: 3 },
  { id: 'legend', title: 'Chapter Legend', description: 'Reach 1,500 total points', icon: 'star', pointsRequired: 0, type: 'points', threshold: 1500 },
]

export const COMPETITIONS: Competition[] = [
  { id: 'biz-plan', name: 'Business Plan', category: 'Presentation', maxPoints: 300 },
  { id: 'coding', name: 'Coding & Programming', category: 'Technology', maxPoints: 300 },
  { id: 'accounting', name: 'Accounting I', category: 'Objective Test', maxPoints: 250 },
  { id: 'marketing', name: 'Marketing', category: 'Presentation', maxPoints: 300 },
  { id: 'entrepreneurship', name: 'Entrepreneurship', category: 'Team', maxPoints: 300 },
  { id: 'graphic-design', name: 'Graphic Design', category: 'Production', maxPoints: 250 },
  { id: 'public-speaking', name: 'Public Speaking', category: 'Presentation', maxPoints: 300 },
  { id: 'business-ethics', name: 'Business Ethics', category: 'Case Study', maxPoints: 250 },
  { id: 'economics', name: 'Economics', category: 'Objective Test', maxPoints: 250 },
  { id: 'financial-literacy', name: 'Financial Literacy', category: 'Objective Test', maxPoints: 250 },
  { id: 'journalism', name: 'Journalism', category: 'Production', maxPoints: 250 },
  { id: 'hospitality', name: 'Hospitality Management', category: 'Case Study', maxPoints: 250 },
]

function futureDate(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

function pastDate(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

export function createSeedChapter(): ChapterState {
  const members = [
    { id: 'seed-1', name: 'Alex Chen', points: 1420, competitionPoints: 550 },
    { id: 'seed-2', name: 'Jordan Martinez', points: 1280, competitionPoints: 480 },
    { id: 'seed-3', name: 'Sam Williams', points: 1150, competitionPoints: 420 },
    { id: 'seed-4', name: 'Taylor Brooks', points: 980, competitionPoints: 380 },
    { id: 'seed-5', name: 'Riley Johnson', points: 870, competitionPoints: 320 },
    { id: 'seed-6', name: 'Casey Nguyen', points: 760, competitionPoints: 290 },
    { id: 'seed-7', name: 'Morgan Lee', points: 640, competitionPoints: 240 },
    { id: 'seed-8', name: 'Jamie Patel', points: 520, competitionPoints: 200 },
  ]

  return {
    events: [
      {
        id: 'evt-slc',
        title: 'State Leadership Conference',
        description: 'Annual state conference with competitions, workshops, and networking.',
        date: futureDate(45),
        location: 'Charlotte Convention Center',
        capacity: 120,
        registeredIds: ['seed-1', 'seed-2', 'seed-3'],
        category: 'conference',
      },
      {
        id: 'evt-fall',
        title: 'Fall Leadership Workshop',
        description: 'Build leadership skills and meet chapter officers.',
        date: futureDate(14),
        location: 'Riverside High — Room 204',
        capacity: 40,
        registeredIds: ['seed-1', 'seed-4', 'seed-5'],
        category: 'workshop',
      },
      {
        id: 'evt-network',
        title: 'Business Networking Night',
        description: 'Connect with local business professionals and alumni.',
        date: futureDate(21),
        location: 'Downtown Chamber of Commerce',
        capacity: 50,
        registeredIds: ['seed-2', 'seed-6'],
        category: 'workshop',
      },
      {
        id: 'evt-dues',
        title: 'Membership Dues Deadline',
        description: 'Submit national and state dues to remain eligible for competitions.',
        date: futureDate(7),
        location: 'Online — Member Portal',
        capacity: 200,
        registeredIds: [],
        category: 'deadline',
      },
      {
        id: 'evt-prep',
        title: 'Competition Prep Session',
        description: 'Officers lead breakout sessions by event category.',
        date: futureDate(28),
        location: 'Riverside High — Library',
        capacity: 60,
        registeredIds: ['seed-3', 'seed-7'],
        category: 'meeting',
      },
      {
        id: 'evt-community',
        title: 'Community Service Day',
        description: 'Chapter volunteer project — earn service hours and points.',
        date: futureDate(35),
        location: 'Riverside Community Center',
        capacity: 30,
        registeredIds: ['seed-5', 'seed-8'],
        category: 'meeting',
      },
      {
        id: 'evt-winter',
        title: 'Winter Social & Awards',
        description: 'Celebrate semester achievements and preview spring events.',
        date: pastDate(30),
        location: 'Riverside High — Cafeteria',
        capacity: 80,
        registeredIds: ['seed-1', 'seed-2', 'seed-3', 'seed-4'],
        category: 'meeting',
      },
    ],
    competitions: COMPETITIONS,
    leaderboard: members.map((m) => ({
      id: m.id,
      name: m.name,
      points: m.points,
      competitionPoints: m.competitionPoints,
    })),
    activities: [
      { id: 'act-1', message: 'Alex Chen registered for State Leadership Conference', timestamp: pastDate(2), type: 'event' },
      { id: 'act-2', message: 'Jordan Martinez placed 2nd in Business Plan', timestamp: pastDate(5), type: 'competition' },
      { id: 'act-3', message: 'Sam Williams unlocked Elite Member achievement', timestamp: pastDate(7), type: 'achievement' },
      { id: 'act-4', message: 'Chapter meeting reminder sent to all members', timestamp: pastDate(1), type: 'system' },
      { id: 'act-5', message: 'Taylor Brooks entered Coding & Programming', timestamp: pastDate(3), type: 'competition' },
    ],
  }
}

export function createInitialProfile(
  uid: string,
  displayName: string,
  email: string,
  role: MemberProfile['role'],
  photoURL?: string,
): MemberProfile {
  const history = Array.from({ length: 8 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (7 - i))
    return { date: d.toISOString(), points: Math.floor(50 + i * 30 + Math.random() * 40) }
  })

  return {
    uid,
    displayName,
    email,
    photoURL,
    role,
    points: 120,
    competitionPoints: 0,
    achievements: [],
    registeredEventIds: [],
    enteredCompetitionIds: [],
    competitionPlacements: {},
    pointsHistory: history,
  }
}
