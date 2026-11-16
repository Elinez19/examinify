"use client";

import * as React from "react";
import {
  Award,
  BookOpen,
  BookOpenCheck,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  Sparkles,
  User,
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
      label: "Class & Subjects",
      description: "Class arm, peers & registered subjects",
      icon: GraduationCap,
      children: [
        {
          href: "/student/class",
          label: "My Class",
          description: "Class teacher, wing & classmate roster",
          icon: GraduationCap,
        },
        {
          href: "/student/subjects",
          label: "My Subjects",
          description: "Registered subjects & syllabus progress",
          icon: BookOpen,
        },
      ],
    },
    {
      href: "/student/exams",
      label: "Examinations",
      description: "Active CBTs, schedule & results",
      icon: BookOpenCheck,
      children: [
        {
          href: "/student/exams",
          label: "Live & Upcoming",
          description: "Launch live CBTs & view exam timetable",
          icon: BookOpenCheck,
          badge: liveCount > 0 ? `${liveCount} Live` : undefined,
        },
        {
          href: "/student/results",
          label: "Results & Scripts",
          description: "Review marked scripts & request remarks",
          icon: Award,
        },
      ],
    },
    {
      href: "/student/study-mode",
      label: "Study Mode",
      description: "Self-paced question bank practice",
      icon: Sparkles,
    },
    {
      href: "/student/profile",
      label: "Account",
      description: "Profile details & sign-in security",
      icon: User,
      children: [
        {
          href: "/student/profile",
          label: "Profile Details",
          description: "Update display name & avatar",
          icon: User,
        },
        {
          href: "/student/profile/password",
          label: "Change Password",
          description: "Update your CBT portal password",
          icon: KeyRound,
        },
      ],
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
