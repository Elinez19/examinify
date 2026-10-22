import { Users, Clock, MapPin, Mail, ChevronRight, School } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { IClassCohort } from "@/types/student"

interface ClassCardProps {
  cohort: IClassCohort
  onSelectCohort?: (cohortId: string) => void
}

export function ClassCard({ cohort, onSelectCohort }: ClassCardProps) {
  return (
    <Card glossy className="relative overflow-hidden flex flex-col justify-between">
      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={cohort.isPrimaryClass ? "primary" : "pill"} className="text-[10px]">
                {cohort.isPrimaryClass ? "Primary Homeroom" : "Specialized Cohort"}
              </Badge>
              <span className="text-xs font-semibold text-muted-foreground">
                {cohort.code}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              {cohort.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {cohort.term} • {cohort.academicYear}
            </p>
          </div>

          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <School className="size-5" />
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {cohort.description}
        </p>

        {/* Lead Teacher Pill */}
        <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-1 text-xs">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Lead Instructor
          </span>
          <p className="font-bold text-foreground">
            {cohort.teacherName}
          </p>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
            <span>{cohort.teacherTitle}</span>
            <a
              href={`mailto:${cohort.teacherEmail}`}
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <Mail className="size-3" />
              <span>Contact</span>
            </a>
          </div>
        </div>

        {/* Class Logistics Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-1 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-primary shrink-0" />
            <span className="truncate">{cohort.scheduleTime}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Users className="size-3.5 text-primary shrink-0" />
            <span>{cohort.totalStudents} Peers Enrolled</span>
          </div>

          <div className="flex items-center gap-1.5 col-span-2">
            <MapPin className="size-3.5 text-primary shrink-0" />
            <span className="truncate">{cohort.room}</span>
          </div>
        </div>

        {/* Schedule Days */}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="text-[11px] font-medium text-muted-foreground">Days:</span>
          <div className="flex items-center gap-1 flex-wrap">
            {cohort.scheduleDays.map((day) => (
              <Badge key={day} variant="pill" className="text-[10px] px-2 py-0.2">
                {day}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectCohort && onSelectCohort(cohort.id)}
            className="w-full text-xs font-semibold"
            rightIcon={<ChevronRight className="size-3.5" />}
          >
            Open Class Space
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
