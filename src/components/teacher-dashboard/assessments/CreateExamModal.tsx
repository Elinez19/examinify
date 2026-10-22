import * as React from "react"
import { X, Sparkles, FileCheck2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ITeacherAssignedClass, ITeacherCbtExam } from "@/types/teacher"

interface CreateExamModalProps {
  isOpen: boolean
  onClose: () => void
  assignedClasses: ITeacherAssignedClass[]
  defaultSubject: string
  onCreateExam: (newExam: ITeacherCbtExam) => void
}

export function CreateExamModal({
  isOpen,
  onClose,
  assignedClasses,
  defaultSubject,
  onCreateExam,
}: CreateExamModalProps) {
  const [title, setTitle] = React.useState("")
  const [subject, setSubject] = React.useState(defaultSubject || "Mathematics")
  const [selectedClasses, setSelectedClasses] = React.useState<string[]>(() =>
    assignedClasses.length > 0 ? [assignedClasses[0].className] : []
  )
  const [duration, setDuration] = React.useState(60)
  const [totalQuestions, setTotalQuestions] = React.useState(40)
  const passScore = 50

  if (!isOpen) return null

  const toggleClass = (clsName: string) => {
    setSelectedClasses((prev) =>
      prev.includes(clsName) ? prev.filter((c) => c !== clsName) : [...prev, clsName]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || selectedClasses.length === 0) return

    const newExam: ITeacherCbtExam = {
      id: `exm-${Date.now()}`,
      title: title.trim(),
      subject,
      targetClasses: selectedClasses,
      totalQuestions: Number(totalQuestions) || 40,
      readyQuestionsCount: 0,
      durationMinutes: Number(duration) || 60,
      status: "draft",
      scheduledDate: "Draft (Unscheduled)",
      passingScore: Number(passScore) || 50,
      submissionsCount: 0,
      questions: [],
    }

    onCreateExam(newExam)
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border p-6 space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <FileCheck2 className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-foreground">
                Create New CBT Assessment
              </h2>
              <p className="text-xs text-muted-foreground">
                Configure exam parameters and deploy to your assigned classes.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Exam Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Assessment Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 2nd Term Mid-Term CBT Assessment"
              className="w-full h-10 px-3.5 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Target Classes (Checkboxes) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Target Classes <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {assignedClasses.map((cls) => {
                const isChecked = selectedClasses.includes(cls.className)

                return (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => toggleClass(cls.className)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                      isChecked
                        ? "border-primary bg-primary/10 font-bold text-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <span>{cls.className}</span>
                    <span className="text-[10px] text-muted-foreground font-normal">
                      {cls.studentCount} pupils
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Duration & Questions Target */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1">
                <Clock className="size-3 text-muted-foreground" />
                <span>Duration (Mins)</span>
              </label>
              <input
                type="number"
                min={10}
                max={180}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value) || 60)}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Total Questions Target
              </label>
              <input
                type="number"
                min={5}
                max={100}
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(Number(e.target.value) || 40)}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-border flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs font-semibold"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              sheen
              disabled={!title.trim() || selectedClasses.length === 0}
              className="text-xs font-bold"
              rightIcon={<Sparkles className="size-3.5" />}
            >
              Create & Set Questions
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
