import type { AuthUser } from '@/contexts/AuthContext'
import { isSupabaseConfigured } from '@/lib/supabase'
import * as sb from '@/lib/supabase-store'
import * as local from '@/lib/storage'
import type { AppData, ChapterEvent, UserRole } from '@/types'

export { isSupabaseConfigured }

export function storageLabel(): 'supabase' | 'localStorage' {
  return isSupabaseConfigured() ? 'supabase' : 'localStorage'
}

function prefersLocalStorage(user: AuthUser): boolean {
  return user.isDemo || !isSupabaseConfigured()
}

export async function loadUserData(user: AuthUser): Promise<AppData> {
  if (prefersLocalStorage(user)) {
    return (
      local.loadAppData(user.uid) ??
      local.initializeUser(user.uid, user.displayName, user.email, user.role, user.photoURL)
    )
  }
  return sb.sbLoadUserData(user)
}

export async function registerForEvent(user: AuthUser, eventId: string): Promise<AppData | null> {
  if (prefersLocalStorage(user)) return local.registerForEvent(user.uid, eventId)
  return sb.sbRegisterForEvent(user.uid, eventId, false)
}

export async function enterCompetition(
  user: AuthUser,
  competitionId: string,
  placement?: 1 | 2 | 3,
): Promise<AppData | null> {
  if (prefersLocalStorage(user)) return local.enterCompetition(user.uid, competitionId, placement)
  return sb.sbEnterCompetition(user.uid, competitionId, placement, false)
}

export async function updateDisplayName(user: AuthUser, displayName: string): Promise<AppData | null> {
  if (prefersLocalStorage(user)) return local.updateDisplayName(user.uid, displayName)
  return sb.sbUpdateDisplayName(user.uid, displayName, false)
}

export async function addEvent(
  user: AuthUser,
  event: Omit<ChapterEvent, 'id' | 'registeredIds'>,
): Promise<AppData | null> {
  if (prefersLocalStorage(user)) return local.addEvent(user.uid, event)
  return sb.sbAddEvent(user.uid, event, false)
}

export async function resetDemo(user: AuthUser): Promise<AppData> {
  if (user.role === 'admin') {
    if (prefersLocalStorage(user)) {
      local.resetAllDemo()
      return local.initializeUser(
        user.uid,
        user.displayName,
        user.email,
        user.role as UserRole,
        user.photoURL,
      )
    }
    await sb.sbResetAllDemo()
    return sb.sbInitializeUser(
      user.uid,
      user.displayName,
      user.email,
      user.role as UserRole,
      user.photoURL,
      false,
    )
  }

  if (prefersLocalStorage(user)) {
    return local.resetDemoData(
      user.uid,
      user.displayName,
      user.email,
      user.role,
      user.photoURL,
    )
  }
  return sb.sbResetDemoData(
    user.uid,
    user.displayName,
    user.email,
    user.role,
    user.photoURL,
  )
}
