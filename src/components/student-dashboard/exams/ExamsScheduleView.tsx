import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  ShieldCheck,
  Calendar,
  Sparkles,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { IUpcomingExam, IClassCohort } from "../../types/student"

interface ExamsScheduleViewProps {
  upcomingExams: IUpcomingExam[]
  enrolledClass: IClassCohort
  onStartExam: (examId: string) => void
}

export function ExamsScheduleView({
  upcomingExams,
  enrolledClass,
  onStartExam,
}: ExamsScheduleViewProps) {
  const todayExams = upcomingExams.filter(
    (e) => e.status === "open" || e.scheduledDate.toLowerCase().includes("today")
  )
  const scheduledFutureExams = upcomingExams.filter(
    (e) => !todayExams.some((t) => t.id === e.id)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Examinations & CBT Schedule
            </h1>
            <Badge variant="pill" className="text-xs font-bold">
              {enrolledClass.name}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Official timed test sessions, timetable calendar, and CBT workstation instructions.
          </p>
        </div>

        {todayExams.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto rounded-xl bg-status-success/10 border border-status-success/20 px-3.5 py-1.5 text-xs font-bold text-status-success">
            <span className="size-2 rounded-full bg-status-success animate-ping" />
            <span>{todayExams.length} Sittings Ready Today</span>
          </div>
        )}
      </div>

      {/* Today's Active Sittings Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <span>Today's Examination Sittings</span>
          </h2>
          <span className="text-xs text-muted-foreground font-medium">
            Room: {enrolledClass.room}
          </span>
        </div>

        {todayExams.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <CheckCircle2 className="size-8 text-status-success mx-auto" />
              <p className="text-sm font-semibold text-foreground mt-2">
                No examinations scheduled for today
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Check the timetable below for upcoming assessments.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayExams.map((exam) => (
              <div
                key={exam.id}
                className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card p-5 shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="default" className="text-[10px] font-bold uppercase">
                      {exam.examType}
                    </Badge>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-status-success">
                      <span className="size-2 rounded-full bg-status-success animate-pulse" />
                      <span>Ready to Start</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-foreground leading-snug">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                      {exam.subject}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border text-center">
                    <div className="rounded-lg bg-muted/50 p-2">
                      <span className="text-[10px] text-muted-foreground block font-medium">Duration</span>
                      <span className="text-xs font-bold text-foreground">{exam.durationMinutes} mins</span>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2">
                      <span className="text-[10px] text-muted-foreground block font-medium">Questions</span>
                      <span className="text-xs font-bold text-foreground">{exam.totalQuestions} Qs</span>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2">
                      <span className="text-[10px] text-muted-foreground block font-medium">Pass Mark</span>
                      <span className="text-xs font-bold text-foreground">{exam.passingScore}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Clock className="size-3.5 text-primary" />
                    <span>{exam.scheduledDate}</span>
                  </span>

                  <Button
                    variant="primary"
                    size="sm"
                    sheen
                    onClick={() => onStartExam(exam.id)}
                    className="text-xs font-bold"
                    leftIcon={<Play className="size-3.5 fill-current" />}
                  >
                    Start CBT Exam
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Exam Timetable */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Calendar className="size-4 text-primary" />
          <span>Upcoming Examination Timetable</span>
        </h2>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
          <div className="divide-y divide-border">
            {scheduledFutureExams.map((exam) => (
              <div
                key={exam.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-3 hover:bg-muted/20 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">
                      {exam.title}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {exam.examType}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {exam.subject} • {exam.durationMinutes} mins • {exam.totalQuestions} Questions
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    <span>{exam.scheduledDate}</span>
                  </span>
                  <Badge variant="pill" className="text-xs">
                    Scheduled
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CBT Candidate Guidelines & Integrity Rules */}
      <Card glossy>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold">CBT Examination Guidelines</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Standard operating instructions for computer-based tests
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-1">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Clock className="size-3.5 text-primary" />
                <span>Timed Auto-Submission</span>
              </span>
              <p className="text-muted-foreground leading-relaxed text-[11px]">
                The timer runs on official server time. When the clock reaches zero, your test is saved and submitted automatically.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-1">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <AlertTriangle className="size-3.5 text-status-warning" />
                <span>Anti-Malpractice Proctoring</span>
              </span>
              <p className="text-muted-foreground leading-relaxed text-[11px]">
                Navigating outside the test window or switching tabs triggers automated security warnings and alerts examiners.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-1">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <HelpCircle className="size-3.5 text-status-info" />
                <span>Flag for Review</span>
              </span>
              <p className="text-muted-foreground leading-relaxed text-[11px]">
                Use the question palette to flag uncertain questions and jump freely between items before final confirmation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
