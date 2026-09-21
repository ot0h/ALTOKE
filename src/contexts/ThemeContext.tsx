import { createContext, ReactNode, useContext, useState } from 'react'

export const lightTheme = {
  colors: {
    background: '#F8FAFC',
    surface: '#FFFFFF',

    text: '#1E2744',
    textSecondary: '#64748B',
    textMuted: '#919191',

    primary: '#0145EA',
    primaryDark: '#1E2744',

    border: '#E2E8F0',
    borderInput: '#B8B8B8',

    placeholder: '#919191',

    success: '#16A34A',
    warning: '#F59E0B',
    error: '#DC2626',

    disabled: '#CBD5E1',
  },
}

export const darkTheme = {
  colors: {
    background: '#192229',
    surface: '#192229',

    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',

    primary: '#4D7CFE',
    primaryDark: '#A5B4FC',

    border: '#334155',
    borderInput: '#475569',

    placeholder: '#94A3B8',

    success: '#4ADE80',
    warning: '#FBBF24',
    error: '#F87171',

    disabled: '#475569',
  },
}

export type ThemeColors = typeof lightTheme.colors

type ThemeContextType = {
  isDark?: boolean
  colors: ThemeColors
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  const toggleTheme = () => setIsDark((prev) => !prev)
  const colors = isDark ? darkTheme.colors : lightTheme.colors

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider')
  return ctx
}
