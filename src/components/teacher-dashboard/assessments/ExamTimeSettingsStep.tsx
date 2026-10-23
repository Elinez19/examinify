import * as React from "react"
import { ChevronLeft, ChevronRight, Clock, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ExamTimeSettingsStepProps {
  scheduledDate: string
  onChangeScheduledDate: (date: string) => void
  startTime: string
  onChangeStartTime: (time: string) => void
  durationMinutes: number
  onChangeDurationMinutes: (minutes: number) => void
  onPrevious: () => void
  onNext: () => void
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const WEEK_DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

/**
 * Parses a date string like "26-10-2026" or "2026-10-26" into day, month (0-indexed), year.
 */
function parseDateString(dateStr: string): { day: number; month: number; year: number } {
  const parts = dateStr.trim().split(/[-/.]/)
  if (parts.length === 3) {
    const p0 = parseInt(parts[0], 10)
    const p1 = parseInt(parts[1], 10)
    const p2 = parseInt(parts[2], 10)

    if (p0 > 31) {
      // YYYY-MM-DD
      return { year: p0, month: Math.max(0, Math.min(11, p1 - 1)), day: p2 }
    }
    // DD-MM-YYYY
    return { day: p0, month: Math.max(0, Math.min(11, p1 - 1)), year: p2 }
  }

  // Fallback default: Oct 26, 2026
  return { day: 26, month: 9, year: 2026 }
}

/**
 * Formats day, month (0-indexed), year to "DD-MM-YYYY"
 */
function formatDateDDMMYYYY(day: number, month: number, year: number): string {
  return `${String(day).padStart(2, "0")}-${String(month + 1).padStart(2, "0")}-${year}`
}

/**
 * Humanizes duration in minutes (e.g. 60 -> "1h", 90 -> "1h 30m", 45 -> "45m")
 */
function formatDurationHuman(minutes: number): string {
  if (isNaN(minutes) || minutes <= 0) return "0m"
  const hours = Math.floor(minutes / 60)
  const remainingMins = minutes % 60

  if (hours > 0 && remainingMins > 0) {
    return `${hours}h ${remainingMins}m`
  }
  if (hours > 0) {
    return `${hours}h`
  }
  return `${remainingMins}m`
}

/**
 * Computes 24h end time string (e.g. "17:57") given start time ("04:57 PM") and duration in minutes
 */
function calculateEndTime(startTimeStr: string, durationMinutes: number): string {
  if (!startTimeStr || isNaN(durationMinutes) || durationMinutes < 0) return "--:--"

  const match = startTimeStr.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i)
  if (!match) return "--:--"

  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const period = match[3] ? match[3].toUpperCase() : null

  if (period === "PM" && hours < 12) {
    hours += 12
  } else if (period === "AM" && hours === 12) {
    hours = 0
  }

  const totalMinutes = (hours * 60 + minutes + durationMinutes) % 1440
  const endHours = Math.floor(totalMinutes / 60)
  const endMinutes = totalMinutes % 60

  return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`
}

export function ExamTimeSettingsStep({
  scheduledDate,
  onChangeScheduledDate,
  startTime,
  onChangeStartTime,
  durationMinutes,
  onChangeDurationMinutes,
  onPrevious,
  onNext,
}: ExamTimeSettingsStepProps) {
  // Calendar View month & year
  const initialDateParsed = React.useMemo(() => parseDateString(scheduledDate), [scheduledDate])

  const [viewMonth, setViewMonth] = React.useState<number>(initialDateParsed.month)
  const [viewYear, setViewYear] = React.useState<number>(initialDateParsed.year)

  // Time picker dropdown state
  const [showTimePicker, setShowTimePicker] = React.useState<boolean>(false)
  const timePickerRef = React.useRef<HTMLDivElement>(null)

  // Direct date input change handler
  const handleDateInputChange = (val: string) => {
    onChangeScheduledDate(val)
    const match = val.trim().match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/)
    if (match) {
      const monthIdx = parseInt(match[2], 10) - 1
      const yearVal = parseInt(match[3], 10)
      if (monthIdx >= 0 && monthIdx <= 11 && yearVal > 1900) {
        setViewMonth(monthIdx)
        setViewYear(yearVal)
      }
    }
  }

  // Close time picker when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setShowTimePicker(false)
      }
    }
    if (showTimePicker) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showTimePicker])

  // Calendar matrix calculation (always exactly 42 days for 6 rows)
  const calendarDays = React.useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay() // 0 = Sun
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate()

    const parsedSelected = parseDateString(scheduledDate)

    const days: {
      day: number
      month: number
      year: number
      isCurrentMonth: boolean
      isSelected: boolean
    }[] = []

    // Previous month trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i
      const m = viewMonth === 0 ? 11 : viewMonth - 1
      const y = viewMonth === 0 ? viewYear - 1 : viewYear
      const isSelected =
        parsedSelected.day === d &&
        parsedSelected.month === m &&
        parsedSelected.year === y

      days.push({
        day: d,
        month: m,
        year: y,
        isCurrentMonth: false,
        isSelected,
      })
    }

    // Current month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const isSelected =
        parsedSelected.day === d &&
        parsedSelected.month === viewMonth &&
        parsedSelected.year === viewYear

      days.push({
        day: d,
        month: viewMonth,
        year: viewYear,
        isCurrentMonth: true,
        isSelected,
      })
    }

    // Next month leading days to complete 42 cells (6 rows x 7 cols)
    const remainingDays = 42 - days.length
    for (let d = 1; d <= remainingDays; d++) {
      const m = viewMonth === 11 ? 0 : viewMonth + 1
      const y = viewMonth === 11 ? viewYear + 1 : viewYear
      const isSelected =
        parsedSelected.day === d &&
        parsedSelected.month === m &&
        parsedSelected.year === y

      days.push({
        day: d,
        month: m,
        year: y,
        isCurrentMonth: false,
        isSelected,
      })
    }

    return days
  }, [viewYear, viewMonth, scheduledDate])

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((prev) => prev - 1)
    } else {
      setViewMonth((prev) => prev - 1)
    }
  }

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((prev) => prev + 1)
    } else {
      setViewMonth((prev) => prev + 1)
    }
  }

  const handleSelectDay = (day: number, month: number, year: number) => {
    setViewMonth(month)
    setViewYear(year)
    onChangeScheduledDate(formatDateDDMMYYYY(day, month, year))
  }

  // Calculated End Time
  const calculatedEndTime = React.useMemo(() => {
    return calculateEndTime(startTime, durationMinutes)
  }, [startTime, durationMinutes])

  // Parse hour, minute, period from startTime for the picker
  const timeDetails = React.useMemo(() => {
    const match = startTime.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i)
    if (match) {
      return {
        hour: parseInt(match[1], 10),
        minute: parseInt(match[2], 10),
        period: (match[3] || "PM").toUpperCase() as "AM" | "PM",
      }
    }
    return { hour: 4, minute: 57, period: "PM" as const }
  }, [startTime])

  const setPickerTime = (h: number, m: number, p: "AM" | "PM") => {
    const formatted = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${p}`
    onChangeStartTime(formatted)
  }

  return (
    <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
      {/* Title & Description Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground tracking-tight">Time</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Set your examination's start time and duration.
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start pt-2">
        {/* Left Column: Interactive Calendar Card */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs select-none">
          {/* Calendar Month Navigation Header */}
          <div className="flex items-center justify-between pb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer transition-colors"
              aria-label="Previous Month"
            >
              <ChevronLeft className="size-4" />
            </button>

            <span className="font-bold text-sm sm:text-base text-foreground tracking-tight">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer transition-colors"
              aria-label="Next Month"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Weekday Abbreviations */}
          <div className="grid grid-cols-7 gap-1 text-center py-2">
            {WEEK_DAYS.map((wd) => (
              <span
                key={wd}
                className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground tracking-wider uppercase"
              >
                {wd}
              </span>
            ))}
          </div>

          {/* 42-day Calendar Matrix */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarDays.map((item, idx) => {
              const isSelected = item.isSelected

              return (
                <button
                  key={`${item.year}-${item.month}-${item.day}-${idx}`}
                  type="button"
                  onClick={() => handleSelectDay(item.day, item.month, item.year)}
                  className={`h-8 sm:h-9 w-full flex items-center justify-center text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : item.isCurrentMonth
                      ? "text-foreground hover:bg-muted/60"
                      : "text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted/30"
                  }`}
                  aria-label={`${item.day} ${MONTH_NAMES[item.month]} ${item.year}`}
                >
                  {item.day}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Column: Time & Duration Configuration */}
        <div className="space-y-5">
          {/* Schedule Date Input */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">
              Schedule Date
            </label>
            <Input
              type="text"
              value={scheduledDate}
              onChange={(e) => handleDateInputChange(e.target.value)}
              placeholder="DD-MM-YYYY"
              className="h-11 px-3.5 text-xs sm:text-sm font-semibold rounded-xl bg-background border-border text-foreground"
            />
          </div>

          {/* Start Time and Duration Row */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 items-start">
            {/* Start Time Field */}
            <div className="relative" ref={timePickerRef}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Start Time
                </label>
                <button
                  type="button"
                  title="The exact start time pupils are allowed to begin this examination"
                  aria-label="Start time information"
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-help inline-flex items-center justify-center"
                >
                  <HelpCircle className="size-3.5" />
                </button>
              </div>

              <div className="relative">
                <Input
                  type="text"
                  value={startTime}
                  onChange={(e) => onChangeStartTime(e.target.value)}
                  onClick={() => setShowTimePicker(true)}
                  placeholder="04:57 PM"
                  className="h-11 pr-10 text-xs sm:text-sm font-semibold rounded-xl bg-background border-border text-foreground cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setShowTimePicker(!showTimePicker)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Toggle time picker"
                >
                  <Clock className="size-4" />
                </button>
              </div>

              {/* Interactive Time Picker Popover */}
              {showTimePicker && (
                <div className="absolute left-0 top-full mt-2 z-30 w-64 rounded-xl border border-border bg-card p-3 shadow-lg animate-in fade-in zoom-in-95 space-y-3">
                  <div className="text-xs font-bold text-foreground border-b border-border pb-1.5">
                    Adjust Start Time
                  </div>

                  {/* Hour & Minute adjustment */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex flex-col items-center flex-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                        Hour
                      </span>
                      <div className="flex items-center gap-1 mt-1">
                        <select
                          value={timeDetails.hour}
                          onChange={(e) =>
                            setPickerTime(
                              Number(e.target.value),
                              timeDetails.minute,
                              timeDetails.period
                            )
                          }
                          className="h-8 px-2 rounded-lg border border-border bg-background text-foreground font-bold cursor-pointer text-xs"
                        >
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                            <option key={h} value={h}>
                              {String(h).padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <span className="font-bold text-muted-foreground pt-4">:</span>

                    <div className="flex flex-col items-center flex-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                        Minute
                      </span>
                      <div className="flex items-center gap-1 mt-1">
                        <select
                          value={timeDetails.minute}
                          onChange={(e) =>
                            setPickerTime(
                              timeDetails.hour,
                              Number(e.target.value),
                              timeDetails.period
                            )
                          }
                          className="h-8 px-2 rounded-lg border border-border bg-background text-foreground font-bold cursor-pointer text-xs"
                        >
                          {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                            <option key={m} value={m}>
                              {String(m).padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                        AM / PM
                      </span>
                      <div className="flex items-center gap-1 mt-1">
                        <Button
                          type="button"
                          variant={timeDetails.period === "AM" ? "primary" : "outline"}
                          size="sm"
                          onClick={() =>
                            setPickerTime(timeDetails.hour, timeDetails.minute, "AM")
                          }
                          className="h-8 px-2 text-xs font-bold"
                        >
                          AM
                        </Button>
                        <Button
                          type="button"
                          variant={timeDetails.period === "PM" ? "primary" : "outline"}
                          size="sm"
                          onClick={() =>
                            setPickerTime(timeDetails.hour, timeDetails.minute, "PM")
                          }
                          className="h-8 px-2 text-xs font-bold"
                        >
                          PM
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Preset Quick Picks */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase block">
                      Common Slots
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {["08:30 AM", "09:00 AM", "10:00 AM", "01:30 PM", "04:57 PM"].map(
                        (slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => {
                              onChangeStartTime(slot)
                              setShowTimePicker(false)
                            }}
                            className={`px-1.5 py-1 text-[11px] font-semibold rounded-md border transition-colors cursor-pointer ${
                              startTime.trim().toUpperCase() === slot
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted/30 text-foreground border-border hover:bg-muted/70"
                            }`}
                          >
                            {slot}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-1 border-t border-border">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => setShowTimePicker(false)}
                      className="text-xs h-7 px-3 font-semibold"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Duration Field */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Duration
                </label>
                <button
                  type="button"
                  title="Duration of the examination in minutes"
                  aria-label="Duration information"
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-help inline-flex items-center justify-center"
                >
                  <HelpCircle className="size-3.5" />
                </button>
              </div>

              <Input
                type="number"
                min={5}
                max={360}
                value={durationMinutes || ""}
                onChange={(e) =>
                  onChangeDurationMinutes(Math.max(1, Number(e.target.value)))
                }
                className="h-11 text-xs sm:text-sm font-semibold rounded-xl bg-background border-border text-foreground"
              />
              <span className="text-[11px] text-muted-foreground block mt-1.5 font-medium">
                Duration: {formatDurationHuman(durationMinutes)}
              </span>
            </div>
          </div>

          {/* Calculated End Time Field */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-foreground">
                Calculated End Time
              </label>
              <button
                type="button"
                title="Computed conclusion time based on the examination start time and duration"
                aria-label="Calculated End Time information"
                className="text-muted-foreground hover:text-foreground transition-colors cursor-help inline-flex items-center justify-center"
              >
                <HelpCircle className="size-3.5" />
              </button>
            </div>

            <Input
              type="text"
              readOnly
              disabled
              value={calculatedEndTime}
              className="h-11 text-xs sm:text-sm font-semibold rounded-xl bg-muted/40 text-foreground border-border cursor-not-allowed select-none opacity-90"
            />
          </div>
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={onPrevious}
          className="text-xs font-bold px-7 h-10 rounded-xl cursor-pointer"
        >
          Previous
        </Button>

        <Button
          type="button"
          variant="primary"
          size="default"
          onClick={onNext}
          className="text-xs font-bold px-8 h-10 rounded-xl shadow-xs cursor-pointer"
        >
          Next
        </Button>
      </div>
    </div>
  )
}
