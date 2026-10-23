import * as React from "react"
import { TeacherDashboardSidebar } from "./TeacherDashboardSidebar"
import { TeacherDashboardHeader } from "./TeacherDashboardHeader"
import type { TeacherDashboardTab, ITeacherProfile, ITeacherSubject } from "@/types/teacher"
import { MOCK_TEACHER_SUBJECTS } from "@/services/teacher-dashboard/mockTeacherData"

interface TeacherDashboardLayoutProps {
  currentTab: TeacherDashboardTab
  onTabChange: (tab: TeacherDashboardTab) => void
  profile: ITeacherProfile
  activeExamsCount?: number
  subjects?: ITeacherSubject[]
  selectedSubject?: string | null
  onSelectSubject?: (subjectName: string) => void
  onNavigateHome?: () => void
  onLogOut?: () => void
  onOpenAiCreation?: () => void
  children: React.ReactNode
}

export function TeacherDashboardLayout({
  currentTab,
  onTabChange,
  profile,
  activeExamsCount = 0,
  subjects = MOCK_TEACHER_SUBJECTS,
  selectedSubject,
  onSelectSubject,
  onNavigateHome,
  onLogOut,
  onOpenAiCreation,
  children,
}: TeacherDashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground antialiased flex flex-col">
      {/* Top Universal Header */}
      <TeacherDashboardHeader
        profile={profile}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        onNavigateHome={onNavigateHome}
        onLogOut={onLogOut}
        onTabChange={onTabChange}
        onOpenAiCreation={onOpenAiCreation}
      />

      <div className="flex flex-1 min-w-0">
        {/* Minimalist 4-Item Sidebar */}
        <TeacherDashboardSidebar
          currentTab={currentTab}
          onTabChange={onTabChange}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          profile={profile}
          activeExamsCount={activeExamsCount}
          subjects={subjects}
          selectedSubject={selectedSubject}
          onSelectSubject={onSelectSubject}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
