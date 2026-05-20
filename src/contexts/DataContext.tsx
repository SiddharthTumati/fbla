import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  addEvent,
  enterCompetition,
  initializeUser,
  loadAppData,
  registerForEvent,
  resetDemoData,
  resetAllDemo,
  updateDisplayName,
} from '@/lib/storage'
import type { AppData, ChapterEvent, UserRole } from '@/types'

interface DataContextValue {
  data: AppData | null
  loading: boolean
  registerEvent: (eventId: string) => void
  enterComp: (competitionId: string, placement?: 1 | 2 | 3) => void
  setDisplayName: (name: string) => void
  createEvent: (event: Omit<ChapterEvent, 'id' | 'registeredIds'>) => void
  resetDemo: () => void
  refresh: () => void
  rank: number
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [data, setData] = useState<AppData | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    if (!user) {
      setData(null)
      setLoading(false)
      return
    }
    const existing = loadAppData(user.uid)
    if (existing) {
      setData(existing)
    } else {
      setData(
        initializeUser(
          user.uid,
          user.displayName,
          user.email,
          user.role,
          user.photoURL,
        ),
      )
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    setLoading(true)
    refresh()
  }, [refresh])

  useEffect(() => {
    const onStorage = () => refresh()
    window.addEventListener('fbla-storage', onStorage)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('fbla-storage', onStorage)
      window.removeEventListener('storage', onStorage)
    }
  }, [refresh])

  const registerEvent = useCallback(
    (eventId: string) => {
      if (!user) return
      const updated = registerForEvent(user.uid, eventId)
      if (updated) setData(updated)
    },
    [user],
  )

  const enterComp = useCallback(
    (competitionId: string, placement?: 1 | 2 | 3) => {
      if (!user) return
      const updated = enterCompetition(user.uid, competitionId, placement)
      if (updated) setData(updated)
    },
    [user],
  )

  const setDisplayName = useCallback(
    (name: string) => {
      if (!user) return
      const updated = updateDisplayName(user.uid, name)
      if (updated) setData(updated)
    },
    [user],
  )

  const createEvent = useCallback(
    (event: Omit<ChapterEvent, 'id' | 'registeredIds'>) => {
      if (!user) return
      const updated = addEvent(user.uid, event)
      if (updated) setData(updated)
    },
    [user],
  )

  const resetDemo = useCallback(() => {
    if (!user) return
    if (user.role === 'admin') {
      resetAllDemo()
      const updated = initializeUser(
        user.uid,
        user.displayName,
        user.email,
        user.role as UserRole,
        user.photoURL,
      )
      setData(updated)
    } else {
      const updated = resetDemoData(
        user.uid,
        user.displayName,
        user.email,
        user.role,
        user.photoURL,
      )
      setData(updated)
    }
  }, [user])

  const rank = useMemo(() => {
    if (!data) return 0
    const sorted = [...data.chapter.leaderboard].sort((a, b) => b.points - a.points)
    const idx = sorted.findIndex((e) => e.id === data.profile.uid || e.isCurrentUser)
    return idx >= 0 ? idx + 1 : sorted.length + 1
  }, [data])

  const value = useMemo(
    () => ({
      data,
      loading,
      registerEvent,
      enterComp,
      setDisplayName,
      createEvent,
      resetDemo,
      refresh,
      rank,
    }),
    [data, loading, registerEvent, enterComp, setDisplayName, createEvent, resetDemo, refresh, rank],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
