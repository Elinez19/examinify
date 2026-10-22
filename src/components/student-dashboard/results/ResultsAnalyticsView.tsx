import { CheckCircle2, TrendingUp, Download, BarChart3 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { IRecentExamResult } from "../../types/student"

interface ResultsAnalyticsViewProps {
  results: IRecentExamResult[]
  readinessScore: number
}

export function ResultsAnalyticsView({
  results,
  readinessScore,
}: ResultsAnalyticsViewProps) {
  const averagePercentage = Math.round(
    results.reduce((acc, curr) => acc + curr.percentage, 0) / (results.length || 1)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <span>CBT Results & Gradebook</span>
            <Badge variant="success" className="text-xs">
              Verified Records
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Detailed transcripts, percentile distributions, and institutional mock histories
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          leftIcon={<Download className="size-3.5 text-primary" />}
          className="text-xs font-semibold"
        >
          Export Official Transcript
        </Button>
      </div>

      {/* Analytics KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card glossy>
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Mean CBT Score
            </span>
            <div className="text-3xl font-extrabold text-foreground">
              {averagePercentage}%
            </div>
            <p className="text-[11px] text-status-success font-medium flex items-center gap-1">
              <TrendingUp className="size-3" />
              Consistent A1/B2 Grade Average
            </p>
          </CardContent>
        </Card>

        <Card glossy>
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Composite Readiness
            </span>
            <div className="text-3xl font-extrabold text-primary">
              {readinessScore}%
            </div>
            <p className="text-[11px] text-muted-foreground">
              Projected JAMB UTME Score: 310 - 335
            </p>
          </CardContent>
        </Card>

        <Card glossy>
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              National Percentile
            </span>
            <div className="text-3xl font-extrabold text-foreground">
              96th
            </div>
            <p className="text-[11px] text-status-success font-medium flex items-center gap-1">
              <CheckCircle2 className="size-3" />
              Top 4% Nationally in STEM
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results Table / Cards */}
      <Card glossy>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Official Examination History</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Full ledger of completed Computer-Based Assessments
              </p>
            </div>
          </div>
          <Badge variant="pill" className="text-xs">
            {results.length} Recorded
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          {results.map((res) => (
            <div
              key={res.id}
              className="rounded-xl border border-border bg-card/70 p-4 space-y-3 hover:bg-muted/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    {res.examTitle}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {res.subject} • Completed on {res.completedDate}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={res.passed ? "success" : "destructive"}>
                    {res.grade} ({res.score} / {res.maxScore})
                  </Badge>
                  <Badge variant="pill" className="text-[11px]">
                    {res.percentile}th Percentile
                  </Badge>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Score Percentage</span>
                  <span className="font-bold text-foreground">{res.percentage}%</span>
                </div>
                <Progress
                  value={res.percentage}
                  indicatorClassName={res.percentage >= 85 ? "bg-status-success" : "bg-primary"}
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
