import * as React from "react"
import {
  LayoutDashboard,
  Users,
  FileCheck2,
  GraduationCap,
  CalendarDays,
  X,
  ShieldCheck,
  School,
  MapPin,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { TeacherDashboardTab, ITeacherProfile } from "@/types/teacher"

interface TeacherDashboardSidebarProps {
  currentTab: TeacherDashboardTab
  onTabChange: (tab: TeacherDashboardTab) => void
  isMobileOpen: boolean
  onCloseMobile: () => void
  profile: ITeacherProfile
  activeExamsCount: number
}

interface NavItem {
  tab: TeacherDashboardTab
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  badgeVariant?: "default" | "primary" | "warning"
}

export function TeacherDashboardSidebar({
  currentTab,
  onTabChange,
  isMobileOpen,
  onCloseMobile,
  profile,
  activeExamsCount,
}: TeacherDashboardSidebarProps) {
  // Exactly the 5 requested menus:
  // 1. Overview
  // 2. Class Teachers (Classes assigned to teacher)
  // 3. CBT / Assessments
  // 4. Gradebook & Broadsheet
  // 5. Profile & Timetable
  const navItems: NavItem[] = [
    {
      tab: "overview",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      tab: "classes",
      label: "Class Teachers",
      icon: Users,
    },
    {
      tab: "assessments",
      label: "CBT / Assessments",
      icon: FileCheck2,
      badge: activeExamsCount > 0 ? activeExamsCount : undefined,
      badgeVariant: "primary",
    },
    {
      tab: "gradebook",
      label: "Gradebook & Broadsheet",
      icon: GraduationCap,
    },
    {
      tab: "profile",
      label: "Profile & Timetable",
      icon: CalendarDays,
    },
  ]

  const sidebarContent = (
    <div className="flex h-full flex-col bg-card text-card-foreground overflow-hidden">
      {/* Branding & School/Branch Context */}
      <div className="p-4 sm:p-5 border-b border-border space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <ShieldCheck className="size-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-foreground">
                Examinify
              </span>
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                Teacher Portal
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted md:hidden"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Multi-School & Multi-Branch Badge */}
        <div className="rounded-xl border border-border bg-muted/40 p-2.5 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-foreground truncate">
            <School className="size-3.5 text-primary shrink-0" />
            <span className="truncate">{profile.schoolName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <MapPin className="size-3 text-muted-foreground shrink-0" />
            <span className="truncate">{profile.branchName}</span>
          </div>
          {profile.assignedClassRole && (
            <div className="pt-1 border-t border-border/60">
              <Badge variant="pill" className="text-[10px] font-semibold text-primary">
                {profile.assignedClassRole}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Middle Navigation Links (5 strict menus) */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Teacher Menus
        </div>

        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentTab === item.tab

          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => {
                onTabChange(item.tab)
                onCloseMobile()
              }}
              className={cn(
                "group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer text-left",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "size-4.5 transition-colors",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border h-screen sticky top-0 shrink-0 self-start overflow-hidden bg-card z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
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
