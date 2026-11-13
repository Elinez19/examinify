export type QuestionType = "mcq" | "true_false" | "short_answer" | "theory";
export type DifficultyLevel = "easy" | "medium" | "hard";
export type PortalExamStatus =
  | "live"
  | "scheduled"
  | "practice"
  | "completed"
  | "draft";

export interface QuestionOption {
  id: string;
  label: string;
  text: string;
}

export interface QuestionItem {
  id: string;
  subjectId: string;
  subjectName: string;
  classLevel: string;
  topic: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  marks: number;
  stem: string;
  passage?: string;
  diagramLabel?: string;
  options?: QuestionOption[];
  correctAnswer?: string;
  rubric?: string;
  explanation?: string;
  createdBy: string;
  createdAt: string;
}

export interface PortalExam {
  id: string;
  code: string;
  title: string;
  subjectId: string;
  subjectName: string;
  classLevel: string;
  term: string;
  teacherId: string;
  teacherName: string;
  status: PortalExamStatus;
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  passMarkPercent: number;
  accessPin?: string;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  allowCalculator: boolean;
  offlineReady: boolean;
  instantResult: boolean;
  venue: string;
  instructions: string[];
  questionIds: string[];
}

export interface ExamSubmission {
  id: string;
  examId: string;
  examCode: string;
  examTitle: string;
  subjectName: string;
  studentId: string;
  studentName: string;
  studentRegNo: string;
  classLevel: string;
  submittedAt: string;
  receiptCode: string;
  syncStatus: "synced" | "queued_offline";
  timeSpentSeconds: number;
  tabSwitchCount: number;
  answers: Record<string, string>;
  flaggedQuestionIds: string[];
  objectiveScore: number;
  objectiveMax: number;
  theoryScore: number;
  theoryMax: number;
  totalScore: number;
  totalMax: number;
  percentage: number;
  grade: string;
  gradingStatus: "auto_graded" | "pending_theory" | "published";
  theoryScoresByQuestion: Record<string, number>;
  teacherFeedback?: string;
  appealStatus?: "none" | "submitted" | "reviewed";
  appealReason?: string;
}

export type CandidateLiveStatus =
  | "in_progress"
  | "offline_cached"
  | "flagged"
  | "submitted"
  | "not_started";

export interface LiveCandidateState {
  id: string;
  examId: string;
  studentName: string;
  regNo: string;
  seatNumber: string;
  classLevel: string;
  status: CandidateLiveStatus;
  answeredCount: number;
  totalQuestions: number;
  remainingMinutes: number;
  tabSwitches: number;
  lastSyncAgo: string;
}

export interface RoomBroadcast {
  id: string;
  examId: string;
  message: string;
  sentAt: string;
  sender: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  regNo: string;
  classLevel: string;
  schoolName: string;
  term: string;
  campus: string;
  guardianPhone: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  staffId: string;
  department: string;
  assignedClasses: string[];
  schoolName: string;
  term: string;
}

export interface SubjectEnrollment {
  id: string;
  title: string;
  code: string;
  teacherName: string;
  classLevel: string;
  topicsCount: number;
  masteryPercent: number;
  practiceExamId: string;
  nextAssessment: string;
}

export interface StudentAccessibilityPrefs {
  fontSize: "standard" | "large" | "xlarge";
  highContrastOptions: boolean;
  showKeyboardHints: boolean;
  offlinePreloadEnabled: boolean;
}

export interface PortalStoreData {
  student: StudentProfile;
  teacher: TeacherProfile;
  subjects: SubjectEnrollment[];
  questions: QuestionItem[];
  exams: PortalExam[];
  submissions: ExamSubmission[];
  liveCandidates: LiveCandidateState[];
  broadcasts: RoomBroadcast[];
  accessibility: StudentAccessibilityPrefs;
}

export function computeLetterGrade(percentage: number): string {
  if (percentage >= 75) return "A1";
  if (percentage >= 70) return "B2";
  if (percentage >= 65) return "B3";
  if (percentage >= 60) return "C4";
  if (percentage >= 55) return "C5";
  if (percentage >= 50) return "C6";
  if (percentage >= 45) return "D7";
  if (percentage >= 40) return "E8";
  return "F9";
}

export const INITIAL_STUDENT: StudentProfile = {
  id: "stu_amina",
  name: "Amina Bello",
  email: "amina.bello@students.examinify.ng",
  regNo: "EXM-JSS3-0412",
  classLevel: "JSS 3A",
  schoolName: "Crescent Heights Academy",
  term: "First Term 2026/2027",
  campus: "Main Campus, Abuja",
  guardianPhone: "+234 809 332 1104",
};

export const INITIAL_TEACHER: TeacherProfile = {
  id: "tch_emeka",
  name: "Mr. Emeka Okafor",
  email: "emeka.okafor@crescentheights.edu.ng",
  staffId: "STF-MTH-019",
  department: "Mathematics & Sciences",
  assignedClasses: ["JSS 3A", "JSS 3B", "SSS 1A", "SSS 2B"],
  schoolName: "Crescent Heights Academy",
  term: "First Term 2026/2027",
};

export const INITIAL_SUBJECTS: SubjectEnrollment[] = [
  {
    id: "sub_math",
    title: "Mathematics",
    code: "MTH-301",
    teacherName: "Mr. Emeka Okafor",
    classLevel: "JSS 3A",
    topicsCount: 12,
    masteryPercent: 86,
    practiceExamId: "exm_practice_math",
    nextAssessment: "2nd CA Live Today",
  },
  {
    id: "sub_english",
    title: "English Language",
    code: "ENG-301",
    teacherName: "Mrs. Zainab Ibrahim",
    classLevel: "JSS 3A",
    topicsCount: 10,
    masteryPercent: 79,
    practiceExamId: "exm_practice_eng",
    nextAssessment: "Tomorrow · 11:30 AM",
  },
  {
    id: "sub_science",
    title: "Basic Science & Tech",
    code: "BSC-302",
    teacherName: "Ms. Ngozi Eze",
    classLevel: "JSS 3A",
    topicsCount: 9,
    masteryPercent: 91,
    practiceExamId: "exm_practice_sci",
    nextAssessment: "Completed · Graded",
  },
  {
    id: "sub_ict",
    title: "Computer Studies / ICT",
    code: "ICT-304",
    teacherName: "Mr. Kunle Adewale",
    classLevel: "JSS 3A",
    topicsCount: 8,
    masteryPercent: 88,
    practiceExamId: "exm_practice_math",
    nextAssessment: "Nov 18 · 09:00 AM",
  },
];

export const INITIAL_QUESTIONS: QuestionItem[] = [
  {
    id: "q_math_1",
    subjectId: "sub_math",
    subjectName: "Mathematics",
    classLevel: "JSS 3A",
    topic: "Linear Equations",
    type: "mcq",
    difficulty: "easy",
    marks: 5,
    stem: "Solve for x in the linear equation: 3x - 7 = 2x + 5.",
    options: [
      { id: "A", label: "A", text: "x = 2" },
      { id: "B", label: "B", text: "x = 12" },
      { id: "C", label: "C", text: "x = -12" },
      { id: "D", label: "D", text: "x = 7" },
    ],
    correctAnswer: "B",
    explanation: "Subtract 2x from both sides to get x - 7 = 5, then add 7: x = 12.",
    createdBy: "Mr. Emeka Okafor",
    createdAt: "2026-11-05",
  },
  {
    id: "q_math_2",
    subjectId: "sub_math",
    subjectName: "Mathematics",
    classLevel: "JSS 3A",
    topic: "Number Bases",
    type: "mcq",
    difficulty: "medium",
    marks: 5,
    stem: "Convert the binary number 10110₂ to base ten (denary).",
    options: [
      { id: "A", label: "A", text: "18" },
      { id: "B", label: "B", text: "20" },
      { id: "C", label: "C", text: "22" },
      { id: "D", label: "D", text: "24" },
    ],
    correctAnswer: "C",
    explanation: "1×16 + 0×8 + 1×4 + 1×2 + 0×1 = 16 + 4 + 2 = 22.",
    createdBy: "Mr. Emeka Okafor",
    createdAt: "2026-11-06",
  },
  {
    id: "q_math_3",
    subjectId: "sub_math",
    subjectName: "Mathematics",
    classLevel: "JSS 3A",
    topic: "Geometry & Angles",
    type: "true_false",
    difficulty: "easy",
    marks: 5,
    stem: "The sum of interior angles of any quadrilateral is 360°.",
    options: [
      { id: "True", label: "True", text: "True — interior angles sum to 360°" },
      { id: "False", label: "False", text: "False — interior angles do not sum to 360°" },
    ],
    correctAnswer: "True",
    explanation: "Using (n - 2) × 180° for n = 4 gives 2 × 180° = 360°.",
    createdBy: "Mr. Emeka Okafor",
    createdAt: "2026-11-06",
  },
  {
    id: "q_math_4",
    subjectId: "sub_math",
    subjectName: "Mathematics",
    classLevel: "JSS 3A",
    topic: "Mensuration",
    type: "short_answer",
    difficulty: "medium",
    marks: 5,
    stem: "A rectangle has length 14 cm and width 6 cm. Calculate its perimeter in cm (enter number only).",
    correctAnswer: "40",
    explanation: "Perimeter = 2 × (14 + 6) = 40 cm.",
    createdBy: "Mr. Emeka Okafor",
    createdAt: "2026-11-07",
  },
  {
    id: "q_math_5",
    subjectId: "sub_math",
    subjectName: "Mathematics",
    classLevel: "JSS 3A",
    topic: "Simultaneous Equations",
    type: "theory",
    difficulty: "hard",
    marks: 10,
    stem: "Two notebooks and three pens cost ₦1,450. Four notebooks and one pen cost ₦1,900. Clearly show step-by-step workings to find the cost of one notebook and one pen.",
    rubric:
      "3 marks for forming correct equations (2n + 3p = 1450; 4n + p = 1900). 4 marks for elimination/substitution steps. 3 marks for final values: notebook = ₦425, pen = ₦200.",
    explanation: "Notebook = ₦425, Pen = ₦200.",
    createdBy: "Mr. Emeka Okafor",
    createdAt: "2026-11-08",
  },
  {
    id: "q_math_6",
    subjectId: "sub_math",
    subjectName: "Mathematics",
    classLevel: "JSS 3A",
    topic: "Percentages & Profit",
    type: "mcq",
    difficulty: "medium",
    marks: 5,
    stem: "A trader bought a science textbook for ₦2,500 and sold it for ₦3,000. What is the percentage profit?",
    options: [
      { id: "A", label: "A", text: "15%" },
      { id: "B", label: "B", text: "20%" },
      { id: "C", label: "C", text: "25%" },
      { id: "D", label: "D", text: "16.7%" },
    ],
    correctAnswer: "B",
    explanation: "Profit = ₦500; Percentage profit = (500 / 2500) × 100 = 20%.",
    createdBy: "Mr. Emeka Okafor",
    createdAt: "2026-11-09",
  },
  {
    id: "q_eng_1",
    subjectId: "sub_english",
    subjectName: "English Language",
    classLevel: "JSS 3A",
    topic: "Comprehension",
    type: "mcq",
    difficulty: "medium",
    marks: 5,
    passage:
      "Read carefully: 'Across Crescent Heights, migrating examinations onto a school-owned offline CBT host eliminated paper leaks and cut result broadsheet preparation from ten days to twelve minutes, allowing teachers to focus on personalized coaching.'",
    stem: "According to the passage, what was the primary benefit to teachers after switching to the local CBT host?",
    options: [
      { id: "A", label: "A", text: "They no longer needed to teach comprehension." },
      { id: "B", label: "B", text: "They gained more time for personalized student coaching." },
      { id: "C", label: "C", text: "Exam halls became ten times larger." },
      { id: "D", label: "D", text: "Students wrote exams for twelve minutes only." },
    ],
    correctAnswer: "B",
    explanation: "The passage explicitly links faster broadsheet prep to more focus on personalized coaching.",
    createdBy: "Mrs. Zainab Ibrahim",
    createdAt: "2026-11-08",
  },
  {
    id: "q_eng_2",
    subjectId: "sub_english",
    subjectName: "English Language",
    classLevel: "JSS 3A",
    topic: "Lexis & Structure",
    type: "mcq",
    difficulty: "easy",
    marks: 5,
    stem: "Choose the option nearest in meaning to the underlined word: The principal gave an *unequivocal* directive on lab punctuality.",
    options: [
      { id: "A", label: "A", text: "Ambiguous" },
      { id: "B", label: "B", text: "Unmistakable and clear" },
      { id: "C", label: "C", text: "Temporary" },
      { id: "D", label: "D", text: "Optional" },
    ],
    correctAnswer: "B",
    explanation: "'Unequivocal' means leaving no doubt; clear and unambiguous.",
    createdBy: "Mrs. Zainab Ibrahim",
    createdAt: "2026-11-09",
  },
  {
    id: "q_eng_3",
    subjectId: "sub_english",
    subjectName: "English Language",
    classLevel: "JSS 3A",
    topic: "Essay Writing",
    type: "theory",
    difficulty: "medium",
    marks: 10,
    stem: "Write a concise paragraph (60–100 words) advising a junior student on three practical habits for preparing effectively for computer-based assessments.",
    rubric:
      "4 marks for 3 distinct practical habits, 3 marks for coherence and paragraph structure, 3 marks for grammar and punctuation.",
    createdBy: "Mrs. Zainab Ibrahim",
    createdAt: "2026-11-10",
  },
  {
    id: "q_sci_1",
    subjectId: "sub_science",
    subjectName: "Basic Science & Tech",
    classLevel: "JSS 3A",
    topic: "States of Matter & Energy",
    type: "mcq",
    difficulty: "easy",
    marks: 5,
    diagramLabel: "Laboratory Energy Transfer Diagram (Cached Offline SVG)",
    stem: "Which process describes the direct change of a substance from solid state to gaseous state without passing through liquid?",
    options: [
      { id: "A", label: "A", text: "Condensation" },
      { id: "B", label: "B", text: "Evaporation" },
      { id: "C", label: "C", text: "Sublimation" },
      { id: "D", label: "D", text: "Crystallization" },
    ],
    correctAnswer: "C",
    explanation: "Sublimation is the direct solid-to-gas transition (e.g., iodine crystals or dry ice).",
    createdBy: "Ms. Ngozi Eze",
    createdAt: "2026-11-05",
  },
  {
    id: "q_sci_2",
    subjectId: "sub_science",
    subjectName: "Basic Science & Tech",
    classLevel: "JSS 3A",
    topic: "Human Biology",
    type: "true_false",
    difficulty: "easy",
    marks: 5,
    stem: "Red blood cells contain hemoglobin, which binds oxygen for transport from the lungs to body tissues.",
    options: [
      { id: "True", label: "True", text: "True" },
      { id: "False", label: "False", text: "False" },
    ],
    correctAnswer: "True",
    explanation: "Hemoglobin is the iron-containing protein in red blood cells responsible for oxygen transport.",
    createdBy: "Ms. Ngozi Eze",
    createdAt: "2026-11-06",
  },
  {
    id: "q_sci_3",
    subjectId: "sub_science",
    subjectName: "Basic Science & Tech",
    classLevel: "JSS 3A",
    topic: "Simple Machines",
    type: "short_answer",
    difficulty: "medium",
    marks: 5,
    stem: "State the SI unit of work and energy (one word).",
    correctAnswer: "Joule",
    explanation: "Work and energy are measured in Joules (J).",
    createdBy: "Ms. Ngozi Eze",
    createdAt: "2026-11-07",
  },
];

export const INITIAL_EXAMS: PortalExam[] = [
  {
    id: "exm_live_math",
    code: "EXM-2026-8891",
    title: "JSS 3 Mathematics 2nd CA CBT",
    subjectId: "sub_math",
    subjectName: "Mathematics",
    classLevel: "JSS 3A",
    term: "First Term 2026/2027",
    teacherId: "tch_emeka",
    teacherName: "Mr. Emeka Okafor",
    status: "live",
    scheduledDate: "2026-11-13",
    scheduledTime: "09:00 AM",
    durationMinutes: 35,
    passMarkPercent: 50,
    accessPin: "3041",
    shuffleQuestions: false,
    shuffleOptions: false,
    allowCalculator: true,
    offlineReady: true,
    instantResult: false,
    venue: "CBT Lab A · Main Campus, Abuja",
    instructions: [
      "Read every question carefully before selecting or typing your answer.",
      "Your responses are saved locally in real time and sync automatically.",
      "Use the Question Navigator on the right to flag and revisit tricky items.",
      "Do not switch browser tabs or exit the exam hall during active timing.",
    ],
    questionIds: ["q_math_1", "q_math_2", "q_math_3", "q_math_4", "q_math_5", "q_math_6"],
  },
  {
    id: "exm_sched_eng",
    code: "EXM-2026-8892",
    title: "JSS 3 English Comprehension & Lexis",
    subjectId: "sub_english",
    subjectName: "English Language",
    classLevel: "JSS 3A",
    term: "First Term 2026/2027",
    teacherId: "tch_zainab",
    teacherName: "Mrs. Zainab Ibrahim",
    status: "scheduled",
    scheduledDate: "2026-11-14",
    scheduledTime: "11:30 AM",
    durationMinutes: 40,
    passMarkPercent: 50,
    accessPin: "2210",
    shuffleQuestions: false,
    shuffleOptions: true,
    allowCalculator: false,
    offlineReady: true,
    instantResult: false,
    venue: "CBT Lab B · Main Campus, Abuja",
    instructions: [
      "Read the comprehension passage in the left/top panel carefully.",
      "Essay answers must be concise, well-punctuated, and between 60–100 words.",
    ],
    questionIds: ["q_eng_1", "q_eng_2", "q_eng_3"],
  },
  {
    id: "exm_practice_math",
    code: "PRC-MTH-301",
    title: "Mathematics Objective Speed Drill (Practice)",
    subjectId: "sub_math",
    subjectName: "Mathematics",
    classLevel: "JSS 3A",
    term: "First Term 2026/2027",
    teacherId: "tch_emeka",
    teacherName: "Mr. Emeka Okafor",
    status: "practice",
    scheduledDate: "Anytime",
    scheduledTime: "Self-Paced",
    durationMinutes: 15,
    passMarkPercent: 50,
    shuffleQuestions: true,
    shuffleOptions: false,
    allowCalculator: true,
    offlineReady: true,
    instantResult: true,
    venue: "Offline / Home Practice Mode",
    instructions: [
      "Untimed pressure-free practice with instant answer explanation upon submission.",
      "Calculator tool is enabled in the top exam bar.",
    ],
    questionIds: ["q_math_1", "q_math_2", "q_math_3", "q_math_4", "q_math_6"],
  },
  {
    id: "exm_practice_eng",
    code: "PRC-ENG-301",
    title: "English Language Lexis & Passage Practice",
    subjectId: "sub_english",
    subjectName: "English Language",
    classLevel: "JSS 3A",
    term: "First Term 2026/2027",
    teacherId: "tch_zainab",
    teacherName: "Mrs. Zainab Ibrahim",
    status: "practice",
    scheduledDate: "Anytime",
    scheduledTime: "Self-Paced",
    durationMinutes: 20,
    passMarkPercent: 50,
    shuffleQuestions: false,
    shuffleOptions: false,
    allowCalculator: false,
    offlineReady: true,
    instantResult: true,
    venue: "Offline / Home Practice Mode",
    instructions: [
      "Practice reading comprehension and lexical precision.",
    ],
    questionIds: ["q_eng_1", "q_eng_2"],
  },
  {
    id: "exm_comp_sci",
    code: "EXM-2026-8895",
    title: "JSS 3 Basic Science Midterm CBT",
    subjectId: "sub_science",
    subjectName: "Basic Science & Tech",
    classLevel: "JSS 3A",
    term: "First Term 2026/2027",
    teacherId: "tch_ngozi",
    teacherName: "Ms. Ngozi Eze",
    status: "completed",
    scheduledDate: "2026-11-09",
    scheduledTime: "01:00 PM",
    durationMinutes: 25,
    passMarkPercent: 50,
    shuffleQuestions: false,
    shuffleOptions: false,
    allowCalculator: true,
    offlineReady: true,
    instantResult: true,
    venue: "CBT Lab A · Main Campus, Abuja",
    instructions: [
      "Objective science evaluation with cached diagrams.",
    ],
    questionIds: ["q_sci_1", "q_sci_2", "q_sci_3"],
  },
  {
    id: "exm_practice_sci",
    code: "PRC-BSC-302",
    title: "Basic Science Diagram & Concept Drill",
    subjectId: "sub_science",
    subjectName: "Basic Science & Tech",
    classLevel: "JSS 3A",
    term: "First Term 2026/2027",
    teacherId: "tch_ngozi",
    teacherName: "Ms. Ngozi Eze",
    status: "practice",
    scheduledDate: "Anytime",
    scheduledTime: "Self-Paced",
    durationMinutes: 15,
    passMarkPercent: 50,
    shuffleQuestions: false,
    shuffleOptions: false,
    allowCalculator: false,
    offlineReady: true,
    instantResult: true,
    venue: "Offline / Home Practice Mode",
    instructions: ["Instant feedback on Basic Science fundamentals."],
    questionIds: ["q_sci_1", "q_sci_2", "q_sci_3"],
  },
];

export const INITIAL_SUBMISSIONS: ExamSubmission[] = [
  {
    id: "sub_seed_1",
    examId: "exm_comp_sci",
    examCode: "EXM-2026-8895",
    examTitle: "JSS 3 Basic Science Midterm CBT",
    subjectName: "Basic Science & Tech",
    studentId: "stu_amina",
    studentName: "Amina Bello",
    studentRegNo: "EXM-JSS3-0412",
    classLevel: "JSS 3A",
    submittedAt: "2026-11-09T13:21:00.000Z",
    receiptCode: "EXM-SUB-99210",
    syncStatus: "synced",
    timeSpentSeconds: 980,
    tabSwitchCount: 0,
    answers: {
      q_sci_1: "C",
      q_sci_2: "True",
      q_sci_3: "Joule",
    },
    flaggedQuestionIds: [],
    objectiveScore: 15,
    objectiveMax: 15,
    theoryScore: 0,
    theoryMax: 0,
    totalScore: 15,
    totalMax: 15,
    percentage: 100,
    grade: "A1",
    gradingStatus: "published",
    theoryScoresByQuestion: {},
    teacherFeedback: "Excellent precision across matter transitions and SI units.",
    appealStatus: "none",
  },
  {
    id: "sub_seed_2",
    examId: "exm_live_math",
    examCode: "EXM-2026-8891",
    examTitle: "JSS 3 Mathematics 2nd CA CBT",
    subjectName: "Mathematics",
    studentId: "stu_tolu",
    studentName: "Toluwalase Adeyemi",
    studentRegNo: "EXM-JSS3-0418",
    classLevel: "JSS 3A",
    submittedAt: "2026-11-13T09:29:00.000Z",
    receiptCode: "EXM-SUB-99412",
    syncStatus: "synced",
    timeSpentSeconds: 1740,
    tabSwitchCount: 0,
    answers: {
      q_math_1: "B",
      q_math_2: "C",
      q_math_3: "True",
      q_math_4: "40",
      q_math_5:
        "Let notebook = n and pen = p.\n2n + 3p = 1450 ...(1)\n4n + p = 1900 => p = 1900 - 4n ...(2)\nSubstitute into (1): 2n + 3(1900 - 4n) = 1450\n2n + 5700 - 12n = 1450 => -10n = -4250 => n = 425.\np = 1900 - 4(425) = 200.\nTherefore one notebook costs ₦425 and one pen costs ₦200.",
      q_math_6: "B",
    },
    flaggedQuestionIds: ["q_math_5"],
    objectiveScore: 25,
    objectiveMax: 25,
    theoryScore: 0,
    theoryMax: 10,
    totalScore: 25,
    totalMax: 35,
    percentage: 71,
    grade: "B2",
    gradingStatus: "pending_theory",
    theoryScoresByQuestion: {},
    appealStatus: "none",
  },
  {
    id: "sub_seed_3",
    examId: "exm_live_math",
    examCode: "EXM-2026-8891",
    examTitle: "JSS 3 Mathematics 2nd CA CBT",
    subjectName: "Mathematics",
    studentId: "stu_chidinma",
    studentName: "Chidinma Nwosu",
    studentRegNo: "EXM-JSS3-0425",
    classLevel: "JSS 3A",
    submittedAt: "2026-11-13T09:31:00.000Z",
    receiptCode: "EXM-SUB-99419",
    syncStatus: "synced",
    timeSpentSeconds: 1890,
    tabSwitchCount: 1,
    answers: {
      q_math_1: "B",
      q_math_2: "A",
      q_math_3: "True",
      q_math_4: "40",
      q_math_5:
        "2n + 3p = 1450 and 4n + p = 1900. Multiplying second equation by 3 gives 12n + 3p = 5700. Subtracting first gives 10n = 4250, so n = 425. Then p = 200.",
      q_math_6: "B",
    },
    flaggedQuestionIds: [],
    objectiveScore: 20,
    objectiveMax: 25,
    theoryScore: 0,
    theoryMax: 10,
    totalScore: 20,
    totalMax: 35,
    percentage: 57,
    grade: "C5",
    gradingStatus: "pending_theory",
    theoryScoresByQuestion: {},
    appealStatus: "none",
  },
];

export const INITIAL_LIVE_CANDIDATES: LiveCandidateState[] = [
  {
    id: "cand_1",
    examId: "exm_live_math",
    studentName: "Amina Bello",
    regNo: "EXM-JSS3-0412",
    seatNumber: "LAB-A-04",
    classLevel: "JSS 3A",
    status: "in_progress",
    answeredCount: 4,
    totalQuestions: 6,
    remainingMinutes: 22,
    tabSwitches: 0,
    lastSyncAgo: "Just now",
  },
  {
    id: "cand_2",
    examId: "exm_live_math",
    studentName: "Toluwalase Adeyemi",
    regNo: "EXM-JSS3-0418",
    seatNumber: "LAB-A-09",
    classLevel: "JSS 3A",
    status: "submitted",
    answeredCount: 6,
    totalQuestions: 6,
    remainingMinutes: 0,
    tabSwitches: 0,
    lastSyncAgo: "2m ago",
  },
  {
    id: "cand_3",
    examId: "exm_live_math",
    studentName: "Ibrahim Danjuma",
    regNo: "EXM-JSS3-0407",
    seatNumber: "LAB-A-11",
    classLevel: "JSS 3A",
    status: "offline_cached",
    answeredCount: 5,
    totalQuestions: 6,
    remainingMinutes: 19,
    tabSwitches: 0,
    lastSyncAgo: "Cached locally (45s)",
  },
  {
    id: "cand_4",
    examId: "exm_live_math",
    studentName: "Kelechi Okafor",
    regNo: "EXM-JSS3-0431",
    seatNumber: "LAB-A-14",
    classLevel: "JSS 3A",
    status: "flagged",
    answeredCount: 3,
    totalQuestions: 6,
    remainingMinutes: 17,
    tabSwitches: 2,
    lastSyncAgo: "12s ago",
  },
  {
    id: "cand_5",
    examId: "exm_live_math",
    studentName: "Chidinma Nwosu",
    regNo: "EXM-JSS3-0425",
    seatNumber: "LAB-A-18",
    classLevel: "JSS 3A",
    status: "submitted",
    answeredCount: 6,
    totalQuestions: 6,
    remainingMinutes: 0,
    tabSwitches: 1,
    lastSyncAgo: "4m ago",
  },
  {
    id: "cand_6",
    examId: "exm_live_math",
    studentName: "Sadiq Mohammed",
    regNo: "EXM-JSS3-0440",
    seatNumber: "LAB-A-22",
    classLevel: "JSS 3A",
    status: "not_started",
    answeredCount: 0,
    totalQuestions: 6,
    remainingMinutes: 35,
    tabSwitches: 0,
    lastSyncAgo: "Awaiting PIN",
  },
];

export const INITIAL_BROADCASTS: RoomBroadcast[] = [
  {
    id: "bcast_1",
    examId: "exm_live_math",
    message:
      "Show all workings clearly in Question 5 (Simultaneous Equations). Built-in calculator is enabled.",
    sentAt: "09:05 AM",
    sender: "Mr. Emeka Okafor",
  },
];

export const INITIAL_ACCESSIBILITY: StudentAccessibilityPrefs = {
  fontSize: "standard",
  highContrastOptions: false,
  showKeyboardHints: true,
  offlinePreloadEnabled: true,
};

const STORAGE_KEY = "examinify_portal_store_v1";

export function getInitialPortalStore(): PortalStoreData {
  return {
    student: INITIAL_STUDENT,
    teacher: INITIAL_TEACHER,
    subjects: INITIAL_SUBJECTS,
    questions: INITIAL_QUESTIONS,
    exams: INITIAL_EXAMS,
    submissions: INITIAL_SUBMISSIONS,
    liveCandidates: INITIAL_LIVE_CANDIDATES,
    broadcasts: INITIAL_BROADCASTS,
    accessibility: INITIAL_ACCESSIBILITY,
  };
}

export function loadPortalStore(): PortalStoreData {
  const fallback = getInitialPortalStore();
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<PortalStoreData>;
    return {
      student: parsed.student ?? fallback.student,
      teacher: parsed.teacher ?? fallback.teacher,
      subjects: Array.isArray(parsed.subjects) ? parsed.subjects : fallback.subjects,
      questions: Array.isArray(parsed.questions)
        ? parsed.questions
        : fallback.questions,
      exams: Array.isArray(parsed.exams) ? parsed.exams : fallback.exams,
      submissions: Array.isArray(parsed.submissions)
        ? parsed.submissions
        : fallback.submissions,
      liveCandidates: Array.isArray(parsed.liveCandidates)
        ? parsed.liveCandidates
        : fallback.liveCandidates,
      broadcasts: Array.isArray(parsed.broadcasts)
        ? parsed.broadcasts
        : fallback.broadcasts,
      accessibility: parsed.accessibility ?? fallback.accessibility,
    };
  } catch {
    return fallback;
  }
}

export function savePortalStore(data: PortalStoreData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota issues in restricted browsers
  }
}

