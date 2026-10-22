import * as React from "react"
import { useTeacherDashboard } from "@/hooks/teacher-dashboard/useTeacherDashboard"
import { TeacherDashboardLayout } from "@/components/teacher-dashboard/layout/TeacherDashboardLayout"
import { TeacherOverviewTab } from "@/components/teacher-dashboard/overview/TeacherOverviewTab"
import { ClassTeachersTab } from "@/components/teacher-dashboard/classes/ClassTeachersTab"
import { ClassRosterDrawer } from "@/components/teacher-dashboard/classes/ClassRosterDrawer"
import { TeacherAssessmentsTab } from "@/components/teacher-dashboard/assessments/TeacherAssessmentsTab"
import { ExamBuilderModal } from "@/components/teacher-dashboard/assessments/ExamBuilderModal"
import { TeacherGradebookTab } from "@/components/teacher-dashboard/gradebook/TeacherGradebookTab"
import { TeacherProfileTab } from "@/components/teacher-dashboard/profile/TeacherProfileTab"
import type { TeacherDashboardTab, TeacherSchoolLevel } from "@/types/teacher"

interface TeacherDashboardPageProps {
  initialTab?: TeacherDashboardTab
  initialLevel?: TeacherSchoolLevel
  onNavigateHome?: () => void
  onLogOut?: () => void
}

export function TeacherDashboardPage({
  initialTab = "overview",
  initialLevel = "secondary",
  onNavigateHome,
  onLogOut,
}: TeacherDashboardPageProps) {
  const {
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
    addNewExam,
    activeClassForRoster,
    openClassRoster,
    closeClassRoster,
  } = useTeacherDashboard({
    initialTab,
    initialLevel,
    onNavigateHome,
    onLogOut,
  })

  return (
    <>
      <TeacherDashboardLayout
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        profile={profile}
        teacherLevel={teacherLevel}
        onSwitchTeacherLevel={switchTeacherLevel}
        activeExamsCount={exams.length}
        onNavigateHome={onNavigateHome}
        onLogOut={onLogOut}
      >
        {/* Tab 1: Overview */}
        {currentTab === "overview" && (
          <TeacherOverviewTab
            profile={profile}
            assignedClasses={assignedClasses}
            exams={exams}
            timetable={timetable}
            onNavigateTab={setCurrentTab}
            onOpenExamBuilder={openExamBuilder}
          />
        )}

        {/* Tab 2: Class Teachers */}
        {currentTab === "classes" && (
          <ClassTeachersTab
            assignedClasses={assignedClasses}
            onOpenRoster={openClassRoster}
            onNavigateTab={setCurrentTab}
          />
        )}

        {/* Tab 3: CBT / Assessments */}
        {currentTab === "assessments" && (
          <TeacherAssessmentsTab
            exams={exams}
            assignedClasses={assignedClasses}
            defaultSubject={assignedClasses[0]?.subjectsTaught[0] || "Mathematics"}
            onOpenExamBuilder={openExamBuilder}
            onAddNewExam={addNewExam}
            onDeleteExam={deleteExam}
          />
        )}

        {/* Tab 4: Gradebook & Broadsheet */}
        {currentTab === "gradebook" && (
          <TeacherGradebookTab assignedClasses={assignedClasses} />
        )}

        {/* Tab 5: Profile & Timetable */}
        {currentTab === "profile" && (
          <TeacherProfileTab profile={profile} timetable={timetable} />
        )}
      </TeacherDashboardLayout>

      {/* Slide-over Class Roster Drawer */}
      <ClassRosterDrawer
        assignedClass={activeClassForRoster}
        onClose={closeClassRoster}
      />

      {/* Central Exam Question Builder Workspace Modal */}
      <ExamBuilderModal
        exam={activeExamForBuilder}
        onClose={closeExamBuilder}
        onSaveQuestions={saveExamQuestions}
      />
    </>
  )
}
