import * as React from "react"
import type {
  DashboardTab,
  IStudentProfile,
  IUpcomingExam,
  IRecentExamResult,
  IClassAnnouncement,
  IDashboardMetric,
} from "../types/student"
import {
  MOCK_STUDENT_PROFILE,
  MOCK_UPCOMING_EXAMS,
  MOCK_RECENT_RESULTS,
  MOCK_ANNOUNCEMENTS,
  MOCK_METRICS,
} from "../services/mockStudentData"

interface UseStudentDashboardOptions {
  initialTab?: DashboardTab
  onStartExam?: (examId: string) => void
  onNavigateHome?: () => void
  onLogOut?: () => void
}

export function useStudentDashboard({
  initialTab = "overview",
  onStartExam,
  onNavigateHome,
  onLogOut,
}: UseStudentDashboardOptions = {}) {
  const [currentTab, setCurrentTab] = React.useState<DashboardTab>(initialTab)
  const [profile] = React.useState<IStudentProfile>(MOCK_STUDENT_PROFILE)
  const [upcomingExams] = React.useState<IUpcomingExam[]>(MOCK_UPCOMING_EXAMS)
  const [recentResults] = React.useState<IRecentExamResult[]>(MOCK_RECENT_RESULTS)
  const [announcements, setAnnouncements] = React.useState<IClassAnnouncement[]>(MOCK_ANNOUNCEMENTS)
  const [metrics] = React.useState<IDashboardMetric[]>(MOCK_METRICS)
  const [unreadNotificationsCount, setUnreadNotificationsCount] = React.useState(2)

  const markAllNotificationsRead = React.useCallback(() => {
    setUnreadNotificationsCount(0)
  }, [])

  const handleStartExam = React.useCallback(
    (examId: string) => {
      if (onStartExam) {
        onStartExam(examId)
      } else {
        window.location.hash = `cbt/${examId}`
      }
    },
    [onStartExam]
  )

  const handleLogOut = React.useCallback(() => {
    if (onLogOut) {
      onLogOut()
    } else if (onNavigateHome) {
      onNavigateHome()
    } else {
      window.location.hash = ""
      window.location.reload()
    }
  }, [onLogOut, onNavigateHome])

  const enrolledClass = profile.enrolledClass
  const classes = React.useMemo(() => [enrolledClass], [enrolledClass])

  const todayExams = React.useMemo(() => {
    return upcomingExams.filter(
      (e) => e.status === "open" || e.scheduledDate.toLowerCase().includes("today")
    )
  }, [upcomingExams])

  return {
    currentTab,
    setCurrentTab,
    profile,
    enrolledClass,
    classes,
    upcomingExams,
    todayExams,
    recentResults,
    announcements,
    setAnnouncements,
    metrics,
    unreadNotificationsCount,
    markAllNotificationsRead,
    handleStartExam,
    handleLogOut,
    onNavigateHome,
  }
}
