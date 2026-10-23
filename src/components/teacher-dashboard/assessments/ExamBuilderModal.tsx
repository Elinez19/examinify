import * as React from "react"
import {
  X,
  Plus,
  Copy,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Check,
  HelpCircle,
  CornerDownLeft,
  Database,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useExamBuilder } from "@/hooks/teacher-dashboard/useExamBuilder"
import { BulkQuestionImporterModal } from "./BulkQuestionImporterModal"
import { ExamStudentPreviewModal } from "./ExamStudentPreviewModal"
import { QuestionBankModal } from "./QuestionBankModal"
import type { ITeacherCbtExam, ITeacherQuestion } from "@/types/teacher"

interface ExamBuilderModalProps {
  exam: ITeacherCbtExam | null
  onClose: () => void
  onSaveQuestions: (examId: string, questions: ITeacherQuestion[]) => void
}

export function ExamBuilderModal({
  exam,
  onClose,
  onSaveQuestions,
}: ExamBuilderModalProps) {
  if (!exam) return null
  return (
    <ExamBuilderModalContent
      exam={exam}
      onClose={onClose}
      onSaveQuestions={onSaveQuestions}
    />
  )
}

function ExamBuilderModalContent({
  exam,
  onClose,
  onSaveQuestions,
}: {
  exam: ITeacherCbtExam
  onClose: () => void
  onSaveQuestions: (examId: string, questions: ITeacherQuestion[]) => void
}) {

  const {
    questions,
    currentIndex,
    setCurrentIndex,
    currentQuestion,
    addQuestion,
    duplicateQuestion,
    deleteQuestion,
    updatePrompt,
    updateOptionText,
    setCorrectOption,
    updatePoints,
    updateExplanation,
    saveAndNext,
    importBulkQuestions,
    importQuestionsFromBank,
    getQuestionValidity,
    isPreviewOpen,
    setIsPreviewOpen,
    isBulkImportOpen,
    setIsBulkImportOpen,
    isQuestionBankOpen,
    setIsQuestionBankOpen,
    saveToastVisible,
  } = useExamBuilder({ exam, onSaveQuestions })

  // Keyboard shortcut listener: Cmd/Ctrl + Enter -> Save & Next
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault()
        saveAndNext()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [saveAndNext])

  // Math symbol quick insertion helper
  const insertSymbol = (sym: string) => {
    updatePrompt(currentQuestion.prompt + sym)
  }

  const currentValidity = getQuestionValidity(currentQuestion)
  const totalCompleted = questions.filter((q) => getQuestionValidity(q).isValid).length

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="w-full max-w-6xl h-[94vh] bg-card rounded-3xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar Header */}
          <div className="p-4 sm:p-5 border-b border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="pill" className="text-xs font-bold text-primary">
                  {exam.subject} Question Builder
                </Badge>
                <span className="text-sm font-extrabold text-foreground truncate max-w-md">
                  {exam.title}
                </span>
                <Badge variant="outline" className="text-[11px] font-semibold text-muted-foreground">
                  Target: {exam.targetClasses.join(", ")}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Progress: <strong className="text-foreground">{totalCompleted} / {exam.totalQuestions} Questions Ready</strong></span>
                <span>•</span>
                <span>Duration: {exam.durationMinutes} mins</span>
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsQuestionBankOpen(true)}
                leftIcon={<Database className="size-3.5 text-primary" />}
                className="text-xs font-semibold"
              >
                Question Bank
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsBulkImportOpen(true)}
                leftIcon={<UploadCloud className="size-3.5 text-primary" />}
                className="text-xs font-semibold"
              >
                ⚡ Bulk Paste Questions
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewOpen(true)}
                leftIcon={<Eye className="size-3.5 text-primary" />}
                className="text-xs font-semibold"
              >
                Preview Student CBT
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                sheen
                onClick={onClose}
                className="text-xs font-bold shadow-xs"
              >
                Save & Done
              </Button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted ml-1"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Builder Workspace: Left Palette + Center Editor Canvas */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Palette: Question Navigation Strip */}
            <div className="w-56 sm:w-64 border-r border-border bg-muted/20 flex flex-col shrink-0 overflow-hidden">
              <div className="p-3.5 border-b border-border/60 flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Questions ({questions.length})
                </span>
                <span className="text-[10px] font-bold text-status-success">
                  {totalCompleted} Valid
                </span>
              </div>

              {/* Scrollable Questions List */}
              <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
                {questions.map((q, idx) => {
                  const isSelected = idx === currentIndex
                  const val = getQuestionValidity(q)

                  return (
                    <button
                      key={q.id || idx}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`group w-full p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                          : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-card"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-bold shrink-0">
                          Q{idx + 1}
                        </span>
                        <span
                          className={`text-xs truncate ${
                            isSelected ? "text-primary-foreground/90" : "text-muted-foreground"
                          }`}
                        >
                          {q.prompt.trim() || "(Empty prompt)"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {val.isValid ? (
                          <CheckCircle2
                            className={`size-3.5 ${
                              isSelected ? "text-primary-foreground" : "text-status-success"
                            }`}
                          />
                        ) : (
                          <AlertTriangle
                            className={`size-3.5 ${
                              isSelected ? "text-primary-foreground" : "text-status-warning"
                            }`}
                          />
                        )}
                        <span
                          className={`text-[10px] font-bold uppercase rounded px-1 ${
                            isSelected
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {q.correctOptionId}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Add Question Button */}
              <div className="p-3 border-t border-border/60 bg-card">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addQuestion}
                  leftIcon={<Plus className="size-4 text-primary" />}
                  className="w-full text-xs font-bold justify-center"
                >
                  Add Question (Alt+N)
                </Button>
              </div>
            </div>

            {/* Center Canvas: Question Editor Form */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-card">
              {/* Question Header & Points */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-foreground">
                    Question {currentIndex + 1} of {questions.length}
                  </h3>
                  {currentValidity.isValid ? (
                    <Badge variant="success" className="text-[10px] font-bold gap-1">
                      <CheckCircle2 className="size-3" />
                      <span>Ready</span>
                    </Badge>
                  ) : (
                    <Badge variant="pill" className="text-[10px] font-bold text-status-warning gap-1">
                      <AlertTriangle className="size-3" />
                      <span>Incomplete</span>
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">Marks / Points:</span>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={currentQuestion.points}
                    onChange={(e) => updatePoints(Number(e.target.value) || 1)}
                    className="w-16 h-8 rounded-lg border border-border bg-card px-2 text-xs font-bold text-center text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Quick Math Symbols Helper */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-muted-foreground mr-1">
                  Quick Insert:
                </span>
                {["x²", "x³", "√", "π", "±", "θ", "½", "≠", "≤", "≥"].map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => insertSymbol(sym)}
                    className="px-2 py-0.5 rounded-md border border-border bg-muted/40 hover:bg-muted text-xs font-mono text-foreground transition-colors cursor-pointer"
                  >
                    {sym}
                  </button>
                ))}
              </div>

              {/* Question Prompt Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Question Prompt Text <span className="text-destructive">*</span>
                </label>
                <textarea
                  rows={4}
                  value={currentQuestion.prompt}
                  onChange={(e) => updatePrompt(e.target.value)}
                  placeholder="Type or format your question prompt here..."
                  className="w-full rounded-2xl border border-border bg-card p-3.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed resize-none shadow-2xs"
                />
              </div>

              {/* Multiple Choice Options (A, B, C, D) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">
                    Multiple Choice Options (Select radio button for Correct Answer)
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    Selected Answer: <strong className="text-primary font-bold">{currentQuestion.correctOptionId}</strong>
                  </span>
                </div>

                <div className="space-y-2.5">
                  {(currentQuestion.options || []).map((opt) => {
                    const isCorrect = currentQuestion.correctOptionId === opt.id

                    return (
                      <div
                        key={opt.id}
                        className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                          isCorrect
                            ? "border-primary bg-primary/5 shadow-xs"
                            : "border-border bg-card hover:border-primary/30"
                        }`}
                      >
                        {/* Radio for Correct Answer */}
                        <button
                          type="button"
                          onClick={() => setCorrectOption(opt.id as "A" | "B" | "C" | "D")}
                          className={`size-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-all cursor-pointer ${
                            isCorrect
                              ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                              : "border border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                          }`}
                          title={`Set Option ${opt.id} as Correct Answer`}
                        >
                          {isCorrect ? <Check className="size-4 stroke-[3]" /> : opt.id}
                        </button>

                        {/* Option text input */}
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => updateOptionText(opt.id as "A" | "B" | "C" | "D", e.target.value)}
                          placeholder={`Enter Option ${opt.id} text...`}
                          className="flex-1 bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Explanation / Solution Working */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                  <HelpCircle className="size-3.5" />
                  <span>Working / Solution Explanation (Optional - Shown to students after test)</span>
                </label>
                <textarea
                  rows={2}
                  value={currentQuestion.explanation || ""}
                  onChange={(e) => updateExplanation(e.target.value)}
                  placeholder="Provide step-by-step formula or reasoning for the correct answer..."
                  className="w-full rounded-xl border border-border bg-card p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed resize-none"
                />
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-border flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => duplicateQuestion(currentIndex)}
                    leftIcon={<Copy className="size-3.5 text-muted-foreground" />}
                    className="text-xs font-semibold"
                  >
                    Duplicate
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => deleteQuestion(currentIndex)}
                    leftIcon={<Trash2 className="size-3.5 text-destructive" />}
                    className="text-xs font-semibold text-destructive hover:border-destructive/40"
                  >
                    Delete
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  {saveToastVisible && (
                    <span className="text-xs font-bold text-status-success animate-in fade-in flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" />
                      <span>Saved!</span>
                    </span>
                  )}

                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    sheen
                    onClick={saveAndNext}
                    rightIcon={<CornerDownLeft className="size-3.5" />}
                    className="text-xs font-bold shadow-xs"
                  >
                    Save & Next Question (Cmd+Enter)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Importer Modal */}
      <BulkQuestionImporterModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImport={importBulkQuestions}
      />

      {/* Question Bank Modal */}
      <QuestionBankModal
        isOpen={isQuestionBankOpen}
        onClose={() => setIsQuestionBankOpen(false)}
        onImport={(imported) => importQuestionsFromBank(imported)}
        currentSubject={exam.subject}
      />

      {/* Live CBT Student Preview Modal */}
      <ExamStudentPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        exam={exam}
        questions={questions}
      />
    </>
  )
}
