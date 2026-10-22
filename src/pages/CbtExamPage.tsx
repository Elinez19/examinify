import { useCbtExamRunner } from "@/hooks/cbt-exam/useCbtExamRunner"
import { ExamPreflightWizard } from "@/components/cbt-exam/preliminary/ExamPreflightWizard"
import { CbtExamHeaderHUD } from "@/components/cbt-exam/runner/CbtExamHeaderHUD"
import { CbtSubjectTabs } from "@/components/cbt-exam/runner/CbtSubjectTabs"
import { CbtQuestionView } from "@/components/cbt-exam/runner/CbtQuestionView"
import { CbtQuestionPalette } from "@/components/cbt-exam/runner/CbtQuestionPalette"
import { CbtActionBar } from "@/components/cbt-exam/runner/CbtActionBar"
import { CbtCalculatorModal } from "@/components/cbt-exam/runner/CbtCalculatorModal"
import { CbtProctorAlertModal } from "@/components/cbt-exam/runner/CbtProctorAlertModal"
import { CbtSubmitConfirmModal } from "@/components/cbt-exam/runner/CbtSubmitConfirmModal"
import { CbtResultSummaryView } from "@/components/cbt-exam/results/CbtResultSummaryView"

interface CbtExamPageProps {
  sessionId?: string
  onReturnToDashboard: () => void
}

export function CbtExamPage({
  sessionId = "exm-term2-day1",
  onReturnToDashboard,
}: CbtExamPageProps) {
  const {
    session,
    viewMode,
    setViewMode,
    preflightStep,
    activeSubjectIndex,
    activeQuestionIndex,
    currentSubject,
    currentQuestion,
    answers,
    flagged,
    visited,
    saveStatus,
    fontSize,
    isCalculatorOpen,
    isSubmitModalOpen,
    examResult,
    subjectStats,
    timer,
    proctoring,
    handleNextPreflightStep,
    handlePreviousPreflightStep,
    handleStartExam,
    handleSelectSubject,
    handleJumpToQuestion,
    handleSelectOption,
    handleClearOption,
    handleToggleFlag,
    handlePreviousQuestion,
    handleNextQuestion,
    handleToggleFontSize,
    setIsCalculatorOpen,
    setIsSubmitModalOpen,
    handleFinalizeSubmission,
  } = useCbtExamRunner({
    sessionId,
    onExitExam: onReturnToDashboard,
  })

  // 1. Preflight Verification & Onboarding Wizard
  if (viewMode === "preflight") {
    return (
      <ExamPreflightWizard
        session={session}
        currentStep={preflightStep}
        onNextStep={handleNextPreflightStep}
        onPreviousStep={handlePreviousPreflightStep}
        onStartExam={handleStartExam}
        onCancel={onReturnToDashboard}
      />
    )
  }

  // 3. Post-Exam Official Result Slip
  if (viewMode === "results" && examResult) {
    return (
      <CbtResultSummaryView
        result={examResult}
        onReturnToDashboard={onReturnToDashboard}
        onRetakePractice={() => setViewMode("preflight")}
      />
    )
  }

  // 2. Live Fullscreen Examination Arena
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col select-none">
      {/* Top Header HUD */}
      <CbtExamHeaderHUD
        candidate={session.candidate}
        formattedTime={timer.formattedTime}
        urgency={timer.urgency}
        saveStatus={saveStatus}
        fontSize={fontSize}
        allowCalculator={session.allowCalculator}
        onToggleCalculator={() => setIsCalculatorOpen((prev) => !prev)}
        onToggleFontSize={handleToggleFontSize}
      />

      {/* Multi-Subject Tab Switcher */}
      <CbtSubjectTabs
        subjects={session.subjects}
        activeSubjectIndex={activeSubjectIndex}
        subjectStats={subjectStats}
        onSelectSubject={handleSelectSubject}
      />

      {/* Main Examination Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 items-start">
        {/* Left / Center: Question & Options View */}
        <div className="flex-1 w-full bg-card rounded-3xl border border-border p-5 sm:p-8 shadow-xs">
          <CbtQuestionView
            question={currentQuestion}
            subjectName={currentSubject.name}
            totalSubjectQuestions={currentSubject.questions.length}
            selectedOptionId={answers[currentQuestion.id]}
            isFlagged={Boolean(flagged[currentQuestion.id])}
            fontSize={fontSize}
            onSelectOption={handleSelectOption}
            onToggleFlag={handleToggleFlag}
            onClearOption={handleClearOption}
          />
        </div>

        {/* Right: Question Navigation Palette */}
        <CbtQuestionPalette
          questions={currentSubject.questions}
          activeQuestionIndex={activeQuestionIndex}
          answers={answers}
          flagged={flagged}
          visited={visited}
          subjectName={currentSubject.name}
          onJumpToQuestion={handleJumpToQuestion}
        />
      </main>

      {/* Sticky Bottom Action Navigation Bar */}
      <CbtActionBar
        hasPrevious={activeSubjectIndex > 0 || activeQuestionIndex > 0}
        hasNext={
          activeSubjectIndex < session.subjects.length - 1 ||
          activeQuestionIndex < currentSubject.questions.length - 1
        }
        onPrevious={handlePreviousQuestion}
        onNext={handleNextQuestion}
        onSubmit={() => setIsSubmitModalOpen(true)}
      />

      {/* Popovers & Interceptors */}
      <CbtCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      <CbtProctorAlertModal
        isOpen={proctoring.isAlertActive}
        infractionCount={proctoring.infractionCount}
        maxInfractions={proctoring.maxInfractions}
        reason={proctoring.lastInfractionReason}
        onReenterFullscreen={proctoring.dismissAlertAndReenterFullscreen}
      />

      <CbtSubmitConfirmModal
        isOpen={isSubmitModalOpen}
        subjectStats={subjectStats}
        onConfirmSubmit={handleFinalizeSubmission}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </div>
  )
}
