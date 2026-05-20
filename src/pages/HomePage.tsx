import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { LogoFrame } from '@/components/LogoFrame'
import { HeroCollage } from '@/components/HeroCollage'
import { toast } from 'sonner'

export function HomePage() {
  const { user, signInGoogle, signInDemo, firebaseEnabled, loading } = useAuth()
  const { theme, config } = useTheme()
  const navigate = useNavigate()

  const enterPortal = (role: 'member' | 'officer' | 'admin' = 'member') => {
    signInDemo(role)
    navigate('/dashboard')
  }

  const handleGoogle = async () => {
    try {
      await signInGoogle()
      navigate('/dashboard')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Sign in failed')
    }
  }

  const handleCta = () => {
    if (firebaseEnabled) handleGoogle()
    else enterPortal('member')
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
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {user ? (
              <button type="button" onClick={() => navigate('/dashboard')} className="pro-btn-primary pro-btn-lg">
                <LayoutDashboard className="h-4 w-4" />
                Open Portal
              </button>
            ) : (
              <button type="button" onClick={handleCta} className="pro-btn-primary pro-btn-lg">
                {config.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
