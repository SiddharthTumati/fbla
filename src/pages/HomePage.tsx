import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  Trophy,
  Award,
  ArrowRight,
  Users,
  TrendingUp,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { LogoFrame } from '@/components/LogoFrame'
import { Reveal } from '@/components/Reveal'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { toast } from 'sonner'

const BG_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_063509_7d167302-4fd4-480b-8260-18ab572333d4.mp4'

const features = [
  { icon: LayoutDashboard, title: 'Live Dashboard', desc: 'Real-time stats, chapter rank, and points tracking' },
  { icon: Calendar, title: 'Event Registration', desc: 'One-click signup for conferences and workshops' },
  { icon: Trophy, title: 'Competition Tracker', desc: 'Leaderboards and placement points' },
  { icon: Award, title: 'Achievements', desc: 'Unlock badges as you hit milestones' },
]

const LIVE_STATS = [
  { label: 'Chapter members', value: 127, icon: Users },
  { label: 'Events this semester', value: 24, icon: Calendar },
  { label: 'Competition entries', value: 89, icon: Trophy },
  { label: 'Points awarded', value: 14280, icon: TrendingUp },
]

const STAT_DELAYS = { 'top-right': '0.65s', 'bottom-left': '0.8s', 'bottom-right': '0.95s' } as const

function scrollTo(href: string) {
  const id = href.replace('#', '')
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function HeroStat({
  value,
  label,
  position,
}: {
  value: string
  label: string
  position: 'top-right' | 'bottom-left' | 'bottom-right'
}) {
  const posClass = {
    'top-right': 'absolute right-6 md:right-24 top-[14%]',
    'bottom-left': 'absolute left-6 md:left-20 bottom-20 md:bottom-24',
    'bottom-right': 'absolute right-6 md:right-20 bottom-16 md:bottom-20',
  }[position]

  const isTopRight = position === 'top-right'
  const isBottomRight = position === 'bottom-right'

  return (
    <div
      className={`${posClass} animate-stat`}
      style={{ animationDelay: STAT_DELAYS[position] }}
    >
      <div
        className={`flex items-center gap-3 ${isTopRight || isBottomRight ? 'justify-end' : ''}`}
      >
        {isTopRight && (
          <div className="hidden md:block h-px w-24 bg-white/40 rotate-[20deg] transition-opacity duration-500" aria-hidden />
        )}
        {position === 'bottom-left' && (
          <span className="text-4xl md:text-5xl font-medium tracking-tight lowercase">{value}</span>
        )}
        {isBottomRight && (
          <div className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg] transition-opacity duration-500" aria-hidden />
        )}
        {(isTopRight || isBottomRight) && (
          <span className="text-4xl md:text-5xl font-medium tracking-tight lowercase">{value}</span>
        )}
        {position === 'bottom-left' && (
          <div className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg] transition-opacity duration-500" aria-hidden />
        )}
      </div>
      <p
        className={`text-xs md:text-sm text-white/70 mt-1 lowercase ${
          isTopRight || isBottomRight ? 'text-right' : ''
        }`}
      >
        {label}
      </p>
    </div>
  )
}

export function HomePage() {
  const { user, signInGoogle, signInDemo, firebaseEnabled, loading } = useAuth()
  const { theme, config } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [livePoints, setLivePoints] = useState(14280)
  const [heroReady, setHeroReady] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    if (location.hash) scrollTo(location.hash)
  }, [location.hash])

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 50)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setLivePoints((p) => p + Math.floor(Math.random() * 15) + 5)
    }, 3200)
    return () => clearInterval(id)
  }, [])

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

  const pillClass = 'pill-nav flex items-center gap-1 backdrop-blur-md rounded-full'

  if (loading) {
    return (
      <div className="homepage flex h-screen items-center justify-center bg-black">
        <LogoFrame src={config.logo} alt={config.logoAlt} variant="hero" className="animate-logo-float" />
      </div>
    )
  }

  return (
    <div
      className="homepage bg-black text-white"
      style={{ fontFamily: config.fonts.body }}
    >
      <section className="homepage-hero relative h-screen w-full overflow-hidden bg-black">
        <video
          className="hero-video absolute inset-0 w-full h-full object-cover"
          src={BG_VIDEO}
          poster={config.logo}
          autoPlay
          loop
          muted
          playsInline
        />

        <div className="absolute inset-0 bg-black/30 pointer-events-none" />

        <nav className="absolute z-20 px-6 md:px-10 pt-6 top-0 left-0 right-0 flex items-center justify-between gap-3">
          <div className={`${pillClass} items-center gap-3 pl-3 pr-5 py-2 animate-nav-enter`}>
            <LogoFrame src={config.logo} alt={config.logoAlt} variant="nav" showGlow={false} />
            <span className="text-white text-sm font-medium tracking-tight lowercase theme-crossfade" key={theme}>
              {config.brandPill}
            </span>
          </div>

          <div className={`hidden md:flex ${pillClass} px-3 py-2 animate-nav-enter-delay-1`}>
            {config.navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => scrollTo(link.href)}
                className="text-neutral-300 hover:text-white transition-colors duration-300 text-sm px-5 py-2 rounded-full lowercase"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0 animate-nav-enter-delay-2">
            <button
              type="button"
              className="md:hidden p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10"
              onClick={() => setMobileNavOpen((open) => !open)}
              aria-expanded={mobileNavOpen}
              aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <ThemeSwitcher variant="pill" />
            {user ? (
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="hero-cta text-sm font-normal rounded-full px-5 py-3 lowercase shrink-0 flex items-center gap-1.5"
              >
                <LayoutDashboard className="h-4 w-4" />
                portal
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCta}
                className="hero-cta text-sm font-normal rounded-full px-6 py-3 lowercase shrink-0"
              >
                {config.ctaLabel}
              </button>
            )}
          </div>
        </nav>

        {mobileNavOpen && (
          <div className={`md:hidden absolute z-30 left-4 right-4 top-[5.5rem] ${pillClass} flex-col items-stretch p-2 gap-0.5`}>
            {config.navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => {
                  scrollTo(link.href)
                  setMobileNavOpen(false)
                }}
                className="text-neutral-300 hover:text-white transition-colors text-sm px-4 py-3 rounded-full lowercase text-left w-full"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}

        <div className="relative h-full w-full" key={theme}>
          {heroReady &&
            config.heroHeadlines.map((line, i) => (
              <h1
                key={`${theme}-${line.text}`}
                className={`hero-title absolute font-medium text-[14vw] md:text-[13vw] lowercase animate-hero-word ${
                  line.className
                } ${line.script ? 'hero-script' : 'text-white'}`}
                style={{ animationDelay: `${0.12 + i * 0.14}s` }}
              >
                {line.text}
              </h1>
            ))}

          <p className="absolute left-6 md:left-10 top-[46%] max-w-[280px] text-[15px] leading-snug text-white/90 lowercase animate-hero-desc theme-crossfade">
            {config.heroDescription}
          </p>

          {config.stats.map((stat) => (
            <HeroStat key={`${theme}-${stat.position}`} value={stat.value} label={stat.label} position={stat.position} />
          ))}

          {config.markImage && (
            <div className="absolute right-6 md:right-12 top-[28%] hidden lg:block animate-stat" style={{ animationDelay: '0.5s' }}>
              <LogoFrame src={config.markImage} alt={config.tagline} variant="hero" float showGlow />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => scrollTo('#features')}
          className="absolute bottom-6 right-6 z-20 text-white/50 hover:text-white transition-colors duration-300 animate-chevron-smooth"
          aria-label="Scroll down"
        >
          <ChevronDown size={24} />
        </button>

        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black"
          aria-hidden
        />
      </section>

      <div className="relative bg-black">
        <Reveal>
          <section id="stats" className="relative z-10 px-5 sm:px-8 py-16 sm:py-20 border-t border-white/5">
            <div className="max-w-6xl mx-auto">
              <p className="text-white/50 text-xs tracking-widest mb-6 text-center lowercase">
                {config.chapterName} · chapter pulse
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {LIVE_STATS.map(({ label, value, icon: Icon }, i) => (
                  <div
                    key={label}
                    className="liquid-glass rounded-2xl px-4 py-6 text-center"
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <Icon className="h-5 w-5 mx-auto mb-3 hero-accent-icon transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
                    <p className="text-2xl sm:text-3xl font-medium tabular-nums lowercase transition-all duration-500">
                      {label === 'Points awarded' ? livePoints.toLocaleString() : value.toLocaleString()}
                    </p>
                    <p className="text-xs text-white/50 mt-2 lowercase">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={100}>
          <section id="features" className="relative z-10 px-5 sm:px-8 py-12 sm:py-16">
            <div className="max-w-6xl mx-auto">
              <h2
                className="text-2xl sm:text-3xl font-medium mb-2 lowercase hero-display"
                style={{ fontFamily: config.fonts.display }}
              >
                everything in one portal
              </h2>
              <p className="text-white/50 text-sm mb-10 max-w-lg lowercase">
                member dashboard · event registration · competition tracker · points & achievements
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {features.map(({ icon: Icon, title, desc }, i) => (
                  <div
                    key={title}
                    className="liquid-glass rounded-2xl p-6 group"
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    <div className="mb-4 rounded-xl bg-white/5 p-3 w-fit transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6 hero-accent-icon" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-medium text-base lowercase">{title}</h3>
                    <p className="mt-2 text-sm text-white/50 leading-relaxed lowercase">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={150}>
          <section className="relative z-10 px-5 sm:px-8 py-12 grid sm:grid-cols-2 gap-4 max-w-6xl mx-auto w-full">
            <div id="events-preview" className="liquid-glass rounded-2xl p-6 sm:p-8 group">
              <Calendar className="h-6 w-6 mb-4 hero-accent-icon transition-transform duration-300 group-hover:rotate-6" strokeWidth={1.5} />
              <h3 className="text-lg font-medium mb-2 lowercase">event registration</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4 lowercase">
                register for state leadership conference and chapter events — +50 points per signup
              </p>
              <button
                type="button"
                onClick={() => enterPortal('member')}
                className="text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all duration-300 lowercase"
              >
                try it <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
            <div id="competitions-preview" className="liquid-glass rounded-2xl p-6 sm:p-8 group">
              <Trophy className="h-6 w-6 mb-4 hero-accent-icon transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
              <h3 className="text-lg font-medium mb-2 lowercase">competition leaderboard</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4 lowercase">
                enter events, record placements, see your name on the live chapter leaderboard
              </p>
              <button
                type="button"
                onClick={() => enterPortal('member')}
                className="text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all duration-300 lowercase"
              >
                view leaderboard <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
          </section>
        </Reveal>

        <Reveal delay={200}>
          <section className="relative z-10 px-5 sm:px-8 py-12 max-w-6xl mx-auto w-full">
            <div className="liquid-glass rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8">
              <LogoFrame
                key={theme}
                src={config.markImage ?? config.logo}
                alt={config.tagline}
                variant="card"
                float
              />
              <div className="flex-1 text-center md:text-left theme-crossfade" key={theme}>
                <p className="text-white/50 text-xs tracking-widest mb-2 lowercase">active theme</p>
                <p
                  className="text-xl font-medium lowercase hero-display"
                  style={{ fontFamily: config.fonts.display }}
                >
                  {config.label}
                </p>
                <p className="text-white/60 text-sm mt-2 lowercase">
                  fbla national · marvin ridge mavericks
                </p>
                <div className="mt-4 flex justify-center md:justify-start">
                  <ThemeSwitcher variant="glass" />
                </div>
              </div>
              <LogoFrame src={config.logo} alt={config.logoAlt} variant="card" showGlow className="hidden sm:flex" />
            </div>
          </section>
        </Reveal>

        <Reveal delay={250}>
          <section id="portal-cta" className="relative z-10 px-5 sm:px-8 py-20 sm:py-28">
            <div className="max-w-xl mx-auto text-center liquid-glass rounded-3xl p-8 sm:p-12">
              <div className="flex justify-center mb-6">
                <LogoFrame src={config.logo} alt={config.logoAlt} variant="card" showGlow={false} />
              </div>
              <h2
                className="text-2xl sm:text-3xl font-medium mb-3 lowercase hero-display"
                style={{ fontFamily: config.fonts.display }}
              >
                ready to demo?
              </h2>
              <p className="text-white/50 text-sm mb-8 lowercase">
                sign in with google or try demo — member, officer, or admin
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {firebaseEnabled && (
                  <button
                    type="button"
                    onClick={handleGoogle}
                    className="w-full sm:w-auto hero-cta text-sm font-medium px-6 py-3 rounded-full flex items-center justify-center gap-2 lowercase"
                  >
                    sign in with google
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => enterPortal('member')}
                  className="w-full sm:w-auto hero-cta text-sm font-medium px-6 py-3 rounded-full lowercase"
                >
                  try demo <ArrowRight className="h-4 w-4 inline ml-1" />
                </button>
              </div>
              {!firebaseEnabled && (
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {(['member', 'officer', 'admin'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => enterPortal(role)}
                      className="text-xs text-white/50 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-white/25 transition-all duration-300 lowercase hover:scale-105"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        </Reveal>

        <footer className="pb-10 text-center text-white/30 text-xs lowercase">
          fbla member portal · {config.chapterName}
        </footer>
      </div>
    </div>
  )
}
