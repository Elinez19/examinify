import { Award, CheckCircle2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { IRecentExamResult } from "@/types/student"

interface RecentResultsCardProps {
  results: IRecentExamResult[]
  onViewAll?: () => void
}

export function RecentResultsCard({ results }: RecentResultsCardProps) {
  return (
    <Card glossy>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-status-success/10 text-status-success">
            <Award className="size-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">Recent CBT Performance</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verified test scores and percentile standings
            </p>
          </div>
        </div>
        <Badge variant="success" className="text-xs">
          All Passed
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {results.map((res) => (
          <div
            key={res.id}
            className="rounded-xl border border-border bg-card/60 p-3.5 space-y-2 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h5 className="text-xs font-bold text-foreground">
                  {res.examTitle}
                </h5>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {res.subject} • {res.completedDate}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Badge
                  variant={res.percentage >= 85 ? "success" : "default"}
                  className="font-bold text-xs"
                >
                  {res.grade} ({res.score}/{res.maxScore})
                </Badge>
              </div>
            </div>

            {/* Progress bar representing percentage */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Score: {res.percentage}%
                </span>
                <span className="flex items-center gap-1 text-status-success font-medium">
                  <CheckCircle2 className="size-3" />
                  Top {100 - res.percentile}% Nationally
                </span>
              </div>
              <Progress
                value={res.percentage}
                indicatorClassName={
                  res.percentage >= 85 ? "bg-status-success" : "bg-primary"
                }
                className="h-1.5"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
