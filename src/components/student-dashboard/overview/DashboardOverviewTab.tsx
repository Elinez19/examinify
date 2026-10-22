import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  BookOpen,
  Megaphone,
  School,
  CalendarCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { DashboardMetricsGrid } from "./DashboardMetricsGrid"
import { UpcomingExamsCard } from "./UpcomingExamsCard"
import { RecentResultsCard } from "./RecentResultsCard"
import type {
  IStudentProfile,
  IDashboardMetric,
  IUpcomingExam,
  IRecentExamResult,
  IClassAnnouncement,
  DashboardTab,
} from "@/types/student"

interface DashboardOverviewTabProps {
  profile: IStudentProfile
  metrics: IDashboardMetric[]
  upcomingExams: IUpcomingExam[]
  recentResults: IRecentExamResult[]
  announcements: IClassAnnouncement[]
  onStartExam: (examId: string) => void
  onNavigateTab: (tab: DashboardTab) => void
}

export function DashboardOverviewTab({
  profile,
  metrics,
  upcomingExams,
  recentResults,
  announcements,
  onStartExam,
  onNavigateTab,
}: DashboardOverviewTabProps) {
  const enrolledClass = profile.enrolledClass

  // Detect today's scheduled exams
  const todayExams = upcomingExams.filter(
    (e) => e.status === "open" || e.scheduledDate.toLowerCase().includes("today")
  )

  return (
    <div className="space-y-6">
      {/* Candidate Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-linear-to-br from-card via-card to-primary/5 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="pill" className="text-xs font-bold gap-1.5 px-3 py-1">
                <GraduationCap className="size-3.5 text-primary" />
                <span>Candidate Reg: {profile.registrationNumber}</span>
              </Badge>
              <Badge variant="default" className="text-xs font-semibold">
                {profile.academicStanding}
              </Badge>
              {enrolledClass && (
                <Badge variant="outline" className="text-xs font-medium gap-1 text-muted-foreground">
                  <School className="size-3 text-primary" />
                  <span>{enrolledClass.name}</span>
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back, {profile.fullName.split(" ")[0]}!
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Enrolled in <strong className="text-foreground">{enrolledClass?.name}</strong> ({enrolledClass?.room}) under Lead Instructor{" "}
              <strong className="text-foreground">{enrolledClass?.teacherName}</strong>. You have 13 active curriculum subjects.
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            {todayExams.length > 0 ? (
              <Button
                variant="primary"
                size="default"
                sheen
                onClick={() => onStartExam(todayExams[0].id)}
                leftIcon={<Sparkles className="size-4" />}
                className="text-xs font-bold shadow-md shadow-primary/20"
              >
                Start Today's CBT ({todayExams[0].subject.split(":")[0]})
              </Button>
            ) : (
              <Button
                variant="primary"
                size="default"
                sheen
                onClick={() => onNavigateTab("exams")}
                leftIcon={<CalendarCheck className="size-4" />}
                className="text-xs font-bold"
              >
                View Exam Timetable
              </Button>
            )}

            <Button
              variant="outline"
              size="default"
              onClick={() => onNavigateTab("subjects")}
              leftIcon={<BookOpen className="size-4 text-primary" />}
              className="text-xs font-semibold"
            >
              Enrolled Subjects (13)
            </Button>
          </div>
        </div>
      </div>

      {/* Prominent Notice for Today's Scheduled Exams if any */}
      {todayExams.length > 0 && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shrink-0 shadow-xs">
              <CalendarCheck className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                CBT Examination Sitting Notice for Today
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                You have {todayExams.length} scheduled tests today:{" "}
                {todayExams.map((e, idx) => (
                  <span key={e.id} className="font-semibold text-foreground">
                    {e.subject} ({e.scheduledDate}){idx < todayExams.length - 1 ? " and " : "."}
                  </span>
                ))}
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            sheen
            onClick={() => onStartExam(todayExams[0].id)}
            className="text-xs font-bold self-start sm:self-auto shrink-0"
            rightIcon={<ArrowRight className="size-3.5" />}
          >
            Take Test Now
          </Button>
        </div>
      )}

      {/* 4 Focused KPI Metric Cards Grid */}
      <DashboardMetricsGrid metrics={metrics} />

      {/* 2-Column Split: Today's Exams & Recent Results / Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Scheduled Tests & Subjects Shortcut */}
        <div className="lg:col-span-7 space-y-6">
          <UpcomingExamsCard
            exams={upcomingExams}
            onStartExam={onStartExam}
          />

          {/* Clean 13 Subjects Snapshot Card */}
          <Card glossy>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Enrolled Subjects Table</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    13 subjects registered for {enrolledClass?.name}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab("subjects")}
                className="text-xs text-primary font-semibold"
                rightIcon={<ArrowRight className="size-3.5" />}
              >
                Open Full Table
              </Button>
            </CardHeader>

            <CardContent className="pt-2 text-xs">
              <div className="rounded-xl border border-border bg-muted/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-foreground block">
                    Continuous Assessment & Syllabus Tracking
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Mathematics, English, Physics, Chemistry, Biology, Further Maths, and 7 more subjects.
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigateTab("subjects")}
                  className="text-xs font-semibold shrink-0"
                >
                  View 13 Subjects
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (5 cols): Recent Results & Class Announcements */}
        <div className="lg:col-span-5 space-y-6">
          <RecentResultsCard results={recentResults} />

          {/* Class Bulletin / Announcements */}
          <Card glossy>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-status-info/10 text-status-info">
                  <Megaphone className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Classroom Notices</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Updates from {enrolledClass?.name} instructors
                  </p>
                </div>
              </div>
              <Badge variant="info" className="text-xs font-semibold">
                Live Feed
              </Badge>
            </CardHeader>

            <CardContent className="space-y-3 pt-2">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="rounded-xl border border-border bg-card/60 p-3.5 space-y-1.5 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-foreground line-clamp-1">
                      {ann.title}
                    </span>
                    {ann.priority === "urgent" && (
                      <Badge variant="destructive" className="text-[9px] uppercase px-1.5 py-0.2">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {ann.content}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground font-medium">
                    <span>{ann.senderName} ({ann.senderRole})</span>
                    <span>{ann.timestamp}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
