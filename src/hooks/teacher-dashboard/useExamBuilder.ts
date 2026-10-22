import * as React from "react"
import type { ITeacherCbtExam, ITeacherQuestion } from "@/types/teacher"
import { parseBulkQuestionsText } from "@/services/teacher-dashboard/teacher.service"

interface UseExamBuilderOptions {
  exam: ITeacherCbtExam
  onSaveQuestions: (examId: string, questions: ITeacherQuestion[]) => void
}

export function useExamBuilder({ exam, onSaveQuestions }: UseExamBuilderOptions) {
  // Questions list in builder
  const [questions, setQuestions] = React.useState<ITeacherQuestion[]>(() => {
    if (exam.questions && exam.questions.length > 0) {
      return exam.questions
    }
    // If no questions, seed with 1 empty question
    return [
      {
        id: `q-${Date.now()}-1`,
        questionNumber: 1,
        prompt: "",
        options: [
          { id: "A", text: "" },
          { id: "B", text: "" },
          { id: "C", text: "" },
          { id: "D", text: "" },
        ],
        correctOptionId: "A",
        points: 1,
        difficulty: "Intermediate",
      },
    ]
  })

  const [currentIndex, setCurrentIndex] = React.useState<number>(0)
  const [isPreviewOpen, setIsPreviewOpen] = React.useState<boolean>(false)
  const [isBulkImportOpen, setIsBulkImportOpen] = React.useState<boolean>(false)
  const [saveToastVisible, setSaveToastVisible] = React.useState<boolean>(false)

  // Current active question
  const currentQuestion = questions[currentIndex] || questions[0]

  // Persist back to parent on questions change
  const persistChanges = React.useCallback(
    (newQuestions: ITeacherQuestion[]) => {
      setQuestions(newQuestions)
      onSaveQuestions(exam.id, newQuestions)
    },
    [exam.id, onSaveQuestions]
  )

  // Add new empty question at end and select it
  const addQuestion = React.useCallback(() => {
    const nextNum = questions.length + 1
    const newQ: ITeacherQuestion = {
      id: `q-${Date.now()}-${nextNum}`,
      questionNumber: nextNum,
      prompt: "",
      options: [
        { id: "A", text: "" },
        { id: "B", text: "" },
        { id: "C", text: "" },
        { id: "D", text: "" },
      ],
      correctOptionId: "A",
      points: 1,
      difficulty: "Intermediate",
    }
    const updated = [...questions, newQ]
    persistChanges(updated)
    setCurrentIndex(updated.length - 1)
  }, [questions, persistChanges])

  // Duplicate an existing question
  const duplicateQuestion = React.useCallback(
    (idx: number) => {
      const source = questions[idx]
      if (!source) return
      const nextNum = questions.length + 1
      const cloned: ITeacherQuestion = {
        ...source,
        id: `q-${Date.now()}-${nextNum}`,
        questionNumber: nextNum,
        prompt: `${source.prompt} (Copy)`,
        options: source.options.map((o) => ({ ...o })),
      }
      const updated = [...questions, cloned]
      persistChanges(updated)
      setCurrentIndex(updated.length - 1)
    },
    [questions, persistChanges]
  )

  // Delete a question
  const deleteQuestion = React.useCallback(
    (idx: number) => {
      if (questions.length <= 1) {
        // Keep at least 1 question
        const reset: ITeacherQuestion = {
          id: `q-${Date.now()}-1`,
          questionNumber: 1,
          prompt: "",
          options: [
            { id: "A", text: "" },
            { id: "B", text: "" },
            { id: "C", text: "" },
            { id: "D", text: "" },
          ],
          correctOptionId: "A",
          points: 1,
        }
        persistChanges([reset])
        setCurrentIndex(0)
        return
      }

      const filtered = questions.filter((_, i) => i !== idx)
      // Re-number
      const renumbered = filtered.map((q, i) => ({
        ...q,
        questionNumber: i + 1,
      }))
      persistChanges(renumbered)
      if (currentIndex >= renumbered.length) {
        setCurrentIndex(renumbered.length - 1)
      }
    },
    [questions, currentIndex, persistChanges]
  )

  // Update prompt of current question
  const updatePrompt = React.useCallback(
    (prompt: string) => {
      const updated = questions.map((q, i) => (i === currentIndex ? { ...q, prompt } : q))
      persistChanges(updated)
    },
    [questions, currentIndex, persistChanges]
  )

  // Update single option text
  const updateOptionText = React.useCallback(
    (optId: "A" | "B" | "C" | "D", text: string) => {
      const updated = questions.map((q, i) => {
        if (i !== currentIndex) return q
        return {
          ...q,
          options: q.options.map((opt) => (opt.id === optId ? { ...opt, text } : opt)),
        }
      })
      persistChanges(updated)
    },
    [questions, currentIndex, persistChanges]
  )

  // Set correct answer
  const setCorrectOption = React.useCallback(
    (optId: "A" | "B" | "C" | "D") => {
      const updated = questions.map((q, i) =>
        i === currentIndex ? { ...q, correctOptionId: optId } : q
      )
      persistChanges(updated)
    },
    [questions, currentIndex, persistChanges]
  )

  // Update points/marks
  const updatePoints = React.useCallback(
    (points: number) => {
      const updated = questions.map((q, i) =>
        i === currentIndex ? { ...q, points } : q
      )
      persistChanges(updated)
    },
    [questions, currentIndex, persistChanges]
  )

  // Update explanation
  const updateExplanation = React.useCallback(
    (explanation: string) => {
      const updated = questions.map((q, i) =>
        i === currentIndex ? { ...q, explanation } : q
      )
      persistChanges(updated)
    },
    [questions, currentIndex, persistChanges]
  )

  // Fast shortcut: Save & jump to next (or create new if at end)
  const saveAndNext = React.useCallback(() => {
    setSaveToastVisible(true)
    setTimeout(() => setSaveToastVisible(false), 1500)

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      addQuestion()
    }
  }, [currentIndex, questions.length, addQuestion])

  // Bulk Import handler
  const importBulkQuestions = React.useCallback(
    (rawText: string) => {
      const startIndex = questions.length + 1
      const { parsedQuestions, errors } = parseBulkQuestionsText(rawText, startIndex)
      if (parsedQuestions.length > 0) {
        // If current question 1 is blank, replace it
        const combined: ITeacherQuestion[] =
          questions.length === 1 && !questions[0].prompt.trim()
            ? parsedQuestions.map((q, idx) => ({ ...q, questionNumber: idx + 1 }))
            : [...questions, ...parsedQuestions]
        persistChanges(combined)
        setIsBulkImportOpen(false)
        return { success: true, count: parsedQuestions.length, errors }
      }
      return { success: false, count: 0, errors }
    },
    [questions, persistChanges]
  )

  // Validity checks
  const getQuestionValidity = React.useCallback((q: ITeacherQuestion) => {
    const hasPrompt = Boolean(q.prompt && q.prompt.trim().length > 0)
    const hasAtLeastTwoOptions = q.options.filter((o) => o.text && o.text.trim().length > 0).length >= 2
    const hasCorrectOption = Boolean(q.correctOptionId)
    return {
      isValid: hasPrompt && hasAtLeastTwoOptions && hasCorrectOption,
      hasPrompt,
      hasAtLeastTwoOptions,
      hasCorrectOption,
    }
  }, [])

  return {
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
    getQuestionValidity,
    isPreviewOpen,
    setIsPreviewOpen,
    isBulkImportOpen,
    setIsBulkImportOpen,
    saveToastVisible,
  }
}
