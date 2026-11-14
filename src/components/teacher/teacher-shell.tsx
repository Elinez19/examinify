"use client";

import * as React from "react";
import {
  BookOpen,
  ClipboardCheck,
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
      label: "ClassList",
      description: "Student rosters across assigned classes",
      icon: Users,
    },
    {
      href: "/teacher/subjects",
      label: "Subjects",
      description: "Assigned subjects & question bank items",
      icon: BookOpen,
    },
    {
      href: "/teacher/exams",
      label: "Exam",
      description: "Assessments, live monitor, grading & broadsheets",
      icon: ClipboardCheck,
      badge: pendingGradingCount > 0 ? `${pendingGradingCount}` : undefined,
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
      userSublabel={`${store.teacher.department}`}
      userInitials={getInitials(store.teacher.name)}
      avatarUrl={store.teacher.avatarUrl}
      brandTagline={termLabel}
      statusBadge="Live Invigilation Ready"
      alerts={store.submissions
        .filter((item) => item.gradingStatus === "needs_theory_review")
        .slice(0, 4)
        .map((item) => ({
          id: item.id,
          title: `Theory Review · ${item.subjectCode}`,
          detail: `${item.studentName} submitted ${item.examTitle}`,
          time: item.submittedAt,
          tone: "warning" as const,
        }))}
    >
      {children}
    </PortalShell>
  );
}
