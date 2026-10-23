import * as React from "react"
import { X, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ITeacherCbtExam, ITeacherQuestion } from "@/types/teacher"

interface ExamStudentPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  exam: ITeacherCbtExam
  questions: ITeacherQuestion[]
}

export function ExamStudentPreviewModal({
  isOpen,
  onClose,
  exam,
  questions,
}: ExamStudentPreviewModalProps) {
  const [activeIdx, setActiveIdx] = React.useState<number>(0)
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, string>>({})

  if (!isOpen) return null

  const currentQ = questions[activeIdx] || questions[0]
  const total = questions.length

  const handleSelectOption = (optId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [activeIdx]: optId }))
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl h-[90vh] bg-card rounded-3xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Student HUD Bar */}
        <div className="p-4 sm:p-5 border-b border-border bg-muted/40 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Badge variant="pill" className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Student CBT Preview Mode
              </Badge>
              <span className="text-xs font-bold text-foreground truncate max-w-md">
                {exam.title}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Subject: <strong className="text-foreground">{exam.subject}</strong> • Target: {exam.targetClasses.join(", ")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Simulated Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-mono font-bold text-foreground">
              <Clock className="size-3.5 text-primary" />
              <span>{exam.durationMinutes}:00</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
              aria-label="Close Preview"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Main Body: Question Display & Question Palette */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Question View */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* Question Counter Header */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Question {activeIdx + 1} of {total}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                Marks: {currentQ?.points || 1}.0
              </span>
            </div>

            {/* Diagram / Illustration if attached */}
            {currentQ?.imageUrl && (
              <div className="rounded-2xl border border-border bg-muted/20 p-3 max-w-lg space-y-1.5">
                <img
                  src={currentQ.imageUrl}
                  alt={currentQ.imageCaption || "Question Diagram"}
                  className="rounded-xl object-contain max-h-56 w-auto mx-auto"
                />
                {currentQ.imageCaption && (
                  <p className="text-[11px] font-medium text-center text-muted-foreground italic">
                    {currentQ.imageCaption}
                  </p>
                )}
              </div>
            )}

            {/* Prompt */}
            <div className="text-base font-semibold text-foreground leading-relaxed">
              {currentQ?.prompt || "No prompt text provided for this question."}
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQ?.options?.map((opt) => {
                const isSelected = selectedAnswers[activeIdx] === opt.id
                const isActualCorrect = currentQ.correctOptionId === opt.id

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center gap-3.5 transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-xs"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div
                      className={`size-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      {opt.id}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-foreground flex-1">
                      {opt.text || `Option ${opt.id}`}
                    </span>
                    {/* Teacher Hint for verification */}
                    {isActualCorrect && (
                      <Badge variant="success" className="text-[10px] font-bold">
                        Key
                      </Badge>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Teacher Solution Preview */}
            {currentQ?.explanation && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs space-y-1">
                <span className="font-bold text-primary">Working / Solution Explanation:</span>
                <p className="text-muted-foreground leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}
          </div>

          {/* Right: Question Navigation Palette */}
          <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-border bg-muted/20 p-4 flex flex-col shrink-0">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Question Palette
            </span>

            <div className="grid grid-cols-5 gap-2 overflow-y-auto max-h-48 md:max-h-full">
              {questions.map((q, idx) => {
                const isCurrent = idx === activeIdx
                const isAnswered = selectedAnswers[idx] !== undefined

                return (
                  <button
                    key={q.id || idx}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={`h-9 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                      isCurrent
                        ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                        : isAnswered
                        ? "bg-status-success/15 border border-status-success/30 text-status-success"
                        : "border border-border bg-card text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <div className="p-4 border-t border-border bg-card flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={activeIdx === 0}
            onClick={() => setActiveIdx((prev) => prev - 1)}
            leftIcon={<ChevronLeft className="size-4" />}
            className="text-xs font-semibold"
          >
            Previous
          </Button>

          <span className="text-xs text-muted-foreground">
            {Object.keys(selectedAnswers).length} of {total} Simulated Answers
          </span>

          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={activeIdx >= total - 1}
            onClick={() => setActiveIdx((prev) => prev + 1)}
            rightIcon={<ChevronRight className="size-4" />}
            className="text-xs font-bold"
          >
            Next Question
          </Button>
        </div>
      </div>
    </div>
  )
}
