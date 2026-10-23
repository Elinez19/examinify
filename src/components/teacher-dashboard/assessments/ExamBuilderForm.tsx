import * as React from "react"
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Plus,
  Trash2,
  Copy,
  Image as ImageIcon,
  Check,
  Database,
  Layers,
  Save,
  X,
  FileText,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useExamBuilderForm, type ExamBuilderStep } from "@/hooks/teacher-dashboard/useExamBuilderForm"
import { BulkQuestionImporterModal } from "./BulkQuestionImporterModal"
import { ExamStudentPreviewModal } from "./ExamStudentPreviewModal"
import { QuestionBankModal } from "./QuestionBankModal"
import { CreateWithAiModal } from "./CreateWithAiModal"
import { ExamTimeSettingsStep } from "./ExamTimeSettingsStep"
import { ExamSettingsStep } from "./ExamSettingsStep"
import type {
  ITeacherCbtExam,
  ITeacherAssignedClass,
  AssessmentType,
  TeacherQuestionType,
} from "@/types/teacher"

interface ExamBuilderFormProps {
  initialExam?: ITeacherCbtExam | null
  assignedClasses: ITeacherAssignedClass[]
  defaultSubject: string
  initialOpenAiModal?: boolean
  onSaveExam: (exam: ITeacherCbtExam) => void
  onCancel: () => void
}

export function ExamBuilderForm({
  initialExam,
  assignedClasses,
  defaultSubject,
  initialOpenAiModal,
  onSaveExam,
  onCancel,
}: ExamBuilderFormProps) {
  const {
    currentStep,
    setCurrentStep,

    // Meta
    title,
    setTitle,
    subject,
    setSubject,
    assessmentType,
    setAssessmentType,
    academicSession,
    setAcademicSession,
    term,
    setTerm,
    instructions,
    setInstructions,

    // Class selection
    selectedClasses,
    toggleClass,
    selectAllClasses,
    totalEnrolledPupils,

    // Timing & Settings
    durationMinutes,
    setDurationMinutes,
    passingScore,
    scheduledDate,
    setScheduledDate,
    startTime,
    setStartTime,
    allowCalculator,

    // Exam Settings Step Controls
    autoPublishResults,
    setAutoPublishResults,
    showStudentFeedback,
    setShowStudentFeedback,
    showCorrectAnswers,
    setShowCorrectAnswers,
    allowRemarkRequests,
    setAllowRemarkRequests,
    remarkRequestWindowDays,
    setRemarkRequestWindowDays,
    maxTabSwitches,
    setMaxTabSwitches,
    allowBackwardNavigation,
    setAllowBackwardNavigation,
    randomizeOptions,
    setRandomizeOptions,
    enableLiveMonitoring,
    setEnableLiveMonitoring,
    enableQuestionBank,
    setEnableQuestionBank,

    // Questions Studio
    questions,
    currentIndex,
    setCurrentIndex,
    currentQuestion,
    addQuestion,
    duplicateQuestion,
    deleteQuestion,
    moveQuestionUp,
    moveQuestionDown,
    updateQuestionType,
    updatePrompt,
    updateTheoryAnswer,
    updateShortAnswer,
    incrementPoints,
    decrementPoints,
    addRubricCriterion,
    updateRubricCriterion,
    updateRubricWeight,
    deleteRubricCriterion,
    addOption,
    updateOptionText,
    deleteOption,
    setCorrectOption,
    updateQuestionImage,
    removeQuestionImage,
    insertSymbol,
    importBulkQuestions,

    // Modals & UI
    isBulkImportOpen,
    setIsBulkImportOpen,
    isQuestionBankOpen,
    setIsQuestionBankOpen,
    isAiModalOpen,
    setIsAiModalOpen,
    isPreviewOpen,
    setIsPreviewOpen,
    importQuestionsFromBank,
    importAiQuestions,
    saveToastVisible,
    setSaveToastVisible,

    // Stats
    validQuestionsCount,
    totalPoints,

    // Final Action
    handleSave,
  } = useExamBuilderForm({
    initialExam,
    assignedClasses,
    defaultSubject,
    initialOpenAiModal,
    onSaveExam,
    onCancel,
  })

  // State for Rubrics Collapsible panel
  const [rubricsExpanded, setRubricsExpanded] = React.useState(true)

  // Question navigation list
  const activeQType: TeacherQuestionType = currentQuestion.type || "theory"
  const qPrompt = currentQuestion.prompt || ""
  const qTheoryAnswer = currentQuestion.theoryAnswer || ""
  const qRubrics = React.useMemo(() => currentQuestion.rubrics || [], [currentQuestion.rubrics])

  // Calculate total rubrics weight
  const totalRubricWeight = React.useMemo(() => {
    const sum = qRubrics.reduce((acc, r) => acc + (r.weight || 0), 0)
    return Math.round(sum * 100) / 100
  }, [qRubrics])

  const isRubricsBalanced = Math.abs(totalRubricWeight - 1.0) < 0.01

  // Temporary assembled exam for student preview simulator
  const previewExam: ITeacherCbtExam = React.useMemo(() => {
    return {
      id: initialExam?.id || "preview-id",
      title: title.trim() || "CBT Assessment",
      subject: subject || "English Language",
      assessmentType,
      academicSession,
      term,
      instructions,
      targetClasses: selectedClasses,
      totalQuestions: questions.length,
      readyQuestionsCount: validQuestionsCount,
      durationMinutes: Number(durationMinutes) || 60,
      status: "draft",
      scheduledDate: scheduledDate || "26-10-2026",
      startTime,
      passingScore: Number(passingScore) || 50,
      questions,
      allowCalculator,
      autoPublishResults,
      showStudentFeedback,
      showCorrectAnswers,
      allowRemarkRequests,
      remarkRequestWindowDays,
      maxTabSwitches,
      allowBackwardNavigation,
      randomizeOptions,
      enableLiveMonitoring,
      enableQuestionBank,
    }
  }, [
    initialExam?.id,
    title,
    subject,
    assessmentType,
    academicSession,
    term,
    instructions,
    selectedClasses,
    questions,
    validQuestionsCount,
    durationMinutes,
    scheduledDate,
    startTime,
    passingScore,
    allowCalculator,
    autoPublishResults,
    showStudentFeedback,
    showCorrectAnswers,
    allowRemarkRequests,
    remarkRequestWindowDays,
    maxTabSwitches,
    allowBackwardNavigation,
    randomizeOptions,
    enableLiveMonitoring,
    enableQuestionBank,
  ])

  // Stepper items specification
  const stepperTabs: { id: ExamBuilderStep; label: string }[] = [
    { id: "about", label: "About Exam" },
    { id: "questions", label: "Add Questions" },
    { id: "time", label: "Time" },
    { id: "settings", label: "Exam Settings" },
    { id: "groups", label: "Student Groups" },
  ]

  return (
    <div className="relative pb-16 space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb Back Navigation (Reference Images 1, 3, 4) */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 text-xs font-bold text-foreground hover:text-primary transition-colors cursor-pointer group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase">Back to {subject || "ENGLISH LANGUAGE"}</span>
        </button>

        <div className="flex items-center gap-2">
          {saveToastVisible && (
            <Badge variant="success" className="text-xs font-bold gap-1 animate-in fade-in">
              <Check className="size-3.5" />
              <span>Draft Saved</span>
            </Badge>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewOpen(true)}
            className="text-xs font-semibold h-9 px-3.5"
          >
            Preview as Student
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSave("draft")}
            className="text-xs font-bold h-9 px-4 text-primary border-primary/30 hover:bg-primary/5 cursor-pointer"
          >
            Save to Draft
          </Button>
        </div>
      </div>

      {/* Horizontal Stepper Header (Reference Images 1, 3, 4) */}
      <div className="flex items-center justify-center border-b border-border text-xs sm:text-sm font-semibold select-none overflow-x-auto">
        <div className="flex items-center gap-8 sm:gap-12 min-w-max pb-3">
          {stepperTabs.map((step) => {
            const currentStepIdx = stepperTabs.findIndex((t) => t.id === currentStep)
            const stepIdx = stepperTabs.findIndex((t) => t.id === step.id)
            const isActive = currentStep === step.id
            const isCompleted = stepIdx < currentStepIdx

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={`relative cursor-pointer transition-colors pb-1 ${
                  isActive
                    ? "text-primary font-bold"
                    : isCompleted
                    ? "text-status-success font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{step.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-in fade-in duration-150" />
                )}
                {isCompleted && !isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-status-success rounded-full opacity-60" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* STEP 1: ABOUT EXAM */}
      {currentStep === "about" && (
        <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-foreground">About Examination</h2>
            <p className="text-xs text-muted-foreground">
              Configure the foundational metadata and instructions for this assessment.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5">
                Assessment Title
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 2nd Term Continuous Assessment (CA 1)"
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">
                  Subject
                </label>
                <Input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. English Language"
                  className="h-10 text-xs rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">
                  Assessment Type
                </label>
                <select
                  value={assessmentType}
                  onChange={(e) => setAssessmentType(e.target.value as AssessmentType)}
                  className="w-full h-10 px-3 text-xs font-semibold rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                >
                  <option value="CA1">CA 1 (Continuous Assessment 1)</option>
                  <option value="CA2">CA 2 (Continuous Assessment 2)</option>
                  <option value="CA3">CA 3 (Continuous Assessment 3)</option>
                  <option value="CA4">CA 4 (Continuous Assessment 4)</option>
                  <option value="Exam">Terminal Examination</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">
                  Academic Session
                </label>
                <Input
                  type="text"
                  value={academicSession}
                  onChange={(e) => setAcademicSession(e.target.value)}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">
                  Term
                </label>
                <Input
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="h-10 text-xs rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5">
                Instructions for Candidates
              </label>
              <textarea
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Candidate instructions..."
                className="w-full p-3 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button
              type="button"
              variant="primary"
              size="default"
              onClick={() => setCurrentStep("questions")}
              className="text-xs font-bold px-6"
            >
              Continue to Questions →
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: ADD QUESTIONS (Pixel-Accurate to Reference Images 1, 3, 4) */}
      {currentStep === "questions" && (
        <div className="flex items-start justify-center gap-4 relative">
          {/* Main Question Editor Canvas */}
          <div className="w-full max-w-3xl space-y-6">
            {/* Question Selector Pills if more than 1 question */}
            {questions.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-xs font-bold text-muted-foreground mr-1">Questions:</span>
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-7 px-3 rounded-lg font-bold transition-all cursor-pointer ${
                      currentIndex === idx
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Q{idx + 1}
                  </button>
                ))}
              </div>
            )}

            {/* Quick Actions & Order Controls */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAiModalOpen(true)}
                  leftIcon={<Sparkles className="size-3.5 text-primary" />}
                  className="text-xs font-bold h-8 rounded-xl cursor-pointer bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary shadow-2xs"
                >
                  Create with AI
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsQuestionBankOpen(true)}
                  leftIcon={<Database className="size-3.5 text-primary" />}
                  className="text-xs font-semibold h-8 rounded-xl cursor-pointer"
                >
                  Question Bank
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBulkImportOpen(true)}
                  leftIcon={<FileText className="size-3.5 text-primary" />}
                  className="text-xs font-semibold h-8 rounded-xl hidden sm:inline-flex cursor-pointer"
                >
                  Bulk Import
                </Button>
              </div>

              {/* Top Right Order Controls (Blue square up/down buttons matching reference image) */}
              <div className="flex justify-end gap-1.5 ml-auto">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => moveQuestionUp(currentIndex)}
                  className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
                  title="Move Question Up"
                  aria-label="Move Question Up"
                >
                  <ChevronUp className="size-4 stroke-[2.5]" />
                </button>

                <button
                  type="button"
                  disabled={currentIndex >= questions.length - 1}
                  onClick={() => moveQuestionDown(currentIndex)}
                  className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
                  title="Move Question Down"
                  aria-label="Move Question Down"
                >
                  <ChevronDown className="size-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Central Question Editor Card (Left Blue Bar Accent matching Reference Images) */}
            <div className="rounded-2xl border border-border border-l-4 border-l-primary bg-card p-6 sm:p-8 shadow-xs space-y-6 transition-all">
              {/* Row 1: Question Type + Max Score Stepper + Action Icons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  {/* Question Type Dropdown */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-medium text-muted-foreground block">
                      Question Type
                    </span>
                    <select
                      value={activeQType}
                      onChange={(e) => updateQuestionType(e.target.value as TeacherQuestionType)}
                      className="h-9 px-3 text-xs font-semibold rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer min-w-[130px]"
                    >
                      <option value="theory">Theory</option>
                      <option value="mcq">MCQ</option>
                      <option value="fill-blanks">Fill the Blanks</option>
                    </select>
                  </div>

                  {/* Maximum Score Stepper */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-medium text-muted-foreground block">
                      Maximum Score
                    </span>
                    <div className="flex items-center rounded-xl border border-border bg-background h-9 overflow-hidden">
                      <button
                        type="button"
                        onClick={decrementPoints}
                        className="px-2.5 h-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                        aria-label="Decrease score"
                      >
                        –
                      </button>
                      <span className="px-3 text-xs font-extrabold text-foreground min-w-[32px] text-center">
                        {currentQuestion.points || 1}
                      </span>
                      <button
                        type="button"
                        onClick={incrementPoints}
                        className="px-2.5 h-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                        aria-label="Increase score"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Action Icons in Header */}
                <div className="flex items-center gap-1.5 self-end sm:self-center text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => duplicateQuestion(currentIndex)}
                    className="p-2 rounded-lg hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                    title="Duplicate Question"
                    aria-label="Duplicate Question"
                  >
                    <Copy className="size-4" />
                  </button>

                  <button
                    type="button"
                    disabled={questions.length <= 1}
                    onClick={() => deleteQuestion(currentIndex)}
                    className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-40 cursor-pointer"
                    title="Delete Question"
                    aria-label="Delete Question"
                  >
                    <Trash2 className="size-4" />
                  </button>

                  <div className="h-4 w-px bg-border mx-1" />

                  {/* Math / Sigma Icon */}
                  <button
                    type="button"
                    onClick={() => insertSymbol(" Σ ")}
                    className="p-2 rounded-lg hover:bg-muted hover:text-foreground transition-colors font-serif font-bold text-xs cursor-pointer"
                    title="Insert Mathematical Sigma"
                  >
                    Σ
                  </button>

                  {/* Matrix / Symbol Tool */}
                  <button
                    type="button"
                    onClick={() => insertSymbol(" ▦ ")}
                    className="p-2 rounded-lg hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                    title="Grid / Matrix Symbol"
                  >
                    ▦
                  </button>

                  {/* Image Tool */}
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt("Enter image diagram URL:")
                      if (url) updateQuestionImage(url)
                    }}
                    className="p-2 rounded-lg hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                    title="Insert Image Diagram"
                  >
                    <ImageIcon className="size-4" />
                  </button>
                </div>
              </div>

              {/* Row 2: Question Prompt Textarea (Reference Images 1, 3, 4) */}
              <div className="space-y-1">
                <textarea
                  rows={3}
                  value={qPrompt}
                  maxLength={500}
                  onChange={(e) => updatePrompt(e.target.value)}
                  placeholder="Enter question text"
                  className="w-full p-0 text-sm font-medium border-0 border-b border-border/80 bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors resize-none py-2"
                />
                <div className="flex justify-end text-[11px] text-muted-foreground">
                  <span>{500 - qPrompt.length} characters left</span>
                </div>
              </div>

              {/* Image Preview if question has image */}
              {currentQuestion.imageUrl && (
                <div className="relative rounded-xl border border-border p-2 max-w-sm bg-muted/20">
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Question Diagram"
                    className="rounded-lg max-h-48 object-contain w-full"
                  />
                  <button
                    type="button"
                    onClick={removeQuestionImage}
                    className="absolute top-3 right-3 p-1 rounded-full bg-card shadow-xs text-destructive hover:bg-destructive hover:text-card transition-colors cursor-pointer"
                    aria-label="Remove image"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              )}

              {/* Dynamic Body: THEORY (Reference Image 1) */}
              {activeQType === "theory" && (
                <div className="space-y-6 pt-2">
                  {/* Theory Answer Placeholder */}
                  <div className="space-y-1">
                    <textarea
                      rows={3}
                      value={qTheoryAnswer}
                      maxLength={1500}
                      onChange={(e) => updateTheoryAnswer(e.target.value)}
                      placeholder="Theory answer"
                      className="w-full p-0 text-xs font-normal border-0 border-b border-border/80 bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors resize-none py-2"
                    />
                    <div className="flex justify-end text-[11px] text-muted-foreground">
                      <span>{1500 - qTheoryAnswer.length} characters left</span>
                    </div>
                  </div>

                  {/* Question Rubrics Section (Reference Image 1) */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setRubricsExpanded(!rubricsExpanded)}
                        className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
                      >
                        <span>Question Rubrics</span>
                        {rubricsExpanded ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </button>
                    </div>

                    {rubricsExpanded && (
                      <div className="space-y-2.5 animate-in fade-in duration-150">
                        {qRubrics.map((rubric) => (
                          <div
                            key={rubric.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-xl border border-border/70 bg-muted/20"
                          >
                            <input
                              type="text"
                              value={rubric.criterion}
                              onChange={(e) => updateRubricCriterion(rubric.id, e.target.value)}
                              placeholder="Criterion description..."
                              className="w-full text-xs font-medium bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:outline-none"
                            />

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                              {/* Weight Stepper */}
                              <div className="flex items-center rounded-lg border border-border bg-background h-7 overflow-hidden text-xs">
                                <button
                                  type="button"
                                  onClick={() => updateRubricWeight(rubric.id, -0.1)}
                                  className="px-2 h-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                  aria-label="Decrease weight"
                                >
                                  –
                                </button>
                                <span className="px-2 font-mono font-bold text-foreground min-w-[28px] text-center">
                                  {rubric.weight.toFixed(1)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateRubricWeight(rubric.id, 0.1)}
                                  className="px-2 h-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                  aria-label="Increase weight"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => deleteRubricCriterion(rubric.id)}
                                className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                                aria-label="Remove criterion"
                              >
                                <X className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}

                        <div className="flex items-center justify-between pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addRubricCriterion}
                            leftIcon={<Plus className="size-3.5" />}
                            className="text-xs font-semibold h-8"
                          >
                            Add criteria
                          </Button>

                          <div className="text-xs font-bold">
                            <span className="text-muted-foreground">Total Weight: </span>
                            <span
                              className={
                                isRubricsBalanced
                                  ? "text-status-success font-extrabold"
                                  : "text-status-warning font-extrabold"
                              }
                            >
                              {totalRubricWeight.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Dynamic Body: MCQ (Reference Image 3) */}
              {activeQType === "mcq" && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2.5">
                    {(currentQuestion.options || []).map((opt) => {
                      const isCorrect = currentQuestion.correctOptionId === opt.id

                      return (
                        <div
                          key={opt.id}
                          className="flex items-center gap-3 p-2 rounded-xl border border-border/80 hover:border-primary/40 bg-background transition-colors group"
                        >
                          <button
                            type="button"
                            onClick={() => setCorrectOption(opt.id)}
                            className={`flex size-4.5 items-center justify-center rounded-full border transition-all cursor-pointer ${
                              isCorrect
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground/40 hover:border-primary"
                            }`}
                            aria-label={`Mark Option ${opt.id} as correct`}
                          >
                            {isCorrect && <span className="size-1.5 rounded-full bg-primary-foreground" />}
                          </button>

                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => updateOptionText(opt.id, e.target.value)}
                            placeholder={`Option ${opt.id}`}
                            className="w-full text-xs font-medium bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:outline-none"
                          />

                          {(currentQuestion.options || []).length > 2 && (
                            <button
                              type="button"
                              onClick={() => deleteOption(opt.id)}
                              className="p-1 rounded-md text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              aria-label="Delete option"
                            >
                              <X className="size-3.5" />
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={addOption}
                      className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
                    >
                      <Plus className="size-3.5" />
                      <span>Add option</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic Body: FILL THE BLANKS (Reference Image 4) */}
              {activeQType === "fill-blanks" && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-medium text-muted-foreground block">
                    Expected Blank / Accepted Answer
                  </span>
                  <Input
                    type="text"
                    value={currentQuestion.shortAnswer || ""}
                    onChange={(e) => updateShortAnswer(e.target.value)}
                    placeholder="Short answer"
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              )}
            </div>

            {/* Bottom Row Action Buttons (Reference Images 1, 3, 4) */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={() => addQuestion(activeQType)}
                leftIcon={<Plus className="size-4" />}
                className="text-xs font-bold h-10 px-4 rounded-xl"
              >
                Add Question
              </Button>

              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={() => addQuestion("theory")}
                leftIcon={<Plus className="size-4" />}
                className="text-xs font-bold h-10 px-4 rounded-xl"
              >
                Add Section
              </Button>

              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={() => {
                  setSaveToastVisible(true)
                  setTimeout(() => setSaveToastVisible(false), 1500)
                }}
                leftIcon={<Layers className="size-4" />}
                className="text-xs font-bold h-10 px-4 rounded-xl"
              >
                Auto-section by type
              </Button>
            </div>

            {/* Footer Navigation Buttons (Previous / Save Questions) */}
            <div className="flex items-center justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={() => setCurrentStep("about")}
                className="text-xs font-bold px-6 h-10 rounded-xl"
              >
                Previous
              </Button>

              <Button
                type="button"
                variant="primary"
                size="default"
                onClick={() => {
                  setSaveToastVisible(true)
                  setTimeout(() => setSaveToastVisible(false), 1500)
                  setCurrentStep("time")
                }}
                className="text-xs font-bold px-8 h-10 rounded-xl shadow-xs"
              >
                Save Questions
              </Button>
            </div>
          </div>

          {/* Right-Hand Floating Tool Dock (Reference Images 1, 3, 4) */}
          <div className="hidden lg:flex flex-col items-center gap-2 p-2 rounded-2xl border border-border bg-card shadow-sm sticky top-24 select-none">
            <button
              type="button"
              onClick={() => addQuestion(activeQType)}
              className="p-2.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              title="Add Question"
              aria-label="Add Question"
            >
              <Plus className="size-4.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsBulkImportOpen(true)}
              className="p-2.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              title="Bulk Question Importer"
              aria-label="Bulk Question Importer"
            >
              <FileText className="size-4.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsQuestionBankOpen(true)}
              className="p-2.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              title="Curriculum Question Bank"
              aria-label="Curriculum Question Bank"
            >
              <Database className="size-4.5" />
            </button>

            <button
              type="button"
              onClick={() => addQuestion("theory")}
              className="p-2.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              title="Add New Section"
              aria-label="Add New Section"
            >
              <Layers className="size-4.5" />
            </button>

            <div className="h-px w-6 bg-border my-1" />

            <button
              type="button"
              onClick={() => {
                setSaveToastVisible(true)
                setTimeout(() => setSaveToastVisible(false), 1500)
              }}
              className="p-2.5 rounded-xl text-primary hover:bg-primary/10 transition-colors cursor-pointer"
              title="Quick Save Draft"
              aria-label="Quick Save Draft"
            >
              <Save className="size-4.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: TIME */}
      {currentStep === "time" && (
        <ExamTimeSettingsStep
          scheduledDate={scheduledDate}
          onChangeScheduledDate={setScheduledDate}
          startTime={startTime}
          onChangeStartTime={setStartTime}
          durationMinutes={durationMinutes}
          onChangeDurationMinutes={setDurationMinutes}
          onPrevious={() => setCurrentStep("questions")}
          onNext={() => setCurrentStep("settings")}
        />
      )}

      {/* STEP 4: EXAM SETTINGS */}
      {currentStep === "settings" && (
        <ExamSettingsStep
          autoPublishResults={autoPublishResults}
          onChangeAutoPublishResults={setAutoPublishResults}
          showStudentFeedback={showStudentFeedback}
          onChangeShowStudentFeedback={setShowStudentFeedback}
          showCorrectAnswers={showCorrectAnswers}
          onChangeShowCorrectAnswers={setShowCorrectAnswers}
          allowRemarkRequests={allowRemarkRequests}
          onChangeAllowRemarkRequests={setAllowRemarkRequests}
          remarkRequestWindowDays={remarkRequestWindowDays}
          onChangeRemarkRequestWindowDays={setRemarkRequestWindowDays}
          maxTabSwitches={maxTabSwitches}
          onChangeMaxTabSwitches={setMaxTabSwitches}
          allowBackwardNavigation={allowBackwardNavigation}
          onChangeAllowBackwardNavigation={setAllowBackwardNavigation}
          randomizeOptions={randomizeOptions}
          onChangeRandomizeOptions={setRandomizeOptions}
          enableLiveMonitoring={enableLiveMonitoring}
          onChangeEnableLiveMonitoring={setEnableLiveMonitoring}
          enableQuestionBank={enableQuestionBank}
          onChangeEnableQuestionBank={setEnableQuestionBank}
          onPrevious={() => setCurrentStep("time")}
          onNext={() => setCurrentStep("groups")}
        />
      )}

      {/* STEP 5: STUDENT GROUPS & PUBLISHING */}
      {currentStep === "groups" && (
        <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-foreground">Student Groups / Classes</h2>
            <p className="text-xs text-muted-foreground">
              Select which of your assigned classes will take this examination.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs pb-1">
              <span className="text-muted-foreground">Available Teaching Classes:</span>
              <button
                type="button"
                onClick={selectAllClasses}
                className="font-bold text-primary hover:underline cursor-pointer"
              >
                Select All
              </button>
            </div>

            {assignedClasses.map((cls) => {
              const isSelected = selectedClasses.includes(cls.className)

              return (
                <label
                  key={cls.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleClass(cls.className)}
                      className="size-4 rounded text-primary focus:ring-primary cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-foreground text-xs block">{cls.className}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {cls.studentCount} enrolled students
                      </span>
                    </div>
                  </div>

                  <Badge variant="pill" className="text-[10px] font-semibold text-primary">
                    {cls.room}
                  </Badge>
                </label>
              )
            })}
          </div>

          {/* Publishing Summary */}
          <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Questions Configured:</span>
              <strong className="text-foreground">{questions.length}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Exam Points:</span>
              <strong className="text-foreground">{totalPoints}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Eligible Candidate Pupils:</span>
              <strong className="text-foreground">{totalEnrolledPupils} Students</strong>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => setCurrentStep("settings")}
              className="text-xs font-bold px-6"
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={() => handleSave("draft")}
                className="text-xs font-bold px-4"
              >
                Save as Draft
              </Button>

              <Button
                type="button"
                variant="primary"
                size="default"
                onClick={() => handleSave("published")}
                className="text-xs font-bold px-6 shadow-xs"
              >
                Publish Examination
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modals: Bulk Importer, Question Bank & Preview Simulator */}
      <BulkQuestionImporterModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImport={(raw) => importBulkQuestions(raw)}
      />

      <QuestionBankModal
        isOpen={isQuestionBankOpen}
        onClose={() => setIsQuestionBankOpen(false)}
        onImport={(importedQuestions) => importQuestionsFromBank(importedQuestions)}
        currentSubject={subject}
      />

      <ExamStudentPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        exam={previewExam}
        questions={questions}
      />

      {/* AI Question Generator Modal (Create with AI) */}
      <CreateWithAiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onImportQuestions={(aiQuestions) => importAiQuestions(aiQuestions)}
        currentSubject={subject}
      />
    </div>
  )
}
