"use client";

import * as React from "react";
import {
  BookOpenCheck,
  GraduationCap,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import {
  PortalShell,
  type PortalNavItem,
} from "@/components/portal/portal-shell";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import { getInitials } from "@/lib/portal-auth";

export function StudentShell({ children }: { children: React.ReactNode }) {
  const { store, activeSessionTerm } = usePortalStore();

  const liveCount = store.exams.filter(
    (exam) =>
      exam.status === "live" &&
      (exam.classLevel === store.student.classLevel ||
        exam.classLevel.startsWith(store.student.classLevel.split(" ")[0] ?? ""))
  ).length;

  const navItems: PortalNavItem[] = [
    {
      href: "/student",
      label: "Overview",
      description: "Term summary & active assessments",
      icon: LayoutDashboard,
    },
    {
      href: "/student/class",
      label: "Class",
      description: "Class arm, subjects & peers",
      icon: GraduationCap,
    },
    {
      href: "/student/exams",
      label: "Examinations",
      description: "Active CBTs, schedule & results",
      icon: BookOpenCheck,
      badge: liveCount > 0 ? `${liveCount} Live` : undefined,
    },
    {
      href: "/student/study-mode",
      label: "Study Mode",
      description: "Self-paced question bank practice",
      icon: Sparkles,
    },
  ];

  const activeTermLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : store.student.termLabel;

  return (
    <PortalShell
      role="student"
      roleLabel="Student Portal"
      navItems={navItems}
      userName={store.student.name}
      userSublabel={`${store.student.classLevel} · ${store.student.admissionNo}`}
      userInitials={getInitials(store.student.name)}
      avatarUrl={store.student.avatarUrl}
      profileHref="/student/profile"
      brandTagline={activeTermLabel}
      statusBadge="Offline Sync Ready"
      alerts={store.broadcasts.map((item) => ({
        id: item.id,
        title: `Notice · ${item.senderName}`,
        detail: item.message,
        time: item.sentAt,
        tone: item.urgency === "warning" ? "warning" : "info",
      }))}
    >
      {children}
    </PortalShell>
  );
}
