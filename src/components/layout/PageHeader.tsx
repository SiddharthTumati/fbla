import type { ReactNode } from 'react'
import { useTheme } from '@/hooks/useTheme'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  /** Extra vertical rhythm for primary portal pages (e.g. Dashboard) */
  spacious?: boolean
}

export function PageHeader({ title, description, action, spacious }: PageHeaderProps) {
  const { config } = useTheme()

  return (
    <header className={spacious ? 'portal-page-header portal-page-header--spacious' : 'portal-page-header'}>
      <div className="min-w-0 flex-1">
        <p className="portal-eyebrow">{config.chapterName}</p>
        <h1 className="portal-title" style={{ fontFamily: config.fonts.display }}>
          {title}
        </h1>
        {description && <p className="portal-description">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}
