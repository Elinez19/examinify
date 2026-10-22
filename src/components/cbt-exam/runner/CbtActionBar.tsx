import {
  ChevronLeft,
  ChevronRight,
  SendHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface CbtActionBarProps {
  hasPrevious: boolean
  hasNext: boolean
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
}

export function CbtActionBar({
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  onSubmit,
}: CbtActionBarProps) {
  return (
    <div className="w-full border-t border-border bg-card/90 backdrop-blur-md px-4 sm:px-6 py-3 sticky bottom-0 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="default"
          onClick={onPrevious}
          disabled={!hasPrevious}
          leftIcon={<ChevronLeft className="size-4" />}
          className="text-xs font-semibold gap-1.5"
        >
          <span>Previous</span>
          <span className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            [P]
          </span>
        </Button>

        {/* Next & Submit Actions */}
        <div className="flex items-center gap-2.5">
          {hasNext ? (
            <Button
              variant="primary"
              size="default"
              onClick={onNext}
              rightIcon={<ChevronRight className="size-4" />}
              className="text-xs font-semibold gap-1.5"
            >
              <span>Next</span>
              <span className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary-foreground/20 text-primary-foreground">
                [N]
              </span>
            </Button>
          ) : (
            <div />
          )}

          {/* Submit Examination Button */}
          <Button
            variant="default"
            size="default"
            sheen
            onClick={onSubmit}
            rightIcon={<SendHorizontal className="size-4" />}
            className="text-xs font-bold bg-brand-navy hover:bg-brand-navy/90 text-brand-navy-foreground shadow-sm gap-1.5"
          >
            <span>Submit Exam</span>
            <span className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20 text-white">
              [S]
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}
