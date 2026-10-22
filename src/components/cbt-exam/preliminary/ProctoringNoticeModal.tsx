import {
  ShieldAlert,
  Maximize2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface ProctoringNoticeModalProps {
  maxInfractions: number
  onProceed: () => void
  onBack: () => void
}

export function ProctoringNoticeModal({
  maxInfractions,
  onProceed,
  onBack,
}: ProctoringNoticeModalProps) {
  const readinessChecks = [
    { label: "Fullscreen Security Protocol", status: "Supported & Ready" },
    { label: "Browser Tab Switching Monitor", status: "Active Watchdog" },
    { label: "8-Key Keyboard Shortcuts", status: "Enabled (A, B, C, D, P, N, R, S)" },
    { label: "Continuous Local Auto-Save", status: "Armed & Persistent" },
  ]

  return (
    <Card className="max-w-2xl w-full border-border bg-card shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
      {/* Header */}
      <div className="bg-destructive/10 border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-destructive text-primary-foreground flex items-center justify-center">
            <ShieldAlert className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Anti-Cheating & Fullscreen Security Notice
            </h3>
            <p className="text-xs text-muted-foreground">
              Proctored Environment Rules & Strike Infraction Policy
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs font-semibold text-destructive border-destructive/30">
          Strict Mode
        </Badge>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Fullscreen Notice Banner */}
        <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/20 space-y-2">
          <div className="flex items-center gap-2 text-destructive font-bold text-xs">
            <Maximize2 className="size-4" />
            <span>MANDATORY FULLSCREEN LOCKDOWN</span>
          </div>
          <p className="text-xs text-foreground leading-relaxed">
            Upon entering the examination, your browser will transition into full-screen mode.
            <strong> Do NOT exit fullscreen, press the Escape key, switch browser tabs, or minimize the window</strong>.
          </p>
        </div>

        {/* 3-Strike Warning Box */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-status-warning/10 border border-status-warning/30 text-xs">
          <AlertTriangle className="size-4 text-status-warning shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-foreground">
              Three-Strike Penalty Policy ({maxInfractions} Maximum Infractions)
            </p>
            <p className="text-muted-foreground leading-relaxed">
              If an unauthorized action (such as exiting fullscreen or switching tabs) is detected,
              an infraction alert will freeze your screen and log a strike penalty. Reaching <strong>{maxInfractions} strikes</strong> will immediately and automatically finalize and submit your examination.
            </p>
          </div>
        </div>

        {/* System Readiness Checklist */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            System Pre-Flight Readiness Status
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {readinessChecks.map((check, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border/80 text-xs"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-status-success shrink-0" />
                  <span className="font-medium text-foreground">{check.label}</span>
                </div>
                <Badge variant="outline" className="text-[10px] font-semibold text-status-success border-status-success/30">
                  {check.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Button
            variant="outline"
            size="default"
            onClick={onBack}
            leftIcon={<ArrowLeft className="size-4" />}
            className="text-xs font-semibold"
          >
            Back to Regulations
          </Button>

          <Button
            variant="primary"
            size="default"
            sheen
            onClick={onProceed}
            rightIcon={<ArrowRight className="size-4" />}
            className="text-xs font-bold"
          >
            I Acknowledge & Understand
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
