import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { User } from 'firebase/auth'
import {
  isFirebaseConfigured,
  signInWithGoogle,
  signOut as firebaseSignOut,
  subscribeAuth,
} from '@/lib/firebase'
import { parseEmails } from '@/lib/utils'
import type { UserRole } from '@/types'

export interface AuthUser {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  role: UserRole
  isDemo?: boolean
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  firebaseEnabled: boolean
  signInGoogle: () => Promise<void>
  signInDemo: (role?: UserRole) => void
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

function readDemoUser(): AuthUser | null {
  const saved = sessionStorage.getItem('fbla:demo-user')
  return saved ? (JSON.parse(saved) as AuthUser) : null
}

function resolveRole(email: string): UserRole {
  const normalized = email.toLowerCase()
  const admins = parseEmails(import.meta.env.VITE_ADMIN_EMAILS)
  const officers = parseEmails(import.meta.env.VITE_OFFICER_EMAILS)
  if (admins.includes(normalized)) return 'admin'
  if (officers.includes(normalized)) return 'officer'
  return 'member'
}

function mapFirebaseUser(fbUser: User): AuthUser {
  return {
    uid: fbUser.uid,
    email: fbUser.email ?? '',
    displayName: fbUser.displayName ?? fbUser.email?.split('@')[0] ?? 'Member',
    photoURL: fbUser.photoURL ?? undefined,
    role: resolveRole(fbUser.email ?? ''),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const firebaseEnabled = isFirebaseConfigured()
  const [user, setUser] = useState<AuthUser | null>(() =>
    firebaseEnabled ? null : readDemoUser(),
  )
  const [loading, setLoading] = useState(() => firebaseEnabled)

  useEffect(() => {
    if (!firebaseEnabled) return

    return subscribeAuth((fbUser) => {
      if (fbUser) {
        setUser(mapFirebaseUser(fbUser))
        sessionStorage.removeItem('fbla:demo-user')
      } else {
        const saved = sessionStorage.getItem('fbla:demo-user')
        setUser(saved ? (JSON.parse(saved) as AuthUser) : null)
      }
      setLoading(false)
    })
  }, [firebaseEnabled])

  const signInGoogle = useCallback(async () => {
    const fbUser = await signInWithGoogle()
    setUser(mapFirebaseUser(fbUser))
  }, [])

  const signInDemo = useCallback((role: UserRole = 'member') => {
    const demoUser: AuthUser = {
      uid: `demo-${role}`,
      email: role === 'admin' ? 'admin@fbla.demo' : role === 'officer' ? 'officer@fbla.demo' : 'member@fbla.demo',
      displayName: role === 'admin' ? 'Demo Admin' : role === 'officer' ? 'Demo Officer' : 'Demo Member',
      role,
      isDemo: true,
    }
    sessionStorage.setItem('fbla:demo-user', JSON.stringify(demoUser))
    setUser(demoUser)
  }, [])

  const signOut = useCallback(async () => {
    sessionStorage.removeItem('fbla:demo-user')
    setUser(null)
    if (firebaseEnabled) await firebaseSignOut()
  }, [firebaseEnabled])

  const value = useMemo(
    () => ({ user, loading, firebaseEnabled, signInGoogle, signInDemo, signOut }),
    [user, loading, firebaseEnabled, signInGoogle, signInDemo, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
