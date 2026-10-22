export type TeacherSchoolLevel = "primary" | "secondary"

export type TeacherDashboardTab =
  | "overview"
  | "classes"
  | "assessments"
  | "gradebook"
  | "profile"

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
  attendanceRate: number                 // Percentage
  currentGrade: string                   // "A1", "B2", etc.
  totalScore: number                     // /100
  performanceStatus: "Excelling" | "Good Standing" | "Needs Attention"
  parentPhone: string
  parentEmail: string
}

export interface ICbtQuestionOption {
  id: "A" | "B" | "C" | "D"
  text: string
}

export interface ITeacherQuestion {
  id: string
  questionNumber: number
  prompt: string
  options: ICbtQuestionOption[]
  correctOptionId: "A" | "B" | "C" | "D"
  points: number
  explanation?: string
  difficulty?: "Basic" | "Intermediate" | "Advanced"
}

export type TeacherExamStatus = "draft" | "scheduled" | "live" | "completed"

export interface ITeacherCbtExam {
  id: string
  title: string
  subject: string
  targetClasses: string[]                // e.g. ["SS 1 Explorers", "SS 1 Pioneers"]
  totalQuestions: number
  readyQuestionsCount: number
  durationMinutes: number
  status: TeacherExamStatus
  scheduledDate: string
  passingScore: number
  questions: ITeacherQuestion[]
  submissionsCount?: number
  averageScore?: number
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
