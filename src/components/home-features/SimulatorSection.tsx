import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSimulator } from "@/hooks/simulator/useSimulator"
import {
  Clock,
  CheckCircle2,
  Bookmark,
  Sparkles,
  HelpCircle,
  ArrowRight,
  RotateCcw,
} from "lucide-react"

export function SimulatorSection() {
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    selectedOptionId,
    isFlagged,
    saveStatus,
    showExplanation,
    secondsRemaining,
    handleSelectOption,
    handleToggleFlag,
    handleNextQuestion,
    handleToggleExplanation,
  } = useSimulator()

  return (
    <div id="simulator-section">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="default" className="gap-2 px-4 py-1 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="size-3.5" />
          <span>Interactive CBT Practice</span>
        </Badge>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Test Drive the <span className="text-primary">Practice CBT Runner</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground">
          Experience how intuitive and stress-free computer-based testing is. Select an answer below
          to see automatic saving, flag questions for later review, and inspect instant solution breakdowns.
        </p>
      </div>

      {/* Live Simulator Card Container */}
      <div className="mt-12 mx-auto max-w-4xl">
        <div className="glossy-surface glow-ambient overflow-hidden rounded-3xl p-4 sm:p-8">
          {/* Simulation Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="px-2.5 py-0.5 text-xs font-bold">
                  {currentQuestion.examType}
                </Badge>
                <span className="text-xs text-muted-foreground font-medium">
                  Subject: {currentQuestion.subject}
                </span>
              </div>
              <h3 className="mt-1 text-lg font-bold text-foreground sm:text-xl">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </h3>
            </div>

            {/* Status HUD (Timer & Auto-save) */}
            <div className="flex items-center gap-3">
              <div className="glossy-pill flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-sm font-semibold text-foreground">
                <Clock className="size-4 text-primary" />
                <span className="font-mono text-base font-bold text-primary">
                  {secondsRemaining}
                </span>
              </div>

              {/* Auto-save pulse */}
              <div
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                  saveStatus === "saving"
                    ? "bg-status-warning/15 text-status-warning border border-status-warning/30 animate-pulse"
                    : "bg-status-success/15 text-status-success border border-status-success/30"
                }`}
              >
                <CheckCircle2 className="size-3.5 text-status-success" />
                <span>{saveStatus === "saving" ? "Syncing..." : "Saved locally"}</span>
              </div>
            </div>
          </div>

          {/* Question Body */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Standard Multiple Choice (Single Best Answer)
              </span>
              <button
                type="button"
                onClick={handleToggleFlag}
                className={`cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                  isFlagged
                    ? "text-status-warning font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Bookmark
                  className={`size-4 ${isFlagged ? "fill-status-warning text-status-warning" : ""}`}
                />
                <span>{isFlagged ? "Flagged for Later Review" : "Flag for Review"}</span>
              </button>
            </div>

            <div className="mt-4 rounded-2xl bg-card p-5 border border-border shadow-sm">
              <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed">
                {currentQuestion.questionText}
              </p>
            </div>

            {/* Interactive Radio Options */}
            <div className="mt-6 space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOptionId === option.id
                return (
                  <div
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className={`cursor-pointer group flex items-center justify-between rounded-xl p-4 border transition-all duration-200 ${
                      isSelected
                        ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary"
                        : "bg-card border-border hover:border-border/80 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`flex size-8 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                        }`}
                      >
                        {option.label}
                      </span>
                      <span className="text-sm sm:text-base font-medium text-foreground">
                        {option.text}
                      </span>
                    </div>
                    {isSelected && <CheckCircle2 className="size-5 text-primary" />}
                  </div>
                )
              })}
            </div>

            {/* Explanation Reveal (Interactive Teaching mode) */}
            {showExplanation && (
              <div className="mt-6 rounded-2xl bg-primary/5 border border-primary/20 p-5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <HelpCircle className="size-4" />
                  <span>Verified Solution & Explanation</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Control Buttons Row */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
              <button
                type="button"
                onClick={handleToggleExplanation}
                className="cursor-pointer text-xs font-semibold text-primary hover:text-primary/80 underline underline-offset-4"
              >
                {showExplanation ? "Hide Solution Breakdown" : "Reveal Instant Solution"}
              </button>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleNextQuestion}
                  leftIcon={<RotateCcw className="size-4" />}
                >
                  Next Sample Question
                </Button>
                <Button
                  variant="primary"
                  size="default"
                  sheen
                  onClick={() => {
                    alert("In the full Examinify CBT Runner, exams auto-grade instantly upon submission with detailed performance analytics and topic insights!")
                  }}
                  rightIcon={<ArrowRight className="size-4" />}
                >
                  Finish & View Scorecard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
