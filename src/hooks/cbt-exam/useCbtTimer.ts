import * as React from "react"

export type TimerUrgency = "normal" | "warning" | "critical"

interface UseCbtTimerOptions {
  durationMinutes: number
  onTimeExpired?: () => void
  autoStart?: boolean
}

export function useCbtTimer({
  durationMinutes,
  onTimeExpired,
  autoStart = false,
}: UseCbtTimerOptions) {
  const initialSeconds = Math.max(60, durationMinutes * 60)
  const [secondsRemaining, setSecondsRemaining] = React.useState(initialSeconds)
  const [isRunning, setIsRunning] = React.useState(autoStart)
  const [isExpired, setIsExpired] = React.useState(false)

  // Keep callback fresh in ref
  const onTimeExpiredRef = React.useRef(onTimeExpired)
  React.useEffect(() => {
    onTimeExpiredRef.current = onTimeExpired
  }, [onTimeExpired])

  const [prevDuration, setPrevDuration] = React.useState(durationMinutes)
  if (prevDuration !== durationMinutes) {
    setPrevDuration(durationMinutes)
    setSecondsRemaining(Math.max(60, durationMinutes * 60))
    setIsExpired(false)
  }

  React.useEffect(() => {
    if (!isRunning || isExpired) return

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsExpired(true)
          setIsRunning(false)
          if (onTimeExpiredRef.current) {
            onTimeExpiredRef.current()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, isExpired])

  const startTimer = React.useCallback(() => {
    setIsRunning(true)
  }, [])

  const pauseTimer = React.useCallback(() => {
    setIsRunning(false)
  }, [])

  const resumeTimer = React.useCallback(() => {
    if (!isExpired) {
      setIsRunning(true)
    }
  }, [isExpired])

  const urgency: TimerUrgency = React.useMemo(() => {
    if (secondsRemaining <= 300) return "critical" // under 5 minutes
    if (secondsRemaining <= 900) return "warning"  // under 15 minutes
    return "normal"
  }, [secondsRemaining])

  const formattedTime = React.useMemo(() => {
    const hours = Math.floor(secondsRemaining / 3600)
    const minutes = Math.floor((secondsRemaining % 3600) / 60)
    const seconds = secondsRemaining % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`
  }, [secondsRemaining])

  const elapsedSeconds = initialSeconds - secondsRemaining

  return {
    secondsRemaining,
    formattedTime,
    urgency,
    isRunning,
    isExpired,
    elapsedSeconds,
    startTimer,
    pauseTimer,
    resumeTimer,
  }
}
