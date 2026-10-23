import * as React from "react"
import {
  FileCheck2,
  Plus,
  Clock,
  Edit3,
  Trash2,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { ITeacherCbtExam, ITeacherSubject } from "@/types/teacher"
import { MOCK_TEACHER_SUBJECTS } from "@/services/teacher-dashboard/mockTeacherData"

interface TeacherExamsTabProps {
  exams: ITeacherCbtExam[]
  subjects?: ITeacherSubject[]
  onOpenExamBuilder: (exam?: ITeacherCbtExam | null, defaultSubject?: string) => void
  onDeleteExam: (examId: string) => void
}

type ExamFilterTab = "all" | "published" | "drafts"

export function TeacherExamsTab({
  exams,
  subjects = MOCK_TEACHER_SUBJECTS,
  onOpenExamBuilder,
  onDeleteExam,
}: TeacherExamsTabProps) {
  const [activeTab, setActiveTab] = React.useState<ExamFilterTab>("all")
  const [selectedSubject, setSelectedSubject] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredExams = React.useMemo(() => {
    return exams.filter((exam) => {
      // Tab filter
      if (activeTab === "published" && exam.status !== "published" && exam.status !== "live") {
        return false
      }
      if (activeTab === "drafts" && exam.status !== "draft") {
        return false
      }

      // Subject filter
      if (selectedSubject !== "all" && exam.subject !== selectedSubject) {
        return false
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchTitle = exam.title.toLowerCase().includes(q)
        const matchSubject = exam.subject.toLowerCase().includes(q)
        const matchClasses = exam.targetClasses.some((c) => c.toLowerCase().includes(q))
        if (!matchTitle && !matchSubject && !matchClasses) return false
      }

      return true
    })
  }, [exams, activeTab, selectedSubject, searchQuery])

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Examinations Catalog
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Create, configure, and monitor your Continuous Assessments and Terminal Examinations.
          </p>
        </div>

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

      {/* Filter and Tab Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold select-none">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`pb-2 relative cursor-pointer transition-colors ${
              activeTab === "all" ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>All Exams ({exams.length})</span>
            {activeTab === "all" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("published")}
            className={`pb-2 relative cursor-pointer transition-colors ${
              activeTab === "published" ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Published ({exams.filter((e) => e.status === "published" || e.status === "live").length})</span>
            {activeTab === "published" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("drafts")}
            className={`pb-2 relative cursor-pointer transition-colors ${
              activeTab === "drafts" ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Drafts ({exams.filter((e) => e.status === "draft").length})</span>
            {activeTab === "drafts" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>

        {/* Search & Subject Dropdown Filter */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search exams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8.5 h-9 text-xs rounded-xl w-40 sm:w-48 bg-card"
            />
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="h-9 px-3 text-xs font-semibold rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
          >
            <option value="all">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Exams Table / Cards */}
      {filteredExams.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-border bg-card space-y-3">
          <FileCheck2 className="size-10 text-muted-foreground/40 mx-auto" />
          <h3 className="text-base font-bold text-foreground">No examinations found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try choosing another filter or create your first evaluation using the Exam Builder.
          </p>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => onOpenExamBuilder(null)}
            className="text-xs font-bold"
          >
            Create New Exam +
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-bold uppercase tracking-wider text-[11px] text-muted-foreground">
                  <th className="py-3.5 px-4 sm:px-6">Exam Title</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Target Classes</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Questions</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-bold text-foreground text-xs group-hover:text-primary transition-colors">
                        {exam.title}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {exam.academicSession} • {exam.term}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="pill" className="text-[11px] font-semibold text-primary">
                        {exam.subject}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {exam.targetClasses.join(", ")}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="size-3 text-muted-foreground" />
                        <span>{exam.durationMinutes}m</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {exam.questions.length} questions
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
                          onClick={() => onOpenExamBuilder(exam, exam.subject)}
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
