import * as React from "react"
import type { SimulatorQuestion } from "@/types/landing"

const SAMPLE_QUESTIONS: SimulatorQuestion[] = [
  {
    id: "q-1",
    subject: "Mathematics & Quantitative Reasoning",
    examType: "School Term & Promotional CBT",
    questionText:
      "If 3x + 7 = 22, what is the value of 2x - 3?",
    options: [
      { id: "opt-a", label: "A", text: "5" },
      { id: "opt-b", label: "B", text: "7 (x = 5, so 2(5) - 3 = 7)" },
      { id: "opt-c", label: "C", text: "9" },
      { id: "opt-d", label: "D", text: "10" },
    ],
    correctOptionId: "opt-b",
    explanation:
      "First solve 3x + 7 = 22 for x: subtract 7 from both sides to get 3x = 15, then divide by 3 to find x = 5. Substitute x = 5 into 2x - 3: 2(5) - 3 = 10 - 3 = 7.",
  },
  {
    id: "q-2",
    subject: "General Science & Biology",
    examType: "National Mock Readiness Exam",
    questionText:
      "Which organelle in green plant cells is primarily responsible for converting sunlight into chemical energy through photosynthesis?",
    options: [
      { id: "opt-a", label: "A", text: "Mitochondria" },
      { id: "opt-b", label: "B", text: "Chloroplast" },
      { id: "opt-c", label: "C", text: "Ribosome" },
      { id: "opt-d", label: "D", text: "Endoplasmic Reticulum" },
    ],
    correctOptionId: "opt-b",
    explanation:
      "Chloroplasts contain chlorophyll pigments that absorb light energy to produce glucose during photosynthesis. Mitochondria produce cellular ATP through respiration.",
  },
]

export function useSimulator() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0)
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<string, string>>({})
  const [flaggedQuestions, setFlaggedQuestions] = React.useState<Record<string, boolean>>({})
  const [saveStatus, setSaveStatus] = React.useState<"saved" | "saving">("saved")
  const [showExplanation, setShowExplanation] = React.useState(false)
  const [secondsRemaining, setSecondsRemaining] = React.useState(2640) // 44 mins

  const currentQuestion = SAMPLE_QUESTIONS[currentQuestionIndex]
  const selectedOptionId = selectedAnswers[currentQuestion.id] || null
  const isFlagged = Boolean(flaggedQuestions[currentQuestion.id])

  // Timer countdown simulation
  React.useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSelectOption = React.useCallback(
    (optionId: string) => {
      setSaveStatus("saving")
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: optionId,
      }))

      // Simulate instantaneous auto-save per keystroke
      const timeout = setTimeout(() => {
        setSaveStatus("saved")
      }, 350)

      return () => clearTimeout(timeout)
    },
    [currentQuestion.id]
  )

  const handleToggleFlag = React.useCallback(() => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }))
  }, [currentQuestion.id])

  const handleNextQuestion = React.useCallback(() => {
    setShowExplanation(false)
    setCurrentQuestionIndex((prev) => (prev + 1) % SAMPLE_QUESTIONS.length)
  }, [])

  const handleToggleExplanation = React.useCallback(() => {
    setShowExplanation((prev) => !prev)
  }, [])

  const formatTimer = React.useCallback((totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }, [])

  return {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions: SAMPLE_QUESTIONS.length,
    selectedOptionId,
    isFlagged,
    saveStatus,
    showExplanation,
    secondsRemaining: formatTimer(secondsRemaining),
    handleSelectOption,
    handleToggleFlag,
    handleNextQuestion,
    handleToggleExplanation,
  }
}
