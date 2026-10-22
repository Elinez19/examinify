import { Zap, Clock, ArrowRight, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ISubjectItem } from "@/types/student"

interface SubjectExamNoticeProps {
  scheduledSubjects: ISubjectItem[]
  onStartExam: (examId: string) => void
}

export function SubjectExamNotice({
  scheduledSubjects,
  onStartExam,
}: SubjectExamNoticeProps) {
  if (!scheduledSubjects || scheduledSubjects.length === 0) {
    return null
  }

  const nextExam = scheduledSubjects[0]
  const nextExamId = nextExam.examSchedule.examId || "exm-term2-day1"

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-linear-to-r from-primary/10 via-card to-primary/5 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Notice Content */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="primary" className="font-bold px-2.5 py-0.5 text-[11px] gap-1.5 shadow-xs">
              <span className="size-2 rounded-full bg-primary-foreground animate-pulse" />
              <span>Live CBT Schedule Today</span>
            </Badge>
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Clock className="size-3.5 text-primary" />
              <span>{scheduledSubjects.length} {scheduledSubjects.length === 1 ? "Subject" : "Subjects"} Scheduled</span>
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Zap className="size-4.5 text-primary fill-primary" />
              <span>Examination Session Active for Today</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              You are scheduled to sit for{" "}
              {scheduledSubjects.map((s, idx) => (
                <span key={s.id}>
                  <strong className="text-foreground font-semibold">{s.name}</strong> ({s.examSchedule.scheduledTime})
                  {idx < scheduledSubjects.length - 1 ? " and " : "."}
                </span>
              ))}{" "}
              Please verify your workstation, internet connection, and launch your test promptly.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium pt-0.5">
            <ShieldCheck className="size-3.5 text-status-success" />
            <span>Biometric verification validated • Anti-malpractice proctoring active</span>
          </div>
        </div>

        {/* Right: Quick Launch Button */}
        <div className="flex items-center shrink-0">
          <Button
            variant="primary"
            size="default"
            sheen
            onClick={() => onStartExam(nextExamId)}
            className="w-full sm:w-auto text-xs font-bold shadow-md shadow-primary/20"
            rightIcon={<ArrowRight className="size-4" />}
          >
            Launch {nextExam.name.split(" ")[0]} CBT
          </Button>
        </div>
      </div>
    </div>
  )
}
