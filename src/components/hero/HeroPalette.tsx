import { Button } from "@/components/ui/button"

interface HeroPaletteProps {
  currentQuestionNumber: number
  heroFlagged: boolean
  onExploreCbt: () => void
}

export function HeroPalette({
  currentQuestionNumber,
  heroFlagged,
  onExploreCbt,
}: HeroPaletteProps) {
  return (
    <div className="rounded-2xl border border-border bg-card/95 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-foreground">
          Question Palette
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
          13/40 Answered
        </span>
      </div>

      {/* Palette Status Legend */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-primary" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-status-warning" />
          <span>Flagged</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-muted" />
          <span>Unvisited</span>
        </div>
      </div>

      {/* Question Jump Buttons Grid */}
      <div className="mt-4 grid grid-cols-5 gap-2">
        {Array.from({ length: 20 }, (_, i) => {
          const num = i + 1
          const isCurrent = num === currentQuestionNumber
          const isAnswered = num < currentQuestionNumber && num % 3 !== 0
          const isFlag = num === 7 || (isCurrent && heroFlagged)
          return (
            <button
              key={num}
              type="button"
              className={`flex size-9 items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                isCurrent
                  ? "bg-primary text-primary-foreground ring-2 ring-primary/40 ring-offset-2 ring-offset-background font-bold shadow-sm"
                  : isFlag
                  ? "bg-status-warning/20 text-status-warning border border-status-warning/40 font-bold"
                  : isAnswered
                  ? "bg-primary/20 text-primary font-semibold border border-primary/30"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {num}
            </button>
          )
        })}
      </div>

      {/* Instant Submit Button */}
      <div className="mt-6 border-t border-border pt-4">
        <Button
          variant="primary"
          size="default"
          className="w-full"
          onClick={onExploreCbt}
        >
          Submit Practice Exam
        </Button>
      </div>
    </div>
  )
}
