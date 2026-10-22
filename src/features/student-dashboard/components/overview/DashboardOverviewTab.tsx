import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  School,
  BookOpen,
  Megaphone,
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
  IClassCohort,
  IClassAnnouncement,
  DashboardTab,
} from "../../types/student"

interface DashboardOverviewTabProps {
  profile: IStudentProfile
  metrics: IDashboardMetric[]
  upcomingExams: IUpcomingExam[]
  recentResults: IRecentExamResult[]
  primaryClass?: IClassCohort
  announcements: IClassAnnouncement[]
  onStartExam: (examId: string) => void
  onNavigateTab: (tab: DashboardTab) => void
}

export function DashboardOverviewTab({
  profile,
  metrics,
  upcomingExams,
  recentResults,
  primaryClass,
  announcements,
  onStartExam,
  onNavigateTab,
}: DashboardOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Candidate Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-linear-to-br from-card via-card to-primary/5 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="pill" className="text-xs font-semibold gap-1.5 px-3 py-1">
                <GraduationCap className="size-3.5 text-primary" />
                <span>Candidate Reg: {profile.registrationNumber}</span>
              </Badge>
              <Badge variant="default" className="text-xs font-semibold">
                {profile.academicStanding}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back, {profile.fullName.split(" ")[0]}!
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed">
              You are currently enrolled in{" "}
              <strong className="text-foreground">{profile.department}</strong> at{" "}
              <strong className="text-foreground">{profile.institutionName}</strong>. Your target exam is{" "}
              <strong className="text-primary">{profile.targetExamTrack}</strong>.
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <Button
              variant="primary"
              size="default"
              sheen
              onClick={() => onStartExam("exm-term2-day1")}
              leftIcon={<Sparkles className="size-4" />}
              className="text-xs font-bold"
            >
              Start Day 1 CBT (2 Subjects: Math & Physics)
            </Button>
            <Button
              variant="outline"
              size="default"
              onClick={() => onStartExam("exm-jamb-mock-2")}
              leftIcon={<BookOpen className="size-4 text-primary" />}
              className="text-xs font-semibold"
            >
              National JAMB Mock (4 Subjects)
            </Button>
          </div>
        </div>
      </div>

      {/* 4-KPI Metric Cards Grid */}
      <DashboardMetricsGrid metrics={metrics} />

      {/* 2-Column Split: Exams & Results + Classes & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Upcoming CBT Exams & Quick Subject Progress */}
        <div className="lg:col-span-7 space-y-6">
          <UpcomingExamsCard
            exams={upcomingExams}
            onStartExam={onStartExam}
          />

          {/* Active Class Snapshot */}
          {primaryClass && (
            <Card glossy>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <School className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Current Primary Class</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {primaryClass.term} • {primaryClass.academicYear}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigateTab("classes")}
                  className="text-xs text-primary font-semibold"
                  rightIcon={<ArrowRight className="size-3.5" />}
                >
                  All Classes
                </Button>
              </CardHeader>

              <CardContent className="space-y-3 pt-2 text-xs">
                <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">
                      {primaryClass.name}
                    </span>
                    <Badge variant="pill">{primaryClass.code}</Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {primaryClass.description}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border text-muted-foreground">
                    <span>
                      <strong>Lead Teacher:</strong> {primaryClass.teacherName}
                    </span>
                    <span>
                      <strong>Room:</strong> {primaryClass.room}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
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
                    Updates from your class instructors
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
