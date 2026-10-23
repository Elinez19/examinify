import * as React from "react"
import { useTeacherDashboard } from "@/hooks/teacher-dashboard/useTeacherDashboard"
import { TeacherDashboardLayout } from "@/components/teacher-dashboard/layout/TeacherDashboardLayout"
import { TeacherOverviewTab } from "@/components/teacher-dashboard/overview/TeacherOverviewTab"
import { TeacherStudentsTab } from "@/components/teacher-dashboard/students/TeacherStudentsTab"
import { TeacherSubjectsTab } from "@/components/teacher-dashboard/subjects/TeacherSubjectsTab"
import { TeacherExamsTab } from "@/components/teacher-dashboard/exams/TeacherExamsTab"
import { ExamBuilderForm } from "@/components/teacher-dashboard/assessments/ExamBuilderForm"
import { ClassRosterDrawer } from "@/components/teacher-dashboard/classes/ClassRosterDrawer"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, GraduationCap, ShieldCheck } from "lucide-react"
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
    profile,
    assignedClasses,
    subjects,
    selectedSubject,
    setSelectedSubject,
    builderDefaultSubject,
    students,
    exams,
    activeExamForBuilder,
    isCreatingExam,
    openExamBuilder,
    closeExamBuilder,
    saveFullExam,
    deleteExam,
    activeClassForRoster,
    closeClassRoster,
    openStudentDrawer,
  } = useTeacherDashboard({
    initialTab,
    initialLevel,
    onNavigateHome,
    onLogOut,
  })

  const [openAiModalInBuilder, setOpenAiModalInBuilder] = React.useState(false)

  const handleOpenAiCreation = () => {
    setOpenAiModalInBuilder(true)
    if (!isCreatingExam && !activeExamForBuilder) {
      openExamBuilder(null)
    }
  }

  return (
    <>
      <TeacherDashboardLayout
        currentTab={currentTab}
        onTabChange={(tab) => {
          setOpenAiModalInBuilder(false)
          closeExamBuilder()
          setCurrentTab(tab)
        }}
        profile={profile}
        activeExamsCount={exams.length}
        subjects={subjects}
        selectedSubject={selectedSubject}
        onSelectSubject={(subjName) => {
          setOpenAiModalInBuilder(false)
          closeExamBuilder()
          setSelectedSubject(subjName)
          setCurrentTab("subjects")
        }}
        onNavigateHome={onNavigateHome}
        onLogOut={onLogOut}
        onOpenAiCreation={handleOpenAiCreation}
      >
        {/* If in Exam Builder mode (Reference Images 1, 3, 4) */}
        {isCreatingExam || activeExamForBuilder ? (
          <ExamBuilderForm
            initialExam={activeExamForBuilder}
            assignedClasses={assignedClasses}
            defaultSubject={builderDefaultSubject}
            initialOpenAiModal={openAiModalInBuilder}
            onSaveExam={(saved) => {
              setOpenAiModalInBuilder(false)
              saveFullExam(saved)
            }}
            onCancel={() => {
              setOpenAiModalInBuilder(false)
              closeExamBuilder()
            }}
          />
        ) : (
          <>
            {/* Tab 1: Overview */}
            {currentTab === "overview" && (
              <TeacherOverviewTab
                profile={profile}
                assignedClasses={assignedClasses}
                exams={exams}
                subjects={subjects}
                onNavigateTab={setCurrentTab}
                onOpenExamBuilder={(ex) => openExamBuilder(ex)}
              />
            )}

            {/* Tab 2: Students (Paginated, filterable, sortable reusable table) */}
            {currentTab === "students" && (
              <TeacherStudentsTab
                students={students}
                assignedClasses={assignedClasses}
                onOpenStudentDrawer={openStudentDrawer}
              />
            )}

            {/* Tab 3: Subjects (Reference Image 2 course exams & empty states) */}
            {currentTab === "subjects" && (
              <TeacherSubjectsTab
                subjects={subjects}
                exams={exams}
                assignedClasses={assignedClasses}
                selectedSubject={selectedSubject}
                onSelectSubject={setSelectedSubject}
                onOpenExamBuilder={(ex, defSubj) => openExamBuilder(ex, defSubj)}
                onDeleteExam={deleteExam}
              />
            )}

            {/* Tab 4: Exams */}
            {currentTab === "exams" && (
              <TeacherExamsTab
                exams={exams}
                subjects={subjects}
                onOpenExamBuilder={(ex, defSubj) => openExamBuilder(ex, defSubj)}
                onDeleteExam={deleteExam}
              />
            )}

            {/* Settings & Profile Tab */}
            {(currentTab === "settings" || currentTab === "profile") && (
              <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-150">
                <div className="space-y-1">
                  <h1 className="text-2xl font-extrabold text-foreground">Teacher Profile & Settings</h1>
                  <p className="text-xs text-muted-foreground">
                    Your institutional educator profile and teaching assignments.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-black text-xl">
                      {profile.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{profile.fullName}</h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="pill" className="text-[10px] font-semibold text-primary">
                          {profile.title}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">{profile.staffId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border text-xs">
                    <div className="flex items-center gap-2.5 text-muted-foreground">
                      <Mail className="size-4 text-primary shrink-0" />
                      <span className="text-foreground">{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-muted-foreground">
                      <Phone className="size-4 text-primary shrink-0" />
                      <span className="text-foreground">{profile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-muted-foreground">
                      <GraduationCap className="size-4 text-primary shrink-0" />
                      <span className="text-foreground">{profile.department}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-muted-foreground">
                      <ShieldCheck className="size-4 text-primary shrink-0" />
                      <span className="text-foreground">{profile.schoolName}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <span className="text-xs font-bold text-foreground block mb-2">Qualifications & Specializations</span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.qualifications.map((q) => (
                        <Badge key={q} variant="secondary" className="text-[11px]">
                          {q}
                        </Badge>
                      ))}
                      {profile.specializations.map((s) => (
                        <Badge key={s} variant="outline" className="text-[11px] text-foreground">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </TeacherDashboardLayout>

      {/* Slide-over Class Roster Drawer */}
      <ClassRosterDrawer
        assignedClass={activeClassForRoster}
        onClose={closeClassRoster}
      />
    </>
  )
}
