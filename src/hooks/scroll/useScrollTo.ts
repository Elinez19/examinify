import * as React from "react"

export function useScrollTo() {
  const scrollTo = React.useCallback((elementId: string) => {
    const el = document.getElementById(elementId)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  return { scrollTo }
}
