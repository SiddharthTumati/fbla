import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { LogoFrame } from '@/components/LogoFrame'
import { HeroCollage } from '@/components/HeroCollage'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'
import { toast } from 'sonner'

const DEMO_ENABLED = import.meta.env.VITE_ENABLE_DEMO !== 'false'

export function HomePage() {
  const { user, signInGoogle, signInDemo, authConfigured, loading } = useAuth()
  const { theme, config } = useTheme()
  const navigate = useNavigate()
  const [googleLoading, setGoogleLoading] = useState(false)

  const enterPortal = (role: 'member' | 'officer' | 'admin' = 'member') => {
    signInDemo(role)
    navigate('/dashboard')
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    try {
      await signInGoogle()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Google sign in failed')
      setGoogleLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="homepage flex h-screen items-center justify-center">
        <LogoFrame src={config.logo} alt={config.logoAlt} variant="hero" />
      </div>
    )
  }

  return (
    <div className="homepage" style={{ fontFamily: config.fonts.body }}>
      <section className="homepage-hero relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        <HeroCollage />
        <div className="hero-overlay absolute inset-0" aria-hidden />

        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center animate-hero-desc" key={theme}>
          <h1
            className="hero-headline text-white"
            style={{ fontFamily: config.fonts.display }}
          >
            {config.heroTitle}{' '}
            <span className="text-[var(--brand-accent)]">{config.heroHighlight}</span>
          </h1>
          <p className="hero-subline mt-4 text-white/75">{config.heroDescription}</p>

          <div className="mt-8 flex flex-col items-center gap-4">
            {user ? (
              <button type="button" onClick={() => navigate('/dashboard')} className="pro-btn-primary pro-btn-lg">
                <LayoutDashboard className="h-4 w-4" />
                Open Portal
              </button>
            ) : (
              <>
                {authConfigured ? (
                  <>
                    <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
                      <Link to="/login" className="pro-btn-primary pro-btn-lg flex-1 text-center">
                        Sign in
                      </Link>
                      <Link
                        to="/signup"
                        className="pro-btn-lg flex-1 rounded-lg border border-white/25 bg-white/10 text-center text-white transition hover:bg-white/15"
                      >
                        Create account
                      </Link>
                    </div>
                    <GoogleSignInButton onClick={handleGoogle} loading={googleLoading} />
                  </>
                ) : import.meta.env.DEV ? (
                  <Link
                    to="/dev/setup"
                    className="pro-btn-primary pro-btn-lg w-full max-w-sm text-center"
                  >
                    Connect Supabase (localhost)
                  </Link>
                ) : (
                  <p className="max-w-sm text-xs text-white/50">
                    Add Supabase keys in <code className="text-white/70">.env.local</code> to enable accounts.
                  </p>
                )}

                {DEMO_ENABLED && (
                  <>
                    <div className="flex w-full max-w-sm items-center gap-3 text-xs text-white/45">
                      <span className="h-px flex-1 bg-white/15" />
                      or try demo
                      <span className="h-px flex-1 bg-white/15" />
                    </div>

                    <button
                      type="button"
                      onClick={() => enterPortal('member')}
                      className="pro-btn-primary pro-btn-lg w-full max-w-sm"
                    >
                      {config.ctaLabel}
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <div className="flex gap-2">
                      {(['officer', 'admin'] as const).map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => enterPortal(role)}
                          className="rounded-md border border-white/20 px-3 py-1.5 text-xs capitalize text-white/60 transition hover:border-white/35 hover:text-white"
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
