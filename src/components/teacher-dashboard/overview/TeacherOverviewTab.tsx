import {
  Sparkles,
  Users,
  Clock,
  FileCheck2,
  TrendingUp,
  ArrowRight,
  School,
  MapPin,
  CalendarCheck,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type {
  ITeacherProfile,
  ITeacherAssignedClass,
  ITeacherCbtExam,
  ITimetablePeriod,
  TeacherDashboardTab,
} from "@/types/teacher"

interface TeacherOverviewTabProps {
  profile: ITeacherProfile
  assignedClasses: ITeacherAssignedClass[]
  exams: ITeacherCbtExam[]
  timetable: ITimetablePeriod[]
  onNavigateTab: (tab: TeacherDashboardTab) => void
  onOpenExamBuilder: (exam: ITeacherCbtExam) => void
}

export function TeacherOverviewTab({
  profile,
  assignedClasses,
  exams,
  timetable,
  onNavigateTab,
  onOpenExamBuilder,
}: TeacherOverviewTabProps) {
  // Today's periods
  const todayPeriods = timetable.filter((t) => t.isToday)

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-linear-to-br from-card via-card to-primary/5 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="pill" className="text-xs font-bold gap-1.5 px-3 py-1">
                <School className="size-3.5 text-primary" />
                <span>{profile.schoolName}</span>
              </Badge>
              <Badge variant="outline" className="text-xs font-medium gap-1 text-muted-foreground">
                <MapPin className="size-3 text-primary" />
                <span>{profile.branchName}</span>
              </Badge>
              {profile.assignedClassRole && (
                <Badge variant="success" className="text-xs font-bold gap-1">
                  <CheckCircle2 className="size-3" />
                  <span>{profile.assignedClassRole}</span>
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back, {profile.fullName.split(" ")[0]}!
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Staff ID: <strong className="text-foreground font-mono">{profile.staffId}</strong> •{" "}
              {profile.department}. You have{" "}
              <strong className="text-foreground">{assignedClasses.length} assigned classes</strong> and{" "}
              <strong className="text-foreground">{exams.length} active CBT assessments</strong>.
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            {exams.length > 0 && (
              <Button
                variant="primary"
                size="default"
                sheen
                onClick={() => onOpenExamBuilder(exams[0])}
                leftIcon={<Sparkles className="size-4" />}
                className="text-xs font-bold shadow-md shadow-primary/20"
              >
                Set Questions ({exams[0].subject})
              </Button>
            )}
            <Button
              variant="outline"
              size="default"
              onClick={() => onNavigateTab("gradebook")}
              leftIcon={<TrendingUp className="size-4 text-primary" />}
              className="text-xs font-bold"
            >
              Open Broadsheet Gradebook
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Students
              </span>
              <p className="text-2xl font-extrabold text-foreground">
                {profile.totalStudentsTaught}
              </p>
              <span className="text-[11px] text-muted-foreground">
                Across {assignedClasses.length} assigned classes
              </span>
            </div>
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
              <Users className="size-5.5" />
            </div>
          </CardContent>
        </Card>

        {/* Weekly Teaching Load */}
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Weekly Periods
              </span>
              <p className="text-2xl font-extrabold text-foreground">
                {profile.totalWeeklyPeriods}
              </p>
              <span className="text-[11px] text-muted-foreground">
                Standard 45-min instructional periods
              </span>
            </div>
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
              <Clock className="size-5.5" />
            </div>
          </CardContent>
        </Card>

        {/* CBT Exams */}
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                CBT Assessments
              </span>
              <p className="text-2xl font-extrabold text-foreground">
                {exams.length}
              </p>
              <span className="text-[11px] text-muted-foreground">
                {exams.filter((e) => e.status === "draft").length} in draft / question setting
              </span>
            </div>
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
              <FileCheck2 className="size-5.5" />
            </div>
          </CardContent>
        </Card>

        {/* Performance Average */}
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Class Average
              </span>
              <p className="text-2xl font-extrabold text-foreground">
                76.4%
              </p>
              <span className="text-[11px] text-status-success font-semibold">
                WAEC Grade B2 Average
              </span>
            </div>
            <div className="flex size-11 items-center justify-center rounded-2xl bg-status-success/10 text-status-success shrink-0">
              <TrendingUp className="size-5.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout: Today's Schedule HUD + Recent CBT Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Teaching Schedule HUD */}
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="size-4.5 text-primary" />
              <CardTitle className="text-sm font-bold text-foreground">
                Today&apos;s Teaching Schedule
              </CardTitle>
            </div>
            <Badge variant="pill" className="text-[10px] font-bold">
              {todayPeriods.length} Periods Today
            </Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {todayPeriods.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No classes scheduled for today.
              </p>
            ) : (
              todayPeriods.map((period) => (
                <div
                  key={period.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    period.isCurrent
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`size-2.5 rounded-full ${
                          period.isCurrent ? "bg-primary animate-pulse" : "bg-muted-foreground/40"
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">
                            {period.subjectName}
                          </span>
                          <Badge variant="outline" className="text-[10px] font-semibold">
                            {period.className}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{period.room}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-foreground">
                        {period.timeSlot}
                      </span>
                      {period.isCurrent && (
                        <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
                          Active Now
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateTab("profile")}
              className="w-full text-xs font-semibold text-muted-foreground hover:text-foreground mt-2"
              rightIcon={<ArrowRight className="size-3.5" />}
            >
              View Full Weekly Timetable
            </Button>
          </CardContent>
        </Card>

        {/* Recent CBT Assessments */}
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck2 className="size-4.5 text-primary" />
              <CardTitle className="text-sm font-bold text-foreground">
                CBT & Assessments Overview
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateTab("assessments")}
              className="text-xs font-bold text-primary hover:text-primary"
              rightIcon={<ArrowRight className="size-3.5" />}
            >
              All Exams
            </Button>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="p-3.5 rounded-xl border border-border bg-card hover:border-primary/40 transition-all flex items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground truncate">
                      {exam.title}
                    </span>
                    <Badge
                      variant={
                        exam.status === "live"
                          ? "destructive"
                          : exam.status === "scheduled"
                          ? "default"
                          : "pill"
                      }
                      className="text-[10px] uppercase font-bold shrink-0"
                    >
                      {exam.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-primary">{exam.subject}</span>
                    <span>•</span>
                    <span className="truncate">{exam.targetClasses.join(", ")}</span>
                    <span>•</span>
                    <span>{exam.readyQuestionsCount}/{exam.totalQuestions} Qs</span>
                  </div>
                </div>

                <Button
                  variant={exam.status === "draft" ? "primary" : "outline"}
                  size="sm"
                  sheen={exam.status === "draft"}
                  onClick={() => onOpenExamBuilder(exam)}
                  className="shrink-0 text-xs font-bold"
                >
                  {exam.status === "draft" ? "Set Questions" : "Manage"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
