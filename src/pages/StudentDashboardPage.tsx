import { useStudentDashboard } from "@/hooks/student-dashboard/useStudentDashboard"
import { DashboardLayout } from "@/components/student-dashboard/layout/DashboardLayout"
import { DashboardOverviewTab } from "@/components/student-dashboard/overview/DashboardOverviewTab"
import { SubjectListView } from "@/components/student-dashboard/subjects/SubjectListView"
import { ExamsScheduleView } from "@/components/student-dashboard/exams/ExamsScheduleView"
import { ProfileDetailsView } from "@/components/student-dashboard/profile/ProfileDetailsView"
import { ResultsAnalyticsView } from "@/components/student-dashboard/results/ResultsAnalyticsView"
import type { DashboardTab } from "@/types/student"

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
