import * as React from "react"

interface UseCbtKeyboardShortcutsOptions {
  enabled: boolean
  onSelectOption: (label: "A" | "B" | "C" | "D") => void
  onPrevious: () => void
  onNext: () => void
  onToggleFlag: () => void
  onSubmit: () => void
}

export function useCbtKeyboardShortcuts({
  enabled,
  onSelectOption,
  onPrevious,
  onNext,
  onToggleFlag,
  onSubmit,
}: UseCbtKeyboardShortcutsOptions) {
  React.useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if focus is inside text input, textarea, or contentEditable
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return
      }

      // Avoid interfering with browser defaults like Cmd+R or Ctrl+Shift+I
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return
      }

      const key = e.key.toUpperCase()

      if (key === "A" || key === "B" || key === "C" || key === "D") {
        e.preventDefault()
        onSelectOption(key as "A" | "B" | "C" | "D")
      } else if (key === "P" || e.key === "ArrowLeft") {
        e.preventDefault()
        onPrevious()
      } else if (key === "N" || e.key === "ArrowRight") {
        e.preventDefault()
        onNext()
      } else if (key === "R") {
        e.preventDefault()
        onToggleFlag()
      } else if (key === "S") {
        e.preventDefault()
        onSubmit()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [enabled, onSelectOption, onPrevious, onNext, onToggleFlag, onSubmit])
}
