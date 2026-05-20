import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AppShell } from '@/components/layout/AppShell'

const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })))
const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const Events = lazy(() => import('@/pages/Events').then((m) => ({ default: m.Events })))
const Competitions = lazy(() =>
  import('@/pages/Competitions').then((m) => ({ default: m.Competitions })),
)
const Achievements = lazy(() =>
  import('@/pages/Achievements').then((m) => ({ default: m.Achievements })),
)
const Profile = lazy(() => import('@/pages/Profile').then((m) => ({ default: m.Profile })))

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
    </div>
  )
}

function SuspensePage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <SuspensePage>
            <HomePage />
          </SuspensePage>
        }
      />
      <Route path="/portal" element={<Navigate to="/" replace />} />
      <Route path="/equilibrium" element={<Navigate to="/" replace />} />
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={
            <SuspensePage>
              <Dashboard />
            </SuspensePage>
          }
        />
        <Route
          path="/events"
          element={
            <SuspensePage>
              <Events />
            </SuspensePage>
          }
        />
        <Route
          path="/competitions"
          element={
            <SuspensePage>
              <Competitions />
            </SuspensePage>
          }
        />
        <Route
          path="/achievements"
          element={
            <SuspensePage>
              <Achievements />
            </SuspensePage>
          }
        />
        <Route
          path="/profile"
          element={
            <SuspensePage>
              <Profile />
            </SuspensePage>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
