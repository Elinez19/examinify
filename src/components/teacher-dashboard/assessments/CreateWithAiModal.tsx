import * as React from "react"
import {
  Upload,
  Sparkles,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useAiQuestionGenerator } from "@/hooks/teacher-dashboard/useAiQuestionGenerator"
import type { ITeacherQuestion } from "@/types/teacher"

export interface CreateWithAiModalProps {
  isOpen: boolean
  onClose: () => void
  onImportQuestions: (questions: ITeacherQuestion[]) => void
  currentSubject?: string
}

export function CreateWithAiModal({
  isOpen,
  onClose,
  onImportQuestions,
  currentSubject = "English Language",
}: CreateWithAiModalProps) {
  const {
    step,
    setStep,
    uploadedFiles,
    uploadCount,
    maxFiles,
    uploadError,
    addFiles,
    removeFile,
    clearFiles,
    addSampleFile,
    subject,
    setSubject,
    topicFocus,
    setTopicFocus,
    questionCount,
    setQuestionCount,
    selectedTypes,
    toggleQuestionType,
    difficulty,
    setDifficulty,
    pointsPerQuestion,
    setPointsPerQuestion,
    generationProgress,
    generationStageText,
    startGeneration,
    generatedQuestions,
    selectedQuestionIds,
    selectedCount,
    isAllSelected,
    toggleQuestionSelection,
    selectAllQuestions,
    deselectAllQuestions,
    handleImportSelected,
    resetAll,
  } = useAiQuestionGenerator({
    currentSubject,
    onImportQuestions,
    onClose,
  })

  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const [isDragOver, setIsDragOver] = React.useState(false)

  // Reset state when modal is closed
  const handleClose = () => {
    resetAll()
    onClose()
  }

  // Handle Drag & Drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files)
      e.target.value = "" // Reset to allow re-uploading the same file if needed
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-modal-title"
    >
      <div
        className="w-full max-w-xl max-h-[85vh] bg-card rounded-2xl shadow-2xl border border-border p-4 sm:p-5 space-y-3.5 animate-in zoom-in-95 duration-200 overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= STEP 1: UPLOAD MATERIALS (MATCHING USER SCREENSHOT) ================= */}
        {step === "upload" && (
          <div className="space-y-3.5">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <h2
                id="ai-modal-title"
                className="text-sm sm:text-base font-bold tracking-tight text-foreground"
              >
                Generate Questions with Acad AI
              </h2>
              <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                Cost: 0 Credits
              </span>
            </div>

            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-foreground">
                  Upload materials
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Teaching notes, documents, etc.
                </p>
              </div>

              <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold bg-primary/10 text-primary">
                {uploadCount}/{maxFiles} Files
              </span>
            </div>

            {/* Error Notification if any */}
            {uploadError && (
              <div className="p-2.5 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-[11px] flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="size-3.5 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Compact Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-2xl border-2 border-dashed transition-all py-5 px-4 sm:py-6 text-center cursor-pointer flex flex-col items-center justify-center select-none ${
                isDragOver
                  ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                  : "border-border hover:border-primary/50 bg-muted/10 hover:bg-muted/20"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.pptx,.docx,.doc,.txt"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload curriculum files"
              />

              {/* Upload Icon */}
              <div className="flex items-center justify-center mb-1.5">
                <Upload className="size-8 stroke-[1.5] text-muted-foreground" />
              </div>

              {/* Text: Drag & Drop or Choose Files */}
              <p className="text-xs font-medium text-foreground">
                Drag & Drop or{" "}
                <span className="text-primary font-semibold hover:underline">
                  Choose Files
                </span>
              </p>

              {/* Supported formats & size */}
              <p className="text-[11px] text-muted-foreground mt-0.5">
                PDF, PPTX, DOCX (Max 5MB each)
              </p>
            </div>

            {/* Uploaded Files Listing */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground px-1">
                  <span>Attached Documents ({uploadedFiles.length})</span>
                  <button
                    type="button"
                    onClick={clearFiles}
                    className="text-destructive hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                          <FileText className="size-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate max-w-xs sm:max-w-md text-xs">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {file.formattedSize} • Ready
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFile(file.id)
                        }}
                        className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                        title="Remove file"
                        aria-label={`Remove ${file.name}`}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subtle Inline Helper Link for Testing (0 extra height footprint) */}
            {uploadedFiles.length === 0 && (
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <span>Want to test immediately?</span>
                <button
                  type="button"
                  onClick={() => addSampleFile(0)}
                  className="text-primary hover:underline font-semibold cursor-pointer"
                >
                  Load sample lesson notes
                </button>
              </div>
            )}

            {/* Modal Footer (Matching Screenshot) */}
            <div className="flex items-center justify-between pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="text-xs font-semibold rounded-xl px-4 py-1.5 h-9 border-border text-foreground hover:bg-muted"
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  if (uploadedFiles.length === 0) {
                    addSampleFile(0)
                  }
                  setStep("configure")
                }}
                className="text-xs font-semibold rounded-xl px-4 py-1.5 h-9 shadow-xs"
              >
                Configure Questions
              </Button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: CONFIGURE QUESTIONS ================= */}
        {step === "configure" && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-foreground">
                  Configure Questions
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Tailor question generation based on your uploaded materials.
                </p>
              </div>
              <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                Cost: 0 Credits
              </span>
            </div>

            <div className="space-y-3 max-h-[48vh] overflow-y-auto pr-1">
              {/* Subject & Focus */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-foreground block mb-1">
                    Academic Subject
                  </label>
                  <Input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. English Language"
                    className="h-8 text-xs rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-foreground block mb-1">
                    Question Count
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[5, 10, 15, 20].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setQuestionCount(count)}
                        className={`h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          questionCount === count
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Question Types */}
              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1">
                  Question Formats
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => toggleQuestionType("mcq")}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedTypes.includes("mcq")
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:bg-muted/30"
                    }`}
                  >
                    <Checkbox
                      checked={selectedTypes.includes("mcq")}
                      onCheckedChange={() => toggleQuestionType("mcq")}
                    />
                    <div>
                      <span className="text-xs font-bold block">Multiple Choice (MCQ)</span>
                      <span className="text-[10px] text-muted-foreground">
                        4 options with instant answer key
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleQuestionType("theory")}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedTypes.includes("theory")
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:bg-muted/30"
                    }`}
                  >
                    <Checkbox
                      checked={selectedTypes.includes("theory")}
                      onCheckedChange={() => toggleQuestionType("theory")}
                    />
                    <div>
                      <span className="text-xs font-bold block">Theory & Rubrics</span>
                      <span className="text-[10px] text-muted-foreground">
                        Model answer & 3-point criteria
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1">
                  Difficulty Distribution
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold">
                  {(["Basic", "Intermediate", "Advanced", "Mixed"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`h-8 rounded-xl transition-all cursor-pointer ${
                        difficulty === lvl
                          ? "bg-primary text-primary-foreground font-bold shadow-xs"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {lvl === "Mixed" ? "Mixed" : lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Topic Instructions */}
              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1">
                  Topic Focus (Optional)
                </label>
                <Input
                  type="text"
                  value={topicFocus}
                  onChange={(e) => setTopicFocus(e.target.value)}
                  placeholder="e.g. Focus on Chapter 3 definitions, diagram labeling, and practical examples."
                  className="h-8 text-xs rounded-xl"
                />
              </div>

              {/* Points per question */}
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-muted/20 text-xs">
                <div>
                  <span className="font-bold text-foreground block text-xs">
                    Points Allocation
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Default score awarded per correct answer
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 5].map((pts) => (
                    <button
                      key={pts}
                      type="button"
                      onClick={() => setPointsPerQuestion(pts)}
                      className={`size-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        pointsPerQuestion === pts
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "bg-card border border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      {pts}p
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-1 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep("upload")}
                leftIcon={<ArrowLeft className="size-3" />}
                className="text-xs font-semibold rounded-xl h-8 px-3"
              >
                Back
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                sheen
                onClick={startGeneration}
                leftIcon={<Sparkles className="size-3" />}
                className="text-xs font-bold rounded-xl px-4 h-8"
              >
                Generate {questionCount} Questions
              </Button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: GENERATING QUESTIONS (ANIMATED) ================= */}
        {step === "generating" && (
          <div className="py-6 text-center space-y-4 animate-in fade-in">
            <div className="relative mx-auto size-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-60" />
              <div className="relative size-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                <Sparkles className="size-5 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                Synthesizing Exam Questions
              </h3>
              <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                {generationStageText}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-xs mx-auto space-y-1">
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-semibold text-muted-foreground px-0.5">
                <span>Analyzing Materials</span>
                <span>{generationProgress}%</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: REVIEW & IMPORT ================= */}
        {step === "review" && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-foreground">
                  Review Generated Questions
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  {generatedQuestions.length} questions synthesized from your uploaded notes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={isAllSelected ? deselectAllQuestions : selectAllQuestions}
                  className="text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                  {isAllSelected ? "Deselect All" : "Select All"}
                </button>
                <Badge variant="pill" className="text-xs font-semibold">
                  {selectedCount} Selected
                </Badge>
              </div>
            </div>

            {/* Questions List Palette */}
            <div className="max-h-[46vh] overflow-y-auto space-y-2 pr-1">
              {generatedQuestions.map((q, idx) => {
                const isSelected = selectedQuestionIds.has(q.id)

                return (
                  <div
                    key={q.id}
                    onClick={() => toggleQuestionSelection(q.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-2xs"
                        : "border-border bg-card opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleQuestionSelection(q.id)}
                        className="mt-0.5"
                      />

                      <div className="flex-1 min-w-0 space-y-1.5">
                        {/* Meta tags */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-extrabold text-foreground">
                            Question {idx + 1}
                          </span>
                          <Badge variant="outline" className="text-[10px] uppercase font-bold py-0 h-4">
                            {q.type === "mcq" ? "MCQ" : "Theory"}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px] font-semibold py-0 h-4">
                            {q.difficulty}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground font-semibold ml-auto">
                            {q.points} Points
                          </span>
                        </div>

                        {/* Prompt */}
                        <p className="text-xs font-medium text-foreground leading-snug">
                          {q.prompt}
                        </p>

                        {/* MCQ Options Display */}
                        {q.type === "mcq" && q.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-0.5">
                            {q.options.map((opt) => {
                              const isCorrect = opt.id === q.correctOptionId
                              return (
                                <div
                                  key={opt.id}
                                  className={`px-2 py-1 rounded-md text-[11px] font-medium border ${
                                    isCorrect
                                      ? "border-status-success/40 bg-status-success/10 text-status-success font-semibold"
                                      : "border-border bg-muted/40 text-foreground"
                                  }`}
                                >
                                  <span className="font-bold mr-1">{opt.id}.</span>
                                  <span>{opt.text}</span>
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {/* Theory Rubrics Display */}
                        {q.type === "theory" && (
                          <div className="space-y-1 pt-0.5 text-xs">
                            {q.theoryAnswer && (
                              <div className="p-1.5 rounded-md bg-muted/40 border border-border text-[10px]">
                                <span className="font-bold text-foreground mr-1">
                                  Model Answer:
                                </span>
                                <span className="text-muted-foreground">
                                  {q.theoryAnswer}
                                </span>
                              </div>
                            )}

                            {q.rubrics && q.rubrics.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {q.rubrics.map((r, rIdx) => (
                                  <span
                                    key={r.id || rIdx}
                                    className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                                  >
                                    <CheckCircle2 className="size-2.5 text-primary" />
                                    <span>{r.criterion}</span>
                                    <span className="font-bold">({Math.round(r.weight * 100)}%)</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-1 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep("configure")}
                className="text-xs font-semibold rounded-xl h-8 px-3"
              >
                Back
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={selectedCount === 0}
                onClick={handleImportSelected}
                leftIcon={<Sparkles className="size-3" />}
                className="text-xs font-bold rounded-xl px-4 h-8 shadow-xs"
              >
                Insert {selectedCount} Questions
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
