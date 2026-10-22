export type QuestionType =
  | "multiple-choice"
  | "multi-select"
  | "true-false"
  | "formula"
  | "essay"

export interface IQuestionOption {
  id: string
  label: string
  text: string
}

export interface IQuestion {
  id: string
  type: QuestionType
  subject: string
  prompt: string
  options?: IQuestionOption[]
  correctAnswer?: string | string[]
  explanation?: string
  points: number
}

export interface IExamSummary {
  id: string
  title: string
  subject: string
  durationMinutes: number
  totalQuestions: number
  passingScore: number
}
