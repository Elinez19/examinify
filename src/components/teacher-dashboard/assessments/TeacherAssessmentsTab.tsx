import * as React from "react"
import {
  Plus,
  MoreVertical,
  Edit3,
  Eye,
  Trash2,
  Copy,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreateExamModal } from "./CreateExamModal"
import type { ITeacherCbtExam, ITeacherAssignedClass } from "@/types/teacher"

interface TeacherAssessmentsTabProps {
  exams: ITeacherCbtExam[]
  assignedClasses: ITeacherAssignedClass[]
  defaultSubject: string
  onOpenExamBuilder: (exam: ITeacherCbtExam) => void
  onAddNewExam: (newExam: ITeacherCbtExam) => void
  onDeleteExam: (examId: string) => void
}

export function TeacherAssessmentsTab({
  exams,
  assignedClasses,
  defaultSubject,
  onOpenExamBuilder,
  onAddNewExam,
  onDeleteExam,
}: TeacherAssessmentsTabProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [openDropdownId, setOpenDropdownId] = React.useState<string | null>(null)

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null)
    window.addEventListener("click", handleClickOutside)
    return () => window.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
            CBT / Assessments Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Click on any subject to set questions, or manage your assessments using the options menu.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          sheen
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={<Plus className="size-4" />}
          className="text-xs font-bold self-start sm:self-auto shadow-xs"
        >
          Create New Assessment
        </Button>
      </div>

      {/* Exam Management Table */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-bold uppercase tracking-wider text-[11px] text-muted-foreground">
                <th className="py-3.5 px-4 sm:px-6">Exam Title</th>
                <th className="py-3.5 px-4">Subject (Click to Set Questions)</th>
                <th className="py-3.5 px-4">Target Classes</th>
                <th className="py-3.5 px-4">Total Qs</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {exams.map((exam) => {
                const isDropdownOpen = openDropdownId === exam.id

                return (
                  <tr
                    key={exam.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    {/* Title */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="space-y-0.5">
                        <span className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors">
                          {exam.title}
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          {exam.scheduledDate}
                        </p>
                      </div>
                    </td>

                    {/* Subject (Click to Set Questions) */}
                    <td className="py-4 px-4">
                      <button
                        type="button"
                        onClick={() => onOpenExamBuilder(exam)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-bold transition-all cursor-pointer group/btn"
                        title="Click to launch Question Builder"
                      >
                        <Edit3 className="size-3 text-primary group-hover/btn:scale-110 transition-transform" />
                        <span className="underline decoration-primary/40 underline-offset-2">
                          {exam.subject}
                        </span>
                        <span className="text-[10px] text-primary/70 font-mono">✍️</span>
                      </button>
                    </td>

                    {/* Target Classes */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                        {exam.targetClasses.map((cls) => (
                          <Badge
                            key={cls}
                            variant="outline"
                            className="text-[10px] font-semibold text-foreground"
                          >
                            {cls}
                          </Badge>
                        ))}
                      </div>
                    </td>

                    {/* Total Qs */}
                    <td className="py-4 px-4 font-semibold text-foreground">
                      <div className="space-y-0.5">
                        <span className="font-bold text-xs">
                          {exam.readyQuestionsCount} / {exam.totalQuestions} Qs
                        </span>
                        <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round((exam.readyQuestionsCount / exam.totalQuestions) * 100)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="py-4 px-4 font-mono font-medium text-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-muted-foreground" />
                        <span>{exam.durationMinutes} mins</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          exam.status === "live"
                            ? "destructive"
                            : exam.status === "scheduled"
                            ? "default"
                            : exam.status === "completed"
                            ? "success"
                            : "pill"
                        }
                        className="text-[10px] uppercase font-bold"
                      >
                        {exam.status}
                      </Badge>
                    </td>

                    {/* Actions: Three Dots Dropdown (⋮) */}
                    <td className="py-4 px-4 text-right relative">
                      <div className="inline-block text-left">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenDropdownId(isDropdownOpen ? null : exam.id)
                          }}
                          className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                          aria-label="Exam actions"
                        >
                          <MoreVertical className="size-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                          <div
                            className="absolute right-4 top-12 z-20 w-48 rounded-xl border border-border bg-card p-1 shadow-lg animate-in fade-in zoom-in-95 duration-150"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setOpenDropdownId(null)
                                onOpenExamBuilder(exam)
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                            >
                              <Edit3 className="size-3.5 text-primary" />
                              <span>Set Questions</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setOpenDropdownId(null)
                                onOpenExamBuilder(exam)
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                            >
                              <Eye className="size-3.5 text-muted-foreground" />
                              <span>Preview as Student</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setOpenDropdownId(null)
                                onAddNewExam({
                                  ...exam,
                                  id: `exm-${Date.now()}`,
                                  title: `${exam.title} (Copy)`,
                                  status: "draft",
                                })
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                            >
                              <Copy className="size-3.5 text-muted-foreground" />
                              <span>Duplicate Assessment</span>
                            </button>

                            <div className="my-1 border-t border-border/60" />

                            <button
                              type="button"
                              onClick={() => {
                                setOpenDropdownId(null)
                                onDeleteExam(exam.id)
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                            >
                              <Trash2 className="size-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Exam Modal */}
      <CreateExamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        assignedClasses={assignedClasses}
        defaultSubject={defaultSubject}
        onCreateExam={onAddNewExam}
      />
    </div>
  )
}
