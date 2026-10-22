import { CheckCircle2, Circle, Clock, X, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { ISubjectItem } from "@/types/student"

interface SubjectTopicsViewProps {
  subject: ISubjectItem
  onClose: () => void
  onToggleTopic: (topicId: string) => void
}

export function SubjectTopicsView({
  subject,
  onClose,
  onToggleTopic,
}: SubjectTopicsViewProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-md space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-3 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="primary" className="text-xs">
              {subject.code}
            </Badge>
            <Badge variant="pill" className="text-xs">
              {subject.category}
            </Badge>
          </div>
          <h3 className="text-lg font-bold text-foreground">
            {subject.name} — Syllabus Blueprint
          </h3>
          <p className="text-xs text-muted-foreground">
            Instructor: {subject.teacherName} ({subject.teacherEmail})
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          aria-label="Close syllabus view"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Progress Metric */}
      <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground">
            Curriculum Coverage
          </span>
          <span className="font-bold text-primary">
            {subject.syllabusProgress}% ({subject.completedTopicsCount} of {subject.totalTopicsCount} topics)
          </span>
        </div>
        <Progress value={subject.syllabusProgress} className="h-2" />
        <p className="text-[11px] text-muted-foreground">
          Click any topic checkbox below to toggle your personal revision milestone.
        </p>
      </div>

      {/* Topics Checklist */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Topic Breakdown & Revision Milestones
        </h4>

        <div className="space-y-2">
          {subject.topics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => onToggleTopic(topic.id)}
              className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-card/80 hover:bg-muted/40 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                {topic.isCompleted ? (
                  <CheckCircle2 className="size-4.5 text-status-success shrink-0" />
                ) : (
                  <Circle className="size-4.5 text-muted-foreground shrink-0" />
                )}
                <div>
                  <span
                    className={`text-xs font-semibold ${
                      topic.isCompleted
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {topic.title}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant={
                    topic.difficulty === "Advanced"
                      ? "destructive"
                      : topic.difficulty === "Intermediate"
                      ? "warning"
                      : "default"
                  }
                  className="text-[10px] px-1.5 py-0.2"
                >
                  {topic.difficulty}
                </Badge>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="size-3 text-primary" />
                  {topic.hours}h
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-2 flex items-center justify-between border-t border-border">
        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
          <BookOpen className="size-4 text-primary" />
          <span>Standardized to National Examination Board Syllabus</span>
        </span>
        <Button
          variant="primary"
          size="sm"
          sheen
          onClick={onClose}
          className="text-xs font-semibold"
        >
          Save & Close View
        </Button>
      </div>
    </div>
  )
}
