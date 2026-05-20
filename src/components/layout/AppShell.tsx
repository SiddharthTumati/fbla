import { NavLink, Outlet, useNavigate } from 'react-router-dom'
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
import { useAuth } from '@/contexts/AuthContext'
import { useData } from '@/contexts/DataContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CHAPTER_NAME } from '@/data/seed'
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
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const roleBadge = user?.role === 'admin' ? 'admin' : user?.role === 'officer' ? 'success' : 'secondary'

  return (
    <div className="flex min-h-screen bg-navy-950 light:bg-slate-50">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-800/80 bg-navy-900/95 backdrop-blur-xl transition-transform lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-800/80 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/20 text-gold-400 font-bold text-sm">
            FBLA
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-100">Member Portal</p>
            <p className="truncate text-xs text-slate-500">{CHAPTER_NAME}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-gold-500/10 text-gold-400'
                    : 'text-slate-400 hover:bg-navy-800 hover:text-slate-200',
                )
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-800/80 p-4 space-y-3">
          <div className="flex items-center gap-3 rounded-lg bg-navy-800/50 p-3">
            <Avatar>
              <AvatarImage src={user?.photoURL} />
              <AvatarFallback>{user?.displayName?.[0] ?? 'M'}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-200">{user?.displayName}</p>
              <Badge variant={roleBadge} className="mt-1 capitalize">{user?.role}</Badge>
            </div>
          </div>
          {data && (
            <p className="text-center text-xs text-slate-500">
              <span className="text-gold-400 font-semibold">{data.profile.points}</span> pts
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
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-800/80 bg-navy-950/80 px-4 backdrop-blur-xl lg:px-8">
          <button className="lg:hidden text-slate-300" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <p className="text-sm text-slate-400 hidden lg:block">
            Welcome back, <span className="text-slate-200 font-medium">{user?.displayName}</span>
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-8 pb-24 lg:pb-8">
          <Outlet />
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-20 flex border-t border-slate-800/80 bg-navy-900/95 backdrop-blur-xl lg:hidden">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-1 flex-col items-center gap-1 py-2 text-[10px]',
                  isActive ? 'text-gold-400' : 'text-slate-500',
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
