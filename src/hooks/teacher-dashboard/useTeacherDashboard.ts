import * as React from "react"
import type {
  TeacherDashboardTab,
  TeacherSchoolLevel,
  ITeacherProfile,
  ITeacherAssignedClass,
  ITeacherCbtExam,
  ITimetablePeriod,
  ITeacherSubject,
  IClassStudentRosterItem,
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
  MOCK_TEACHER_SUBJECTS,
  MOCK_ALL_SECONDARY_STUDENTS,
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
  const [subjects] = React.useState<ITeacherSubject[]>(MOCK_TEACHER_SUBJECTS)
  const [selectedSubject, setSelectedSubject] = React.useState<string | null>(null)
  const [builderDefaultSubject, setBuilderDefaultSubject] = React.useState<string>("English Language")

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

  const students: IClassStudentRosterItem[] = React.useMemo(() => {
    return MOCK_ALL_SECONDARY_STUDENTS
  }, [])

  const timetable: ITimetablePeriod[] = React.useMemo(() => {
    return teacherLevel === "secondary" ? MOCK_SECONDARY_TIMETABLE : MOCK_PRIMARY_TIMETABLE
  }, [teacherLevel])

  // Modals & Drawers state
  const [activeExamForBuilder, setActiveExamForBuilder] = React.useState<ITeacherCbtExam | null>(null)
  const [isCreatingExam, setIsCreatingExam] = React.useState<boolean>(false)
  const [activeClassForRoster, setActiveClassForRoster] = React.useState<ITeacherAssignedClass | null>(null)
  const [activeStudentForDrawer, setActiveStudentForDrawer] = React.useState<IClassStudentRosterItem | null>(null)

  // Switch demo teacher level
  const switchTeacherLevel = React.useCallback((level: TeacherSchoolLevel) => {
    setTeacherLevel(level)
    setActiveExamForBuilder(null)
    setIsCreatingExam(false)
    setActiveClassForRoster(null)
  }, [])

  // Exam Builder triggers
  const openExamBuilder = React.useCallback((exam?: ITeacherCbtExam | null, defaultSubj?: string) => {
    if (exam) {
      setActiveExamForBuilder(exam)
      setIsCreatingExam(false)
      setBuilderDefaultSubject(exam.subject)
    } else {
      setActiveExamForBuilder(null)
      setIsCreatingExam(true)
      setBuilderDefaultSubject(defaultSubj || selectedSubject || "English Language")
    }
  }, [selectedSubject])

  const closeExamBuilder = React.useCallback(() => {
    setActiveExamForBuilder(null)
    setIsCreatingExam(false)
  }, [])

  // Class Roster & Student Details triggers
  const openClassRoster = React.useCallback((cls: ITeacherAssignedClass) => {
    setActiveClassForRoster(cls)
  }, [])

  const closeClassRoster = React.useCallback(() => {
    setActiveClassForRoster(null)
  }, [])

  const openStudentDrawer = React.useCallback((student: IClassStudentRosterItem) => {
    setActiveStudentForDrawer(student)
    // Find matching class if available
    const cls = assignedClasses.find((c) => c.className === student.assignedClass)
    if (cls) {
      setActiveClassForRoster(cls)
    }
  }, [assignedClasses])

  // Save entire exam from builder
  const saveFullExam = React.useCallback(
    (examToSave: ITeacherCbtExam) => {
      const updater = (prev: ITeacherCbtExam[]) => {
        const exists = prev.some((e) => e.id === examToSave.id)
        if (exists) {
          return prev.map((e) => (e.id === examToSave.id ? examToSave : e))
        }
        return [examToSave, ...prev]
      }

      if (teacherLevel === "secondary") {
        setSecondaryExams(updater)
      } else {
        setPrimaryExams(updater)
      }
      setActiveExamForBuilder(null)
      setIsCreatingExam(false)
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
        setIsCreatingExam(false)
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
    subjects,
    selectedSubject,
    setSelectedSubject,
    builderDefaultSubject,
    students,
    exams,
    timetable,
    activeExamForBuilder,
    isCreatingExam,
    openExamBuilder,
    closeExamBuilder,
    saveFullExam,
    deleteExam,
    activeClassForRoster,
    openClassRoster,
    closeClassRoster,
    activeStudentForDrawer,
    openStudentDrawer,
    onNavigateHome,
    onLogOut,
  }
}
