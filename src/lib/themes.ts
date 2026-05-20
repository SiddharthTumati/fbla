export type AppTheme = 'fbla' | 'marvin-ridge'

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
    brandName: string
    navLinks: { label: string; href: string }[]
    heroTitle: string
    heroHighlight: string
    heroDescription: string
    ctaLabel: string
    fonts: {
      body: string
      display: string
      accent: string
    }
  }
> = {
  fbla: {
    id: 'fbla',
    label: 'FBLA National',
    chapterName: 'Marvin Ridge High School FBLA',
    tagline: 'Make Your Mark',
    year: '2025–2026',
    logo: '/branding/fbla-logo.png',
    logoAlt: 'FBLA logo',
    markImage: '/branding/fbla-make-your-mark.png',
    brandName: 'FBLA Member Portal',
    navLinks: [
      { label: 'Features', href: '#features' },
      { label: 'Events', href: '#events-preview' },
      { label: 'Competitions', href: '#competitions-preview' },
      { label: 'Sign In', href: '#portal-cta' },
    ],
    heroTitle: 'Make',
    heroHighlight: 'Your Mark',
    heroDescription: 'Events, competitions, and chapter points — in one place.',
    ctaLabel: 'Enter Portal',
    fonts: {
      body: "'Inter', system-ui, sans-serif",
      display: "'Oswald', 'Inter', sans-serif",
      accent: "'Oswald', 'Inter', sans-serif",
    },
  },
  'marvin-ridge': {
    id: 'marvin-ridge',
    label: 'Marvin Ridge Mavericks',
    chapterName: 'Marvin Ridge High School FBLA',
    tagline: 'Mavericks Lead',
    year: '2025–2026',
    logo: '/branding/marvin-ridge-logo.png',
    logoAlt: 'Marvin Ridge Mavericks',
    markImage: '/branding/marvin-ridge-mavericks.png',
    brandName: 'Mavericks Portal',
    navLinks: [
      { label: 'Features', href: '#features' },
      { label: 'Events', href: '#events-preview' },
      { label: 'Leaderboard', href: '#competitions-preview' },
      { label: 'Sign In', href: '#portal-cta' },
    ],
    heroTitle: 'Lead',
    heroHighlight: 'Your Chapter',
    heroDescription: 'Your chapter hub for events, competitions, and points.',
    ctaLabel: 'Enter Portal',
    fonts: {
      body: "'Inter', system-ui, sans-serif",
      display: "'Barlow Condensed', 'Inter', sans-serif",
      accent: "'Barlow Condensed', 'Inter', sans-serif",
    },
  },
}

export const THEME_STORAGE_KEY = 'fbla-portal-theme'
