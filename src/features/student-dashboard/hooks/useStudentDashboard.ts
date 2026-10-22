import * as React from "react"
import type {
  DashboardTab,
  IStudentProfile,
  IClassCohort,
  IUpcomingExam,
  IRecentExamResult,
  IClassAnnouncement,
  IDashboardMetric,
} from "../types/student"
import {
  MOCK_STUDENT_PROFILE,
  MOCK_CLASSES,
  MOCK_UPCOMING_EXAMS,
  MOCK_RECENT_RESULTS,
  MOCK_ANNOUNCEMENTS,
  MOCK_METRICS,
} from "../services/mockStudentData"

interface UseStudentDashboardOptions {
  initialTab?: DashboardTab
  onStartExam?: (examId: string) => void
  onNavigateHome?: () => void
}

export function useStudentDashboard({
  initialTab = "overview",
  onStartExam,
  onNavigateHome,
}: UseStudentDashboardOptions = {}) {
  const [currentTab, setCurrentTab] = React.useState<DashboardTab>(initialTab)
  const [profile] = React.useState<IStudentProfile>(MOCK_STUDENT_PROFILE)
  const [classes] = React.useState<IClassCohort[]>(MOCK_CLASSES)
  const [upcomingExams] = React.useState<IUpcomingExam[]>(MOCK_UPCOMING_EXAMS)
  const [recentResults] = React.useState<IRecentExamResult[]>(MOCK_RECENT_RESULTS)
  const [announcements, setAnnouncements] = React.useState<IClassAnnouncement[]>(MOCK_ANNOUNCEMENTS)
  const [metrics] = React.useState<IDashboardMetric[]>(MOCK_METRICS)
  const [unreadNotificationsCount, setUnreadNotificationsCount] = React.useState(3)
  const [selectedClassId, setSelectedClassId] = React.useState<string | null>(null)
  const [searchFilter, setSearchFilter] = React.useState("")

  const markAllNotificationsRead = React.useCallback(() => {
    setUnreadNotificationsCount(0)
  }, [])

  const handleStartExam = React.useCallback(
    (examId: string) => {
      if (onStartExam) {
        onStartExam(examId)
      } else {
        // Fallback default: navigate to practice simulator section
        window.location.hash = "simulator-section"
      }
    },
    [onStartExam]
  )

  const activeClass = React.useMemo(() => {
    if (!selectedClassId) return classes[0] || null
    return classes.find((c) => c.id === selectedClassId) || classes[0]
  }, [classes, selectedClassId])

  return {
    currentTab,
    setCurrentTab,
    profile,
    classes,
    upcomingExams,
    recentResults,
    announcements,
    setAnnouncements,
    metrics,
    unreadNotificationsCount,
    markAllNotificationsRead,
    selectedClassId,
    setSelectedClassId,
    activeClass,
    searchFilter,
    setSearchFilter,
    handleStartExam,
    onNavigateHome,
  }
}
