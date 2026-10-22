import {
  Clock,
  Calculator,
  Type,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ICbtCandidateInfo } from "@/types/cbt"
import type { TimerUrgency } from "@/hooks/cbt-exam/useCbtTimer"
import type { CbtFontSize } from "@/hooks/cbt-exam/useCbtExamRunner"

interface CbtExamHeaderHUDProps {
  candidate: ICbtCandidateInfo
  formattedTime: string
  urgency: TimerUrgency
  saveStatus: "saved" | "saving"
  fontSize: CbtFontSize
  allowCalculator: boolean
  onToggleCalculator: () => void
  onToggleFontSize: () => void
}

export function CbtExamHeaderHUD({
  candidate,
  formattedTime,
  urgency,
  saveStatus,
  fontSize,
  allowCalculator,
  onToggleCalculator,
  onToggleFontSize,
}: CbtExamHeaderHUDProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-card/95 backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Candidate Profile Snapshot */}
        <div className="flex items-center gap-3 min-w-0">
          {candidate.avatarUrl ? (
            <img
              src={candidate.avatarUrl}
              alt={candidate.fullName}
              className="size-9 rounded-xl object-cover border border-border shadow-2xs shrink-0"
            />
          ) : (
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <User className="size-5" />
            </div>
          )}

          <div className="min-w-0 flex flex-col">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-foreground truncate max-w-[140px] sm:max-w-[200px]">
                {candidate.fullName}
              </span>
              <Badge variant="pill" className="text-[10px] font-mono font-bold px-1.5 py-0">
                {candidate.terminalId}
              </Badge>
            </div>
            <span className="text-[11px] text-muted-foreground font-mono truncate">
              {candidate.registrationNumber} • {candidate.seatNumber}
            </span>
          </div>
        </div>

        {/* Center: Master Examination Countdown Timer */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 rounded-2xl px-4 py-1.5 transition-all duration-300 ${
              urgency === "critical"
                ? "bg-destructive/15 text-destructive border border-destructive/40 animate-pulse shadow-sm"
                : urgency === "warning"
                ? "bg-status-warning/15 text-status-warning border border-status-warning/40 animate-pulse"
                : "bg-muted/60 text-foreground border border-border"
            }`}
          >
            <Clock
              className={`size-4 ${
                urgency === "critical"
                  ? "text-destructive"
                  : urgency === "warning"
                  ? "text-status-warning"
                  : "text-primary"
              }`}
            />
            <div className="flex flex-col items-center">
              <span className="font-mono text-base sm:text-lg font-extrabold tracking-wider leading-none">
                {formattedTime}
              </span>
              <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80">
                {urgency === "critical" ? "Time Critical" : "Remaining"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Tools (Calculator, Font Scaler, Save Status) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Auto-save Status Pill */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground px-2 py-1 rounded-lg bg-muted/40 border border-border/50">
            {saveStatus === "saving" ? (
              <>
                <RefreshCw className="size-3 text-status-warning animate-spin" />
                <span className="text-[11px] text-status-warning font-medium">Syncing</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="size-3 text-status-success" />
                <span className="text-[11px] text-muted-foreground font-medium">Saved</span>
              </>
            )}
          </div>

          {/* Font Size Adjuster */}
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFontSize}
            title={`Font Size: ${fontSize}`}
            className="h-8 px-2 text-xs font-semibold gap-1"
          >
            <Type className="size-3.5 text-primary" />
            <span className="text-[10px] uppercase font-bold">
              {fontSize === "normal" ? "A" : fontSize === "large" ? "A+" : "A++"}
            </span>
          </Button>

          {/* Calculator Button */}
          {allowCalculator && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleCalculator}
              title="Open Digital Calculator"
              className="h-8 px-2 text-xs font-semibold gap-1 text-primary border-primary/20 hover:bg-primary/5"
            >
              <Calculator className="size-3.5" />
              <span className="hidden sm:inline text-xs">Calc</span>
            </Button>
          )}

          {/* Security Status Badge */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-status-success/10 text-status-success text-[11px] font-semibold border border-status-success/20">
            <ShieldCheck className="size-3.5" />
            <span>Secure</span>
          </div>
        </div>
      </div>
    </header>
  )
}
