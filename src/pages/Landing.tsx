import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  Trophy,
  Award,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { CHAPTER_NAME } from '@/data/seed'
import { toast } from 'sonner'

const features = [
  { icon: LayoutDashboard, title: 'Live Dashboard', desc: 'Real-time stats, rank, and points tracking' },
  { icon: Calendar, title: 'Event Registration', desc: 'One-click signup for chapter events' },
  { icon: Trophy, title: 'Competition Tracker', desc: 'Leaderboards and placement points' },
  { icon: Award, title: 'Achievements', desc: 'Earn badges as you level up' },
]

export function Landing() {
  const { signInGoogle, signInDemo, firebaseEnabled, loading } = useAuth()
  const navigate = useNavigate()

  const handleGoogle = async () => {
    try {
      await signInGoogle()
      navigate('/dashboard')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Sign in failed')
    }
  }

  const handleDemo = (role: 'member' | 'officer' | 'admin') => {
    signInDemo(role)
    navigate('/dashboard')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/20 font-bold text-gold-400">
            FBLA
          </div>
          <span className="font-semibold text-slate-200">Member Portal</span>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-8 lg:pt-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/20 bg-gold-500/5 px-4 py-1.5 text-sm text-gold-400 mb-6">
            <Sparkles className="h-4 w-4" />
            {CHAPTER_NAME}
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
            Your chapter hub,
            <span className="block text-gold-400">built like a startup</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Register for events, track competitions, climb the leaderboard, and unlock achievements — all in one modern portal.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {firebaseEnabled ? (
              <Button size="lg" onClick={handleGoogle} className="min-w-[220px]">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </Button>
            ) : (
              <p className="text-sm text-amber-400/90 max-w-md">
                Firebase not configured — use demo mode below, or add credentials to <code className="text-gold-400">.env</code>
              </p>
            )}
            <Button size="lg" variant="outline" onClick={() => handleDemo('member')}>
              Try Demo <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {!firebaseEnabled && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => handleDemo('member')}>Member</Button>
              <Button size="sm" variant="ghost" onClick={() => handleDemo('officer')}>Officer</Button>
              <Button size="sm" variant="ghost" onClick={() => handleDemo('admin')}>Admin</Button>
            </div>
          )}
        </div>

        <div className="mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-slate-800/80 bg-navy-900/40 p-6 backdrop-blur transition hover:border-gold-500/30"
            >
              <div className="mb-4 rounded-lg bg-gold-500/10 p-3 w-fit">
                <Icon className="h-6 w-6 text-gold-400" />
              </div>
              <h3 className="font-semibold text-slate-200">{title}</h3>
              <p className="mt-2 text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
