import { useStudentDashboard } from "@/features/student-dashboard/hooks/useStudentDashboard"
import { DashboardLayout } from "@/features/student-dashboard/components/layout/DashboardLayout"
import { DashboardOverviewTab } from "@/features/student-dashboard/components/overview/DashboardOverviewTab"
import { SubjectListView } from "@/features/student-dashboard/components/subjects/SubjectListView"
import { ExamsScheduleView } from "@/features/student-dashboard/components/exams/ExamsScheduleView"
import { ProfileDetailsView } from "@/features/student-dashboard/components/profile/ProfileDetailsView"
import { ResultsAnalyticsView } from "@/features/student-dashboard/components/results/ResultsAnalyticsView"
import type { DashboardTab } from "@/features/student-dashboard/types/student"

interface StudentDashboardPageProps {
  initialTab?: DashboardTab
  onNavigateHome?: () => void
  onLogOut?: () => void
  onStartExam?: (examId: string) => void
}

export function StudentDashboardPage({
  initialTab = "overview",
  onNavigateHome,
  onLogOut,
  onStartExam,
}: StudentDashboardPageProps) {
  const {
    currentTab,
    setCurrentTab,
    profile,
    upcomingExams,
    todayExams,
    recentResults,
    announcements,
    metrics,
    unreadNotificationsCount,
    markAllNotificationsRead,
    handleStartExam,
    handleLogOut,
  } = useStudentDashboard({
    initialTab,
    onStartExam,
    onNavigateHome,
    onLogOut,
  })

  return (
    <DashboardLayout
      profile={profile}
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      unreadNotificationsCount={unreadNotificationsCount}
      onMarkNotificationsRead={markAllNotificationsRead}
      onNavigateHome={onNavigateHome}
      onLogOut={handleLogOut}
      enrolledSubjectsCount={profile.enrolledSubjectsCount}
      todayScheduledExamsCount={todayExams.length}
    >
      {currentTab === "overview" && (
        <DashboardOverviewTab
          profile={profile}
          metrics={metrics}
          upcomingExams={upcomingExams}
          recentResults={recentResults}
          announcements={announcements}
          onStartExam={handleStartExam}
          onNavigateTab={setCurrentTab}
        />
      )}

      {currentTab === "profile" && <ProfileDetailsView profile={profile} />}

      {currentTab === "subjects" && (
        <SubjectListView onStartExam={handleStartExam} />
      )}

      {currentTab === "exams" && (
        <ExamsScheduleView
          upcomingExams={upcomingExams}
          enrolledClass={profile.enrolledClass}
          onStartExam={handleStartExam}
        />
      )}

      {currentTab === "results" && (
        <ResultsAnalyticsView
          results={recentResults}
          readinessScore={profile.readinessScore}
        />
      )}
    </DashboardLayout>
  )
}
