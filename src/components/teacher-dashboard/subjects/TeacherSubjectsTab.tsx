import * as React from "react"
import {
  BookOpen,
  Plus,
  MoreVertical,
  ArrowRight,
  Clock,
  Trash2,
  Edit3,
  FolderX,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ITeacherSubject, ITeacherCbtExam, ITeacherAssignedClass } from "@/types/teacher"
import { MOCK_TEACHER_SUBJECTS } from "@/services/teacher-dashboard/mockTeacherData"

interface TeacherSubjectsTabProps {
  subjects?: ITeacherSubject[]
  exams: ITeacherCbtExam[]
  assignedClasses?: ITeacherAssignedClass[]
  selectedSubject?: string | null
  onSelectSubject?: (subjectName: string | null) => void
  onOpenExamBuilder: (exam?: ITeacherCbtExam | null, defaultSubject?: string) => void
  onDeleteExam: (examId: string) => void
}

type ExamSubTab = "published" | "drafts"

export function TeacherSubjectsTab({
  subjects = MOCK_TEACHER_SUBJECTS,
  exams,
  selectedSubject,
  onSelectSubject,
  onOpenExamBuilder,
  onDeleteExam,
}: TeacherSubjectsTabProps) {
  const [activeSubTab, setActiveSubTab] = React.useState<ExamSubTab>("published")

  // If a specific subject is selected, render the Course Exam Management View (Reference Image 2)
  if (selectedSubject) {
    const subjectExams = exams.filter((e) => e.subject.toLowerCase() === selectedSubject.toLowerCase())
    const publishedList = subjectExams.filter((e) => e.status === "published" || e.status === "live")
    const draftsList = subjectExams.filter((e) => e.status === "draft")
    const currentList = activeSubTab === "published" ? publishedList : draftsList

    return (
      <div className="space-y-6 animate-in fade-in duration-150">
        {/* Top Header Row (Reference Image 2) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onSelectSubject && onSelectSubject(null)}
              className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              ← All Subjects
            </button>
            <span className="text-muted-foreground text-xs">•</span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground uppercase">
              {selectedSubject}
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onOpenExamBuilder(null, selectedSubject)}
              leftIcon={<Plus className="size-4" />}
              className="text-xs font-bold shadow-xs"
            >
              Create New Exam +
            </Button>

            <button
              type="button"
              className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              aria-label="Course options"
            >
              <MoreVertical className="size-4" />
            </button>
          </div>
        </div>

        {/* Sub-tabs: Published Examinations vs Saved Drafts (Reference Image 2) */}
        <div className="flex items-center gap-6 border-b border-border text-xs sm:text-sm font-semibold select-none">
          <button
            type="button"
            onClick={() => setActiveSubTab("published")}
            className={`pb-3 relative cursor-pointer transition-colors ${
              activeSubTab === "published"
                ? "text-primary font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Published Examinations</span>
            {activeSubTab === "published" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-in fade-in duration-150" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("drafts")}
            className={`pb-3 relative cursor-pointer transition-colors ${
              activeSubTab === "drafts"
                ? "text-primary font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Saved Drafts</span>
            {activeSubTab === "drafts" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-in fade-in duration-150" />
            )}
          </button>
        </div>

        {/* Content Area: Table if items exist, or Pixel-Accurate Empty State (Reference Image 2) */}
        {currentList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 text-center rounded-2xl border border-dashed border-border bg-card">
            {/* Visual Icon Illustration (Matching Reference Image 2) */}
            <div className="relative mb-6">
              <div className="flex size-20 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground/50">
                <FolderX className="size-10 text-muted-foreground/60 stroke-[1.5]" />
              </div>
              <div className="absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-black shadow-xs">
                ✕
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
              {activeSubTab === "published"
                ? "You have no Published Exams"
                : "You have no Saved Drafts"}
            </h3>

            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm leading-relaxed">
              {activeSubTab === "published"
                ? "Your published examinations for this course will appear here"
                : "Your unfinished exam drafts for this course will be saved here"}
            </p>

            <div className="mt-6">
              <Button
                type="button"
                variant="primary"
                size="default"
                onClick={() => onOpenExamBuilder(null, selectedSubject)}
                className="text-xs sm:text-sm font-bold shadow-xs px-6"
              >
                Create New Exam +
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 font-bold uppercase tracking-wider text-[11px] text-muted-foreground">
                    <th className="py-3.5 px-4 sm:px-6">Exam Title</th>
                    <th className="py-3.5 px-4">Target Classes</th>
                    <th className="py-3.5 px-4">Duration</th>
                    <th className="py-3.5 px-4">Questions</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {currentList.map((exam) => (
                    <tr key={exam.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="font-bold text-foreground text-xs group-hover:text-primary transition-colors">
                          {exam.title}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Scheduled: {exam.scheduledDate || "Not set"}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-muted-foreground">
                          {exam.targetClasses.join(", ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-semibold text-foreground">
                          <Clock className="size-3 text-muted-foreground" />
                          <span>{exam.durationMinutes} mins</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-foreground">
                          {exam.questions.length} questions
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            exam.status === "published" || exam.status === "live"
                              ? "success"
                              : "secondary"
                          }
                          className="text-[10px] font-bold uppercase"
                        >
                          {exam.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onOpenExamBuilder(exam, selectedSubject)}
                            className="h-8 text-xs font-semibold"
                            leftIcon={<Edit3 className="size-3.5" />}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteExam(exam.id)}
                            className="h-8 text-destructive hover:bg-destructive/10"
                            aria-label="Delete exam"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )
  }

  // All Subjects Overview Catalog
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Teaching Subjects
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Your curriculum subjects and classes. Select a subject to manage examinations.
          </p>
        </div>

        <Badge variant="pill" className="text-xs font-bold gap-1.5 self-start sm:self-auto px-3.5 py-1.5">
          <BookOpen className="size-3.5 text-primary" />
          <span>{subjects.length} Subjects Active</span>
        </Badge>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((sub) => {
          const subExams = exams.filter((e) => e.subject.toLowerCase() === sub.name.toLowerCase())
          const published = subExams.filter((e) => e.status === "published" || e.status === "live")
          const drafts = subExams.filter((e) => e.status === "draft")

          return (
            <div
              key={sub.id}
              onClick={() => onSelectSubject && onSelectSubject(sub.name)}
              className="group rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <BookOpen className="size-5" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {sub.department}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors">
                    {sub.name}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Classes: <strong className="text-foreground">{sub.assignedClasses.join(", ")}</strong>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span>
                    <strong className="text-foreground font-bold">{published.length}</strong> published
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-foreground font-bold">{drafts.length}</strong> drafts
                  </span>
                </div>

                <span className="flex items-center gap-1 font-bold text-primary group-hover:translate-x-1 transition-transform">
                  <span>Manage</span>
                  <ArrowRight className="size-3.5" />
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
