import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { DataProvider } from '@/contexts/DataContext'
import { useAuth } from '@/hooks/useAuth'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="themed-portal flex min-h-screen items-center justify-center bg-[var(--surface-base)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--brand-accent)] border-t-transparent" />
      </div>
    )
  }

  if (!user) return <Navigate to="/" replace />

  return <DataProvider key={user.uid}>{children}</DataProvider>
}
