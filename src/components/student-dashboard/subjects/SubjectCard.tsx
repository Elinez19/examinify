import { BookOpen, User, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SubjectGradeBadge } from "./SubjectGradeBadge"
import type { ISubjectItem } from "../../types/student"

interface SubjectCardProps {
  subject: ISubjectItem
  onSelectSubject: (subjectId: string) => void
}

export function SubjectCard({ subject, onSelectSubject }: SubjectCardProps) {
  return (
    <Card glossy className="relative overflow-hidden flex flex-col justify-between">
      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="pill" className="text-[10px]">
                {subject.category}
              </Badge>
              <span className="text-xs font-mono font-semibold text-muted-foreground">
                {subject.code}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              {subject.name}
            </h3>
          </div>

          <SubjectGradeBadge
            grade={subject.currentGradeLetter}
            percentage={subject.currentGradePercentage}
          />
        </div>

        {/* Syllabus Progress */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">
              Syllabus Covered
            </span>
            <span className="font-bold text-foreground">
              {subject.syllabusProgress}%
            </span>
          </div>
          <Progress value={subject.syllabusProgress} className="h-2" />
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
            <span>{subject.completedTopicsCount} of {subject.totalTopicsCount} topics completed</span>
            {subject.nextAssessmentDate && (
              <span className="text-primary font-medium">Test: {subject.nextAssessmentDate}</span>
            )}
          </div>
        </div>

        {/* Teacher details */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
          <span className="flex items-center gap-1.5 truncate">
            <User className="size-3.5 text-primary shrink-0" />
            <span className="truncate">{subject.teacherName}</span>
          </span>
          <span className="font-mono text-[11px] text-muted-foreground shrink-0">
            {subject.topics.length} Modules
          </span>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectSubject(subject.id)}
            className="w-full text-xs font-semibold"
            leftIcon={<BookOpen className="size-3.5 text-primary" />}
            rightIcon={<ChevronRight className="size-3.5" />}
          >
            Explore Syllabus Blueprint
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
