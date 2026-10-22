import * as React from "react"
import type {
  TeacherDashboardTab,
  TeacherSchoolLevel,
  ITeacherProfile,
  ITeacherAssignedClass,
  ITeacherCbtExam,
  ITimetablePeriod,
  ITeacherQuestion,
} from "@/types/teacher"
import {
  MOCK_SECONDARY_TEACHER,
  MOCK_SECONDARY_CLASSES,
  MOCK_SECONDARY_EXAMS,
  MOCK_SECONDARY_TIMETABLE,
  MOCK_PRIMARY_TEACHER,
  MOCK_PRIMARY_CLASSES,
  MOCK_PRIMARY_EXAMS,
  MOCK_PRIMARY_TIMETABLE,
} from "@/services/teacher-dashboard/mockTeacherData"

interface UseTeacherDashboardOptions {
  initialTab?: TeacherDashboardTab
  initialLevel?: TeacherSchoolLevel
  onNavigateHome?: () => void
  onLogOut?: () => void
}

export function useTeacherDashboard({
  initialTab = "overview",
  initialLevel = "secondary",
  onNavigateHome,
  onLogOut,
}: UseTeacherDashboardOptions = {}) {
  const [currentTab, setCurrentTab] = React.useState<TeacherDashboardTab>(initialTab)
  const [teacherLevel, setTeacherLevel] = React.useState<TeacherSchoolLevel>(initialLevel)

  // Datasets according to selected teacher level
  const [secondaryExams, setSecondaryExams] = React.useState<ITeacherCbtExam[]>(MOCK_SECONDARY_EXAMS)
  const [primaryExams, setPrimaryExams] = React.useState<ITeacherCbtExam[]>(MOCK_PRIMARY_EXAMS)

  // Current active teacher profile & classes
  const profile: ITeacherProfile = React.useMemo(() => {
    return teacherLevel === "secondary" ? MOCK_SECONDARY_TEACHER : MOCK_PRIMARY_TEACHER
  }, [teacherLevel])

  const assignedClasses: ITeacherAssignedClass[] = React.useMemo(() => {
    return teacherLevel === "secondary" ? MOCK_SECONDARY_CLASSES : MOCK_PRIMARY_CLASSES
  }, [teacherLevel])

  const exams: ITeacherCbtExam[] = React.useMemo(() => {
    return teacherLevel === "secondary" ? secondaryExams : primaryExams
  }, [teacherLevel, secondaryExams, primaryExams])

  const timetable: ITimetablePeriod[] = React.useMemo(() => {
    return teacherLevel === "secondary" ? MOCK_SECONDARY_TIMETABLE : MOCK_PRIMARY_TIMETABLE
  }, [teacherLevel])

  // Modals & Drawers state
  const [activeExamForBuilder, setActiveExamForBuilder] = React.useState<ITeacherCbtExam | null>(null)
  const [activeClassForRoster, setActiveClassForRoster] = React.useState<ITeacherAssignedClass | null>(null)
  const [isCreateExamOpen, setIsCreateExamOpen] = React.useState(false)

  // Switch demo teacher level
  const switchTeacherLevel = React.useCallback((level: TeacherSchoolLevel) => {
    setTeacherLevel(level)
    setActiveExamForBuilder(null)
    setActiveClassForRoster(null)
  }, [])

  // Exam Builder triggers
  const openExamBuilder = React.useCallback((exam: ITeacherCbtExam) => {
    setActiveExamForBuilder(exam)
  }, [])

  const closeExamBuilder = React.useCallback(() => {
    setActiveExamForBuilder(null)
  }, [])

  // Class Roster triggers
  const openClassRoster = React.useCallback((cls: ITeacherAssignedClass) => {
    setActiveClassForRoster(cls)
  }, [])

  const closeClassRoster = React.useCallback(() => {
    setActiveClassForRoster(null)
  }, [])

  // Save updated questions from Exam Builder back to state
  const saveExamQuestions = React.useCallback(
    (examId: string, updatedQuestions: ITeacherQuestion[]) => {
      const updater = (prev: ITeacherCbtExam[]) =>
        prev.map((e) => {
          if (e.id === examId) {
            return {
              ...e,
              questions: updatedQuestions,
              readyQuestionsCount: updatedQuestions.length,
            }
          }
          return e
        })

      if (teacherLevel === "secondary") {
        setSecondaryExams(updater)
      } else {
        setPrimaryExams(updater)
      }

      // Also update currently active exam object
      setActiveExamForBuilder((prev) =>
        prev && prev.id === examId
          ? {
              ...prev,
              questions: updatedQuestions,
              readyQuestionsCount: updatedQuestions.length,
            }
          : prev
      )
    },
    [teacherLevel]
  )

  // Add newly created exam
  const addNewExam = React.useCallback(
    (newExam: ITeacherCbtExam) => {
      if (teacherLevel === "secondary") {
        setSecondaryExams((prev) => [newExam, ...prev])
      } else {
        setPrimaryExams((prev) => [newExam, ...prev])
      }
      setIsCreateExamOpen(false)
      // Automatically open exam builder for this new exam
      setActiveExamForBuilder(newExam)
    },
    [teacherLevel]
  )

  // Delete an exam
  const deleteExam = React.useCallback(
    (examId: string) => {
      const filter = (prev: ITeacherCbtExam[]) => prev.filter((e) => e.id !== examId)
      if (teacherLevel === "secondary") {
        setSecondaryExams(filter)
      } else {
        setPrimaryExams(filter)
      }
      if (activeExamForBuilder?.id === examId) {
        setActiveExamForBuilder(null)
      }
    },
    [teacherLevel, activeExamForBuilder]
  )

  return {
    currentTab,
    setCurrentTab,
    teacherLevel,
    switchTeacherLevel,
    profile,
    assignedClasses,
    exams,
    timetable,
    activeExamForBuilder,
    openExamBuilder,
    closeExamBuilder,
    saveExamQuestions,
    deleteExam,
    isCreateExamOpen,
    setIsCreateExamOpen,
    addNewExam,
    activeClassForRoster,
    openClassRoster,
    closeClassRoster,
    onNavigateHome,
    onLogOut,
  }
}
