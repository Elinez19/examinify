"use client";

import * as React from "react";
import {
  Activity,
  Award,
  BarChart3,
  BookOpen,
  ClipboardCheck,
  FilePlus2,
  Layers,
  LayoutDashboard,
  Users,
} from "lucide-react";
import {
  PortalShell,
  type PortalNavItem,
} from "@/components/portal/portal-shell";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import { getInitials } from "@/lib/portal-auth";

export function TeacherShell({ children }: { children: React.ReactNode }) {
  const { store, activeSessionTerm } = usePortalStore();

  const pendingGradingCount = store.submissions.filter(
    (item) => item.gradingStatus === "needs_theory_review"
  ).length;

  const navItems: PortalNavItem[] = [
    {
      href: "/teacher",
      label: "Overview",
      description: "Assessments, grading queue & quick metrics",
      icon: LayoutDashboard,
    },
    {
      href: "/teacher/class-list",
      label: "Class & Subjects",
      description: "Rosters, subjects & question bank",
      icon: BookOpen,
      children: [
        {
          href: "/teacher/class-list",
          label: "ClassList",
          description: "Student rosters across assigned classes",
          icon: Users,
        },
        {
          href: "/teacher/subjects",
          label: "Assigned Subjects",
          description: "Subject catalog & pass rates",
          icon: BookOpen,
        },
        {
          href: "/teacher/question-bank",
          label: "Question Bank",
          description: "Create & edit CBT assessment items",
          icon: Layers,
        },
      ],
    },
    {
      href: "/teacher/exams/create",
      label: "Examinations",
      description: "Create exams, live monitor, grading & broadsheets",
      icon: ClipboardCheck,
      children: [
        {
          href: "/teacher/exams/create",
          label: "Create Exam",
          description: "Author exam details, questions & ClassList",
          icon: FilePlus2,
        },
        {
          href: "/teacher/live-monitor",
          label: "Live Monitor",
          description: "Supervise active candidate workstations",
          icon: Activity,
        },
        {
          href: "/teacher/grading",
          label: "Theory Grading",
          description: "Score subjective scripts & publish results",
          icon: Award,
          badge:
            pendingGradingCount > 0 ? `${pendingGradingCount}` : undefined,
        },
        {
          href: "/teacher/analytics",
          label: "Broadsheets",
          description: "Consolidated scores & CSV export",
          icon: BarChart3,
        },
      ],
    },
  ];

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : store.teacher.termLabel;

  return (
    <PortalShell
      role="teacher"
      roleLabel="Teacher Portal"
      navItems={navItems}
      userName={store.teacher.name}
      userSublabel={`${store.teacher.schoolType ?? "College"} · ${store.teacher.schoolBranch ?? "Guzape Branch"}`}
      userInitials={getInitials(store.teacher.name)}
      avatarUrl={store.teacher.avatarUrl}
      brandTagline={termLabel}
      statusBadge={`${store.teacher.schoolType ?? "College"} · ${store.teacher.schoolBranch ?? "Guzape Branch"}`}
      alerts={store.submissions
        .filter((item) => item.gradingStatus === "needs_theory_review")
        .slice(0, 4)
        .map((item) => ({
          id: item.id,
          title: `Theory Review · ${item.subjectName || item.examTitle}`,
          detail: `${item.studentName} submitted ${item.examTitle}`,
          time: item.submittedAt,
          tone: "warning" as const,
        }))}
    >
      {children}
    </PortalShell>
  );
}
