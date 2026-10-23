import * as React from "react"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileCheck2,
  Settings,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { TeacherDashboardTab, ITeacherProfile, ITeacherSubject } from "@/types/teacher"
import { MOCK_TEACHER_SUBJECTS } from "@/services/teacher-dashboard/mockTeacherData"

interface TeacherDashboardSidebarProps {
  currentTab: TeacherDashboardTab
  onTabChange: (tab: TeacherDashboardTab) => void
  isMobileOpen: boolean
  onCloseMobile: () => void
  profile: ITeacherProfile
  activeExamsCount?: number
  subjects?: ITeacherSubject[]
  selectedSubject?: string | null
  onSelectSubject?: (subjectName: string) => void
}

interface MainNavItem {
  tab: TeacherDashboardTab
  label: string
  icon: React.ComponentType<{ className?: string }>
  isCoursesGroup?: boolean
}

export function TeacherDashboardSidebar({
  currentTab,
  onTabChange,
  isMobileOpen,
  onCloseMobile,
  subjects = MOCK_TEACHER_SUBJECTS,
  selectedSubject,
  onSelectSubject,
}: TeacherDashboardSidebarProps) {
  const [coursesExpanded, setCoursesExpanded] = React.useState(true)

  const navItems: MainNavItem[] = [
    {
      tab: "overview",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      tab: "students",
      label: "Students",
      icon: Users,
    },
    {
      tab: "subjects",
      label: "Subjects",
      icon: BookOpen,
      isCoursesGroup: true,
    },
    {
      tab: "exams",
      label: "Exams",
      icon: FileCheck2,
    },
  ]

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-card text-card-foreground select-none">
      {/* Top Navigation Block */}
      <div className="flex flex-col flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Mobile Header with close button */}
        <div className="flex items-center justify-between md:hidden pb-3 border-b border-border">
          <span className="text-sm font-bold tracking-tight text-foreground">Navigation</span>
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Primary Navigation Items */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentTab === item.tab

            if (item.isCoursesGroup) {
              return (
                <div key={item.tab} className="space-y-1">
                  <div
                    onClick={() => {
                      onTabChange("subjects")
                      onCloseMobile()
                    }}
                    className={cn(
                      "group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-150 cursor-pointer text-left",
                      isActive && !selectedSubject
                        ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3.5">
                      <Icon
                        className={cn(
                          "size-5 transition-colors",
                          isActive && !selectedSubject
                            ? "text-primary-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      <span>{item.label}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setCoursesExpanded(!coursesExpanded)
                      }}
                      className="p-1 rounded-md hover:bg-black/10 transition-colors"
                      aria-label="Toggle subjects dropdown"
                    >
                      {coursesExpanded ? (
                        <ChevronDown className="size-4 opacity-70" />
                      ) : (
                        <ChevronRight className="size-4 opacity-70" />
                      )}
                    </button>
                  </div>

                  {/* Nested Subject Links (Reference Image 1: English Language item) */}
                  {coursesExpanded && (
                    <div className="pl-6 pr-2 py-1 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                      {subjects.map((sub) => {
                        const isSubActive =
                          currentTab === "subjects" && selectedSubject === sub.name

                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => {
                              if (onSelectSubject) {
                                onSelectSubject(sub.name)
                              }
                              onTabChange("subjects")
                              onCloseMobile()
                            }}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all uppercase cursor-pointer truncate",
                              isSubActive
                                ? "bg-primary/10 text-primary font-bold border-l-2 border-primary"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                          >
                            {sub.name}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => {
                  if (onSelectSubject) {
                    onSelectSubject("")
                  }
                  onTabChange(item.tab)
                  onCloseMobile()
                }}
                className={cn(
                  "group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-150 cursor-pointer text-left",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    className={cn(
                      "size-5 transition-colors",
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bottom Section: Settings (Matching Reference Image bottom icon) */}
      <div className="p-4 border-t border-border shrink-0">
        <button
          type="button"
          onClick={() => {
            onTabChange("settings")
            onCloseMobile()
          }}
          className={cn(
            "group flex w-full items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-150 cursor-pointer text-left",
            currentTab === "settings"
              ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
          )}
        >
          <Settings
            className={cn(
              "size-5 transition-colors",
              currentTab === "settings"
                ? "text-primary-foreground"
                : "text-muted-foreground group-hover:text-foreground"
            )}
          />
          <span>Settings</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sticky Minimalist Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border h-[calc(100vh-4rem)] sticky top-16 shrink-0 self-start overflow-hidden bg-card z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-xs md:hidden animate-in fade-in duration-150"
          onClick={onCloseMobile}
        >
          <div
            className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
