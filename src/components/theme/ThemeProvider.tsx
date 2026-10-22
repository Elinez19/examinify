import * as React from "react"
import {
  ThemeProviderContext,
  type Theme,
} from "@/hooks/theme/useTheme"

export interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({
  children,
  storageKey = "theme",
}: ThemeProviderProps) {
  React.useEffect(() => {
    const root = document.documentElement
    // Enforce light mode and eliminate dark mode classes
    root.classList.remove("dark")
    root.classList.add("light")

    try {
      // Clear any cached dark theme in localStorage
      localStorage.removeItem(storageKey)
    } catch {
      // Ignore storage access errors
    }
  }, [storageKey])

  const value = React.useMemo(
    () => ({
      theme: "light" as const,
      setTheme: () => {},
    }),
    []
  )

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

