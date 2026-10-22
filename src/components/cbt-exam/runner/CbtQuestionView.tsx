import { Bookmark } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ICbtQuestion, ICbtQuestionOption } from "../../types/cbt"
import type { CbtFontSize } from "../../hooks/useCbtExamRunner"

interface CbtQuestionViewProps {
  question: ICbtQuestion
  subjectName: string
  totalSubjectQuestions: number
  selectedOptionId?: string
  isFlagged: boolean
  fontSize: CbtFontSize
  onSelectOption: (optionId: string) => void
  onToggleFlag: () => void
  onClearOption: () => void
}

export function CbtQuestionView({
  question,
  subjectName,
  totalSubjectQuestions,
  selectedOptionId,
  isFlagged,
  fontSize,
  onSelectOption,
  onToggleFlag,
  onClearOption,
}: CbtQuestionViewProps) {
  const getFontSizeClasses = () => {
    switch (fontSize) {
      case "large":
        return {
          prompt: "text-lg sm:text-xl",
          option: "text-base sm:text-lg",
        }
      case "extra-large":
        return {
          prompt: "text-xl sm:text-2xl",
          option: "text-lg sm:text-xl",
        }
      default:
        return {
          prompt: "text-base sm:text-lg",
          option: "text-sm sm:text-base",
        }
    }
  }

  const fontClasses = getFontSizeClasses()

  return (
    <div className="flex-1 flex flex-col space-y-6">
      {/* Question Header Meta Bar */}
      <div className="flex items-center justify-between gap-3 border-b border-border pb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-xs font-bold px-2.5 py-0.5">
            {subjectName}
          </Badge>
          <span className="text-xs font-semibold text-muted-foreground">
            Question {question.questionNumber} of {totalSubjectQuestions}
          </span>
          <span className="text-xs text-muted-foreground">• {question.points} Marks</span>
        </div>

        {/* Flag for Review Toggle Button */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFlag}
            className={`text-xs font-semibold gap-1.5 transition-colors ${
              isFlagged
                ? "border-status-warning bg-status-warning/10 text-status-warning hover:bg-status-warning/20 font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bookmark className={`size-3.5 ${isFlagged ? "fill-current" : ""}`} />
            <span>{isFlagged ? "Flagged for Review" : "Flag Question"}</span>
            <span className="hidden sm:inline text-[10px] font-mono px-1 py-0 rounded bg-muted/60 text-muted-foreground ml-1">
              [R]
            </span>
          </Button>

          {selectedOptionId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearOption}
              className="text-xs text-muted-foreground hover:text-destructive h-8 px-2"
            >
              Clear Choice
            </Button>
          )}
        </div>
      </div>

      {/* Question Stem Prompt */}
      <div className="space-y-3">
        <p
          className={`font-semibold text-foreground leading-relaxed ${fontClasses.prompt}`}
        >
          {question.prompt}
        </p>

        {question.contextSnippet && (
          <div className="p-3.5 rounded-xl bg-muted/50 border border-border text-xs font-mono text-muted-foreground whitespace-pre-wrap">
            {question.contextSnippet}
          </div>
        )}
      </div>

      {/* Answer Options List */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
          <span>Choose the single best option:</span>
          <span className="hidden sm:inline font-mono text-[11px]">
            Shortcut keys: <strong className="text-primary font-bold">A</strong>,{" "}
            <strong className="text-primary font-bold">B</strong>,{" "}
            <strong className="text-primary font-bold">C</strong>,{" "}
            <strong className="text-primary font-bold">D</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option: ICbtQuestionOption) => {
            const isSelected = selectedOptionId === option.id

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelectOption(option.id)}
                className={`w-full text-left cursor-pointer flex items-center gap-4 p-4 rounded-2xl border transition-all duration-150 ${
                  isSelected
                    ? "border-primary bg-primary/8 shadow-xs ring-2 ring-primary/20 scale-[1.005]"
                    : "border-border bg-card hover:bg-muted/40 hover:border-border/80"
                }`}
              >
                {/* Letter Indicator Circle (A, B, C, D) */}
                <div
                  className={`size-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "bg-muted text-foreground border border-border"
                  }`}
                >
                  {option.label}
                </div>

                {/* Option Text */}
                <div className="flex-1 min-w-0">
                  <span
                    className={`font-medium leading-relaxed block ${
                      isSelected ? "text-foreground font-bold" : "text-foreground"
                    } ${fontClasses.option}`}
                  >
                    {option.text}
                  </span>
                </div>

                {/* Selection Radio Dot */}
                <div
                  className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30 bg-card"
                  }`}
                >
                  {isSelected && <div className="size-2 rounded-full bg-white" />}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
