import { CalendarDays } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExamScheduleItem } from "./ExamScheduleItem"
import type { IUpcomingExam } from "../../types/student"

interface UpcomingExamsCardProps {
  exams: IUpcomingExam[]
  onStartExam: (examId: string) => void
}

export function UpcomingExamsCard({ exams, onStartExam }: UpcomingExamsCardProps) {
  return (
    <Card glossy>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarDays className="size-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">Upcoming CBT Assessments</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Scheduled term exams and national preparation mocks
            </p>
          </div>
        </div>
        <Badge variant="default" className="text-xs">
          {exams.length} Scheduled
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3 pt-2">
        {exams.map((exam) => (
          <ExamScheduleItem
            key={exam.id}
            exam={exam}
            onStartExam={onStartExam}
          />
        ))}
      </CardContent>
    </Card>
  )
}
