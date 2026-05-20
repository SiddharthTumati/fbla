import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { THEMES, THEME_STORAGE_KEY, type AppTheme } from '@/lib/themes'

interface ThemeContextValue {
  theme: AppTheme
  config: (typeof THEMES)[AppTheme]
  setTheme: (theme: AppTheme) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

function readStoredTheme(): AppTheme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'fbla' || stored === 'marvin-ridge') return stored
  return 'fbla'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>(readStoredTheme)

  const setTheme = useCallback((next: AppTheme) => {
    setThemeState(next)
    localStorage.setItem(THEME_STORAGE_KEY, next)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const value = useMemo(
    () => ({ theme, config: THEMES[theme], setTheme }),
    [theme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
