import * as React from "react"
import { DashboardHeader } from "./DashboardHeader"
import { DashboardSidebar } from "./DashboardSidebar"
import type { IStudentProfile, DashboardTab } from "../../types/student"

interface DashboardLayoutProps {
  profile: IStudentProfile
  currentTab: DashboardTab
  onTabChange: (tab: DashboardTab) => void
  unreadNotificationsCount: number
  onMarkNotificationsRead: () => void
  onNavigateHome?: () => void
  onStartPracticeExam: () => void
  enrolledClassesCount: number
  enrolledSubjectsCount: number
  children: React.ReactNode
}

export function DashboardLayout({
  profile,
  currentTab,
  onTabChange,
  unreadNotificationsCount,
  onMarkNotificationsRead,
  onNavigateHome,
  onStartPracticeExam,
  enrolledClassesCount,
  enrolledSubjectsCount,
  children,
}: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-row">
      {/* Sidebar (Desktop + Mobile Drawer) */}
      <DashboardSidebar
        currentTab={currentTab}
        onTabChange={onTabChange}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onNavigateHome={onNavigateHome}
        onStartPracticeExam={onStartPracticeExam}
        enrolledClassesCount={enrolledClassesCount}
        enrolledSubjectsCount={enrolledSubjectsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          profile={profile}
          unreadNotificationsCount={unreadNotificationsCount}
          onMarkNotificationsRead={onMarkNotificationsRead}
          onNavigateHome={onNavigateHome}
          onTabChange={onTabChange}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
