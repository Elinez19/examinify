import * as React from "react"
import { Users, MoreVertical, BookOpen, Eye, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { ITeacherAssignedClass, TeacherDashboardTab } from "@/types/teacher"

interface ClassTeachersTabProps {
  assignedClasses: ITeacherAssignedClass[]
  onOpenRoster: (cls: ITeacherAssignedClass) => void
  onNavigateTab: (tab: TeacherDashboardTab) => void
}

export function ClassTeachersTab({
  assignedClasses,
  onOpenRoster,
  onNavigateTab,
}: ClassTeachersTabProps) {
  // Track open dropdown menu id
  const [openDropdownId, setOpenDropdownId] = React.useState<string | null>(null)

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null)
    window.addEventListener("click", handleClickOutside)
    return () => window.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
            Class Teachers & Teaching Allocations
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Classes and subjects assigned by the School Administrator for instructional delivery.
          </p>
        </div>
        <Badge variant="pill" className="text-xs font-bold gap-1 self-start sm:self-auto px-3 py-1">
          <Users className="size-3.5 text-primary" />
          <span>{assignedClasses.length} Assigned Classes</span>
        </Badge>
      </div>

      {/* Clean Table Card */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-bold uppercase tracking-wider text-[11px] text-muted-foreground">
                <th className="py-3.5 px-4 sm:px-6">Class Name</th>
                <th className="py-3.5 px-4">Subjects Taught</th>
                <th className="py-3.5 px-4">Student Count</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {assignedClasses.map((cls) => {
                const isDropdownOpen = openDropdownId === cls.id

                return (
                  <tr
                    key={cls.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    {/* Class Name */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors">
                            {cls.className}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {cls.room} • {cls.scheduleText}
                        </p>
                      </div>
                    </td>

                    {/* Subjects Taught */}
                    <td className="py-4 px-4">
                      {cls.isAllClassSubjects ? (
                        <div className="space-y-1">
                          <Badge variant="pill" className="text-xs font-bold gap-1 text-primary">
                            <BookOpen className="size-3" />
                            <span>All Class Subjects ({cls.subjectsTaught.length})</span>
                          </Badge>
                          <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-md">
                            {cls.subjectsTaught.join(", ")}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {cls.subjectsTaught.map((subj) => (
                            <Badge
                              key={subj}
                              variant="default"
                              className="text-xs font-semibold"
                            >
                              {subj}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Student Count */}
                    <td className="py-4 px-4 font-semibold text-foreground">
                      <div className="flex items-center gap-1.5">
                        <Users className="size-3.5 text-muted-foreground" />
                        <span>{cls.studentCount} Students</span>
                      </div>
                    </td>

                    {/* Actions: Three Dots Dropdown */}
                    <td className="py-4 px-4 text-right relative">
                      <div className="inline-block text-left">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenDropdownId(isDropdownOpen ? null : cls.id)
                          }}
                          className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                          aria-label="Class actions"
                        >
                          <MoreVertical className="size-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                          <div
                            className="absolute right-4 top-12 z-20 w-44 rounded-xl border border-border bg-card p-1 shadow-lg animate-in fade-in zoom-in-95 duration-150"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setOpenDropdownId(null)
                                onOpenRoster(cls)
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                            >
                              <Eye className="size-3.5 text-primary" />
                              <span>View Roster</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setOpenDropdownId(null)
                                onNavigateTab("gradebook")
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                            >
                              <ArrowUpRight className="size-3.5 text-muted-foreground" />
                              <span>Open Gradebook</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
