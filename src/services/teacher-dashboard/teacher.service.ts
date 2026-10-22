import type { ITeacherQuestion, ICbtQuestionOption } from "@/types/teacher"

/**
 * Computes WAEC standard grade and remark based on grand total score (/100).
 */
export function computeWaecGrade(totalScore: number): {
  gradeLetter: string
  remarks: string
  isAtRisk: boolean
} {
  const score = Math.round(Math.max(0, Math.min(100, totalScore)))

  if (score >= 75) return { gradeLetter: "A1", remarks: "Excellent", isAtRisk: false }
  if (score >= 70) return { gradeLetter: "B2", remarks: "Very Good", isAtRisk: false }
  if (score >= 65) return { gradeLetter: "B3", remarks: "Good", isAtRisk: false }
  if (score >= 60) return { gradeLetter: "C4", remarks: "Credit", isAtRisk: false }
  if (score >= 55) return { gradeLetter: "C5", remarks: "Credit", isAtRisk: false }
  if (score >= 50) return { gradeLetter: "C6", remarks: "Credit", isAtRisk: false }
  if (score >= 45) return { gradeLetter: "D7", remarks: "Pass", isAtRisk: false }
  if (score >= 40) return { gradeLetter: "E8", remarks: "Pass", isAtRisk: false }
  return { gradeLetter: "F9", remarks: "Fail", isAtRisk: true }
}

/**
 * Smart Regex Parser for Bulk Pasted Exam Questions from Word, PDF, or Plain Text.
 *
 * Expected format:
 * 1. Question prompt text...
 * A) Option text
 * B) Option text
 * C) Option text
 * D) Option text
 * Answer: B
 * Explanation: Optional explanation text...
 */
export function parseBulkQuestionsText(rawText: string, startIndex = 1): {
  parsedQuestions: ITeacherQuestion[]
  errors: string[]
} {
  const errors: string[] = []
  const parsedQuestions: ITeacherQuestion[] = []

  if (!rawText.trim()) {
    return { parsedQuestions, errors: ["No text provided to parse."] }
  }

  // Split on question boundaries: e.g. "1.", "Q1.", "1)", "Question 1:"
  const rawBlocks = rawText
    .split(/\n\s*(?:(?:\d+[.)]|Q\d+[.:)]|Question\s*\d+[.:)]))\s*/i)
    .map((b) => b.trim())
    .filter(Boolean)

  if (rawBlocks.length === 0) {
    return { parsedQuestions, errors: ["Could not detect numbered questions. Ensure questions start with 1. or 1)"] }
  }

  rawBlocks.forEach((block, idx) => {
    const qNum = startIndex + idx

    // Extract Answer line if present: e.g. "Answer: B" or "Ans: C" or "Correct: A"
    const ansMatch = block.match(/(?:Answer|Ans|Correct(?:\s*Option)?)\s*[:=-]?\s*([A-D])/i)
    const correctLetter = ansMatch ? (ansMatch[1].toUpperCase() as "A" | "B" | "C" | "D") : "A"

    // Extract Explanation if present
    const expMatch = block.match(/(?:Explanation|Solution|Working)\s*[:=-]?\s*([^\n\r]+)/i)
    const explanation = expMatch ? expMatch[1].trim() : undefined

    // Remove Answer and Explanation lines to isolate prompt and options
    const cleanBlock = block
      .replace(/(?:Answer|Ans|Correct(?:\s*Option)?)\s*[:=-]?\s*[A-D][^\n\r]*/i, "")
      .replace(/(?:Explanation|Solution|Working)\s*[:=-]?\s*[^\n\r]*/i, "")
      .trim()

    // Extract Options A, B, C, D
    // Matches A) ... B) ... C) ... D) ... or A. ... B. ...
    const optRegex = /(?:^|\n)\s*([A-D])[.)]\s*([^\n]+)/gi
    const options: ICbtQuestionOption[] = []
    let match: RegExpExecArray | null
    let firstOptIndex = -1

    while ((match = optRegex.exec(cleanBlock)) !== null) {
      if (firstOptIndex === -1) {
        firstOptIndex = match.index
      }
      const label = match[1].toUpperCase() as "A" | "B" | "C" | "D"
      const text = match[2].trim()
      options.push({ id: label, text })
    }

    // Question prompt is everything before the first option
    let promptText = firstOptIndex !== -1 ? cleanBlock.substring(0, firstOptIndex).trim() : cleanBlock.trim()

    // Fallback default options if not all 4 are found
    const defaultLabels: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"]
    const normalizedOptions: ICbtQuestionOption[] = defaultLabels.map((lbl) => {
      const found = options.find((o) => o.id === lbl)
      return found || { id: lbl, text: `Option ${lbl}` }
    })

    if (!promptText) {
      errors.push(`Question ${qNum}: Prompt text was empty.`)
      promptText = `Question ${qNum}`
    }

    parsedQuestions.push({
      id: `bulk-q-${Date.now()}-${idx}`,
      questionNumber: qNum,
      prompt: promptText,
      options: normalizedOptions,
      correctOptionId: correctLetter,
      points: 1,
      explanation,
      difficulty: "Intermediate",
    })
  })

  return { parsedQuestions, errors }
}
