import { ShieldAlert, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CbtProctorAlertModalProps {
  isOpen: boolean
  infractionCount: number
  maxInfractions: number
  reason?: string
  onReenterFullscreen: () => void
}

export function CbtProctorAlertModal({
  isOpen,
  infractionCount,
  maxInfractions,
  reason,
  onReenterFullscreen,
}: CbtProctorAlertModalProps) {
  if (!isOpen) return null

  const isLastWarning = infractionCount >= maxInfractions - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md animate-in fade-in-50 duration-200">
      <div className="max-w-md w-full bg-card rounded-3xl border-2 border-destructive p-6 shadow-2xl space-y-5 text-center">
        {/* Warning Icon Badge */}
        <div className="size-16 rounded-2xl bg-destructive/15 text-destructive mx-auto flex items-center justify-center animate-bounce">
          <ShieldAlert className="size-8" />
        </div>

        {/* Heading & Reason */}
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs font-bold text-destructive border-destructive/40 px-3 py-1">
            Security Violation Warning
          </Badge>

          <h3 className="text-xl font-extrabold text-foreground">
            Examination Paused: Infraction Logged
          </h3>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {reason || "You have navigated away from the active examination window."}
          </p>
        </div>

        {/* Strike Meter */}
        <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-destructive">Proctoring Strikes</span>
            <span className="font-mono text-destructive">
              {infractionCount} / {maxInfractions}
            </span>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: maxInfractions }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i < infractionCount ? "bg-destructive" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <p className="text-[11px] text-muted-foreground pt-1">
            {isLastWarning
              ? "FINAL WARNING: A subsequent violation will automatically finalize and submit your exam."
              : "Exiting fullscreen or switching browser tabs is strictly prohibited during test sessions."}
          </p>
        </div>

        {/* Action Button */}
        <Button
          variant="primary"
          size="lg"
          sheen
          onClick={onReenterFullscreen}
          leftIcon={<Maximize2 className="size-4" />}
          className="w-full text-xs font-bold py-5 bg-destructive hover:bg-destructive/90 text-primary-foreground shadow-sm"
        >
          Re-enter Fullscreen & Resume Exam
        </Button>
      </div>
    </div>
  )
}
