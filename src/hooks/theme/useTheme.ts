import * as React from "react"

export type Theme = "light"
export type ResolvedTheme = "light"

export interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const ThemeProviderContext = React.createContext<ThemeProviderState>({
  theme: "light",
  setTheme: () => {},
})

export function useTheme(): ThemeProviderState {
  const context = React.useContext(ThemeProviderContext)
  return context ?? { theme: "light", setTheme: () => {} }
}

