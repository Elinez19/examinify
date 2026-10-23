import * as React from "react"
import {
  X,
  Search,
  Image as ImageIcon,
  CheckCircle2,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useQuestionBank } from "@/hooks/teacher-dashboard/useQuestionBank"
import type { ITeacherQuestion } from "@/types/teacher"
import type { IQuestionBankItem } from "@/services/teacher-dashboard/questionBankData"

interface QuestionBankModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (questions: ITeacherQuestion[]) => void
  currentSubject?: string
  availableQuestions?: IQuestionBankItem[]
}

export function QuestionBankModal({
  isOpen,
  onClose,
  onImport,
  currentSubject,
  availableQuestions,
}: QuestionBankModalProps) {
  const {
    searchQuery,
    setSearchQuery,
    selectedCourse,
    setSelectedCourse,
    selectedType,
    setSelectedType,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    onlyWithImages,
    setOnlyWithImages,
    courses,
    filteredQuestions,
    selectedIds,
    selectedQuestions,
    selectedCount,
    maxSelectable,
    isAllSelected,
    expandedId,
    setExpandedId,
    toggleQuestion,
    toggleSelectAll,
    resetFilters,
    clearSelection,
  } = useQuestionBank({
    initialCourse: currentSubject,
    availableQuestions,
    maxSelectable: 50,
  })

  // Close on Escape key
  React.useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleImportSubmit = () => {
    if (selectedQuestions.length === 0) return
    onImport(selectedQuestions)
    clearSelection()
    onClose()
  }

  const handleModalClose = () => {
    clearSelection()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/25 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 overflow-y-auto"
      onClick={handleModalClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="question-bank-title"
    >
      <div
        className="w-full max-w-4xl bg-card rounded-2xl sm:rounded-3xl shadow-2xl border border-border my-auto overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Area */}
        <div className="shrink-0 p-5 sm:p-7 pb-3.5 sm:pb-4 space-y-3.5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2
                id="question-bank-title"
                className="text-xl sm:text-2xl font-bold tracking-tight text-foreground"
              >
                Question Bank
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                Reuse questions from your previous exams. Selected questions are copied into this
                exam, so editing them here will not change the originals.
              </p>
            </div>

            <button
              type="button"
              onClick={handleModalClose}
              className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer shrink-0"
              aria-label="Close Question Bank"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Filter Controls Row 1: Search + Course + Type */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
            {/* Search Input */}
            <div className="relative flex items-center sm:col-span-6">
              <Search className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search question text"
                className="w-full h-10 pl-10 pr-8 text-xs sm:text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 p-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Clear search query"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Courses Dropdown */}
            <div className="relative sm:col-span-3">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                aria-label="Filter by course"
                className="w-full h-10 pl-3.5 pr-8 text-xs sm:text-sm font-medium rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer transition-all truncate"
              >
                <option value="all">All courses</option>
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Types Dropdown */}
            <div className="relative sm:col-span-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                aria-label="Filter by question type"
                className="w-full h-10 pl-3.5 pr-8 text-xs sm:text-sm font-medium rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer transition-all"
              >
                <option value="all">All types</option>
                <option value="mcq">Multiple Choice</option>
                <option value="theory">Theory</option>
                <option value="fill-blanks">Fill in the Blanks</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Filter Controls Row 2: Date Pickers + Only Questions with Images Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            {/* Left: Date Range */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* From Date */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground min-w-8">From</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  aria-label="Filter from date"
                  className="h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all cursor-pointer"
                />
              </div>

              {/* To Date */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground min-w-5">To</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  aria-label="Filter to date"
                  className="h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all cursor-pointer"
                />
              </div>

              {(fromDate || toDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setFromDate("")
                    setToDate("")
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
                >
                  Clear dates
                </button>
              )}
            </div>

            {/* Right: Only questions with images switch */}
            <div className="flex items-center gap-2.5 select-none">
              <button
                type="button"
                role="switch"
                aria-checked={onlyWithImages}
                onClick={() => setOnlyWithImages(!onlyWithImages)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  onlyWithImages ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-card shadow-md ring-0 transition duration-200 ease-in-out ${
                    onlyWithImages ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <label
                onClick={() => setOnlyWithImages(!onlyWithImages)}
                className="text-xs sm:text-sm font-medium text-foreground cursor-pointer"
              >
                Only questions with images
              </label>
            </div>
          </div>

          {/* Subheader: Selected Counter & Default Scores Notice */}
          <div className="flex items-center justify-between text-xs sm:text-sm pt-2">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-foreground">
                Selected {selectedCount}/{maxSelectable}
              </span>

              {filteredQuestions.length > 0 && (
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-xs font-semibold text-primary hover:underline cursor-pointer transition-colors"
                >
                  {isAllSelected ? "Deselect all visible" : "Select all matching"}
                </button>
              )}
            </div>

            <span className="text-xs text-muted-foreground">
              Imported at this exam's default scores
            </span>
          </div>
        </div>

        {/* Central Content Area: Questions List or Empty State */}
        <div className="flex-1 min-h-0 overflow-y-auto border-t border-b border-border bg-muted/15">
          {filteredQuestions.length === 0 ? (
            /* Empty State matching screenshot */
            <div className="py-20 sm:py-24 px-6 text-center space-y-3">
              <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                No questions found. Questions appear here once they are part of an exam you have
                published.
              </p>

              {(searchQuery ||
                selectedCourse !== "all" ||
                selectedType !== "all" ||
                fromDate ||
                toDate ||
                onlyWithImages) && (
                <div className="pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-xs font-semibold text-primary hover:bg-primary/10"
                  >
                    Reset all active filters
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Questions List */
            <div className="p-4 sm:p-6 space-y-3">
              {filteredQuestions.map((item) => {
                const isSelected = selectedIds.has(item.id)
                const isExpanded = expandedId === item.id

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleQuestion(item.id)}
                    className={`rounded-2xl border p-4 sm:p-5 transition-all cursor-pointer select-none bg-card ${
                      isSelected
                        ? "border-primary ring-1 ring-primary shadow-xs"
                        : "border-border hover:border-border/80 hover:bg-card/90"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Checkbox */}
                      <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleQuestion(item.id)}
                          aria-label={`Select question: ${item.prompt.slice(0, 30)}`}
                        />
                      </div>

                      {/* Main Question Body */}
                      <div className="flex-1 space-y-2">
                        {/* Meta Tags Row */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="pill"
                            className="text-[10px] font-bold text-primary bg-primary/10"
                          >
                            {item.course}
                          </Badge>

                          <Badge
                            variant="secondary"
                            className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                          >
                            {item.type === "mcq"
                              ? "Multiple Choice"
                              : item.type === "theory"
                              ? "Theory"
                              : "Fill in the Blanks"}
                          </Badge>

                          {item.difficulty && (
                            <span className="text-[11px] font-medium text-muted-foreground">
                              • {item.difficulty}
                            </span>
                          )}

                          <span className="text-[11px] font-medium text-muted-foreground">
                            • {item.examTitle}
                          </span>

                          {item.imageUrl && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded-md border border-primary/20">
                              <ImageIcon className="size-3" />
                              Has Image
                            </span>
                          )}

                          <span className="ml-auto text-xs font-bold text-foreground">
                            {item.points} {item.points === 1 ? "pt" : "pts"}
                          </span>
                        </div>

                        {/* Prompt */}
                        <p className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                          {item.prompt}
                        </p>

                        {/* Optional Attached Diagram Image */}
                        {item.imageUrl && (
                          <div className="pt-1.5 flex items-start gap-3">
                            <img
                              src={item.imageUrl}
                              alt={item.imageCaption || "Question visual illustration"}
                              className="size-20 sm:size-24 rounded-xl object-cover border border-border shadow-2xs"
                              loading="lazy"
                            />
                            {item.imageCaption && (
                              <p className="text-[11px] text-muted-foreground italic self-center">
                                {item.imageCaption}
                              </p>
                            )}
                          </div>
                        )}

                        {/* MCQ Options Quick Preview */}
                        {item.type === "mcq" && item.options && item.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                            {item.options.map((opt) => (
                              <div
                                key={opt.id}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${
                                  opt.id === item.correctOptionId
                                    ? "border-status-success/40 bg-status-success/5 text-foreground font-semibold"
                                    : "border-border/60 bg-muted/20 text-muted-foreground"
                                }`}
                              >
                                <span className="font-bold text-[11px] text-foreground">
                                  {opt.id}.
                                </span>
                                <span className="truncate">{opt.text}</span>
                                {opt.id === item.correctOptionId && (
                                  <CheckCircle2 className="size-3 text-status-success ml-auto shrink-0" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Theory Details Preview Toggle */}
                        {item.type === "theory" && item.theoryAnswer && (
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setExpandedId(isExpanded ? null : item.id)
                              }}
                              className="text-xs font-semibold text-primary hover:underline cursor-pointer inline-flex items-center gap-1"
                            >
                              {isExpanded ? "Hide Marking Guide" : "View Marking Guide & Rubrics"}
                              <ChevronDown
                                className={`size-3 transition-transform ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </button>

                            {isExpanded && (
                              <div className="mt-2 p-3 rounded-xl bg-muted/30 border border-border text-xs space-y-2 animate-in fade-in duration-150">
                                <div>
                                  <span className="font-bold text-foreground block mb-0.5">
                                    Expected Answer Key:
                                  </span>
                                  <p className="text-muted-foreground leading-relaxed">
                                    {item.theoryAnswer}
                                  </p>
                                </div>

                                {item.rubrics && item.rubrics.length > 0 && (
                                  <div>
                                    <span className="font-bold text-foreground block mb-1">
                                      Scoring Rubrics:
                                    </span>
                                    <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                                      {item.rubrics.map((r) => (
                                        <li key={r.id}>
                                          {r.criterion} ({(r.weight * 100).toFixed(0)}%)
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Fill-in-the-blanks Answer Preview */}
                        {item.type === "fill-blanks" && item.shortAnswer && (
                          <div className="pt-1 text-xs text-muted-foreground">
                            Expected Answer:{" "}
                            <span className="font-bold text-foreground bg-muted px-2 py-0.5 rounded-md">
                              {item.shortAnswer}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="shrink-0 flex items-center justify-end gap-3 p-4 sm:p-6 py-3 sm:py-4 bg-card border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={handleModalClose}
            className="rounded-xl px-5 text-xs sm:text-sm font-semibold cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="primary"
            size="default"
            disabled={selectedCount === 0}
            onClick={handleImportSubmit}
            sheen={selectedCount > 0}
            className="rounded-xl px-6 text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
          >
            Import Questions{selectedCount > 0 ? ` (${selectedCount})` : ""}
          </Button>
        </div>
      </div>
    </div>
  )
}
