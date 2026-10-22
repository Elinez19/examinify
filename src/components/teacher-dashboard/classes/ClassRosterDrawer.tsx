import * as React from "react"
import { X, Search, Phone, CheckCircle2, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ITeacherAssignedClass } from "@/types/teacher"
import {
  MOCK_SS1_EXPLORERS_ROSTER,
  MOCK_GRADE4_DIAMOND_ROSTER,
} from "@/services/teacher-dashboard/mockTeacherData"

interface ClassRosterDrawerProps {
  assignedClass: ITeacherAssignedClass | null
  onClose: () => void
}

export function ClassRosterDrawer({ assignedClass, onClose }: ClassRosterDrawerProps) {
  const [search, setSearch] = React.useState("")

  if (!assignedClass) return null

  // Choose appropriate roster
  const rawRoster =
    assignedClass.className.includes("Grade 4")
      ? MOCK_GRADE4_DIAMOND_ROSTER
      : MOCK_SS1_EXPLORERS_ROSTER

  const filtered = rawRoster.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.currentGrade.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl h-full bg-card shadow-2xl border-l border-border flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-foreground">
                {assignedClass.className} Roster
              </h2>
              <Badge variant="pill" className="text-xs font-bold">
                {assignedClass.studentCount} Students
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {assignedClass.room} • {assignedClass.scheduleText}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-border/60 bg-muted/20">
          <div className="relative">
            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, reg number, or grade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Students List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No students found matching your search.
            </div>
          ) : (
            filtered.map((student) => (
              <div
                key={student.id}
                className="p-3.5 rounded-xl border border-border bg-card hover:border-primary/40 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">
                        {student.fullName}
                      </span>
                      <Badge
                        variant={
                          student.performanceStatus === "Excelling"
                            ? "success"
                            : student.performanceStatus === "Needs Attention"
                            ? "destructive"
                            : "outline"
                        }
                        className="text-[10px] font-bold"
                      >
                        {student.performanceStatus === "Excelling" && (
                          <CheckCircle2 className="size-3 mr-1 inline" />
                        )}
                        {student.performanceStatus === "Needs Attention" && (
                          <AlertTriangle className="size-3 mr-1 inline" />
                        )}
                        {student.performanceStatus}
                      </Badge>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">
                      {student.registrationNumber} • {student.gender}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-foreground">
                      {student.totalScore}%
                    </span>
                    <p className="text-[10px] font-bold text-primary">
                      WAEC Grade: {student.currentGrade}
                    </p>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Attendance: <strong className="text-foreground">{student.attendanceRate}%</strong></span>
                  <div className="flex items-center gap-3">
                    <a
                      href={`tel:${student.parentPhone}`}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                      title="Call Guardian"
                    >
                      <Phone className="size-3" />
                      <span>{student.parentPhone}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/20 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs font-semibold">
            Close Roster
          </Button>
        </div>
      </div>
    </div>
  )
}
