import {
  MOCK_STUDENT_PROFILE,
  MOCK_CLASSES,
  MOCK_SUBJECTS,
  MOCK_UPCOMING_EXAMS,
  MOCK_RECENT_RESULTS,
  MOCK_ANNOUNCEMENTS,
  MOCK_METRICS,
} from "./mockStudentData"
import type {
  IStudentProfile,
  IClassCohort,
  ISubjectItem,
  IUpcomingExam,
  IRecentExamResult,
  IClassAnnouncement,
  IDashboardMetric,
} from "../types/student"

export class StudentDashboardService {
  public static async getStudentProfile(): Promise<IStudentProfile> {
    return Promise.resolve({ ...MOCK_STUDENT_PROFILE })
  }

  public static async getClasses(): Promise<IClassCohort[]> {
    return Promise.resolve([...MOCK_CLASSES])
  }

  public static async getSubjects(): Promise<ISubjectItem[]> {
    return Promise.resolve([...MOCK_SUBJECTS])
  }

  public static async getUpcomingExams(): Promise<IUpcomingExam[]> {
    return Promise.resolve([...MOCK_UPCOMING_EXAMS])
  }

  public static async getRecentResults(): Promise<IRecentExamResult[]> {
    return Promise.resolve([...MOCK_RECENT_RESULTS])
  }

  public static async getAnnouncements(): Promise<IClassAnnouncement[]> {
    return Promise.resolve([...MOCK_ANNOUNCEMENTS])
  }

  public static async getMetrics(): Promise<IDashboardMetric[]> {
    return Promise.resolve([...MOCK_METRICS])
  }
}
