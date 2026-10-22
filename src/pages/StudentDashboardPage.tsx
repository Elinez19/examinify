import { useStudentDashboard } from "@/features/student-dashboard/hooks/useStudentDashboard"
import { DashboardLayout } from "@/features/student-dashboard/components/layout/DashboardLayout"
import { DashboardOverviewTab } from "@/features/student-dashboard/components/overview/DashboardOverviewTab"
import { ClassListView } from "@/features/student-dashboard/components/classes/ClassListView"
import { SubjectListView } from "@/features/student-dashboard/components/subjects/SubjectListView"
import { ProfileDetailsView } from "@/features/student-dashboard/components/profile/ProfileDetailsView"
import { ResultsAnalyticsView } from "@/features/student-dashboard/components/results/ResultsAnalyticsView"
import type { DashboardTab } from "@/features/student-dashboard/types/student"

interface StudentDashboardPageProps {
  initialTab?: DashboardTab
  onNavigateHome?: () => void
  onStartExam?: (examId: string) => void
}

export function StudentDashboardPage({
  initialTab = "overview",
  onNavigateHome,
  onStartExam,
}: StudentDashboardPageProps) {
  const {
    currentTab,
    setCurrentTab,
    profile,
    classes,
    upcomingExams,
    recentResults,
    announcements,
    metrics,
    unreadNotificationsCount,
    markAllNotificationsRead,
    activeClass,
    handleStartExam,
  } = useStudentDashboard({
    initialTab,
    onStartExam,
    onNavigateHome,
  })

  return (
    <DashboardLayout
      profile={profile}
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      unreadNotificationsCount={unreadNotificationsCount}
      onMarkNotificationsRead={markAllNotificationsRead}
      onNavigateHome={onNavigateHome}
      onStartPracticeExam={() => handleStartExam("exm-jamb-mock-2")}
      enrolledClassesCount={classes.length}
      enrolledSubjectsCount={profile.enrolledSubjectsCount}
    >
      {currentTab === "overview" && (
        <DashboardOverviewTab
          profile={profile}
          metrics={metrics}
          upcomingExams={upcomingExams}
          recentResults={recentResults}
          primaryClass={activeClass || undefined}
          announcements={announcements}
          onStartExam={handleStartExam}
          onNavigateTab={setCurrentTab}
        />
      )}

      {currentTab === "classes" && (
        <ClassListView
          classes={classes}
          announcements={announcements}
        />
      )}

      {currentTab === "subjects" && <SubjectListView />}

      {currentTab === "profile" && <ProfileDetailsView profile={profile} />}

      {currentTab === "results" && (
        <ResultsAnalyticsView
          results={recentResults}
          readinessScore={profile.readinessScore}
        />
      )}
    </DashboardLayout>
  )
}
