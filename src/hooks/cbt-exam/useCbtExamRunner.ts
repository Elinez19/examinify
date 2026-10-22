import * as React from "react"
import { getCbtExamSession } from "@/services/cbt-exam/cbtMockExams"
import { computeCbtExamResult } from "@/services/cbt-exam/cbtScoring.service"
import { useCbtTimer } from "./useCbtTimer"
import { useCbtProctoring } from "./useCbtProctoring"
import { useCbtKeyboardShortcuts } from "./useCbtKeyboardShortcuts"
import type {
  ICbtExamSession,
  ExamViewMode,
  PreflightStep,
  ICbtAnswerMap,
  ICbtFlagMap,
  ICbtVisitedMap,
  ICbtExamResult,
} from "@/types/cbt"

export type CbtFontSize = "normal" | "large" | "extra-large"

interface UseCbtExamRunnerOptions {
  sessionId?: string
  onExitExam?: () => void
}

export function useCbtExamRunner({
  sessionId = "exm-term2-day1",
  onExitExam,
}: UseCbtExamRunnerOptions = {}) {
  const session: ICbtExamSession = React.useMemo(() => {
    return getCbtExamSession(sessionId)
  }, [sessionId])

  const [viewMode, setViewMode] = React.useState<ExamViewMode>("preflight")
  const [preflightStep, setPreflightStep] = React.useState<PreflightStep>("admit-slip")
  const [activeSubjectIndex, setActiveSubjectIndex] = React.useState(0)
  const [activeQuestionIndex, setActiveQuestionIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<ICbtAnswerMap>({})
  const [flagged, setFlagged] = React.useState<ICbtFlagMap>({})
  const [visited, setVisited] = React.useState<ICbtVisitedMap>({})
  const [saveStatus, setSaveStatus] = React.useState<"saved" | "saving">("saved")
  const [fontSize, setFontSize] = React.useState<CbtFontSize>("normal")
  const [isCalculatorOpen, setIsCalculatorOpen] = React.useState(false)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = React.useState(false)
  const [examResult, setExamResult] = React.useState<ICbtExamResult | null>(null)

  const currentSubject = session.subjects[activeSubjectIndex] || session.subjects[0]
  const currentQuestion =
    currentSubject.questions[activeQuestionIndex] || currentSubject.questions[0]

  const handleFinalizeSubmissionRef = React.useRef<() => void>(() => {})

  // Timer Integration
  const timer = useCbtTimer({
    durationMinutes: session.durationMinutes,
    autoStart: false,
    onTimeExpired: () => {
      handleFinalizeSubmissionRef.current()
    },
  })

  // Proctoring Integration
  const proctoring = useCbtProctoring({
    isActive: viewMode === "live" && session.strictProctoring,
    maxInfractions: session.maxInfractions,
    onMaxInfractionsReached: () => {
      handleFinalizeSubmissionRef.current()
    },
  })

  // Finalize Submission
  const handleFinalizeSubmission = React.useCallback(() => {
    setIsSubmitModalOpen(false)
    const result = computeCbtExamResult(session, answers, timer.elapsedSeconds)
    setExamResult(result)
    proctoring.exitFullscreen()
    setViewMode("results")
  }, [session, answers, timer.elapsedSeconds, proctoring])

  React.useEffect(() => {
    handleFinalizeSubmissionRef.current = handleFinalizeSubmission
  }, [handleFinalizeSubmission])

  // Preflight navigation
  const handleNextPreflightStep = React.useCallback(() => {
    if (preflightStep === "admit-slip") setPreflightStep("regulations")
    else if (preflightStep === "regulations") setPreflightStep("proctoring-check")
    else if (preflightStep === "proctoring-check") setPreflightStep("ready")
  }, [preflightStep])

  const handlePreviousPreflightStep = React.useCallback(() => {
    if (preflightStep === "regulations") setPreflightStep("admit-slip")
    else if (preflightStep === "proctoring-check") setPreflightStep("regulations")
    else if (preflightStep === "ready") setPreflightStep("proctoring-check")
  }, [preflightStep])

  const handleStartExam = React.useCallback(async () => {
    await proctoring.requestFullscreen()
    setViewMode("live")
    if (session.subjects[0]?.questions[0]) {
      setVisited((prev) => ({ ...prev, [session.subjects[0].questions[0].id]: true }))
    }
    timer.startTimer()
  }, [proctoring, timer, session.subjects])

  // In-Exam Navigation
  const handleSelectSubject = React.useCallback((subjectIndex: number) => {
    if (subjectIndex >= 0 && subjectIndex < session.subjects.length) {
      setActiveSubjectIndex(subjectIndex)
      setActiveQuestionIndex(0)
      const targetQ = session.subjects[subjectIndex]?.questions[0]
      if (targetQ) {
        setVisited((prev) => ({ ...prev, [targetQ.id]: true }))
      }
    }
  }, [session.subjects])

  const handleJumpToQuestion = React.useCallback((questionIndex: number) => {
    if (questionIndex >= 0 && questionIndex < currentSubject.questions.length) {
      setActiveQuestionIndex(questionIndex)
      const targetQ = currentSubject.questions[questionIndex]
      if (targetQ) {
        setVisited((prev) => ({ ...prev, [targetQ.id]: true }))
      }
    }
  }, [currentSubject.questions])

  const handleSelectOption = React.useCallback(
    (optionId: string) => {
      setSaveStatus("saving")
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: optionId,
      }))
      setVisited((prev) => ({ ...prev, [currentQuestion.id]: true }))

      const timerId = setTimeout(() => {
        setSaveStatus("saved")
      }, 250)

      return () => clearTimeout(timerId)
    },
    [currentQuestion.id]
  )

  const handleSelectOptionByLabel = React.useCallback(
    (label: "A" | "B" | "C" | "D") => {
      const match = currentQuestion.options.find((opt) => opt.label === label)
      if (match) {
        handleSelectOption(match.id)
      }
    },
    [currentQuestion.options, handleSelectOption]
  )

  const handleClearOption = React.useCallback(() => {
    setSaveStatus("saving")
    setAnswers((prev) => {
      const copy = { ...prev }
      delete copy[currentQuestion.id]
      return copy
    })
    setTimeout(() => setSaveStatus("saved"), 150)
  }, [currentQuestion.id])

  const handleToggleFlag = React.useCallback(() => {
    setFlagged((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }))
  }, [currentQuestion.id])

  const handlePreviousQuestion = React.useCallback(() => {
    if (activeQuestionIndex > 0) {
      const newIdx = activeQuestionIndex - 1
      setActiveQuestionIndex(newIdx)
      const targetQ = currentSubject.questions[newIdx]
      if (targetQ) {
        setVisited((prev) => ({ ...prev, [targetQ.id]: true }))
      }
    } else if (activeSubjectIndex > 0) {
      // Jump to previous subject's last question
      const prevSubIndex = activeSubjectIndex - 1
      const lastQIndex = session.subjects[prevSubIndex].questions.length - 1
      setActiveSubjectIndex(prevSubIndex)
      setActiveQuestionIndex(lastQIndex)
      const targetQ = session.subjects[prevSubIndex].questions[lastQIndex]
      if (targetQ) {
        setVisited((prev) => ({ ...prev, [targetQ.id]: true }))
      }
    }
  }, [activeQuestionIndex, activeSubjectIndex, session.subjects, currentSubject.questions])

  const handleNextQuestion = React.useCallback(() => {
    if (activeQuestionIndex < currentSubject.questions.length - 1) {
      const newIdx = activeQuestionIndex + 1
      setActiveQuestionIndex(newIdx)
      const targetQ = currentSubject.questions[newIdx]
      if (targetQ) {
        setVisited((prev) => ({ ...prev, [targetQ.id]: true }))
      }
    } else if (activeSubjectIndex < session.subjects.length - 1) {
      // Jump to next subject's first question
      const nextSubIndex = activeSubjectIndex + 1
      setActiveSubjectIndex(nextSubIndex)
      setActiveQuestionIndex(0)
      const targetQ = session.subjects[nextSubIndex].questions[0]
      if (targetQ) {
        setVisited((prev) => ({ ...prev, [targetQ.id]: true }))
      }
    }
  }, [activeQuestionIndex, currentSubject.questions, activeSubjectIndex, session.subjects])

  const handleToggleFontSize = React.useCallback(() => {
    setFontSize((prev) => {
      if (prev === "normal") return "large"
      if (prev === "large") return "extra-large"
      return "normal"
    })
  }, [])

  // Keyboard Shortcuts Hook integration
  useCbtKeyboardShortcuts({
    enabled: viewMode === "live" && !isSubmitModalOpen && !isCalculatorOpen && !proctoring.isAlertActive,
    onSelectOption: handleSelectOptionByLabel,
    onPrevious: handlePreviousQuestion,
    onNext: handleNextQuestion,
    onToggleFlag: handleToggleFlag,
    onSubmit: () => setIsSubmitModalOpen(true),
  })

  // Subject statistics for palette and submit modal
  const subjectStats = React.useMemo(() => {
    return session.subjects.map((sub) => {
      let answeredCount = 0
      let flaggedCount = 0
      sub.questions.forEach((q) => {
        if (answers[q.id]) answeredCount += 1
        if (flagged[q.id]) flaggedCount += 1
      })
      return {
        subjectId: sub.id,
        subjectName: sub.name,
        totalQuestions: sub.questions.length,
        answeredCount,
        unansweredCount: sub.questions.length - answeredCount,
        flaggedCount,
      }
    })
  }, [session.subjects, answers, flagged])

  return {
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
    onExitExam,
  }
}
