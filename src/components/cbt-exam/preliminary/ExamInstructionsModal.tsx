import {
  BookOpen,
  Keyboard,
  Calculator,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Shuffle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface ExamInstructionsModalProps {
  instructions: string[]
  allowCalculator: boolean
  durationMinutes: number
  onProceed: () => void
  onBack: () => void
}

export function ExamInstructionsModal({
  instructions,
  allowCalculator,
  durationMinutes,
  onProceed,
  onBack,
}: ExamInstructionsModalProps) {
  const keyboardShortcuts = [
    { key: "A, B, C, D", desc: "Select corresponding option immediately", label: "Answer Keys" },
    { key: "P", desc: "Move to previous question (or ← Arrow)", label: "Previous" },
    { key: "N", desc: "Advance to next question (or → Arrow)", label: "Next" },
    { key: "R", desc: "Flag or unflag question for later review", label: "Review / Flag" },
    { key: "S", desc: "Open examination final submission dialogue", label: "Submit" },
  ]

  return (
    <Card className="max-w-2xl w-full border-border bg-card shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
      {/* Header */}
      <div className="bg-primary/10 border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <BookOpen className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Examination Regulations & 8-Key Navigation Guide
            </h3>
            <p className="text-xs text-muted-foreground">
              Please read instructions carefully before starting the exam timer
            </p>
          </div>
        </div>
        <Badge variant="pill" className="text-xs font-semibold px-3 py-1 gap-1">
          <Clock className="size-3 text-primary" />
          <span>{durationMinutes} Mins</span>
        </Badge>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Core Rules List */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            General Examination Guidelines
          </h4>
          <div className="space-y-2">
            {instructions.map((inst, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 text-xs text-foreground bg-muted/30 p-2.5 rounded-xl border border-border/60"
              >
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed">{inst}</span>
              </div>
            ))}
          </div>
        </div>

        {/* JAMB 8-Key Navigation Feature Card */}
        <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Keyboard className="size-4 text-primary" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Authentic 8-Key CBT Keyboard Navigation
              </h4>
            </div>
            <Badge variant="outline" className="text-[10px] font-semibold text-primary border-primary/30">
              Mouse-Free Ready
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground">
            Just like in national CBT centers, you do not need to use the mouse. You can navigate the entire test using your keyboard keys:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {keyboardShortcuts.map((sc, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border/80 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-card border border-border shadow-2xs text-primary">
                    {sc.key}
                  </span>
                  <span className="font-semibold text-foreground">{sc.label}</span>
                </div>
                <span className="text-[10px] text-muted-foreground text-right">{sc.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights: Multi-Subject & Calculator */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-2.5 text-xs">
            <Shuffle className="size-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-foreground">Multi-Subject Tab Switching</p>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Freely toggle between subjects at any time. Your answers in previous subjects are saved continuously.
              </p>
            </div>
          </div>

          {allowCalculator && (
            <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-2.5 text-xs">
              <Calculator className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground">Onscreen Digital Calculator</p>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  An on-screen 8-digit standard calculator is available on the top toolbar for computational subjects.
                </p>
              </div>
            </div>
          )}
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
            Back to Admit Slip
          </Button>

          <Button
            variant="primary"
            size="default"
            sheen
            onClick={onProceed}
            rightIcon={<ArrowRight className="size-4" />}
            className="text-xs font-bold"
          >
            Proceed to Security Advisory
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
