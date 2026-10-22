import * as React from "react"
import {
  LayoutDashboard,
  School,
  BookOpen,
  GraduationCap,
  Award,
  Sparkles,
  LogOut,
  X,
  ShieldCheck,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { DashboardTab } from "../../types/student"

interface DashboardSidebarProps {
  currentTab: DashboardTab
  onTabChange: (tab: DashboardTab) => void
  isMobileOpen: boolean
  onCloseMobile: () => void
  onNavigateHome?: () => void
  onStartPracticeExam: () => void
  enrolledClassesCount: number
  enrolledSubjectsCount: number
}

interface NavItem {
  tab: DashboardTab
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
}

export function DashboardSidebar({
  currentTab,
  onTabChange,
  isMobileOpen,
  onCloseMobile,
  onNavigateHome,
  onStartPracticeExam,
  enrolledClassesCount,
  enrolledSubjectsCount,
}: DashboardSidebarProps) {
  const navItems: NavItem[] = [
    {
      tab: "overview",
      label: "Dashboard Overview",
      icon: LayoutDashboard,
    },
    {
      tab: "classes",
      label: "My Classes & Cohorts",
      icon: School,
      badge: enrolledClassesCount,
    },
    {
      tab: "subjects",
      label: "Subjects & Syllabus",
      icon: BookOpen,
      badge: enrolledSubjectsCount,
    },
    {
      tab: "profile",
      label: "Candidate Profile",
      icon: GraduationCap,
    },
    {
      tab: "results",
      label: "Exam Results & Scores",
      icon: Award,
    },
  ]

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-card text-card-foreground">
      {/* Top Branding Section */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <ShieldCheck className="size-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-foreground">
                Examinify
              </span>
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                Student Portal
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
      </div>

      {/* Middle Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Menu
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
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
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
                    "flex size-5 items-center justify-center rounded-full text-[10px] font-bold",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:bg-card"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}

        {/* Practice CBT Promo Banner */}
        <div className="pt-6 px-1">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Sparkles className="size-4" />
              <span>CBT Simulator</span>
            </div>
            <p className="mt-1.5 text-muted-foreground leading-relaxed">
              Launch realistic timed mock exams with instant AI diagnostic breakdown.
            </p>
            <Button
              variant="primary"
              size="sm"
              sheen
              onClick={() => {
                onStartPracticeExam()
                onCloseMobile()
              }}
              className="mt-3 w-full text-xs font-semibold"
              rightIcon={<ChevronRight className="size-3.5" />}
            >
              Launch CBT Practice
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Navigation: Home & Sign Out */}
      <div className="p-3 border-t border-border space-y-1">
        {onNavigateHome && (
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <LogOut className="size-4" />
            <span>Exit to Homepage</span>
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border min-h-screen sticky top-0 shrink-0">
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
