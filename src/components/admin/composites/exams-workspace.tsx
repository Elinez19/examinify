/**
 * CBT Exams & Session Management Workspace Composite
 * Separates concerns across:
 * - Domain Types: "@/components/admin/exams/types"
 * - Constants: "@/components/admin/exams/constants"
 * - Custom Hooks: "@/hooks/admin"
 * - Modular UI: "@/components/admin/exams/*"
 */

export * from "@/components/admin/exams/types";
export * from "@/components/admin/exams/constants";
export * from "@/components/admin/exams/exam-session-form";
export * from "@/components/admin/exams/exam-sessions-table";
export * from "@/components/admin/exams/exams-workspace";
