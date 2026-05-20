import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  Trophy,
  Award,
  User,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useData } from '@/hooks/useData'
import { useTheme } from '@/hooks/useTheme'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BrandLogo } from '@/components/BrandLogo'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/events', icon: Calendar, label: 'Events' },
  { to: '/competitions', icon: Trophy, label: 'Competitions' },
  { to: '/achievements', icon: Award, label: 'Achievements' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export function AppShell() {
  const { user, signOut } = useAuth()
  const { data } = useData()
  const { config } = useTheme()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [colorMode, setColorMode] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    document.documentElement.classList.toggle('light', colorMode === 'light')
  }, [colorMode])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const roleBadge = user?.role === 'admin' ? 'admin' : user?.role === 'officer' ? 'success' : 'secondary'

  return (
    <div className="themed-portal flex min-h-screen bg-[var(--surface-base)]">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[var(--border-default)] bg-[var(--surface-raised)]/95 backdrop-blur-xl transition-transform lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-[var(--border-default)] px-4">
          <BrandLogo size="sm" showText onDark={false} />
        </div>
        <p className="px-4 pt-2 text-[10px] text-[var(--text-muted)] truncate">{config.chapterName}</p>

        <nav className="flex-1 space-y-1 p-4">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-colors mb-2"
          >
            View landing
          </Link>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[var(--brand-accent)]/15 text-[var(--brand-accent)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]',
                )
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[var(--border-default)] p-4 space-y-3">
          <ThemeSwitcher variant="portal" className="w-full justify-center" />
          <div className="flex items-center gap-3 rounded-lg bg-[var(--surface-muted)]/50 p-3">
            <Avatar>
              <AvatarImage src={user?.photoURL} />
              <AvatarFallback>{user?.displayName?.[0] ?? 'M'}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.displayName}</p>
              <Badge variant={roleBadge} className="mt-1 capitalize">{user?.role}</Badge>
            </div>
          </div>
          {data && (
            <p className="text-center text-xs text-[var(--text-muted)]">
              <span className="text-brand font-semibold">{data.profile.points}</span> pts
            </p>
          )}
          <Button variant="ghost" size="sm" className="w-full" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className="flex flex-1 flex-col lg:pl-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-[var(--border-default)] bg-[var(--surface-base)]/80 px-4 backdrop-blur-xl lg:px-8">
          <button
            type="button"
            className="lg:hidden text-[var(--text-muted)]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <p className="text-sm text-[var(--text-muted)] hidden lg:block flex-1">
            Welcome back, <span className="font-medium text-[var(--text-primary)]">{user?.displayName}</span>
          </p>
          <div className="hidden sm:block">
            <ThemeSwitcher variant="portal" />
          </div>
          <Button variant="ghost" size="icon" onClick={() => setColorMode(colorMode === 'dark' ? 'light' : 'dark')}>
            {colorMode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-8 pb-24 lg:pb-8">
          <Outlet />
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-20 flex border-t border-[var(--border-default)] bg-[var(--surface-raised)]/95 backdrop-blur-xl lg:hidden">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-1 flex-col items-center gap-1 py-2 text-[10px]',
                  isActive ? 'text-[var(--brand-accent)]' : 'text-[var(--text-muted)]',
                )
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
