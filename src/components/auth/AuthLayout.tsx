import type { ReactNode } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { HeroCollage } from '@/components/HeroCollage'

interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  const { user, loading } = useAuth()
  const { config } = useTheme()

  if (!loading && user && !user.isDemo) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="homepage min-h-screen" style={{ fontFamily: config.fonts.body }}>
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden py-12">
        <HeroCollage />
        <div className="hero-overlay absolute inset-0" aria-hidden />
        <div className="relative z-10 w-full max-w-md px-6">
          <div className="portal-card p-8">
            <Link to="/" className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-accent)] hover:underline">
              ← Back to home
            </Link>
            <h1
              className="mt-4 text-2xl font-bold text-white"
              style={{ fontFamily: config.fonts.display }}
            >
              {title}
            </h1>
            {subtitle && <p className="mt-2 text-sm text-white/60">{subtitle}</p>}
            <div className="mt-6">{children}</div>
            {footer && <div className="mt-6 border-t border-white/10 pt-6 text-center text-sm text-white/55">{footer}</div>}
          </div>
        </div>
      </section>
    </div>
  )
}
