import type { ICbtQuestion, ICbtAnswerMap, ICbtFlagMap, ICbtVisitedMap } from "../../types/cbt"

interface CbtQuestionPaletteProps {
  questions: ICbtQuestion[]
  activeQuestionIndex: number
  answers: ICbtAnswerMap
  flagged: ICbtFlagMap
  visited: ICbtVisitedMap
  subjectName: string
  onJumpToQuestion: (index: number) => void
}

export function CbtQuestionPalette({
  questions,
  activeQuestionIndex,
  answers,
  flagged,
  visited,
  subjectName,
  onJumpToQuestion,
}: CbtQuestionPaletteProps) {
  const answeredCount = questions.filter((q) => Boolean(answers[q.id])).length
  const flaggedCount = questions.filter((q) => Boolean(flagged[q.id])).length
  const unansweredCount = questions.length - answeredCount
  const completionPercent = Math.round((answeredCount / Math.max(1, questions.length)) * 100)

  return (
    <div className="w-full lg:w-72 bg-card rounded-2xl border border-border p-4 space-y-4 shrink-0 shadow-xs">
      {/* Palette Header */}
      <div className="space-y-2 border-b border-border pb-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-foreground truncate">
            {subjectName} Palette
          </h4>
          <span className="text-[11px] font-mono font-bold text-primary">
            {completionPercent}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-status-success transition-all duration-300"
            style={{ width: `${completionPercent}%` }}
          />
        </div>

        {/* Stats Summary Pills */}
        <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
          <div className="p-1 rounded-lg bg-status-success/10 border border-status-success/20">
            <span className="block text-[11px] font-bold text-status-success">
              {answeredCount}
            </span>
            <span className="text-[9px] font-semibold text-muted-foreground uppercase">
              Answered
            </span>
          </div>
          <div className="p-1 rounded-lg bg-muted border border-border">
            <span className="block text-[11px] font-bold text-muted-foreground">
              {unansweredCount}
            </span>
            <span className="text-[9px] font-semibold text-muted-foreground uppercase">
              Left
            </span>
          </div>
          <div className="p-1 rounded-lg bg-status-warning/10 border border-status-warning/20">
            <span className="block text-[11px] font-bold text-status-warning">
              {flaggedCount}
            </span>
            <span className="text-[9px] font-semibold text-muted-foreground uppercase">
              Flagged
            </span>
          </div>
        </div>
      </div>

      {/* Question Number Matrix */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
          Question Matrix (Click to jump)
        </span>

        <div className="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-1">
          {questions.map((q, idx) => {
            const isCurrent = idx === activeQuestionIndex
            const isAnswered = Boolean(answers[q.id])
            const isFlag = Boolean(flagged[q.id])
            const isVisited = Boolean(visited[q.id])

            // Determine status style
            let statusStyle = "bg-muted text-muted-foreground border border-border hover:bg-muted/80"

            if (isFlag) {
              statusStyle = "bg-status-warning text-white font-bold shadow-2xs hover:bg-status-warning/90"
            } else if (isAnswered) {
              statusStyle = "bg-status-success text-white font-bold shadow-2xs hover:bg-status-success/90"
            } else if (isVisited) {
              statusStyle = "bg-primary/10 text-primary border border-primary/40 font-semibold hover:bg-primary/20"
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onJumpToQuestion(idx)}
                title={`Question ${idx + 1}${isFlag ? " (Flagged)" : isAnswered ? " (Answered)" : ""}`}
                className={`cursor-pointer size-9 rounded-xl flex items-center justify-center text-xs transition-all duration-150 ${statusStyle} ${
                  isCurrent
                    ? "ring-2 ring-primary ring-offset-2 scale-105 font-extrabold"
                    : ""
                }`}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>
      </div>

      {/* Palette Legend */}
      <div className="border-t border-border pt-3 space-y-1.5 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-status-success shrink-0" />
          <span className="text-muted-foreground font-medium">Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-status-warning shrink-0" />
          <span className="text-muted-foreground font-medium">Flagged for Review</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-primary/20 border border-primary/40 shrink-0" />
          <span className="text-muted-foreground font-medium">Visited (Unanswered)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-muted border border-border shrink-0" />
          <span className="text-muted-foreground font-medium">Unvisited</span>
        </div>
      </div>
    </div>
  )
}
