"use client";

import * as React from "react";
import {
  Award,
  BookOpen,
  ClipboardCheck,
  LayoutDashboard,
  UserCheck,
} from "lucide-react";
import { PortalShell, type PortalShellConfig } from "@/components/portal/portal-shell";
import { usePortalStore } from "@/hooks/portal/use-portal-store";

export function StudentShell({ children }: { children: React.ReactNode }) {
  const { store, resetDemoData } = usePortalStore();

  const liveOrUpcomingCount = store.exams.filter(
    (e) => e.status === "live" || e.status === "scheduled"
  ).length;
  const studentSubmissions = store.submissions.filter(
    (s) => s.studentId === store.student.id
  );

  const config: PortalShellConfig = {
    portalLabel: "Student Portal",
    badgeText: store.student.classLevel,
    homeHref: "/student",
    layoutIdPrefix: "student",
    userName: store.student.name,
    userMeta: `${store.student.regNo} · ${store.student.classLevel}`,
    userInitials: store.student.name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    quickStatusPill: "Offline Exam Pack Ready",
    statusChips: [
      { label: store.student.term, icon: "sparkles" },
      { label: "Offline Sync", icon: "wifi" },
      { label: "Seat Verified", icon: "lock" },
    ],
    navItems: [
      {
        label: "Overview",
        subtitle: "Upcoming exams & term progress",
        href: "/student",
        icon: <LayoutDashboard className="h-3.5 w-3.5" />,
      },
      {
        label: "My Exams",
        subtitle: "Live hall, timetable & practice drills",
        href: "/student/exams",
        icon: <ClipboardCheck className="h-3.5 w-3.5" />,
        badge: liveOrUpcomingCount,
      },
      {
        label: "Results & Scripts",
        subtitle: "Grades, review & remark appeals",
        href: "/student/results",
        icon: <Award className="h-3.5 w-3.5" />,
        badge: studentSubmissions.length,
      },
      {
        label: "Subjects",
        subtitle: "Enrolled courses & topic mastery",
        href: "/student/subjects",
        icon: <BookOpen className="h-3.5 w-3.5" />,
      },
      {
        label: "Profile & Prefs",
        subtitle: "Candidate slip & accessibility",
        href: "/student/profile",
        icon: <UserCheck className="h-3.5 w-3.5" />,
      },
    ],
    notifications: [
      {
        id: "st-notif-1",
        title: "Live Exam Hall Open",
        detail: "JSS 3 Mathematics 2nd CA CBT is live now (Access PIN: 3041).",
        href: "/student/exams",
      },
      {
        id: "st-notif-2",
        title: "Result Published",
        detail: "Basic Science Midterm CBT graded — view your script review.",
        href: "/student/results",
      },
    ],
    onResetDemo: resetDemoData,
  };

  return <PortalShell config={config}>{children}</PortalShell>;
}

