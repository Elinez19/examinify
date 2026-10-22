export type DashboardTab =
  | "overview"
  | "classes"
  | "subjects"
  | "profile"
  | "results"

export type AcademicStanding = "Honor Roll" | "Good Standing" | "Needs Attention"

export type SubjectCategory = "Core" | "Elective" | "STEM" | "Humanities"

export interface IStudentGuardian {
  fullName: string
  relationship: string
  phone: string
  email: string
  address: string
}

export interface IStudentProfile {
  id: string
  registrationNumber: string
  fullName: string
  email: string
  phone: string
  avatarUrl?: string
  gradeLevel: string
  department: string
  institutionName: string
  institutionBranch?: string
  targetExamTrack: string
  targetExamYear: string
  readinessScore: number
  completedExamsCount: number
  enrolledSubjectsCount: number
  attendanceRate: number
  academicStanding: AcademicStanding
  enrolledDate: string
  guardian: IStudentGuardian
}

export interface IClassCohort {
  id: string
  name: string
  code: string
  gradeLevel: string
  term: string
  academicYear: string
  teacherName: string
  teacherEmail: string
  teacherTitle: string
  room: string
  totalStudents: number
  scheduleDays: string[]
  scheduleTime: string
  isPrimaryClass: boolean
  description: string
}

export interface ISubjectTopic {
  id: string
  title: string
  isCompleted: boolean
  difficulty: "Basic" | "Intermediate" | "Advanced"
  hours: number
}

export interface ISubjectItem {
  id: string
  code: string
  name: string
  category: SubjectCategory
  teacherName: string
  teacherEmail: string
  syllabusProgress: number
  completedTopicsCount: number
  totalTopicsCount: number
  currentGradePercentage: number
  currentGradeLetter: string
  nextAssessmentDate?: string
  topics: ISubjectTopic[]
}

export interface IUpcomingExam {
  id: string
  title: string
  subject: string
  examType: "Term Exam" | "National Mock CBT" | "Class Continuous Assessment" | "Promotional Test"
  scheduledDate: string
  durationMinutes: number
  totalQuestions: number
  passingScore: number
  status: "scheduled" | "open" | "completed"
}

export interface IRecentExamResult {
  id: string
  examTitle: string
  subject: string
  completedDate: string
  score: number
  maxScore: number
  percentage: number
  grade: string
  percentile: number
  passed: boolean
}

export interface IClassAnnouncement {
  id: string
  title: string
  senderName: string
  senderRole: string
  timestamp: string
  content: string
  priority: "normal" | "high" | "urgent"
  classId?: string
  subjectName?: string
}

export interface IDashboardMetric {
  id: string
  title: string
  value: string | number
  unit?: string
  trend: {
    direction: "up" | "down" | "neutral"
    text: string
  }
  description: string
  statusColor?: "primary" | "success" | "warning" | "info"
}
