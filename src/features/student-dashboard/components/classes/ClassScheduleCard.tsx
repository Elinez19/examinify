import { Calendar, Clock, MapPin } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ScheduleBlock {
  day: string
  time: string
  subject: string
  code: string
  instructor: string
  location: string
}

const WEEKLY_SCHEDULE: ScheduleBlock[] = [
  {
    day: "Monday",
    time: "08:15 AM - 09:45 AM",
    subject: "Mathematics & Calculus",
    code: "MTH-301",
    instructor: "Mr. Solomon Okon",
    location: "Science Wing 2B",
  },
  {
    day: "Monday",
    time: "10:15 AM - 11:45 AM",
    subject: "Physics: Optics & Waves",
    code: "PHY-301",
    instructor: "Mr. Babatunde Balogun",
    location: "Physics Lab A",
  },
  {
    day: "Tuesday",
    time: "04:00 PM - 06:00 PM",
    subject: "JAMB UTME CBT Speed Mock",
    code: "JMB-2026",
    instructor: "Dr. Cynthia Onyeka",
    location: "Digital CBT Hall 1",
  },
  {
    day: "Wednesday",
    time: "09:00 AM - 10:30 AM",
    subject: "Chemistry: Volumetric Analysis",
    code: "CHM-301",
    instructor: "Dr. Kalu Ndukwe",
    location: "Chemistry Lab 1",
  },
  {
    day: "Thursday",
    time: "11:00 AM - 12:30 PM",
    subject: "English Language & Lexis",
    code: "ENG-301",
    instructor: "Mrs. Folashade Adele",
    location: "Room 14",
  },
  {
    day: "Friday",
    time: "08:30 AM - 10:00 AM",
    subject: "Biology & Human Ecology",
    code: "BIO-301",
    instructor: "Mrs. Ngozi Eke",
    location: "Biology Lab",
  },
]

export function ClassScheduleCard() {
  return (
    <Card glossy>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Calendar className="size-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">Weekly Timetable</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live lectures, laboratory practicals & CBT practice windows
            </p>
          </div>
        </div>
        <Badge variant="default" className="text-xs">
          Active Week
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {WEEKLY_SCHEDULE.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border bg-card/60 p-3.5 space-y-1.5 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <Badge variant="pill" className="text-[10px] font-bold">
                  {item.day}
                </Badge>
                <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                  <Clock className="size-3 text-primary" />
                  {item.time}
                </span>
              </div>

              <div className="pt-0.5">
                <h5 className="font-bold text-foreground text-xs">
                  {item.subject}
                </h5>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Instructor: {item.instructor}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground border-t border-border">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3 text-primary" />
                  {item.location}
                </span>
                <span className="font-mono text-[10px]">{item.code}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
