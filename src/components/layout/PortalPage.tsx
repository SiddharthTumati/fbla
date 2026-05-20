import type { ReactNode } from 'react'

interface PortalPageProps {
  children?: ReactNode
  loading?: boolean
}

export function PortalPage({ children, loading }: PortalPageProps) {
  if (loading) {
    return (
      <div className="portal-page flex min-h-[50vh] items-center justify-center">
        <div className="portal-spinner" aria-label="Loading" />
      </div>
    )
  }

  return <div className="portal-page">{children}</div>
}
