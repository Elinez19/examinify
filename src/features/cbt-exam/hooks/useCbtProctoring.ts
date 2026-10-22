import * as React from "react"

interface UseCbtProctoringOptions {
  isActive: boolean
  maxInfractions?: number
  onMaxInfractionsReached?: () => void
}

export function useCbtProctoring({
  isActive,
  maxInfractions = 3,
  onMaxInfractionsReached,
}: UseCbtProctoringOptions) {
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(() => {
    return typeof document !== "undefined" && Boolean(document.fullscreenElement)
  })
  const [infractionCount, setInfractionCount] = React.useState<number>(0)
  const [isAlertActive, setIsAlertActive] = React.useState<boolean>(false)
  const [lastInfractionReason, setLastInfractionReason] = React.useState<string>("")

  const onMaxReachedRef = React.useRef(onMaxInfractionsReached)
  React.useEffect(() => {
    onMaxReachedRef.current = onMaxInfractionsReached
  }, [onMaxInfractionsReached])

  const recordInfraction = React.useCallback(
    (reason: string) => {
      if (!isActive) return

      setInfractionCount((prev) => {
        const next = prev + 1
        setLastInfractionReason(reason)
        setIsAlertActive(true)

        if (next >= maxInfractions && onMaxReachedRef.current) {
          onMaxReachedRef.current()
        }
        return next
      })
    },
    [isActive, maxInfractions]
  )

  const requestFullscreen = React.useCallback(async () => {
    try {
      if (typeof document !== "undefined" && !document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen()
        }
      }
      setIsFullscreen(true)
      setIsAlertActive(false)
    } catch {
      // Browser might block if not triggered by direct gesture; handle gracefully
      setIsFullscreen(true)
      setIsAlertActive(false)
    }
  }, [])

  const exitFullscreen = React.useCallback(async () => {
    try {
      if (typeof document !== "undefined" && document.fullscreenElement) {
        await document.exitFullscreen()
      }
      setIsFullscreen(false)
    } catch {
      setIsFullscreen(false)
    }
  }, [])

  const dismissAlertAndReenterFullscreen = React.useCallback(() => {
    requestFullscreen()
  }, [requestFullscreen])

  // Listeners for fullscreen changes & tab visibility
  React.useEffect(() => {
    if (!isActive) return

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = Boolean(document.fullscreenElement)
      setIsFullscreen(isCurrentlyFullscreen)

      if (!isCurrentlyFullscreen) {
        recordInfraction("You exited the secure fullscreen examination mode.")
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        recordInfraction("Browser tab was switched or window minimized during exam.")
      }
    }

    const handleWindowBlur = () => {
      // Additional safety check when focus leaves window
      if (isActive && !document.fullscreenElement) {
        recordInfraction("Focus left the examination environment.")
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("blur", handleWindowBlur)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleWindowBlur)
    }
  }, [isActive, recordInfraction])

  return {
    isFullscreen,
    infractionCount,
    maxInfractions,
    isAlertActive,
    lastInfractionReason,
    requestFullscreen,
    exitFullscreen,
    dismissAlertAndReenterFullscreen,
  }
}
