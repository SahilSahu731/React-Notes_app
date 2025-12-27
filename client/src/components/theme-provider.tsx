'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'noteflow-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey) as Theme | null
      if (stored && ['dark', 'light', 'system'].includes(stored)) {
        return stored
      }
    }
    return defaultTheme
  })

  const [mounted, setMounted] = useState(false)

  // Handle initial mount
  useEffect(() => {
    setMounted(true)
    
    // Read from localStorage on mount (for SSR hydration)
    const stored = localStorage.getItem(storageKey) as Theme | null
    if (stored && ['dark', 'light', 'system'].includes(stored)) {
      setTheme(stored)
    }
  }, [storageKey])

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
  }

  // Prevent flash of wrong theme by not rendering until mounted
  // This ensures the correct theme class is applied before first paint
  if (!mounted) {
    return (
      <ThemeProviderContext.Provider {...props} value={value}>
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </ThemeProviderContext.Provider>
    )
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}