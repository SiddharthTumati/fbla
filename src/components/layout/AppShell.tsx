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
  Home,
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
    <div className="themed-portal flex min-h-screen" style={{ fontFamily: config.fonts.body }}>
      <aside
        className={cn(
          'portal-sidebar fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r backdrop-blur-xl transition-transform lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-[var(--border-default)] px-4">
          <BrandLogo size="sm" showText onDark={false} />
        </div>
        <p
          className="px-4 pt-2 text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)] truncate"
          style={{ fontFamily: config.fonts.display }}
        >
          {config.chapterName}
        </p>

        <nav className="flex-1 space-y-0.5 p-3 pt-4">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="portal-nav-link mb-2 flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)]/60 hover:text-[var(--text-primary)]"
          >
            <Home className="h-5 w-5 shrink-0" />
            Landing Page
          </Link>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'portal-nav-link flex items-center gap-3 px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'portal-nav-link--active'
                    : 'font-medium text-[var(--text-muted)] hover:bg-[var(--surface-muted)]/60 hover:text-[var(--text-primary)]',
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-3 border-t border-[var(--border-default)] p-4">
          <ThemeSwitcher variant="portal" className="w-full justify-center" />
          <div className="portal-card flex items-center gap-3 !p-3">
            <Avatar className="h-10 w-10 border border-[var(--border-default)]">
              <AvatarImage src={user?.photoURL} />
              <AvatarFallback>{user?.displayName?.[0] ?? 'M'}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{user?.displayName}</p>
              <Badge variant={roleBadge} className="mt-1 capitalize text-[10px]">
                {user?.role}
              </Badge>
            </div>
          </div>
          {data && (
            <p className="text-center text-xs text-[var(--text-muted)]">
              <span className="font-semibold text-[var(--brand-accent)]" style={{ fontFamily: config.fonts.display }}>
                {data.profile.points.toLocaleString()}
              </span>{' '}
              pts
            </p>
          )}
          <Button variant="ghost" size="sm" className="w-full text-[var(--text-muted)]" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="portal-header sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b px-4 backdrop-blur-xl lg:px-8">
          <button
            type="button"
            className="text-[var(--text-muted)] lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <p className="hidden flex-1 text-sm text-[var(--text-muted)] lg:block">
            Welcome back,{' '}
            <span className="font-semibold text-[var(--text-primary)]" style={{ fontFamily: config.fonts.display }}>
              {user?.displayName}
            </span>
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="text-[var(--text-muted)]"
            onClick={() => setColorMode(colorMode === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle light mode"
          >
            {colorMode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </header>

        <main className="portal-main flex-1 overflow-auto p-4 pb-24 lg:p-8 lg:pb-8">
          <Outlet />
        </main>

        <nav className="portal-sidebar fixed bottom-0 left-0 right-0 z-20 flex border-t backdrop-blur-xl lg:hidden">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors',
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
