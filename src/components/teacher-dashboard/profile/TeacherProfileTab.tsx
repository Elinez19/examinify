import * as React from "react"
import {
  GraduationCap,
  School,
  MapPin,
  Mail,
  Phone,
  Award,
  CalendarCheck,
  CheckCircle2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { ITeacherProfile, ITimetablePeriod } from "@/types/teacher"

interface TeacherProfileTabProps {
  profile: ITeacherProfile
  timetable: ITimetablePeriod[]
}

export function TeacherProfileTab({ profile, timetable }: TeacherProfileTabProps) {
  const days: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday")[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]

  return (
    <div className="space-y-6">
      {/* Teacher Profile & Credentials Card */}
      <Card className="rounded-3xl border-border bg-card shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-linear-to-r from-card via-card to-primary/5 border-b border-border/60">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="size-20 rounded-2xl object-cover border-2 border-primary/20 shadow-xs"
              />
            ) : (
              <div className="size-20 rounded-2xl bg-primary/10 text-primary font-bold text-2xl flex items-center justify-center">
                {profile.fullName.charAt(0)}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="pill" className="text-xs font-bold uppercase tracking-wider text-primary">
                  Staff ID: {profile.staffId}
                </Badge>
                {profile.assignedClassRole && (
                  <Badge variant="success" className="text-xs font-bold gap-1">
                    <CheckCircle2 className="size-3" />
                    <span>{profile.assignedClassRole}</span>
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {profile.fullName}
              </h1>

              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                {profile.title} • {profile.department}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <School className="size-4 text-primary shrink-0" />
              <span className="font-semibold text-foreground">{profile.schoolName}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-primary shrink-0" />
              <span>{profile.branchName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-muted-foreground shrink-0" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-muted-foreground shrink-0" />
              <span>{profile.phone}</span>
            </div>
          </div>
        </div>

        {/* Qualifications & Specializations */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/10">
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-foreground flex items-center gap-2">
              <GraduationCap className="size-4 text-primary" />
              <span>Educational Qualifications & Certifications</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {profile.qualifications.map((qual) => (
                <Badge key={qual} variant="outline" className="text-xs py-1 px-2.5 font-medium">
                  {qual}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <span className="text-xs font-bold text-foreground flex items-center gap-2">
              <Award className="size-4 text-primary" />
              <span>Subject Specializations & Pedagogical Tracks</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {profile.specializations.map((spec) => (
                <Badge key={spec} variant="default" className="text-xs py-1 px-2.5 font-semibold">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Weekly Teaching Timetable Grid */}
      <Card className="rounded-3xl border-border bg-card shadow-xs overflow-hidden">
        <CardHeader className="pb-4 border-b border-border/60 flex flex-row items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CalendarCheck className="size-5 text-primary" />
              <CardTitle className="text-base font-bold text-foreground">
                Weekly Teaching Timetable (Instructional Periods)
              </CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">
              Monday to Friday instructional schedule across all assigned classes.
            </p>
          </div>
          <Badge variant="pill" className="text-xs font-bold">
            {profile.totalWeeklyPeriods} Total Periods / Week
          </Badge>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {days.map((day) => {
              const dayPeriods = timetable.filter((t) => t.dayOfWeek === day)
              const isToday = day === "Monday" // current demo day is Monday

              return (
                <div
                  key={day}
                  className={`rounded-2xl border p-3.5 space-y-2.5 transition-all ${
                    isToday
                      ? "border-primary/50 bg-primary/5 shadow-xs"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span
                      className={`text-xs font-extrabold uppercase tracking-wide ${
                        isToday ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {day}
                    </span>
                    {isToday && (
                      <Badge variant="primary" className="text-[9px] px-1.5 py-0.2 font-bold uppercase">
                        Today
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    {dayPeriods.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground py-3 text-center">
                        No periods
                      </p>
                    ) : (
                      dayPeriods.map((p) => (
                        <div
                          key={p.id}
                          className={`p-2.5 rounded-xl border text-left space-y-1 ${
                            p.isCurrent
                              ? "border-primary bg-card shadow-xs ring-1 ring-primary/30"
                              : "border-border/80 bg-muted/40"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-foreground truncate">
                              {p.subjectName}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground font-semibold shrink-0">
                              P{p.periodNumber}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span className="font-semibold text-primary">{p.className}</span>
                            <span>{p.room}</span>
                          </div>

                          <div className="text-[10px] text-muted-foreground font-mono">
                            {p.timeSlot}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
