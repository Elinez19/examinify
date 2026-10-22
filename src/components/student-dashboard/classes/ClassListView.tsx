import { Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ClassCard } from "./ClassCard"
import { ClassScheduleCard } from "./ClassScheduleCard"
import { ClassAnnouncementsList } from "./ClassAnnouncementsList"
import type { IClassCohort, IClassAnnouncement } from "../../types/student"

interface ClassListViewProps {
  classes: IClassCohort[]
  announcements: IClassAnnouncement[]
  onSelectCohort?: (cohortId: string) => void
}

export function ClassListView({
  classes,
  announcements,
  onSelectCohort,
}: ClassListViewProps) {
  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <span>Enrolled Classes & Cohorts</span>
            <Badge variant="default" className="text-xs">
              {classes.length} Active
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your primary academic homeroom, test-prep cohorts, and faculty mentors
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Filter className="size-3.5 text-primary" />
          <span>Academic Session: 2025/2026</span>
        </div>
      </div>

      {/* Grid of Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((cohort) => (
          <ClassCard
            key={cohort.id}
            cohort={cohort}
            onSelectCohort={onSelectCohort}
          />
        ))}
      </div>

      {/* Weekly Schedule Section */}
      <ClassScheduleCard />

      {/* Announcements Stream */}
      <ClassAnnouncementsList announcements={announcements} />
    </div>
  )
}
