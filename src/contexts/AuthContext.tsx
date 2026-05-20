import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User as SupabaseUser } from '@supabase/supabase-js'
import {
  getSession,
  isAuthConfigured,
  isEmailProvider,
  mapAuthUser,
  onAuthStateChange,
  resetPasswordForEmail,
  signInWithEmail,
  signInWithGoogle,
  signOut as authSignOut,
  signUpWithEmail,
  updatePassword,
} from '@/lib/auth'
import { ensureMemberProfile, sbGetMemberProfile } from '@/lib/supabase-store'
import { resolveRoleForUser } from '@/lib/member-profile'
import type { UserRole } from '@/types'

export interface AuthUser {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  role: UserRole
  isDemo?: boolean
  authProvider?: string
}

interface AuthContextValue {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  authConfigured: boolean
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signInGoogle: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  signInDemo: (role?: UserRole) => void
  signOut: () => Promise<void>
  canChangePassword: boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)

const DEMO_ENABLED = import.meta.env.VITE_ENABLE_DEMO !== 'false'

function readDemoUser(): AuthUser | null {
  const saved = sessionStorage.getItem('fbla:demo-user')
  return saved ? (JSON.parse(saved) as AuthUser) : null
}

async function mapSessionToAuthUser(
  sessionUser: SupabaseUser,
): Promise<AuthUser> {
  const base = mapAuthUser(sessionUser)
  let profile = await sbGetMemberProfile(sessionUser.id)
  if (!profile) {
    profile = await ensureMemberProfile(
      base.uid,
      base.displayName,
      base.email,
      'member',
      base.photoURL,
    )
  }
  return {
    uid: base.uid,
    email: base.email,
    displayName: profile.displayName,
    photoURL: profile.photoURL ?? base.photoURL,
    role: resolveRoleForUser(base.email, profile.role),
    authProvider: base.provider,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const authConfigured = isAuthConfigured()
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<AuthUser | null>(() =>
    authConfigured ? null : readDemoUser(),
  )
  const [loading, setLoading] = useState(() => authConfigured)

  const applySession = useCallback(async (next: Session | null) => {
    setSession(next)
    if (next?.user) {
      const mapped = await mapSessionToAuthUser(next.user)
      setUser(mapped)
      sessionStorage.removeItem('fbla:demo-user')
    } else {
      setUser(readDemoUser())
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!authConfigured) return

    getSession().then((s) => applySession(s))

    return onAuthStateChange((_event, next) => {
      void applySession(next)
    })
  }, [authConfigured, applySession])

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      const s = await signUpWithEmail(email, password, displayName)
      if (s) await applySession(s)
    },
    [applySession],
  )

  const signInWithEmailHandler = useCallback(
    async (email: string, password: string) => {
      const s = await signInWithEmail(email, password)
      if (s) await applySession(s)
    },
    [applySession],
  )

  const signInGoogle = useCallback(async () => {
    await signInWithGoogle()
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    await resetPasswordForEmail(email)
  }, [])

  const updatePasswordHandler = useCallback(async (password: string) => {
    await updatePassword(password)
  }, [])

  const signInDemo = useCallback((role: UserRole = 'member') => {
    if (!DEMO_ENABLED) return
    const demoUser: AuthUser = {
      uid: `demo-${role}`,
      email: role === 'admin' ? 'admin@fbla.demo' : role === 'officer' ? 'officer@fbla.demo' : 'member@fbla.demo',
      displayName: role === 'admin' ? 'Demo Admin' : role === 'officer' ? 'Demo Officer' : 'Demo Member',
      role,
      isDemo: true,
    }
    sessionStorage.setItem('fbla:demo-user', JSON.stringify(demoUser))
    setUser(demoUser)
    setSession(null)
  }, [])

  const signOut = useCallback(async () => {
    sessionStorage.removeItem('fbla:demo-user')
    setUser(null)
    setSession(null)
    if (authConfigured) await authSignOut()
  }, [authConfigured])

  const canChangePassword = Boolean(session?.user && isEmailProvider(session.user))

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      authConfigured,
      signUp,
      signInWithEmail: signInWithEmailHandler,
      signInGoogle,
      resetPassword,
      updatePassword: updatePasswordHandler,
      signInDemo,
      signOut,
      canChangePassword,
    }),
    [
      user,
      session,
      loading,
      authConfigured,
      signUp,
      signInWithEmailHandler,
      signInGoogle,
      resetPassword,
      updatePasswordHandler,
      signInDemo,
      signOut,
      canChangePassword,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
