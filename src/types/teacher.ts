export type TeacherSchoolLevel = "primary" | "secondary"

export type TeacherDashboardTab =
  | "overview"
  | "students"
  | "subjects"
  | "exams"
  | "classes"
  | "assessments"
  | "gradebook"
  | "profile"
  | "settings"

export interface ITeacherProfile {
  id: string
  staffId: string
  fullName: string
  email: string
  phone: string
  avatarUrl?: string
  title: string
  schoolLevel: TeacherSchoolLevel
  schoolName: string
  branchName: string                     // e.g. "Guzape Campus, Abuja" or "Wuse II Campus, Abuja"
  department: string
  assignedClassRole?: string             // e.g. "Form Master: SS 1 Explorers" or "Class Teacher: Grade 4 Diamond"
  qualifications: string[]
  specializations: string[]
  totalStudentsTaught: number
  totalWeeklyPeriods: number
}

export interface ITeacherSubject {
  id: string
  name: string                           // e.g. "English Language" or "Mathematics" (natural name, no codes)
  department: string
  assignedClasses: string[]              // e.g. ["SS 1 Explorers", "SS 1 Pioneers"]
  totalStudents: number
  publishedExamsCount: number
  draftExamsCount: number
}

export interface ITeacherAssignedClass {
  id: string
  className: string                      // e.g. "SS 1 Explorers" or "Grade 4 Diamond"
  schoolLevel: TeacherSchoolLevel
  subjectsTaught: string[]               // e.g. ["Mathematics"] or ["Mathematics", "English", ...]
  isAllClassSubjects: boolean            // true for Primary school self-contained classes
  studentCount: number
  room: string
  scheduleText: string
  averagePerformance: number             // e.g. 74.5%
}

export interface IClassStudentRosterItem {
  id: string
  registrationNumber: string
  fullName: string
  gender: "Male" | "Female"
  assignedClass?: string                 // e.g. "SS 1 Explorers"
  attendanceRate: number                 // Percentage
  currentGrade: string                   // "A1", "B2", etc.
  totalScore: number                     // /100
  performanceStatus: "Excelling" | "Good Standing" | "Needs Attention"
  parentPhone: string
  parentEmail: string
}

export type AssessmentType = "CA1" | "CA2" | "CA3" | "CA4" | "Exam"

export interface IAdminSchoolConfig {
  sessions: string[]
  activeSession: string
  terms: string[]
  activeTerm: string
  assessmentTypes: {
    id: AssessmentType
    label: string
    defaultMaxScore: number
  }[]
}

export type TeacherQuestionType = "theory" | "mcq" | "fill-blanks"

export interface IQuestionRubricCriterion {
  id: string
  criterion: string
  weight: number                         // e.g. 0.4, 0.3, 0.3 (summing to 1.00)
}

export interface ICbtQuestionOption {
  id: "A" | "B" | "C" | "D" | string
  text: string
}

export interface ITeacherQuestion {
  id: string
  questionNumber: number
  type?: TeacherQuestionType             // "theory" | "mcq" | "fill-blanks"
  prompt: string
  imageUrl?: string                      // Diagram/Illustration for STEM/Arts
  imageCaption?: string                  // e.g. "Fig 1.1: Structure of the mammalian heart"
  // For MCQ
  options?: ICbtQuestionOption[]
  correctOptionId?: "A" | "B" | "C" | "D" | string
  // For Theory
  theoryAnswer?: string
  rubrics?: IQuestionRubricCriterion[]
  // For Fill the Blanks
  shortAnswer?: string
  points: number
  explanation?: string
  difficulty?: "Basic" | "Intermediate" | "Advanced"
}

export type TeacherExamStatus = "draft" | "scheduled" | "live" | "completed" | "published"

export interface ITeacherCbtExam {
  id: string
  title: string
  subject: string
  assessmentType?: AssessmentType        // "CA1" | "CA2" | "CA3" | "CA4" | "Exam"
  academicSession?: string               // e.g. "2025/2026"
  term?: string                          // e.g. "2nd Term"
  instructions?: string                  // Candidate instructions
  targetClasses: string[]                // e.g. ["SS 1 Explorers", "SS 1 Pioneers"]
  totalQuestions: number
  readyQuestionsCount: number
  durationMinutes: number
  status: TeacherExamStatus
  scheduledDate: string
  startTime?: string
  endTime?: string
  passingScore: number
  questions: ITeacherQuestion[]
  allowCalculator?: boolean
  shuffleQuestions?: boolean
  shuffleOptions?: boolean
  proctoringAlerts?: boolean
  accessPin?: string
  submissionsCount?: number
  averageScore?: number

  // Exam Settings & Controls
  autoPublishResults?: boolean
  showStudentFeedback?: boolean
  showCorrectAnswers?: boolean
  allowRemarkRequests?: boolean
  remarkRequestWindowDays?: number
  maxTabSwitches?: number
  allowBackwardNavigation?: boolean
  randomizeOptions?: boolean
  enableLiveMonitoring?: boolean
  enableQuestionBank?: boolean
}

export interface IGradebookRecord {
  studentId: string
  studentName: string
  registrationNumber: string
  assignmentScore: number               // /10
  quizScore: number                     // /10
  midTermScore: number                  // /20
  totalCaScore: number                  // /40 (Computed)
  terminalExamScore: number             // /60
  grandTotal: number                    // /100 (Computed)
  gradeLetter: string                   // WAEC: A1, B2, B3, C4, C5, C6, D7, E8, F9
  remarks: string                       // Excellent, Very Good, Credit, Fail, etc.
  isAtRisk: boolean                     // Highlighted in red
}

export interface ITimetablePeriod {
  id: string
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"
  periodNumber: number
  timeSlot: string                      // e.g. "08:30 - 09:15 AM"
  subjectName: string
  className: string
  room: string
  isToday: boolean
  isCurrent: boolean
}
