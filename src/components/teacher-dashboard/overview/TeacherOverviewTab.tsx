import {
  BookOpen,
  Users,
  FileCheck2,
  FileEdit,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type {
  ITeacherProfile,
  ITeacherAssignedClass,
  ITeacherCbtExam,
  ITeacherSubject,
  TeacherDashboardTab,
} from "@/types/teacher"
import { MOCK_TEACHER_SUBJECTS } from "@/services/teacher-dashboard/mockTeacherData"

interface TeacherOverviewTabProps {
  profile: ITeacherProfile
  assignedClasses: ITeacherAssignedClass[]
  exams: ITeacherCbtExam[]
  subjects?: ITeacherSubject[]
  onNavigateTab: (tab: TeacherDashboardTab) => void
  onOpenExamBuilder: (exam?: ITeacherCbtExam | null) => void
}

export function TeacherOverviewTab({
  profile,
  assignedClasses,
  exams,
  subjects = MOCK_TEACHER_SUBJECTS,
  onNavigateTab,
  onOpenExamBuilder,
}: TeacherOverviewTabProps) {
  const publishedExams = exams.filter((e) => e.status === "published" || e.status === "live")
  const draftExams = exams.filter((e) => e.status === "draft")
  const totalStudents = assignedClasses.reduce((sum, c) => sum + c.studentCount, 0)

  const firstName = profile.fullName.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.)\s*/i, "").split(" ")[0]

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome & Create New Exam Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back, {firstName}!
            </h1>
            <Sparkles className="size-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Manage your subjects, student evaluations, and computer-based tests seamlessly.
          </p>
        </div>

        {/* Quick Action: Create New Exam */}
        <Button
          type="button"
          variant="primary"
          size="default"
          onClick={() => onOpenExamBuilder(null)}
          leftIcon={<Plus className="size-4" />}
          className="text-xs sm:text-sm font-bold shadow-xs shrink-0 self-start sm:self-auto"
        >
          Create New Exam
        </Button>
      </div>

      {/* 4 Minimalist KPI Cards (Glossy White Surfaces & Electric Blue Accents) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Assigned Subjects */}
        <div
          onClick={() => onNavigateTab("subjects")}
          className="group rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Subjects
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <BookOpen className="size-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-foreground">
              {subjects.length}
            </span>
            <span className="text-xs text-muted-foreground block mt-1">
              Active curriculum subjects
            </span>
          </div>
        </div>

        {/* Card 2: Total Students */}
        <div
          onClick={() => onNavigateTab("students")}
          className="group rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Students
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Users className="size-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-foreground">
              {totalStudents}
            </span>
            <span className="text-xs text-muted-foreground block mt-1">
              Across {assignedClasses.length} class groups
            </span>
          </div>
        </div>

        {/* Card 3: Published Exams */}
        <div
          onClick={() => onNavigateTab("exams")}
          className="group rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Published Exams
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <FileCheck2 className="size-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-foreground">
              {publishedExams.length}
            </span>
            <span className="text-xs text-muted-foreground block mt-1">
              Active examinations
            </span>
          </div>
        </div>

        {/* Card 4: Saved Drafts */}
        <div
          onClick={() => onNavigateTab("exams")}
          className="group rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Saved Drafts
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <FileEdit className="size-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-foreground">
              {draftExams.length}
            </span>
            <span className="text-xs text-muted-foreground block mt-1">
              Pending completion
            </span>
          </div>
        </div>
      </div>

      {/* Recent Examinations Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">Recent Examinations</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Quick access to your active CBT evaluations and drafts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab("exams")}
            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            <span>View All Exams</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>

        <div className="divide-y divide-border/60">
          {exams.slice(0, 4).map((exam) => (
            <div
              key={exam.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {exam.title}
                  </span>
                  <Badge
                    variant={exam.status === "published" || exam.status === "live" ? "success" : "secondary"}
                    className="text-[10px] uppercase font-bold"
                  >
                    {exam.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                  <span className="font-semibold text-foreground">{exam.subject}</span>
                  <span>•</span>
                  <span>{exam.targetClasses.join(", ")}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    <span>{exam.durationMinutes} mins</span>
                  </span>
                  <span>•</span>
                  <span>{exam.questions.length} questions</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenExamBuilder(exam)}
                  className="text-xs font-semibold h-8"
                >
                  Edit in Builder
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
