export type AppTheme = 'fbla' | 'marvin-ridge'

export interface HeroHeadline {
  text: string
  className: string
  script?: boolean
}

export const THEMES: Record<
  AppTheme,
  {
    id: AppTheme
    label: string
    chapterName: string
    tagline: string
    year: string
    logo: string
    logoAlt: string
    markImage?: string
    brandPill: string
    navLinks: { label: string; href: string }[]
    heroHeadlines: HeroHeadline[]
    heroDescription: string
    ctaLabel: string
    stats: { value: string; label: string; position: 'top-right' | 'bottom-left' | 'bottom-right' }[]
    fonts: {
      body: string
      display: string
      script: string
    }
  }
> = {
  fbla: {
    id: 'fbla',
    label: 'FBLA National',
    chapterName: 'Marvin Ridge High FBLA',
    tagline: 'Make Your Mark',
    year: "'25–'26",
    logo: '/branding/fbla-logo.png',
    logoAlt: 'FBLA logo',
    markImage: '/branding/fbla-make-your-mark.png',
    brandPill: 'fbla',
    navLinks: [
      { label: 'features', href: '#features' },
      { label: 'events', href: '#events-preview' },
      { label: 'competitions', href: '#competitions-preview' },
      { label: 'portal', href: '#portal-cta' },
    ],
    heroHeadlines: [
      { text: 'make', className: 'left-4 md:left-10 top-[18%]' },
      { text: 'your', className: 'right-4 md:right-10 top-[38%]', script: true },
      { text: 'mark', className: 'left-[18%] md:left-[28%] top-[58%]' },
    ],
    heroDescription:
      'your chapter hub, built like a startup — register for events, track competitions, and climb the leaderboard',
    ctaLabel: 'enter portal',
    stats: [
      { value: '+127', label: 'chapter members', position: 'top-right' },
      { value: '+24', label: 'events this semester', position: 'bottom-left' },
      { value: '+89', label: 'competition entries', position: 'bottom-right' },
    ],
    fonts: {
      body: "'Readex Pro', 'Geist', system-ui, sans-serif",
      display: "'Oswald', 'Readex Pro', sans-serif",
      script: "'Caveat', cursive",
    },
  },
  'marvin-ridge': {
    id: 'marvin-ridge',
    label: 'Marvin Ridge',
    chapterName: 'Marvin Ridge High School FBLA',
    tagline: 'Mavericks Lead',
    year: '2025–2026',
    logo: '/branding/marvin-ridge-logo.png',
    logoAlt: 'Marvin Ridge Mavericks',
    markImage: '/branding/marvin-ridge-mavericks.png',
    brandPill: 'mavericks',
    navLinks: [
      { label: 'features', href: '#features' },
      { label: 'events', href: '#events-preview' },
      { label: 'leaderboard', href: '#competitions-preview' },
      { label: 'portal', href: '#portal-cta' },
    ],
    heroHeadlines: [
      { text: 'lead', className: 'left-4 md:left-10 top-[18%]' },
      { text: 'your', className: 'right-4 md:right-10 top-[38%]', script: true },
      { text: 'chapter', className: 'left-[12%] md:left-[22%] top-[58%]' },
    ],
    heroDescription:
      'marvin ridge fbla member portal — live stats, event registration, competitions, and achievements',
    ctaLabel: 'enter portal',
    stats: [
      { value: '#1', label: 'maverick spirit', position: 'top-right' },
      { value: '+15', label: 'achievements', position: 'bottom-left' },
      { value: 'top 10', label: 'leaderboard rank', position: 'bottom-right' },
    ],
    fonts: {
      body: "'Readex Pro', 'Geist', system-ui, sans-serif",
      display: "'Barlow Condensed', 'Readex Pro', sans-serif",
      script: "'Barlow Condensed', sans-serif",
    },
  },
}

export const THEME_STORAGE_KEY = 'fbla-portal-theme'
