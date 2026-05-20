import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '@/hooks/useAuth'
import {
  addEvent,
  enterCompetition,
  isSupabaseConfigured,
  loadUserData,
  registerForEvent,
  resetDemo,
  storageLabel,
  updateDisplayName,
} from '@/lib/data-store'
import type { AppData, ChapterEvent } from '@/types'
import { toast } from 'sonner'

interface DataContextValue {
  data: AppData | null
  loading: boolean
  storageBackend: 'supabase' | 'localStorage'
  registerEvent: (eventId: string) => void
  enterComp: (competitionId: string, placement?: 1 | 2 | 3) => void
  setDisplayName: (name: string) => void
  createEvent: (event: Omit<ChapterEvent, 'id' | 'registeredIds'>) => void
  resetDemo: () => void
  refresh: () => void
  rank: number
}

export const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [data, setData] = useState<AppData | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!user) {
      setData(null)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const next = await loadUserData(user)
      setData(next)
    } catch (e) {
      console.error(e)
      toast.error(e instanceof Error ? e.message : 'Failed to load chapter data')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [refresh])

  useEffect(() => {
    if (!user?.isDemo && isSupabaseConfigured()) return
    const onStorage = () => void refresh()
    window.addEventListener('fbla-storage', onStorage)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('fbla-storage', onStorage)
      window.removeEventListener('storage', onStorage)
    }
  }, [refresh, user?.isDemo])

  const runMutation = useCallback(
    async (fn: () => Promise<AppData | null>) => {
      if (!user) return
      try {
        const updated = await fn()
        if (updated) setData(updated)
      } catch (e) {
        console.error(e)
        toast.error(e instanceof Error ? e.message : 'Save failed')
      }
    },
    [user],
  )

  const registerEventHandler = useCallback(
    (eventId: string) => {
      if (!user) return
      void runMutation(() => registerForEvent(user, eventId))
    },
    [user, runMutation],
  )

  const enterComp = useCallback(
    (competitionId: string, placement?: 1 | 2 | 3) => {
      if (!user) return
      void runMutation(() => enterCompetition(user, competitionId, placement))
    },
    [user, runMutation],
  )

  const setDisplayName = useCallback(
    (name: string) => {
      if (!user) return
      void runMutation(() => updateDisplayName(user, name))
    },
    [user, runMutation],
  )

  const createEvent = useCallback(
    (event: Omit<ChapterEvent, 'id' | 'registeredIds'>) => {
      if (!user) return
      void runMutation(() => addEvent(user, event))
    },
    [user, runMutation],
  )

  const resetDemoHandler = useCallback(() => {
    if (!user) return
    void (async () => {
      setLoading(true)
      try {
        const updated = await resetDemo(user)
        setData(updated)
      } catch (e) {
        console.error(e)
        toast.error(e instanceof Error ? e.message : 'Reset failed')
      } finally {
        setLoading(false)
      }
    })()
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
      storageBackend: storageLabel(),
      registerEvent: registerEventHandler,
      enterComp,
      setDisplayName,
      createEvent,
      resetDemo: resetDemoHandler,
      refresh: () => void refresh(),
      rank,
    }),
    [
      data,
      loading,
      registerEventHandler,
      enterComp,
      setDisplayName,
      createEvent,
      resetDemoHandler,
      refresh,
      rank,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
