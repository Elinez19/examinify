export type CbtQuestionType = "multiple-choice"

export interface ICbtQuestionOption {
  id: string
  label: "A" | "B" | "C" | "D"
  text: string
}

export interface ICbtQuestion {
  id: string
  subjectId: string
  questionNumber: number
  prompt: string
  contextSnippet?: string
  options: ICbtQuestionOption[]
  correctOptionId: string
  points: number
  explanation?: string
}

export interface ICbtSubject {
  id: string
  code: string
  name: string
  totalQuestions: number
  questions: ICbtQuestion[]
  category: "STEM" | "Humanities" | "General"
}

export type CbtSessionType = "two-subject-daily" | "national-jamb-mock" | "single-subject-ca"

export interface ICbtCandidateInfo {
  registrationNumber: string
  fullName: string
  avatarUrl?: string
  seatNumber: string
  terminalId: string
  examCenter: string
  institution: string
  department: string
}

export interface ICbtExamSession {
  id: string
  title: string
  sessionType: CbtSessionType
  scheduledTime: string
  durationMinutes: number
  candidate: ICbtCandidateInfo
  subjects: ICbtSubject[]
  instructions: string[]
  allowCalculator: boolean
  strictProctoring: boolean
  maxInfractions: number
}

export type PreflightStep = "admit-slip" | "regulations" | "proctoring-check" | "ready"

export type ExamViewMode = "preflight" | "live" | "results"

export interface ICbtAnswerMap {
  [questionId: string]: string // optionId
}

export interface ICbtFlagMap {
  [questionId: string]: boolean
}

export interface ICbtVisitedMap {
  [questionId: string]: boolean
}

export interface ICbtProctoringState {
  isFullscreen: boolean
  infractionCount: number
  maxInfractions: number
  lastInfractionReason?: string
  isAlertActive: boolean
}

export interface ICbtSubjectScore {
  subjectId: string
  subjectName: string
  totalQuestions: number
  attemptedQuestions: number
  correctAnswers: number
  rawScore: number
  percentage: number
  gradeLetter: string
  timeSpentSeconds: number
}

export interface ICbtExamResult {
  sessionId: string
  examTitle: string
  candidate: ICbtCandidateInfo
  completedAt: string
  totalQuestions: number
  totalAttempted: number
  totalCorrect: number
  aggregateScore: number
  maxPossibleScore: number
  aggregatePercentage: number
  performanceRemark: string
  isPassed: boolean
  subjects: ICbtSubjectScore[]
}
