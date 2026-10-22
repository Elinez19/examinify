import { School, Award, Calendar, BookOpen, Target } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { IStudentProfile } from "../../types/student"

interface AcademicRecordCardProps {
  profile: IStudentProfile
}

export function AcademicRecordCard({ profile }: AcademicRecordCardProps) {
  return (
    <Card glossy>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <School className="size-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">Academic Record & Program</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Institutional enrollment and national examination track
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl border border-border bg-card/60 p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <School className="size-3.5 text-primary" />
              School / Institution
            </span>
            <p className="font-bold text-foreground text-sm">
              {profile.institutionName}
            </p>
            <p className="text-muted-foreground">
              {profile.institutionBranch || "Main Campus"}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Target className="size-3.5 text-primary" />
              Target Exam Track
            </span>
            <p className="font-bold text-foreground text-sm text-primary">
              {profile.targetExamTrack}
            </p>
            <p className="text-muted-foreground">
              Target Year: {profile.targetExamYear}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="size-3.5 text-primary" />
              Academic Stream / Department
            </span>
            <p className="font-bold text-foreground text-sm">
              {profile.department}
            </p>
            <p className="text-muted-foreground">
              {profile.enrolledSubjectsCount} Enrolled Core & STEM Subjects
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="size-3.5 text-primary" />
              Enrolled Since
            </span>
            <p className="font-bold text-foreground text-sm">
              {profile.enrolledDate}
            </p>
            <p className="text-muted-foreground flex items-center gap-1">
              <Award className="size-3.5 text-status-success" />
              {profile.completedExamsCount} CBT Tests Completed
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
