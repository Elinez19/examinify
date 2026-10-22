import * as React from "react"
import { TeacherDashboardSidebar } from "./TeacherDashboardSidebar"
import { TeacherDashboardHeader } from "./TeacherDashboardHeader"
import type { TeacherDashboardTab, ITeacherProfile, TeacherSchoolLevel } from "@/types/teacher"

interface TeacherDashboardLayoutProps {
  currentTab: TeacherDashboardTab
  onTabChange: (tab: TeacherDashboardTab) => void
  profile: ITeacherProfile
  teacherLevel: TeacherSchoolLevel
  onSwitchTeacherLevel: (level: TeacherSchoolLevel) => void
  activeExamsCount: number
  onNavigateHome?: () => void
  onLogOut?: () => void
  children: React.ReactNode
}

export function TeacherDashboardLayout({
  currentTab,
  onTabChange,
  profile,
  teacherLevel,
  onSwitchTeacherLevel,
  activeExamsCount,
  onNavigateHome,
  onLogOut,
  children,
}: TeacherDashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false)

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased">
      {/* 5-Menu Sidebar */}
      <TeacherDashboardSidebar
        currentTab={currentTab}
        onTabChange={onTabChange}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        profile={profile}
        activeExamsCount={activeExamsCount}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <TeacherDashboardHeader
          profile={profile}
          teacherLevel={teacherLevel}
          onSwitchTeacherLevel={onSwitchTeacherLevel}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onNavigateHome={onNavigateHome}
          onLogOut={onLogOut}
          onTabChange={onTabChange}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
