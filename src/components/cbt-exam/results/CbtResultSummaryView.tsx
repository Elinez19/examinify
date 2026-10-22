import {
  CheckCircle2,
  Printer,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { ICbtExamResult } from "@/types/cbt"

interface CbtResultSummaryViewProps {
  result: ICbtExamResult
  onReturnToDashboard: () => void
  onRetakePractice?: () => void
}

export function CbtResultSummaryView({
  result,
  onReturnToDashboard,
  onRetakePractice,
}: CbtResultSummaryViewProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-3xl w-full space-y-6">
        {/* Top Action Header (hidden in print) */}
        <div className="flex items-center justify-between gap-3 print:hidden">
          <Badge variant="pill" className="gap-1.5 px-3 py-1 text-xs font-semibold">
            <CheckCircle2 className="size-3.5 text-status-success" />
            <span>Submission Recorded Successfully</span>
          </Badge>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="size-3.5" />}
              className="text-xs font-semibold"
            >
              Print Result Slip
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onReturnToDashboard}
              rightIcon={<ArrowRight className="size-3.5" />}
              className="text-xs font-semibold"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Official Printable Result Slip Card */}
        <Card className="border-border bg-card shadow-xl overflow-hidden print:shadow-none print:border-none">
          {/* Slip Header Banner */}
          <div className="bg-primary/10 border-b border-border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                <ShieldCheck className="size-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Official CBT Assessment Record
                </span>
                <h1 className="text-xl font-extrabold text-foreground">
                  {result.examTitle}
                </h1>
                <p className="text-xs text-muted-foreground font-mono">
                  Timestamp: {result.completedAt}
                </p>
              </div>
            </div>

            <Badge
              variant={result.isPassed ? "success" : "destructive"}
              className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 self-start sm:self-auto"
            >
              {result.isPassed ? "PASSED (Satisfactory)" : "Needs Improvement"}
            </Badge>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Candidate Info Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-muted/30 border border-border text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Candidate Name
                </span>
                <span className="font-bold text-foreground truncate block">
                  {result.candidate.fullName}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Registration No
                </span>
                <span className="font-mono font-bold text-foreground">
                  {result.candidate.registrationNumber}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Seat / Terminal
                </span>
                <span className="font-mono font-bold text-foreground">
                  {result.candidate.seatNumber} ({result.candidate.terminalId})
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Department
                </span>
                <span className="font-bold text-foreground truncate block">
                  {result.candidate.department}
                </span>
              </div>
            </div>

            {/* Overall Score Highlight Banner */}
            <div className="p-6 rounded-3xl bg-linear-to-br from-primary/10 via-card to-card border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Combined Aggregate Performance
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground font-mono">
                  {result.aggregateScore}{" "}
                  <span className="text-lg text-muted-foreground font-normal">
                    / {result.maxPossibleScore} Marks
                  </span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Attempted: <strong>{result.totalAttempted}</strong> of{" "}
                  <strong>{result.totalQuestions}</strong> questions • Accuracy:{" "}
                  <strong className="text-status-success font-mono font-bold">
                    {result.aggregatePercentage}%
                  </strong>
                </p>
              </div>

              <div className="flex flex-col items-center sm:items-end gap-1 shrink-0">
                <div className="size-20 rounded-full border-4 border-primary/30 flex items-center justify-center bg-card shadow-xs">
                  <span className="text-2xl font-extrabold text-primary font-mono">
                    {result.aggregatePercentage}%
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Overall Score
                </span>
              </div>
            </div>

            {/* Subject-by-Subject Score Breakdown Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Individual Subject Breakdown
              </h3>

              <div className="rounded-2xl border border-border overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b border-border text-[11px] text-muted-foreground font-semibold">
                    <tr>
                      <th className="p-3.5">Subject</th>
                      <th className="p-3.5 text-center">Attempted</th>
                      <th className="p-3.5 text-center">Correct</th>
                      <th className="p-3.5 text-center">Score</th>
                      <th className="p-3.5 text-center">Percentage</th>
                      <th className="p-3.5 text-right">Grade Letter</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-medium">
                    {result.subjects.map((sub) => (
                      <tr key={sub.subjectId} className="hover:bg-muted/20">
                        <td className="p-3.5 font-bold text-foreground">
                          {sub.subjectName}
                        </td>
                        <td className="p-3.5 text-center font-mono">
                          {sub.attemptedQuestions} / {sub.totalQuestions}
                        </td>
                        <td className="p-3.5 text-center font-mono text-status-success font-bold">
                          {sub.correctAnswers}
                        </td>
                        <td className="p-3.5 text-center font-mono font-bold text-foreground">
                          {sub.rawScore}
                        </td>
                        <td className="p-3.5 text-center font-mono font-bold text-primary">
                          {sub.percentage}%
                        </td>
                        <td className="p-3.5 text-right font-semibold text-foreground">
                          <Badge variant="outline" className="text-[10px] font-bold">
                            {sub.gradeLetter}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Performance Remark */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Official Assessor Remark
              </span>
              <p className="text-xs font-medium text-foreground leading-relaxed">
                {result.performanceRemark}
              </p>
            </div>

            {/* Bottom Actions (hidden in print) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border print:hidden">
              {onRetakePractice ? (
                <Button
                  variant="outline"
                  size="default"
                  onClick={onRetakePractice}
                  leftIcon={<RotateCcw className="size-4" />}
                  className="w-full sm:w-auto text-xs font-semibold"
                >
                  Practice CBT Again
                </Button>
              ) : (
                <div />
              )}

              <Button
                variant="primary"
                size="default"
                sheen
                onClick={onReturnToDashboard}
                rightIcon={<ArrowRight className="size-4" />}
                className="w-full sm:w-auto text-xs font-bold"
              >
                Return to Student Portal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
