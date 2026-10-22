import { Play, Sparkles, ArrowLeft, ShieldCheck, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CandidateAdmitSlipModal } from "./CandidateAdmitSlipModal"
import { ExamInstructionsModal } from "./ExamInstructionsModal"
import { ProctoringNoticeModal } from "./ProctoringNoticeModal"
import type { ICbtExamSession, PreflightStep } from "../../types/cbt"

interface ExamPreflightWizardProps {
  session: ICbtExamSession
  currentStep: PreflightStep
  onNextStep: () => void
  onPreviousStep: () => void
  onStartExam: () => void
  onCancel: () => void
}

export function ExamPreflightWizard({
  session,
  currentStep,
  onNextStep,
  onPreviousStep,
  onStartExam,
  onCancel,
}: ExamPreflightWizardProps) {
  const steps: { id: PreflightStep; label: string }[] = [
    { id: "admit-slip", label: "Candidate Verification" },
    { id: "regulations", label: "Exam Guidelines" },
    { id: "proctoring-check", label: "Security & Fullscreen" },
    { id: "ready", label: "Launch Arena" },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Top Stepper Indicator */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          {steps.map((s, idx) => {
            const isCompleted = idx < currentStepIndex
            const isCurrent = idx === currentStepIndex

            return (
              <div key={s.id} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex items-center">
                  <div
                    className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                      isCompleted || isCurrent
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold">
                  <span
                    className={`size-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                        ? "border-2 border-primary text-primary bg-card"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <Check className="size-2.5 stroke-[3]" /> : idx + 1}
                  </span>
                  <span
                    className={`hidden sm:inline truncate ${
                      isCurrent
                        ? "text-primary font-bold"
                        : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step View Switcher */}
      {currentStep === "admit-slip" && (
        <CandidateAdmitSlipModal
          candidate={session.candidate}
          subjects={session.subjects}
          durationMinutes={session.durationMinutes}
          onProceed={onNextStep}
          onCancel={onCancel}
        />
      )}

      {currentStep === "regulations" && (
        <ExamInstructionsModal
          instructions={session.instructions}
          allowCalculator={session.allowCalculator}
          durationMinutes={session.durationMinutes}
          onProceed={onNextStep}
          onBack={onPreviousStep}
        />
      )}

      {currentStep === "proctoring-check" && (
        <ProctoringNoticeModal
          maxInfractions={session.maxInfractions}
          onProceed={onNextStep}
          onBack={onPreviousStep}
        />
      )}

      {currentStep === "ready" && (
        <Card className="max-w-2xl w-full border-border bg-card shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
          <div className="bg-primary/10 border-b border-border px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Ready to Launch Examination
                </h3>
                <p className="text-xs text-muted-foreground">
                  All preliminary checks successfully passed
                </p>
              </div>
            </div>
            <Badge variant="success" className="text-xs font-semibold px-3 py-1">
              Active Session
            </Badge>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6 text-center">
            <div className="size-16 rounded-3xl bg-primary/10 text-primary mx-auto flex items-center justify-center shadow-xs">
              <Play className="size-8 fill-current ml-1" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                {session.title}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                You are registered for <strong>{session.subjects.length} subjects</strong> with an aggregated duration of{" "}
                <strong className="text-primary">{session.durationMinutes} minutes</strong>. Clicking the button below will lock into fullscreen mode and initiate the countdown timer.
              </p>
            </div>

            {/* Quick Session Summary Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {session.subjects.map((sub) => (
                <Badge
                  key={sub.id}
                  variant="outline"
                  className="px-3 py-1 text-xs font-semibold bg-muted/30 border-border"
                >
                  {sub.name} ({sub.totalQuestions} Qs)
                </Badge>
              ))}
            </div>

            {/* Launch Primary CTA */}
            <div className="pt-4 max-w-md mx-auto space-y-3">
              <Button
                variant="primary"
                size="lg"
                sheen
                onClick={onStartExam}
                leftIcon={<Sparkles className="size-5" />}
                className="w-full text-sm font-bold py-6 shadow-md"
              >
                Enter Fullscreen & Begin Examination
              </Button>

              <div className="flex items-center justify-between text-xs pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onPreviousStep}
                  leftIcon={<ArrowLeft className="size-3.5" />}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Back to Security Check
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Exit to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
