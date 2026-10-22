import { Megaphone, Bell } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { IClassAnnouncement } from "../../types/student"

interface ClassAnnouncementsListProps {
  announcements: IClassAnnouncement[]
}

export function ClassAnnouncementsList({ announcements }: ClassAnnouncementsListProps) {
  return (
    <Card glossy>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-status-info/10 text-status-info">
            <Megaphone className="size-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">Class Bulletins & Updates</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verified notices from faculty heads and lead instructors
            </p>
          </div>
        </div>
        <Badge variant="info" className="text-xs">
          {announcements.length} Active Notices
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3 pt-2">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="rounded-xl border border-border bg-card/60 p-4 space-y-2 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Bell className="size-4 text-primary shrink-0" />
                <h4 className="text-xs sm:text-sm font-bold text-foreground">
                  {ann.title}
                </h4>
              </div>

              {ann.priority === "urgent" ? (
                <Badge variant="destructive" className="text-[10px] uppercase">
                  Urgent
                </Badge>
              ) : ann.priority === "high" ? (
                <Badge variant="warning" className="text-[10px] uppercase">
                  Important
                </Badge>
              ) : (
                <Badge variant="default" className="text-[10px]">
                  General
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed pl-6">
              {ann.content}
            </p>

            <div className="flex items-center justify-between pt-2 pl-6 text-[11px] text-muted-foreground border-t border-border">
              <span className="font-medium text-foreground">
                {ann.senderName} ({ann.senderRole})
              </span>
              <span>{ann.timestamp}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
