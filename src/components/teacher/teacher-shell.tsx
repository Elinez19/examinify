"use client";

import * as React from "react";
import {
  BarChart3,
  BookMarked,
  CheckSquare,
  ClipboardList,
  LayoutDashboard,
  Radio,
} from "lucide-react";
import { PortalShell, type PortalShellConfig } from "@/components/portal/portal-shell";
import { usePortalStore } from "@/hooks/portal/use-portal-store";

export function TeacherShell({ children }: { children: React.ReactNode }) {
  const { store, resetDemoData } = usePortalStore();

  const pendingGradingCount = store.submissions.filter(
    (s) => s.gradingStatus === "pending_theory"
  ).length;
  const liveExamsCount = store.exams.filter((e) => e.status === "live").length;

  const config: PortalShellConfig = {
    portalLabel: "Teacher Portal",
    badgeText: "Educator",
    homeHref: "/teacher",
    layoutIdPrefix: "teacher",
    userName: store.teacher.name,
    userMeta: `${store.teacher.staffId} · ${store.teacher.department}`,
    userInitials: store.teacher.name
      .replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s*/i, "")
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    quickStatusPill:
      liveExamsCount > 0
        ? `${liveExamsCount} Live CBT Room Active`
        : "Offline Sync Ready",
    statusChips: [
      { label: `${store.teacher.assignedClasses.length} Classes`, icon: "sparkles" },
      { label: "LAN Host Sync", icon: "wifi" },
      { label: "Invigilator", icon: "lock" },
    ],
    navItems: [
      {
        label: "Overview",
        subtitle: "Classes, live rooms & grading queue",
        href: "/teacher",
        icon: <LayoutDashboard className="h-3.5 w-3.5" />,
      },
      {
        label: "Question Bank",
        subtitle: "Author MCQ, objective & theory items",
        href: "/teacher/question-bank",
        icon: <BookMarked className="h-3.5 w-3.5" />,
        badge: store.questions.length,
      },
      {
        label: "Exam Builder",
        subtitle: "Create, schedule & publish CBT papers",
        href: "/teacher/exams",
        icon: <ClipboardList className="h-3.5 w-3.5" />,
        badge: store.exams.length,
      },
      {
        label: "Live Monitor",
        subtitle: "Invigilation, time & broadcasts",
        href: "/teacher/live-monitor",
        icon: <Radio className="h-3.5 w-3.5" />,
        badge: liveExamsCount > 0 ? liveExamsCount : undefined,
      },
      {
        label: "Theory Grading",
        subtitle: "Mark essays & publish scripts",
        href: "/teacher/grading",
        icon: <CheckSquare className="h-3.5 w-3.5" />,
        badge: pendingGradingCount > 0 ? pendingGradingCount : undefined,
      },
      {
        label: "Broadsheets",
        subtitle: "Class analytics & CSV export",
        href: "/teacher/analytics",
        icon: <BarChart3 className="h-3.5 w-3.5" />,
      },
    ],
    notifications: [
      {
        id: "tch-notif-1",
        title: "Theory Scripts Awaiting Marking",
        detail: `${pendingGradingCount} submitted script(s) need theory rubric scoring.`,
        href: "/teacher/grading",
      },
      {
        id: "tch-notif-2",
        title: "Live CBT Invigilation Alert",
        detail: "1 candidate flagged for focus switch in JSS 3 Mathematics 2nd CA.",
        href: "/teacher/live-monitor",
      },
    ],
    onResetDemo: resetDemoData,
  };

  return <PortalShell config={config}>{children}</PortalShell>;
}

