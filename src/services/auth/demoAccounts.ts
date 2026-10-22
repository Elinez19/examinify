import type { DemoAccount } from "@/types/auth"

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "student",
    label: "Student Candidate",
    name: "Amina Adeleke",
    email: "amina.adeleke@students.examinify.edu.ng",
    password: "candidate2026",
    description: "SSS 3 STEM Candidate (WAEC & JAMB UTME Prep)",
    badge: "Student Account",
  },
  {
    role: "teacher",
    label: "Secondary Teacher",
    name: "Mr. Babatunde Adeleke",
    email: "babatunde.adeleke@kingscrest.edu.ng",
    password: "teacher2026",
    description: "Senior Maths Master & Form Master SS 1 (Guzape Campus)",
    badge: "Teacher Account",
  },
  {
    role: "teacher",
    label: "Primary Teacher",
    name: "Mrs. Folake Adeyemi",
    email: "folake.adeyemi@kingscrest.edu.ng",
    password: "teacher2026",
    description: "Grade 4 Diamond Class Teacher (Wuse II Campus)",
    badge: "Teacher Account",
  },
]
