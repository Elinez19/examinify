import { Clock, HelpCircle, ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { IUpcomingExam } from "@/types/student"

interface ExamScheduleItemProps {
  exam: IUpcomingExam
  onStartExam: (examId: string) => void
}

export function ExamScheduleItem({ exam, onStartExam }: ExamScheduleItemProps) {
  const isOpen = exam.status === "open"

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border bg-card/60 hover:bg-muted/40 transition-all duration-200">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant={isOpen ? "success" : "default"}
            className="text-[10px] uppercase font-bold tracking-wider"
          >
            {isOpen ? "Active Now" : exam.examType}
          </Badge>
          <span className="text-xs font-semibold text-muted-foreground">
            {exam.subject}
          </span>
        </div>

        <h4 className="text-sm font-bold text-foreground">
          {exam.title}
        </h4>

        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-0.5">
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="size-3.5 text-primary" />
            {exam.scheduledDate} ({exam.durationMinutes} mins)
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <HelpCircle className="size-3.5 text-muted-foreground" />
            {exam.totalQuestions} Questions
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
        <Button
          variant={isOpen ? "primary" : "outline"}
          size="sm"
          sheen={isOpen}
          onClick={() => onStartExam(exam.id)}
          className="text-xs font-semibold w-full sm:w-auto"
          rightIcon={isOpen ? <Play className="size-3.5 fill-current" /> : <ArrowRight className="size-3.5" />}
        >
          {isOpen ? "Start CBT Session" : "View Syllabus"}
        </Button>
      </div>
    </div>
  )
}
