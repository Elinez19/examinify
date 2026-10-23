import * as React from "react"
import type {
  ITeacherCbtExam,
  ITeacherQuestion,
  ITeacherAssignedClass,
  AssessmentType,
  IAdminSchoolConfig,
  TeacherExamStatus,
  TeacherQuestionType,
  IQuestionRubricCriterion,
} from "@/types/teacher"
import { MOCK_ADMIN_SCHOOL_CONFIG } from "@/services/teacher-dashboard/mockTeacherData"
import { parseBulkQuestionsText } from "@/services/teacher-dashboard/teacher.service"

export type ExamBuilderStep = "about" | "questions" | "time" | "settings" | "groups"

interface UseExamBuilderFormOptions {
  initialExam?: ITeacherCbtExam | null
  assignedClasses: ITeacherAssignedClass[]
  defaultSubject: string
  adminConfig?: IAdminSchoolConfig
  initialOpenAiModal?: boolean
  onSaveExam: (exam: ITeacherCbtExam) => void
  onCancel: () => void
}

export function useExamBuilderForm({
  initialExam,
  assignedClasses,
  defaultSubject,
  adminConfig = MOCK_ADMIN_SCHOOL_CONFIG,
  initialOpenAiModal = false,
  onSaveExam,
  onCancel,
}: UseExamBuilderFormOptions) {
  // Stepper State
  const [currentStep, setCurrentStep] = React.useState<ExamBuilderStep>("questions")

  // Assessment metadata fields
  const [examId] = React.useState<string>(() => initialExam?.id || `exm-${Date.now()}`)
  const [title, setTitle] = React.useState<string>(
    initialExam?.title || `2nd Term Continuous Assessment (CA 1) - ${defaultSubject || "English Language"}`
  )
  const [subject, setSubject] = React.useState<string>(
    initialExam?.subject || defaultSubject || "English Language"
  )
  const [assessmentType, setAssessmentType] = React.useState<AssessmentType>(
    initialExam?.assessmentType || "CA1"
  )
  const [academicSession, setAcademicSession] = React.useState<string>(
    initialExam?.academicSession || adminConfig.activeSession
  )
  const [term, setTerm] = React.useState<string>(
    initialExam?.term || adminConfig.activeTerm
  )
  const [instructions, setInstructions] = React.useState<string>(
    initialExam?.instructions ||
      "Answer all questions. For theory questions, ensure clarity and coherent organization."
  )

  // Target Classes Selection
  const [selectedClasses, setSelectedClasses] = React.useState<string[]>(() => {
    if (initialExam && initialExam.targetClasses.length > 0) {
      return initialExam.targetClasses
    }
    return assignedClasses.length > 0 ? [assignedClasses[0].className] : []
  })

  // Timing & Schedule
  const [durationMinutes, setDurationMinutes] = React.useState<number>(
    initialExam?.durationMinutes || 60
  )
  const [passingScore, setPassingScore] = React.useState<number>(
    initialExam?.passingScore || 50
  )
  const [scheduledDate, setScheduledDate] = React.useState<string>(
    initialExam?.scheduledDate || "26-10-2026"
  )
  const [startTime, setStartTime] = React.useState<string>(
    initialExam?.startTime || "04:57 PM"
  )

  // Security, Anti-Cheat & Lab Settings
  const [allowCalculator, setAllowCalculator] = React.useState<boolean>(
    initialExam?.allowCalculator ?? false
  )
  const [shuffleQuestions, setShuffleQuestions] = React.useState<boolean>(
    initialExam?.shuffleQuestions ?? true
  )
  const [shuffleOptions, setShuffleOptions] = React.useState<boolean>(
    initialExam?.shuffleOptions ?? false
  )
  const [proctoringAlerts, setProctoringAlerts] = React.useState<boolean>(
    initialExam?.proctoringAlerts ?? true
  )
  const [accessPin, setAccessPin] = React.useState<string>(
    initialExam?.accessPin || ""
  )
  const [status, setStatus] = React.useState<TeacherExamStatus>(
    initialExam?.status || "draft"
  )
  const [, setIsDirty] = React.useState<boolean>(false)

  // Exam Settings Step: Results & Visibility
  const [autoPublishResults, setAutoPublishResults] = React.useState<boolean>(
    initialExam?.autoPublishResults ?? false
  )
  const [showStudentFeedback, setShowStudentFeedback] = React.useState<boolean>(
    initialExam?.showStudentFeedback ?? true
  )
  const [showCorrectAnswers, setShowCorrectAnswers] = React.useState<boolean>(
    initialExam?.showCorrectAnswers ?? true
  )

  // Exam Settings Step: Remark Requests
  const [allowRemarkRequests, setAllowRemarkRequests] = React.useState<boolean>(
    initialExam?.allowRemarkRequests ?? true
  )
  const [remarkRequestWindowDays, setRemarkRequestWindowDays] = React.useState<number>(
    initialExam?.remarkRequestWindowDays ?? 3
  )

  // Exam Settings Step: Exam Integrity
  const [maxTabSwitches, setMaxTabSwitches] = React.useState<number>(
    initialExam?.maxTabSwitches ?? 3
  )
  const [allowBackwardNavigation, setAllowBackwardNavigation] = React.useState<boolean>(
    initialExam?.allowBackwardNavigation ?? true
  )
  const [randomizeOptions, setRandomizeOptionsState] = React.useState<boolean>(
    initialExam?.randomizeOptions ?? initialExam?.shuffleOptions ?? false
  )

  const setRandomizeOptions = React.useCallback((val: boolean) => {
    setRandomizeOptionsState(val)
    setShuffleOptions(val)
    setIsDirty(true)
  }, [])

  // Exam Settings Step: Live Monitoring
  const [enableLiveMonitoring, setEnableLiveMonitoring] = React.useState<boolean>(
    initialExam?.enableLiveMonitoring ?? false
  )

  // Exam Settings Step: Question Bank
  const [enableQuestionBank, setEnableQuestionBank] = React.useState<boolean>(
    initialExam?.enableQuestionBank ?? false
  )

  // Questions Array
  const [questions, setQuestions] = React.useState<ITeacherQuestion[]>(() => {
    if (initialExam?.questions && initialExam.questions.length > 0) {
      return initialExam.questions
    }
    // Seed with initial Theory question matching Reference Image 1
    return [
      {
        id: `q-${Date.now()}-1`,
        questionNumber: 1,
        type: "theory",
        prompt: "",
        theoryAnswer: "",
        points: 2,
        rubrics: [
          {
            id: "r-1",
            criterion: "Provides a relevant point to every aspect of the question",
            weight: 0.4,
          },
          {
            id: "r-2",
            criterion: "Quality of explanation and accuracy",
            weight: 0.3,
          },
          {
            id: "r-3",
            criterion: "Depth and alignment with expected answers",
            weight: 0.3,
          },
        ],
        difficulty: "Intermediate",
      },
    ]
  })

  const [currentIndex, setCurrentIndex] = React.useState<number>(0)
  const [isBulkImportOpen, setIsBulkImportOpen] = React.useState<boolean>(false)
  const [isQuestionBankOpen, setIsQuestionBankOpen] = React.useState<boolean>(false)
  const [isPreviewOpen, setIsPreviewOpen] = React.useState<boolean>(false)
  const [isAiModalOpen, setIsAiModalOpen] = React.useState<boolean>(
    Boolean(initialOpenAiModal)
  )
  const [saveToastVisible, setSaveToastVisible] = React.useState<boolean>(false)

  // Class Selection Handlers
  const toggleClass = React.useCallback((clsName: string) => {
    setSelectedClasses((prev) =>
      prev.includes(clsName) ? prev.filter((c) => c !== clsName) : [...prev, clsName]
    )
    setIsDirty(true)
  }, [])

  const selectAllClasses = React.useCallback(() => {
    setSelectedClasses(assignedClasses.map((c) => c.className))
    setIsDirty(true)
  }, [assignedClasses])

  const clearAllClasses = React.useCallback(() => {
    setSelectedClasses([])
    setIsDirty(true)
  }, [])

  const totalEnrolledPupils = React.useMemo(() => {
    return assignedClasses
      .filter((c) => selectedClasses.includes(c.className))
      .reduce((acc, c) => acc + c.studentCount, 0)
  }, [assignedClasses, selectedClasses])

  // Current active question
  const currentQuestion = questions[currentIndex] || questions[0] || {
    id: "q-default",
    questionNumber: 1,
    type: "theory",
    prompt: "",
    points: 1,
  }

  // Question editing callbacks
  const addQuestion = React.useCallback((type: TeacherQuestionType = "theory") => {
    const nextNum = questions.length + 1
    const newQ: ITeacherQuestion = {
      id: `q-${Date.now()}-${nextNum}`,
      questionNumber: nextNum,
      type,
      prompt: "",
      points: type === "theory" ? 2 : 1,
      options:
        type === "mcq"
          ? [
              { id: "A", text: "Option 1" },
              { id: "B", text: "Option 2" },
            ]
          : undefined,
      correctOptionId: type === "mcq" ? "A" : undefined,
      theoryAnswer: type === "theory" ? "" : undefined,
      shortAnswer: type === "fill-blanks" ? "" : undefined,
      rubrics:
        type === "theory"
          ? [
              {
                id: `r-${Date.now()}-1`,
                criterion: "Provides a relevant point to every aspect of the question",
                weight: 0.4,
              },
              {
                id: `r-${Date.now()}-2`,
                criterion: "Quality of explanation and accuracy",
                weight: 0.3,
              },
              {
                id: `r-${Date.now()}-3`,
                criterion: "Depth and alignment with expected answers",
                weight: 0.3,
              },
            ]
          : undefined,
      difficulty: "Intermediate",
    }
    setQuestions((prev) => [...prev, newQ])
    setCurrentIndex(questions.length)
    setIsDirty(true)
  }, [questions.length])

  const duplicateQuestion = React.useCallback(
    (idx: number) => {
      const src = questions[idx]
      if (!src) return
      const nextNum = questions.length + 1
      const cloned: ITeacherQuestion = {
        ...src,
        id: `q-${Date.now()}-${nextNum}`,
        questionNumber: nextNum,
      }
      setQuestions((prev) => [...prev.slice(0, idx + 1), cloned, ...prev.slice(idx + 1)].map((q, i) => ({ ...q, questionNumber: i + 1 })))
      setCurrentIndex(idx + 1)
      setIsDirty(true)
    },
    [questions]
  )

  const deleteQuestion = React.useCallback(
    (idx: number) => {
      if (questions.length <= 1) return
      setQuestions((prev) =>
        prev.filter((_, i) => i !== idx).map((q, i) => ({ ...q, questionNumber: i + 1 }))
      )
      if (currentIndex >= questions.length - 1) {
        setCurrentIndex(Math.max(0, questions.length - 2))
      }
      setIsDirty(true)
    },
    [currentIndex, questions.length]
  )

  // Reorder questions
  const moveQuestionUp = React.useCallback((idx: number) => {
    if (idx <= 0) return
    setQuestions((prev) => {
      const updated = [...prev]
      const temp = updated[idx]
      updated[idx] = updated[idx - 1]
      updated[idx - 1] = temp
      return updated.map((q, i) => ({ ...q, questionNumber: i + 1 }))
    })
    setCurrentIndex(idx - 1)
    setIsDirty(true)
  }, [])

  const moveQuestionDown = React.useCallback((idx: number) => {
    setQuestions((prev) => {
      if (idx >= prev.length - 1) return prev
      const updated = [...prev]
      const temp = updated[idx]
      updated[idx] = updated[idx + 1]
      updated[idx + 1] = temp
      return updated.map((q, i) => ({ ...q, questionNumber: i + 1 }))
    })
    setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))
    setIsDirty(true)
  }, [questions.length])

  // Change Question Type
  const updateQuestionType = React.useCallback((type: TeacherQuestionType) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== currentIndex) return q
        return {
          ...q,
          type,
          options:
            type === "mcq"
              ? q.options && q.options.length > 0
                ? q.options
                : [
                    { id: "A", text: "Option 1" },
                    { id: "B", text: "Option 2" },
                  ]
              : undefined,
          correctOptionId: type === "mcq" ? q.correctOptionId || "A" : undefined,
          theoryAnswer: type === "theory" ? q.theoryAnswer || "" : undefined,
          shortAnswer: type === "fill-blanks" ? q.shortAnswer || "" : undefined,
          rubrics:
            type === "theory"
              ? q.rubrics && q.rubrics.length > 0
                ? q.rubrics
                : [
                    {
                      id: `r-${Date.now()}-1`,
                      criterion: "Provides a relevant point to every aspect of the question",
                      weight: 0.4,
                    },
                    {
                      id: `r-${Date.now()}-2`,
                      criterion: "Quality of explanation and accuracy",
                      weight: 0.3,
                    },
                    {
                      id: `r-${Date.now()}-3`,
                      criterion: "Depth and alignment with expected answers",
                      weight: 0.3,
                    },
                  ]
              : undefined,
          points: type === "theory" && q.points === 1 ? 2 : q.points,
        }
      })
    )
    setIsDirty(true)
  }, [currentIndex])

  const updatePrompt = React.useCallback(
    (prompt: string) => {
      setQuestions((prev) =>
        prev.map((q, i) => (i === currentIndex ? { ...q, prompt } : q))
      )
      setIsDirty(true)
    },
    [currentIndex]
  )

  const updateTheoryAnswer = React.useCallback(
    (theoryAnswer: string) => {
      setQuestions((prev) =>
        prev.map((q, i) => (i === currentIndex ? { ...q, theoryAnswer } : q))
      )
      setIsDirty(true)
    },
    [currentIndex]
  )

  const updateShortAnswer = React.useCallback(
    (shortAnswer: string) => {
      setQuestions((prev) =>
        prev.map((q, i) => (i === currentIndex ? { ...q, shortAnswer } : q))
      )
      setIsDirty(true)
    },
    [currentIndex]
  )

  // Points increment / decrement
  const incrementPoints = React.useCallback(() => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === currentIndex ? { ...q, points: q.points + 1 } : q))
    )
    setIsDirty(true)
  }, [currentIndex])

  const decrementPoints = React.useCallback(() => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === currentIndex ? { ...q, points: Math.max(1, q.points - 1) } : q))
    )
    setIsDirty(true)
  }, [currentIndex])

  const updatePoints = React.useCallback(
    (points: number) => {
      setQuestions((prev) =>
        prev.map((q, i) => (i === currentIndex ? { ...q, points: Math.max(1, points) } : q))
      )
      setIsDirty(true)
    },
    [currentIndex]
  )

  // Rubrics handlers
  const addRubricCriterion = React.useCallback(() => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== currentIndex) return q
        const existing = q.rubrics || []
        const newCriterion: IQuestionRubricCriterion = {
          id: `r-${Date.now()}-${existing.length + 1}`,
          criterion: "New evaluation criterion",
          weight: 0.1,
        }
        return { ...q, rubrics: [...existing, newCriterion] }
      })
    )
    setIsDirty(true)
  }, [currentIndex])

  const updateRubricCriterion = React.useCallback(
    (critId: string, criterion: string) => {
      setQuestions((prev) =>
        prev.map((q, i) => {
          if (i !== currentIndex) return q
          return {
            ...q,
            rubrics: (q.rubrics || []).map((r) =>
              r.id === critId ? { ...r, criterion } : r
            ),
          }
        })
      )
      setIsDirty(true)
    },
    [currentIndex]
  )

  const updateRubricWeight = React.useCallback(
    (critId: string, delta: number) => {
      setQuestions((prev) =>
        prev.map((q, i) => {
          if (i !== currentIndex) return q
          return {
            ...q,
            rubrics: (q.rubrics || []).map((r) => {
              if (r.id !== critId) return r
              const updated = Math.max(0.1, Math.min(1.0, Math.round((r.weight + delta) * 10) / 10))
              return { ...r, weight: updated }
            }),
          }
        })
      )
      setIsDirty(true)
    },
    [currentIndex]
  )

  const deleteRubricCriterion = React.useCallback(
    (critId: string) => {
      setQuestions((prev) =>
        prev.map((q, i) => {
          if (i !== currentIndex) return q
          return {
            ...q,
            rubrics: (q.rubrics || []).filter((r) => r.id !== critId),
          }
        })
      )
      setIsDirty(true)
    },
    [currentIndex]
  )

  // MCQ handlers
  const addOption = React.useCallback(() => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== currentIndex) return q
        const currentOpts = q.options || []
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const nextId = alphabet[currentOpts.length] || `O${currentOpts.length + 1}`
        return {
          ...q,
          options: [...currentOpts, { id: nextId, text: `Option ${currentOpts.length + 1}` }],
        }
      })
    )
    setIsDirty(true)
  }, [currentIndex])

  const updateOptionText = React.useCallback(
    (optId: string, text: string) => {
      setQuestions((prev) =>
        prev.map((q, i) => {
          if (i !== currentIndex) return q
          return {
            ...q,
            options: (q.options || []).map((opt) => (opt.id === optId ? { ...opt, text } : opt)),
          }
        })
      )
      setIsDirty(true)
    },
    [currentIndex]
  )

  const deleteOption = React.useCallback(
    (optId: string) => {
      setQuestions((prev) =>
        prev.map((q, i) => {
          if (i !== currentIndex) return q
          const filtered = (q.options || []).filter((o) => o.id !== optId)
          return {
            ...q,
            options: filtered,
            correctOptionId: q.correctOptionId === optId && filtered[0] ? filtered[0].id : q.correctOptionId,
          }
        })
      )
      setIsDirty(true)
    },
    [currentIndex]
  )

  const setCorrectOption = React.useCallback(
    (optId: string) => {
      setQuestions((prev) =>
        prev.map((q, i) => (i === currentIndex ? { ...q, correctOptionId: optId } : q))
      )
      setIsDirty(true)
    },
    [currentIndex]
  )

  const updateQuestionImage = React.useCallback(
    (imageUrl: string, imageCaption?: string) => {
      setQuestions((prev) =>
        prev.map((q, i) =>
          i === currentIndex ? { ...q, imageUrl, imageCaption: imageCaption || q.imageCaption } : q
        )
      )
      setIsDirty(true)
    },
    [currentIndex]
  )

  const removeQuestionImage = React.useCallback(() => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === currentIndex ? { ...q, imageUrl: undefined, imageCaption: undefined } : q
      )
    )
    setIsDirty(true)
  }, [currentIndex])

  const insertSymbol = React.useCallback(
    (sym: string) => {
      updatePrompt(currentQuestion.prompt + sym)
    },
    [currentQuestion.prompt, updatePrompt]
  )

  // Total points calculation
  const totalPoints = React.useMemo(() => {
    return questions.reduce((sum, q) => sum + (q.points || 1), 0)
  }, [questions])

  // Bulk Import
  const importBulkQuestions = React.useCallback(
    (rawText: string) => {
      const startIndex = questions.length + 1
      const { parsedQuestions, errors } = parseBulkQuestionsText(rawText, startIndex)
      if (parsedQuestions.length > 0) {
        const combined: ITeacherQuestion[] =
          questions.length === 1 && !questions[0].prompt.trim()
            ? parsedQuestions.map((q, idx) => ({ ...q, questionNumber: idx + 1 }))
            : [...questions, ...parsedQuestions]
        setQuestions(combined)
        setIsDirty(true)
        setIsBulkImportOpen(false)
        return { success: true, count: parsedQuestions.length, errors }
      }
      return { success: false, count: 0, errors }
    },
    [questions]
  )

  // Question Bank Importer Handler
  const importQuestionsFromBank = React.useCallback(
    (importedList: ITeacherQuestion[]) => {
      if (!importedList || importedList.length === 0) return

      const cloned = importedList.map((q, idx) => ({
        ...q,
        id: `bank-q-${Date.now()}-${idx}`,
        questionNumber: questions.length + idx + 1,
      }))

      setQuestions((prev) => {
        if (prev.length === 1 && !prev[0].prompt.trim()) {
          return cloned.map((q, idx) => ({ ...q, questionNumber: idx + 1 }))
        }
        return [...prev, ...cloned]
      })
      setIsDirty(true)
      setIsQuestionBankOpen(false)
    },
    [questions.length]
  )

  // AI Generated Questions Importer Handler
  const importAiQuestions = React.useCallback(
    (importedList: ITeacherQuestion[]) => {
      if (!importedList || importedList.length === 0) return

      const cloned = importedList.map((q, idx) => ({
        ...q,
        id: `ai-q-${Date.now()}-${idx}`,
        questionNumber: questions.length + idx + 1,
      }))

      setQuestions((prev) => {
        if (prev.length === 1 && !prev[0].prompt.trim()) {
          return cloned.map((q, idx) => ({ ...q, questionNumber: idx + 1 }))
        }
        return [...prev, ...cloned]
      })
      setIsDirty(true)
      setIsAiModalOpen(false)
    },
    [questions.length]
  )

  // Question Validity Checker
  const getQuestionValidity = React.useCallback((q: ITeacherQuestion) => {
    const hasPrompt = Boolean(q.prompt && q.prompt.trim().length > 0)
    if (q.type === "mcq") {
      const hasOptions = Boolean(q.options && q.options.length >= 2 && q.options.every((o) => o.text.trim().length > 0))
      return { isValid: hasPrompt && hasOptions }
    }
    return { isValid: hasPrompt }
  }, [])

  const validQuestionsCount = React.useMemo(() => {
    return questions.filter((q) => getQuestionValidity(q).isValid).length
  }, [questions, getQuestionValidity])

  // Primary Save Action
  const handleSave = React.useCallback(
    (overrideStatus?: TeacherExamStatus) => {
      const finalStatus = overrideStatus || status
      const savedExam: ITeacherCbtExam = {
        id: examId,
        title: title.trim() || `Continuous Assessment - ${subject}`,
        subject: subject || "English Language",
        assessmentType,
        academicSession,
        term,
        instructions,
        targetClasses: selectedClasses.length > 0 ? selectedClasses : [assignedClasses[0]?.className || "General"],
        totalQuestions: questions.length,
        readyQuestionsCount: validQuestionsCount,
        durationMinutes: Number(durationMinutes) || 60,
        status: finalStatus,
        scheduledDate: scheduledDate || "26-10-2026",
        startTime,
        passingScore: Number(passingScore) || 50,
        questions,
        allowCalculator,
        shuffleQuestions,
        shuffleOptions: randomizeOptions,
        randomizeOptions,
        proctoringAlerts,
        accessPin: accessPin || undefined,
        submissionsCount: initialExam?.submissionsCount || 0,
        averageScore: initialExam?.averageScore || 0,
        autoPublishResults,
        showStudentFeedback,
        showCorrectAnswers,
        allowRemarkRequests,
        remarkRequestWindowDays,
        maxTabSwitches,
        allowBackwardNavigation,
        enableLiveMonitoring,
        enableQuestionBank,
      }

      onSaveExam(savedExam)
    },
    [
      examId,
      title,
      subject,
      assessmentType,
      academicSession,
      term,
      instructions,
      selectedClasses,
      assignedClasses,
      questions,
      validQuestionsCount,
      durationMinutes,
      status,
      scheduledDate,
      startTime,
      passingScore,
      allowCalculator,
      shuffleQuestions,
      randomizeOptions,
      proctoringAlerts,
      accessPin,
      initialExam?.submissionsCount,
      initialExam?.averageScore,
      autoPublishResults,
      showStudentFeedback,
      showCorrectAnswers,
      allowRemarkRequests,
      remarkRequestWindowDays,
      maxTabSwitches,
      allowBackwardNavigation,
      enableLiveMonitoring,
      enableQuestionBank,
      onSaveExam,
    ]
  )

  return {
    // Stepper
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
    adminConfig,

    // Class selection
    selectedClasses,
    toggleClass,
    selectAllClasses,
    clearAllClasses,
    totalEnrolledPupils,

    // Timing & Settings
    durationMinutes,
    setDurationMinutes,
    passingScore,
    setPassingScore,
    scheduledDate,
    setScheduledDate,
    startTime,
    setStartTime,
    allowCalculator,
    setAllowCalculator,
    shuffleQuestions,
    setShuffleQuestions,
    shuffleOptions,
    setShuffleOptions,
    proctoringAlerts,
    setProctoringAlerts,
    accessPin,
    setAccessPin,
    status,
    setStatus,

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
    updatePoints,
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
    importQuestionsFromBank,
    importAiQuestions,
    getQuestionValidity,

    // Modals & UI
    isBulkImportOpen,
    setIsBulkImportOpen,
    isQuestionBankOpen,
    setIsQuestionBankOpen,
    isPreviewOpen,
    setIsPreviewOpen,
    isAiModalOpen,
    setIsAiModalOpen,
    saveToastVisible,
    setSaveToastVisible,

    // Stats
    validQuestionsCount,
    totalPoints,

    // Final Action
    handleSave,
    handleCancel: onCancel,
  }
}
