export type QuestionType =
  | "objective"
  | "multi_select"
  | "fill_blank"
  | "theory"
  | "mcq"
  | "true_false"
  | "short_answer";

export interface QuestionOption {
  id: string;
  label: string;
  text?: string;
}

export interface QuestionItem {
  id: string;
  subjectCode: string;
  subjectTitle: string;
  topic: string;
  classLevel: string;
  term: string;
  type: QuestionType;
  difficulty: "Easy" | "Standard" | "Challenge";
  marks: number;
  prompt: string;
  stem?: string;
  passage?: string;
  diagramLabel?: string;
  options?: QuestionOption[];
  correctOptionId?: string;
  correctAnswer?: string;
  correctOptionIds?: string[];
  acceptedAnswers?: string[];
  markingGuide?: string;
  explanation?: string;
  createdBy: string;
  updatedAt: string;
}

export interface PortalExam {
  id: string;
  title: string;
  subjectCode: string;
  code?: string;
  subjectTitle: string;
  subjectName?: string;
  classLevel: string;
  term: string;
  teacherName: string;
  scheduledFor: string;
  venue?: string;
  durationMinutes: number;
  totalMarks: number;
  status: "live" | "scheduled" | "completed" | "draft" | "practice";
  roomCode: string;
  passCode?: string;
  accessPin?: string;
  proctoringEnabled?: boolean;
  shuffleQuestions?: boolean;
  allowCalculator?: boolean;
  instantResult?: boolean;
  instructions: string | string[];
  questionIds: string[];
}

export interface TheoryScoreEntry {
  score: number;
  maxScore: number;
  comment: string;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  examTitle: string;
  subjectCode: string;
  subjectName?: string;
  classLevel?: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  studentRegNo?: string;
  receiptCode?: string;
  submittedAt: string;
  timeSpentMinutes: number;
  timeSpentSeconds?: number;
  answers: Record<string, string | string[]>;
  objectiveEarned: number;
  objectiveTotal: number;
  theoryEarned: number;
  theoryTotal: number;
  objectiveScore?: number;
  objectiveMax?: number;
  theoryScore?: number;
  theoryMax?: number;
  totalScore?: number;
  totalMax?: number;
  percentage?: number;
  grade?: string;
  syncStatus?: "synced" | "local_pending" | "queued_offline";
  tabSwitchCount?: number;
  theoryScores: Record<string, TheoryScoreEntry>;
  theoryScoresByQuestion?: Record<string, TheoryScoreEntry>;
  gradingStatus: "auto_graded" | "needs_theory_review" | "published";
  overallFeedback?: string;
  tabSwitches: number;
  appealStatus?: "none" | "pending" | "resolved";
  appealReason?: string;
}

export interface LiveCandidateState {
  id: string;
  examId: string;
  studentName: string;
  admissionNo: string;
  seatLabel: string;
  progressPercent: number;
  answeredCount: number;
  totalQuestions: number;
  timeRemainingMinutes: number;
  status: "active" | "flagged" | "offline" | "submitted";
  lastHeartbeat: string;
  tabSwitchCount: number;
}

export interface RoomBroadcast {
  id: string;
  examId: string;
  senderName: string;
  message: string;
  sentAt: string;
  urgency: "info" | "warning";
}

export type AccountStatus = "active" | "inactive" | "pending";

export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  admissionNo: string;
  regNo?: string;
  classLevel: string;
  classArmId: string;
  wing: string;
  termLabel: string;
  schoolName: string;
  avatarUrl?: string;
  password: string;
  status: AccountStatus;
}

export interface TeacherProfile {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  staffId: string;
  department: string;
  assignedClasses: string[];
  assignedSubjectIds: string[];
  termLabel: string;
  schoolName: string;
  avatarUrl?: string;
  password: string;
  status: AccountStatus;
}

export interface StaffProfile {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  roleTitle: string;
  adminScope: "super_admin" | "kyc_moderator" | "dispatch_support";
  permissions: string;
  avatarUrl?: string;
  password: string;
  status: AccountStatus;
  lastActive: string;
}

export interface SubjectEnrollment {
  id: string;
  code: string;
  title: string;
  category: string;
  teacherName: string;
  assignedClasses: string[];
  assignedTeacherIds: string[];
  nextExamAt: string;
  topicsCovered: number;
  totalTopics: number;
  questionCount: number;
  passRate: number;
  status: "active" | "archived";
}

export interface AcademicSessionTerm {
  id: string;
  session: string;
  term: "First Term" | "Second Term" | "Third Term";
  isActive: boolean;
  startsAt: string;
  endsAt: string;
}

export interface ClassArm {
  id: string;
  name: string;
  level: string;
  arm: string;
  classTeacherId: string;
  capacity: number;
  status: "active" | "archived";
}

export interface QuestionTypeConfig {
  id: string;
  code: QuestionType;
  label: string;
  description: string;
  autoGradable: boolean;
  enabled: boolean;
}

export interface StudentAccessibilityPrefs {
  fontScale: "normal" | "large";
  fontSize?: "standard" | "large" | "xlarge";
  highContrast: boolean;
  highContrastOptions?: boolean;
  showKeyboardHints?: boolean;
  extraTimeMode: boolean;
}

export interface PortalStoreData {
  student: StudentProfile;
  teacher: TeacherProfile;
  students: StudentProfile[];
  teachers: TeacherProfile[];
  staff: StaffProfile[];
  academicTerms: AcademicSessionTerm[];
  classArms: ClassArm[];
  questionTypes: QuestionTypeConfig[];
  subjects: SubjectEnrollment[];
  questions: QuestionItem[];
  exams: PortalExam[];
  submissions: ExamSubmission[];
  liveCandidates: LiveCandidateState[];
  broadcasts: RoomBroadcast[];
  accessibility: StudentAccessibilityPrefs;
}

export const INITIAL_STUDENT: StudentProfile = {
  id: "stu_amina",
  firstName: "Amina",
  lastName: "Bello",
  name: "Amina Bello",
  email: "amina.bello@students.examinify.ng",
  phone: "+234 809 332 1104",
  admissionNo: "EXM/2026/JSS3/041",
  classLevel: "JSS 3A",
  classArmId: "arm_jss3a",
  wing: "Science Wing",
  termLabel: "First Term · 2026/2027",
  schoolName: "Greenfield Model Academy",
  avatarUrl: "avatar-1",
  password: "Student@2026",
  status: "active",
};

export const INITIAL_STUDENTS: StudentProfile[] = [
  INITIAL_STUDENT,
  {
    id: "stu_tolu",
    firstName: "Toluwalase",
    lastName: "Adeyemi",
    name: "Toluwalase Adeyemi",
    email: "tolu.adeyemi@students.examinify.ng",
    phone: "+234 803 741 9920",
    admissionNo: "EXM/2026/JSS3/018",
    classLevel: "JSS 3A",
    classArmId: "arm_jss3a",
    wing: "Science Wing",
    termLabel: "First Term · 2026/2027",
    schoolName: "Greenfield Model Academy",
    avatarUrl: "avatar-2",
    password: "Student@2026",
    status: "active",
  },
  {
    id: "stu_chidinma",
    firstName: "Chidinma",
    lastName: "Nwosu",
    name: "Chidinma Nwosu",
    email: "chidinma.nwosu@students.examinify.ng",
    phone: "+234 812 509 4418",
    admissionNo: "EXM/2026/JSS3/022",
    classLevel: "JSS 3B",
    classArmId: "arm_jss3b",
    wing: "Arts & Commercial",
    termLabel: "First Term · 2026/2027",
    schoolName: "Greenfield Model Academy",
    avatarUrl: "avatar-4",
    password: "Student@2026",
    status: "active",
  },
  {
    id: "stu_ibrahim",
    firstName: "Ibrahim",
    lastName: "Danjuma",
    name: "Ibrahim Danjuma",
    email: "ibrahim.danjuma@students.examinify.ng",
    phone: "+234 805 612 8830",
    admissionNo: "EXM/2026/SSS1/009",
    classLevel: "SSS 1A",
    classArmId: "arm_sss1a",
    wing: "Science Wing",
    termLabel: "First Term · 2026/2027",
    schoolName: "Greenfield Model Academy",
    avatarUrl: "avatar-3",
    password: "Student@2026",
    status: "inactive",
  },
];

export const INITIAL_TEACHER: TeacherProfile = {
  id: "tch_emeka",
  firstName: "Emeka",
  lastName: "Okafor",
  name: "Mr. Emeka Okafor",
  email: "emeka.okafor@teachers.examinify.ng",
  phone: "+234 803 884 2109",
  staffId: "STF/SCI/019",
  department: "Mathematics & Basic Sciences",
  assignedClasses: ["JSS 3A", "JSS 3B", "SSS 1A"],
  assignedSubjectIds: ["sub_math", "sub_basic_sci"],
  termLabel: "First Term · 2026/2027",
  schoolName: "Greenfield Model Academy",
  avatarUrl: "avatar-5",
  password: "Teacher@2026",
  status: "active",
};

export const INITIAL_TEACHERS: TeacherProfile[] = [
  INITIAL_TEACHER,
  {
    id: "tch_aisha",
    firstName: "Aisha",
    lastName: "Kareem",
    name: "Mrs. Aisha Kareem",
    email: "aisha.kareem@teachers.examinify.ng",
    phone: "+234 806 219 4501",
    staffId: "STF/ENG/014",
    department: "English & Literature",
    assignedClasses: ["JSS 3A", "JSS 3B"],
    assignedSubjectIds: ["sub_eng"],
    termLabel: "First Term · 2026/2027",
    schoolName: "Greenfield Model Academy",
    avatarUrl: "avatar-4",
    password: "Teacher@2026",
    status: "active",
  },
  {
    id: "tch_babajide",
    firstName: "Babajide",
    lastName: "Lawal",
    name: "Mr. Babajide Lawal",
    email: "babajide.lawal@teachers.examinify.ng",
    phone: "+234 814 900 3312",
    staffId: "STF/CIV/027",
    department: "Humanities & Social Studies",
    assignedClasses: ["JSS 3A", "SSS 1A"],
    assignedSubjectIds: ["sub_civic"],
    termLabel: "First Term · 2026/2027",
    schoolName: "Greenfield Model Academy",
    avatarUrl: "avatar-2",
    password: "Teacher@2026",
    status: "active",
  },
];

export const INITIAL_STAFF: StaffProfile[] = [
  {
    id: "adm_1",
    firstName: "Elijah",
    lastName: "Admin",
    name: "Elijah Admin",
    email: "admin@examinify.ng",
    phone: "+234 803 550 1920",
    roleTitle: "Super Administrator",
    adminScope: "super_admin",
    permissions: "Full access: Academic setup, Users, Exams, PINs & Proctoring",
    avatarUrl: "avatar-1",
    password: "Admin@2026",
    status: "active",
    lastActive: "Online now",
  },
  {
    id: "adm_2",
    firstName: "Funke",
    lastName: "Oladipo",
    name: "Funke Oladipo",
    email: "exams-officer@examinify.ng",
    phone: "+234 812 400 8821",
    roleTitle: "Chief Examinations Officer",
    adminScope: "kyc_moderator",
    permissions: "Exam scheduling, PIN generation, question bank audit & appeals",
    avatarUrl: "avatar-2",
    password: "Admin@2026",
    status: "active",
    lastActive: "18 mins ago",
  },
  {
    id: "adm_3",
    firstName: "Sadiq",
    lastName: "Abdullahi",
    name: "Sadiq Abdullahi",
    email: "cbt-support@examinify.ng",
    phone: "+234 805 700 9912",
    roleTitle: "CBT Proctoring Lead",
    adminScope: "dispatch_support",
    permissions: "Live exam session oversight, offline sync & candidate timing",
    avatarUrl: "avatar-5",
    password: "Admin@2026",
    status: "active",
    lastActive: "1 hour ago",
  },
];

export const INITIAL_ACADEMIC_TERMS: AcademicSessionTerm[] = [
  {
    id: "term_26_1",
    session: "2026/2027",
    term: "First Term",
    isActive: true,
    startsAt: "Sep 08, 2026",
    endsAt: "Dec 18, 2026",
  },
  {
    id: "term_26_2",
    session: "2026/2027",
    term: "Second Term",
    isActive: false,
    startsAt: "Jan 11, 2027",
    endsAt: "Apr 02, 2027",
  },
  {
    id: "term_25_3",
    session: "2025/2026",
    term: "Third Term",
    isActive: false,
    startsAt: "Apr 27, 2026",
    endsAt: "Jul 24, 2026",
  },
];

export const INITIAL_CLASS_ARMS: ClassArm[] = [
  {
    id: "arm_jss3a",
    name: "JSS 3A",
    level: "JSS 3",
    arm: "Science Wing",
    classTeacherId: "tch_emeka",
    capacity: 40,
    status: "active",
  },
  {
    id: "arm_jss3b",
    name: "JSS 3B",
    level: "JSS 3",
    arm: "Arts & Commercial",
    classTeacherId: "tch_aisha",
    capacity: 40,
    status: "active",
  },
  {
    id: "arm_sss1a",
    name: "SSS 1A",
    level: "SSS 1",
    arm: "Science Wing",
    classTeacherId: "tch_babajide",
    capacity: 35,
    status: "active",
  },
];

export const INITIAL_QUESTION_TYPES: QuestionTypeConfig[] = [
  {
    id: "qt_obj",
    code: "objective",
    label: "Multiple Choice (Objective)",
    description: "Single best answer from options A–D, auto-graded immediately.",
    autoGradable: true,
    enabled: true,
  },
  {
    id: "qt_multi",
    code: "multi_select",
    label: "Multi-Select Checkbox",
    description: "Candidates select all correct choices, auto-graded.",
    autoGradable: true,
    enabled: true,
  },
  {
    id: "qt_fill",
    code: "fill_blank",
    label: "Fill-in-the-Blank",
    description: "Short typed value matched against accepted answers.",
    autoGradable: true,
    enabled: true,
  },
  {
    id: "qt_theory",
    code: "theory",
    label: "Theory / Structured Essay",
    description: "Long-form written response graded via marking rubric.",
    autoGradable: false,
    enabled: true,
  },
];

export const INITIAL_SUBJECTS: SubjectEnrollment[] = [
  {
    id: "sub_math",
    code: "MTH-301",
    title: "Mathematics",
    category: "Core Quantitative",
    teacherName: "Mr. Emeka Okafor",
    assignedClasses: ["JSS 3A", "JSS 3B"],
    assignedTeacherIds: ["tch_emeka"],
    nextExamAt: "Live Now · Ends 11:30 AM",
    topicsCovered: 9,
    totalTopics: 10,
    questionCount: 48,
    passRate: 84,
    status: "active",
  },
  {
    id: "sub_eng",
    code: "ENG-302",
    title: "English Language",
    category: "Core Language Arts",
    teacherName: "Mrs. Aisha Kareem",
    assignedClasses: ["JSS 3A", "JSS 3B"],
    assignedTeacherIds: ["tch_aisha"],
    nextExamAt: "Tomorrow · 09:00 AM",
    topicsCovered: 8,
    totalTopics: 10,
    questionCount: 36,
    passRate: 88,
    status: "active",
  },
  {
    id: "sub_basic_sci",
    code: "BSC-304",
    title: "Basic Science",
    category: "Integrated STEM",
    teacherName: "Mr. Emeka Okafor",
    assignedClasses: ["JSS 3A", "SSS 1A"],
    assignedTeacherIds: ["tch_emeka"],
    nextExamAt: "Thu, Nov 19 · 10:30 AM",
    topicsCovered: 7,
    totalTopics: 9,
    questionCount: 42,
    passRate: 79,
    status: "active",
  },
  {
    id: "sub_civic",
    code: "CIV-305",
    title: "Civic Education",
    category: "Humanities",
    teacherName: "Mr. Babajide Lawal",
    assignedClasses: ["JSS 3A", "SSS 1A"],
    assignedTeacherIds: ["tch_babajide"],
    nextExamAt: "Completed · Grade Published",
    topicsCovered: 8,
    totalTopics: 8,
    questionCount: 30,
    passRate: 92,
    status: "active",
  },
];

export const INITIAL_QUESTIONS: QuestionItem[] = [
  {
    id: "q_mth_1",
    subjectCode: "MTH-301",
    subjectTitle: "Mathematics",
    topic: "Linear Equations & Transposition",
    classLevel: "JSS 3A",
    term: "First Term",
    type: "objective",
    difficulty: "Easy",
    marks: 2,
    prompt: "Solve for x if 3x - 7 = 14.",
    options: [
      { id: "a", label: "5" },
      { id: "b", label: "7" },
      { id: "c", label: "9" },
      { id: "d", label: "21" },
    ],
    correctOptionId: "b",
    explanation: "Add 7 to both sides to get 3x = 21, then divide by 3 to get x = 7.",
    createdBy: "Mr. Emeka Okafor",
    updatedAt: "Nov 10, 2026",
  },
  {
    id: "q_mth_2",
    subjectCode: "MTH-301",
    subjectTitle: "Mathematics",
    topic: "Geometry & Angle Properties",
    classLevel: "JSS 3A",
    term: "First Term",
    type: "multi_select",
    difficulty: "Standard",
    marks: 3,
    prompt: "Select ALL true properties of an isosceles triangle.",
    options: [
      { id: "a", label: "At least two sides have equal length" },
      { id: "b", label: "Base angles opposite the equal sides are equal" },
      { id: "c", label: "All interior angles must equal 60°" },
      { id: "d", label: "The interior angles sum up to 180°" },
    ],
    correctOptionIds: ["a", "b", "d"],
    explanation: "An equilateral triangle has all angles equal to 60°, whereas every isosceles triangle has two equal sides, equal base angles, and interior sum 180°.",
    createdBy: "Mr. Emeka Okafor",
    updatedAt: "Nov 11, 2026",
  },
  {
    id: "q_mth_3",
    subjectCode: "MTH-301",
    subjectTitle: "Mathematics",
    topic: "Percentages & Commercial Arithmetic",
    classLevel: "JSS 3A",
    term: "First Term",
    type: "fill_blank",
    difficulty: "Standard",
    marks: 2,
    prompt: "A textbook priced at N2,500 is discounted by 20%. Enter the discounted selling price in Naira (digits only).",
    acceptedAnswers: ["2000", "2,000"],
    explanation: "20% of 2,500 is 500. Subtract 500 from 2,500 to get N2,000.",
    createdBy: "Mr. Emeka Okafor",
    updatedAt: "Nov 11, 2026",
  },
  {
    id: "q_mth_4",
    subjectCode: "MTH-301",
    subjectTitle: "Mathematics",
    topic: "Algebraic Word Problems",
    classLevel: "JSS 3A",
    term: "First Term",
    type: "theory",
    difficulty: "Challenge",
    marks: 5,
    prompt: "A school CBT lab purchases twice as many headsets as backup routers. Each headset costs N4,000 and each router costs N12,000. If the total spend is N100,000, show step-by-step how many routers and headsets were purchased.",
    markingGuide: "1 mark: let routers = r, headsets = 2r; 2 marks: 4000(2r) + 12000r = 100000 => 20000r = 100000; 1 mark: r = 5 routers; 1 mark: 2r = 10 headsets.",
    explanation: "Form a single linear equation in terms of r routers and verify 5*12,000 + 10*4,000 = 100,000.",
    createdBy: "Mr. Emeka Okafor",
    updatedAt: "Nov 12, 2026",
  },
  {
    id: "q_eng_1",
    subjectCode: "ENG-302",
    subjectTitle: "English Language",
    topic: "Lexis & Structure",
    classLevel: "JSS 3A",
    term: "First Term",
    type: "objective",
    difficulty: "Easy",
    marks: 2,
    prompt: "Choose the option that best completes the sentence: Neither the invigilators nor the senior prefect ____ absent during inspection.",
    options: [
      { id: "a", label: "were" },
      { id: "b", label: "are" },
      { id: "c", label: "was" },
      { id: "d", label: "have been" },
    ],
    correctOptionId: "c",
    explanation: "With 'neither...nor', the verb agrees with the nearer subject ('the senior prefect', singular).",
    createdBy: "Mrs. Aisha Kareem",
    updatedAt: "Nov 09, 2026",
  },
  {
    id: "q_eng_2",
    subjectCode: "ENG-302",
    subjectTitle: "English Language",
    topic: "Summary & Guided Writing",
    classLevel: "JSS 3A",
    term: "First Term",
    type: "theory",
    difficulty: "Standard",
    marks: 5,
    prompt: "In three clear sentences, explain why offline-resilient CBT testing improves fairness in schools with unstable internet.",
    markingGuide: "2 marks: zero data loss/disconnect anxiety; 2 marks: uniform timing across candidates; 1 mark: clarity and grammar.",
    createdBy: "Mrs. Aisha Kareem",
    updatedAt: "Nov 09, 2026",
  },
  {
    id: "q_sci_1",
    subjectCode: "BSC-304",
    subjectTitle: "Basic Science",
    topic: "Energy Conversion",
    classLevel: "JSS 3A",
    term: "First Term",
    type: "objective",
    difficulty: "Easy",
    marks: 2,
    prompt: "Which energy transformation takes place inside a solar inverter charging bank?",
    options: [
      { id: "a", label: "Light energy -> Electrical energy -> Chemical energy" },
      { id: "b", label: "Sound energy -> Thermal energy" },
      { id: "c", label: "Mechanical energy -> Nuclear energy" },
      { id: "d", label: "Chemical energy -> Gravitational potential energy" },
    ],
    correctOptionId: "a",
    explanation: "Photovoltaic panels convert sunlight to electricity, which batteries store chemically.",
    createdBy: "Mr. Emeka Okafor",
    updatedAt: "Nov 10, 2026",
  },
  {
    id: "q_sci_2",
    subjectCode: "BSC-304",
    subjectTitle: "Basic Science",
    topic: "Matter & Separation Techniques",
    classLevel: "JSS 3A",
    term: "First Term",
    type: "fill_blank",
    difficulty: "Standard",
    marks: 2,
    prompt: "The separation technique used to recover pure water from salt water while collecting the vapour is called ____.",
    acceptedAnswers: ["distillation", "simple distillation"],
    explanation: "Distillation vaporizes and condenses the pure solvent away from dissolved solutes.",
    createdBy: "Mr. Emeka Okafor",
    updatedAt: "Nov 10, 2026",
  },
  {
    id: "q_civ_1",
    subjectCode: "CIV-305",
    subjectTitle: "Civic Education",
    topic: "National Values & Rule of Law",
    classLevel: "JSS 3A",
    term: "First Term",
    type: "objective",
    difficulty: "Easy",
    marks: 2,
    prompt: "Which principle ensures that no citizen or public official stands above constitutional law?",
    options: [
      { id: "a", label: "Executive Immunity" },
      { id: "b", label: "Rule of Law" },
      { id: "c", label: "Unitary Delegation" },
      { id: "d", label: "Fiscal Autonomy" },
    ],
    correctOptionId: "b",
    explanation: "Supremacy of the law and equality before the law are pillars of the Rule of Law.",
    createdBy: "Mr. Babajide Lawal",
    updatedAt: "Nov 06, 2026",
  },
  {
    id: "q_civ_2",
    subjectCode: "CIV-305",
    subjectTitle: "Civic Education",
    topic: "Citizenship & Civic Duties",
    classLevel: "JSS 3A",
    term: "First Term",
    type: "theory",
    difficulty: "Standard",
    marks: 4,
    prompt: "State two civic responsibilities of students in preserving shared school digital infrastructure.",
    markingGuide: "2 marks per valid responsibility (careful handling of devices, honest exam conduct / reporting faults promptly).",
    createdBy: "Mr. Babajide Lawal",
    updatedAt: "Nov 06, 2026",
  },
];

export const INITIAL_EXAMS: PortalExam[] = [
  {
    id: "exam_mth_midterm",
    title: "JSS 3 Mathematics First Term CBT",
    subjectCode: "MTH-301",
    subjectTitle: "Mathematics",
    classLevel: "JSS 3A",
    term: "First Term",
    teacherName: "Mr. Emeka Okafor",
    scheduledFor: "Live Now · Lab A & B",
    durationMinutes: 40,
    totalMarks: 12,
    status: "live",
    roomCode: "EXM-MTH-301",
    passCode: "482910",
    proctoringEnabled: true,
    shuffleQuestions: true,
    allowCalculator: true,
    instructions: "Attempt all 4 sections carefully. Objective questions auto-grade on submission; theory workings will be marked by your subject teacher.",
    questionIds: ["q_mth_1", "q_mth_2", "q_mth_3", "q_mth_4"],
  },
  {
    id: "exam_eng_ca",
    title: "JSS 3 English Continuous Assessment II",
    subjectCode: "ENG-302",
    subjectTitle: "English Language",
    classLevel: "JSS 3A",
    term: "First Term",
    teacherName: "Mrs. Aisha Kareem",
    scheduledFor: "Tomorrow · 09:00 AM",
    durationMinutes: 30,
    totalMarks: 7,
    status: "scheduled",
    roomCode: "EXM-ENG-302",
    passCode: "739104",
    proctoringEnabled: true,
    shuffleQuestions: false,
    allowCalculator: false,
    instructions: "Read each prompt attentively before selecting or typing your final response.",
    questionIds: ["q_eng_1", "q_eng_2"],
  },
  {
    id: "exam_sci_mock",
    title: "Basic Science Practical & Objective Check",
    subjectCode: "BSC-304",
    subjectTitle: "Basic Science",
    classLevel: "JSS 3A",
    term: "First Term",
    teacherName: "Mr. Emeka Okafor",
    scheduledFor: "Thu, Nov 19 · 10:30 AM",
    durationMinutes: 25,
    totalMarks: 4,
    status: "scheduled",
    roomCode: "EXM-BSC-304",
    passCode: "510842",
    proctoringEnabled: true,
    shuffleQuestions: true,
    allowCalculator: false,
    instructions: "Standard CBT rules apply. Keep your browser tab active throughout.",
    questionIds: ["q_sci_1", "q_sci_2"],
  },
  {
    id: "exam_civ_ca1",
    title: "Civic Education Mid-Term Test",
    subjectCode: "CIV-305",
    subjectTitle: "Civic Education",
    classLevel: "JSS 3A",
    term: "First Term",
    teacherName: "Mr. Babajide Lawal",
    scheduledFor: "Completed · Nov 08, 2026",
    durationMinutes: 25,
    totalMarks: 6,
    status: "completed",
    roomCode: "EXM-CIV-305",
    passCode: "920315",
    proctoringEnabled: false,
    shuffleQuestions: false,
    allowCalculator: false,
    instructions: "Completed examination. Review published script and teacher remarks.",
    questionIds: ["q_civ_1", "q_civ_2"],
  },
];

export const INITIAL_SUBMISSIONS: ExamSubmission[] = [
  {
    id: "sub_amina_civ",
    examId: "exam_civ_ca1",
    examTitle: "Civic Education Mid-Term Test",
    subjectCode: "CIV-305",
    studentId: "stu_amina",
    studentName: "Amina Bello",
    admissionNo: "EXM/2026/JSS3/041",
    submittedAt: "Nov 08, 2026 · 10:18 AM",
    timeSpentMinutes: 17,
    answers: {
      q_civ_1: "b",
      q_civ_2:
        "1. Students should power down lab workstations responsibly and report hardware issues immediately. 2. Students should avoid sharing passcodes or tampering with local network cables during assessments.",
    },
    objectiveEarned: 2,
    objectiveTotal: 2,
    theoryEarned: 4,
    theoryTotal: 4,
    theoryScores: {
      q_civ_2: {
        score: 4,
        maxScore: 4,
        comment: "Concise and practical digital stewardship points.",
      },
    },
    gradingStatus: "published",
    overallFeedback: "Excellent clarity across both objective and structured response.",
    tabSwitches: 0,
    appealStatus: "none",
  },
  {
    id: "sub_tolu_mth",
    examId: "exam_mth_midterm",
    examTitle: "JSS 3 Mathematics First Term CBT",
    subjectCode: "MTH-301",
    studentId: "stu_tolu",
    studentName: "Toluwalase Adeyemi",
    admissionNo: "EXM/2026/JSS3/018",
    submittedAt: "Today · 10:42 AM",
    timeSpentMinutes: 31,
    answers: {
      q_mth_1: "b",
      q_mth_2: ["a", "b", "d"],
      q_mth_3: "2000",
      q_mth_4:
        "Let routers = r, then headsets = 2r. Total cost: 12000r + 4000(2r) = 100000 => 20000r = 100000 => r = 5 routers and 10 headsets.",
    },
    objectiveEarned: 7,
    objectiveTotal: 7,
    theoryEarned: 0,
    theoryTotal: 5,
    theoryScores: {},
    gradingStatus: "needs_theory_review",
    tabSwitches: 0,
    appealStatus: "none",
  },
  {
    id: "sub_chidinma_mth",
    examId: "exam_mth_midterm",
    examTitle: "JSS 3 Mathematics First Term CBT",
    subjectCode: "MTH-301",
    studentId: "stu_chidinma",
    studentName: "Chidinma Nwosu",
    admissionNo: "EXM/2026/JSS3/022",
    submittedAt: "Today · 10:49 AM",
    timeSpentMinutes: 35,
    answers: {
      q_mth_1: "b",
      q_mth_2: ["a", "b"],
      q_mth_3: "2000",
      q_mth_4:
        "If each set of 1 router + 2 headsets costs 12000 + 8000 = 20000, dividing 100000 by 20000 gives 5 routers and 10 headsets.",
    },
    objectiveEarned: 4,
    objectiveTotal: 7,
    theoryEarned: 0,
    theoryTotal: 5,
    theoryScores: {},
    gradingStatus: "needs_theory_review",
    tabSwitches: 1,
    appealStatus: "none",
  },
];

export const INITIAL_LIVE_CANDIDATES: LiveCandidateState[] = [
  {
    id: "cand_1",
    examId: "exam_mth_midterm",
    studentName: "Amina Bello",
    admissionNo: "EXM/2026/JSS3/041",
    seatLabel: "WS-014",
    progressPercent: 75,
    answeredCount: 3,
    totalQuestions: 4,
    timeRemainingMinutes: 19,
    status: "active",
    lastHeartbeat: "3s ago",
    tabSwitchCount: 0,
  },
  {
    id: "cand_2",
    examId: "exam_mth_midterm",
    studentName: "Damilola Sanni",
    admissionNo: "EXM/2026/JSS3/029",
    seatLabel: "WS-008",
    progressPercent: 50,
    answeredCount: 2,
    totalQuestions: 4,
    timeRemainingMinutes: 18,
    status: "flagged",
    lastHeartbeat: "5s ago",
    tabSwitchCount: 2,
  },
  {
    id: "cand_3",
    examId: "exam_mth_midterm",
    studentName: "Ibrahim Danjuma",
    admissionNo: "EXM/2026/JSS3/033",
    seatLabel: "WS-021",
    progressPercent: 50,
    answeredCount: 2,
    totalQuestions: 4,
    timeRemainingMinutes: 22,
    status: "offline",
    lastHeartbeat: "42s ago (Local cache active)",
    tabSwitchCount: 0,
  },
  {
    id: "cand_4",
    examId: "exam_mth_midterm",
    studentName: "Toluwalase Adeyemi",
    admissionNo: "EXM/2026/JSS3/018",
    seatLabel: "WS-003",
    progressPercent: 100,
    answeredCount: 4,
    totalQuestions: 4,
    timeRemainingMinutes: 0,
    status: "submitted",
    lastHeartbeat: "Submitted",
    tabSwitchCount: 0,
  },
];

export const INITIAL_BROADCASTS: RoomBroadcast[] = [
  {
    id: "brd_1",
    examId: "exam_mth_midterm",
    senderName: "Mr. Emeka Okafor",
    message:
      "Show full algebraic steps for Question 4. Local offline sync is active — do not close your exam browser.",
    sentAt: "10:15 AM",
    urgency: "info",
  },
];

export const INITIAL_ACCESSIBILITY: StudentAccessibilityPrefs = {
  fontScale: "normal",
  highContrast: false,
  extraTimeMode: false,
};

export const INITIAL_PORTAL_STORE: PortalStoreData = {
  student: INITIAL_STUDENT,
  teacher: INITIAL_TEACHER,
  students: INITIAL_STUDENTS,
  teachers: INITIAL_TEACHERS,
  staff: INITIAL_STAFF,
  academicTerms: INITIAL_ACADEMIC_TERMS,
  classArms: INITIAL_CLASS_ARMS,
  questionTypes: INITIAL_QUESTION_TYPES,
  subjects: INITIAL_SUBJECTS,
  questions: INITIAL_QUESTIONS,
  exams: INITIAL_EXAMS,
  submissions: INITIAL_SUBMISSIONS,
  liveCandidates: INITIAL_LIVE_CANDIDATES,
  broadcasts: INITIAL_BROADCASTS,
  accessibility: INITIAL_ACCESSIBILITY,
};

export const STORAGE_KEY = "examinify_portal_store_v1";

export function loadPortalStore(): PortalStoreData {
  if (typeof window === "undefined") return INITIAL_PORTAL_STORE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PORTAL_STORE;
    const parsed = JSON.parse(raw) as Partial<PortalStoreData>;

    const normalizeStudent = (item: StudentProfile): StudentProfile => ({
      ...item,
      firstName: item.firstName ?? "",
      lastName: item.lastName ?? "",
      name:
        item.name ||
        `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim() ||
        "Student",
      email: item.email ?? "",
      phone: item.phone ?? "",
      admissionNo: item.admissionNo ?? item.regNo ?? "",
      classLevel: item.classLevel ?? "",
      classArmId: item.classArmId ?? "",
      wing: item.wing ?? "",
      status: item.status ?? "active",
    });

    const normalizeTeacher = (item: TeacherProfile): TeacherProfile => ({
      ...item,
      firstName: item.firstName ?? "",
      lastName: item.lastName ?? "",
      name:
        item.name ||
        `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim() ||
        "Teacher",
      email: item.email ?? "",
      department: item.department ?? "",
      assignedClasses: Array.isArray(item.assignedClasses)
        ? item.assignedClasses
        : [],
      assignedSubjectIds: Array.isArray(item.assignedSubjectIds)
        ? item.assignedSubjectIds
        : [],
      status: item.status ?? "active",
    });

    const normalizeStaff = (item: StaffProfile): StaffProfile => ({
      ...item,
      firstName: item.firstName ?? "",
      lastName: item.lastName ?? "",
      name:
        item.name ||
        `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim() ||
        "Staff",
      email: item.email ?? "",
      roleTitle: item.roleTitle ?? "",
      status: item.status ?? "active",
    });

    const initialSubjectById = new Map(
      INITIAL_SUBJECTS.map((subj) => [subj.id, subj])
    );

    const normalizeSubject = (item: SubjectEnrollment): SubjectEnrollment => {
      const seed = initialSubjectById.get(item.id);
      return {
        ...seed,
        ...item,
        code: item.code ?? seed?.code ?? "",
        title: item.title ?? seed?.title ?? "Untitled Subject",
        category: item.category ?? seed?.category ?? "Core",
        teacherName: item.teacherName ?? seed?.teacherName ?? "Unassigned",
        assignedClasses: Array.isArray(item.assignedClasses)
          ? item.assignedClasses
          : seed?.assignedClasses ?? [],
        assignedTeacherIds: Array.isArray(item.assignedTeacherIds)
          ? item.assignedTeacherIds
          : seed?.assignedTeacherIds ?? [],
        nextExamAt: item.nextExamAt ?? seed?.nextExamAt ?? "Not scheduled",
        topicsCovered: item.topicsCovered ?? seed?.topicsCovered ?? 0,
        totalTopics: item.totalTopics ?? seed?.totalTopics ?? 0,
        questionCount: item.questionCount ?? seed?.questionCount ?? 0,
        passRate: item.passRate ?? seed?.passRate ?? 0,
        status: item.status ?? seed?.status ?? "active",
      };
    };

    return {
      student: normalizeStudent({
        ...INITIAL_STUDENT,
        ...(parsed.student ?? {}),
      }),
      teacher: normalizeTeacher({
        ...INITIAL_TEACHER,
        ...(parsed.teacher ?? {}),
      }),
      students:
        Array.isArray(parsed.students) && parsed.students.length > 0
          ? parsed.students.map(normalizeStudent)
          : INITIAL_STUDENTS,
      teachers:
        Array.isArray(parsed.teachers) && parsed.teachers.length > 0
          ? parsed.teachers.map(normalizeTeacher)
          : INITIAL_TEACHERS,
      staff:
        Array.isArray(parsed.staff) && parsed.staff.length > 0
          ? parsed.staff.map(normalizeStaff)
          : INITIAL_STAFF,
      academicTerms:
        Array.isArray(parsed.academicTerms) && parsed.academicTerms.length > 0
          ? parsed.academicTerms
          : INITIAL_ACADEMIC_TERMS,
      classArms:
        Array.isArray(parsed.classArms) && parsed.classArms.length > 0
          ? parsed.classArms
          : INITIAL_CLASS_ARMS,
      questionTypes:
        Array.isArray(parsed.questionTypes) && parsed.questionTypes.length > 0
          ? parsed.questionTypes
          : INITIAL_QUESTION_TYPES,
      subjects:
        Array.isArray(parsed.subjects) && parsed.subjects.length > 0
          ? parsed.subjects.map(normalizeSubject)
          : INITIAL_SUBJECTS,
      questions: parsed.questions ?? INITIAL_QUESTIONS,
      exams: parsed.exams ?? INITIAL_EXAMS,
      submissions: parsed.submissions ?? INITIAL_SUBMISSIONS,
      liveCandidates: parsed.liveCandidates ?? INITIAL_LIVE_CANDIDATES,
      broadcasts: parsed.broadcasts ?? INITIAL_BROADCASTS,
      accessibility: { ...INITIAL_ACCESSIBILITY, ...(parsed.accessibility ?? {}) },
    };
  } catch {
    return INITIAL_PORTAL_STORE;
  }
}

export function savePortalStore(data: PortalStoreData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors in private browsing
  }
}
