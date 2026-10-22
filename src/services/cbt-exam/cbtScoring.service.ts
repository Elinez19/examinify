import type {
  ICbtExamSession,
  ICbtAnswerMap,
  ICbtExamResult,
  ICbtSubjectScore,
} from "../types/cbt"

function getGradeLetter(percentage: number): string {
  if (percentage >= 80) return "A1 (Distinction)"
  if (percentage >= 75) return "B2 (Very Good)"
  if (percentage >= 70) return "B3 (Good)"
  if (percentage >= 65) return "C4 (Credit)"
  if (percentage >= 60) return "C5 (Credit)"
  if (percentage >= 50) return "C6 (Pass)"
  if (percentage >= 45) return "D7 (Fair)"
  if (percentage >= 40) return "E8 (Weak)"
  return "F9 (Fail)"
}

function getPerformanceRemark(percentage: number): string {
  if (percentage >= 85) return "Outstanding Performance! Top-tier mastery across tested subjects."
  if (percentage >= 70) return "Commendable Result! Solid comprehension of core principles."
  if (percentage >= 50) return "Satisfactory Pass. Consider targeted revision on weaker topics."
  return "Needs Improvement. Intensive remedial practice recommended."
}

export function computeCbtExamResult(
  session: ICbtExamSession,
  answers: ICbtAnswerMap,
  totalElapsedSeconds: number
): ICbtExamResult {
  let totalQuestionsCount = 0
  let totalAttemptedCount = 0
  let totalCorrectCount = 0
  let totalRawScore = 0
  let totalPossibleScore = 0

  const subjectScores: ICbtSubjectScore[] = session.subjects.map((subject) => {
    let attempted = 0
    let correct = 0
    let raw = 0
    let possible = 0

    subject.questions.forEach((q) => {
      totalQuestionsCount += 1
      possible += q.points
      totalPossibleScore += q.points

      const selectedOpt = answers[q.id]
      if (selectedOpt) {
        attempted += 1
        totalAttemptedCount += 1
        if (selectedOpt === q.correctOptionId) {
          correct += 1
          totalCorrectCount += 1
          raw += q.points
          totalRawScore += q.points
        }
      }
    })

    const percentage = possible > 0 ? Math.round((raw / possible) * 100) : 0
    // Estimate proportional time spent per subject
    const subjectTime = Math.round(
      totalElapsedSeconds * (subject.questions.length / Math.max(1, totalQuestionsCount || 1))
    )

    return {
      subjectId: subject.id,
      subjectName: subject.name,
      totalQuestions: subject.questions.length,
      attemptedQuestions: attempted,
      correctAnswers: correct,
      rawScore: raw,
      percentage,
      gradeLetter: getGradeLetter(percentage),
      timeSpentSeconds: subjectTime,
    }
  })

  const aggregatePercentage =
    totalPossibleScore > 0 ? Math.round((totalRawScore / totalPossibleScore) * 100) : 0

  return {
    sessionId: session.id,
    examTitle: session.title,
    candidate: session.candidate,
    completedAt: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    totalQuestions: totalQuestionsCount,
    totalAttempted: totalAttemptedCount,
    totalCorrect: totalCorrectCount,
    aggregateScore: totalRawScore,
    maxPossibleScore: totalPossibleScore,
    aggregatePercentage,
    performanceRemark: getPerformanceRemark(aggregatePercentage),
    isPassed: aggregatePercentage >= 50,
    subjects: subjectScores,
  }
}
