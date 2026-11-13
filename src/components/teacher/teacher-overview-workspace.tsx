"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookMarked,
  CheckSquare,
  ClipboardList,
  Plus,
  Radio,
  Users,
} from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import { AdminKpiCard } from "@/components/admin/ui/admin-kpi-card";
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { OffsetRing } from "@/components/brand/offset-ring";
import { Float } from "@/components/motion/float";
import { usePortalStore } from "@/hooks/portal/use-portal-store";

export function TeacherOverviewWorkspace() {
  const { store } = usePortalStore();
  const { teacher, exams, questions, submissions, liveCandidates } = store;

  const liveExams = exams.filter((e) => e.status === "live");
  const pendingGrading = submissions.filter(
    (s) => s.gradingStatus === "pending_theory"
  );
  const flaggedCandidates = liveCandidates.filter((c) => c.status === "flagged");
  const gradedSubs = submissions.filter(
    (s) => s.gradingStatus === "published" || s.gradingStatus === "auto_graded"
  );
  const avgScore =
    gradedSubs.length > 0
      ? Math.round(
          gradedSubs.reduce((sum, s) => sum + s.percentage, 0) /
            gradedSubs.length
        )
      : 78;

  return (
    <div className="space-y-3 sm:space-y-4">
      <AdminHeroBanner
        eyebrow={`${teacher.schoolName} · ${teacher.department}`}
        eyebrowIcon="dot"
        headline={`Educator Desk, ${teacher.name}.`}
        highlightWords={[teacher.name]}
        subtitle={`Author CBT questions, build termly papers for ${teacher.assignedClasses.join(", ")}, monitor live exam rooms, and grade theory scripts in one unified hub.`}
        primaryCta={{
          label: "Build New Exam",
          href: "/teacher/exams",
          variant: "primary",
          icon: <Plus className="h-3.5 w-3.5" />,
          trailingArrow: true,
        }}
        secondaryCta={{
          label: "Question Bank",
          href: "/teacher/question-bank",
          variant: "secondary",
        }}
        rightSlot={
          <div className="hidden xl:flex items-center gap-3.5 pr-1">
            <Float amplitude={5} duration={4.8}>
              <OffsetRing size="md" faceTone="ink" className="h-20 w-20 text-xs">
                <div className="space-y-0.5 leading-tight">
                  <span className="block text-accent-sky text-lg font-extrabold">
                    {pendingGrading.length}
                  </span>
                  <span className="block text-[9px] font-bold text-ink-on-blue-muted">
                    To Grade
                  </span>
                </div>
              </OffsetRing>
            </Float>
            <Float amplitude={6} duration={5.4} delay={0.3}>
              <OffsetRing
                size="sm"
                faceTone="porcelain"
                className="h-15 w-15 text-[10px]"
              >
                <div className="space-y-0.5 leading-tight">
                  <span className="block text-brand-700 text-xs font-extrabold">
                    {questions.length}
                  </span>
                  <span className="block text-[8px] font-bold text-ink-secondary">
                    Questions
                  </span>
                </div>
              </OffsetRing>
            </Float>
          </div>
        }
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          <AdminKpiCard
            label="Active & Scheduled Exams"
            value={String(
              exams.filter((e) => e.status === "live" || e.status === "scheduled")
                .length
            )}
            numericValue={
              exams.filter((e) => e.status === "live" || e.status === "scheduled")
                .length
            }
            badgeText={`${liveExams.length} Room Live Now`}
            badgeTone="blue"
            badgeIcon="dot"
            tone="ink"
            icon={<Radio className="h-4 w-4 text-accent-gold" />}
          />
          <AdminKpiCard
            label="Question Bank Items"
            value={String(questions.length)}
            numericValue={questions.length}
            badgeText="MCQ, Short & Theory"
            badgeTone="sky"
            icon={<BookMarked className="h-4 w-4 text-brand-600" />}
          />
          <AdminKpiCard
            label="Scripts Awaiting Grading"
            value={String(pendingGrading.length)}
            numericValue={pendingGrading.length}
            badgeText={
              pendingGrading.length > 0 ? "Theory Marking Open" : "All Caught Up"
            }
            badgeTone="porcelain"
            icon={<CheckSquare className="h-4 w-4 text-accent-gold" />}
          />
          <AdminKpiCard
            label="Graded Class Average"
            value={`${avgScore}%`}
            numericValue={avgScore}
            suffix="%"
            badgeText={`${teacher.assignedClasses.length} Assigned Classes`}
            badgeTone="sky"
            icon={<Users className="h-4 w-4 text-accent-success" />}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Left 7 Cols: Live Room & Exam Schedule */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-extrabold text-brand-950">
                  Live Invigilation & Scheduled Papers
                </h2>
                <p className="text-xs font-medium text-ink-secondary">
                  Monitor active seats or edit assessment blueprints.
                </p>
              </div>
              <Link
                href="/teacher/live-monitor"
                className="inline-flex items-center gap-1 font-display text-xs font-extrabold text-brand-600 hover:text-brand-800"
              >
                Live Monitor <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {liveExams.map((live) => (
              <div
                key={live.id}
                className="surface-slab-ink rounded-card border-2 border-brand-600 p-5 text-ink-on-blue space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-pill bg-accent-gold px-2.5 py-0.5 font-display text-[10px] font-extrabold text-brand-950">
                    <Radio className="h-3 w-3 animate-pulse" />
                    LIVE INVIGILATION ROOM
                  </span>
                  <span className="font-mono text-xs font-bold text-accent-sky">
                    PIN: {live.accessPin ?? "Open"} · {live.venue}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-extrabold">
                      {live.title}
                    </h3>
                    <p className="text-xs font-semibold text-ink-on-blue-muted">
                      {liveCandidates.length} seated candidates ·{" "}
                      {flaggedCandidates.length} focus alert(s)
                    </p>
                  </div>
                  <CtaButton
                    variant="primary"
                    size="xs"
                    href="/teacher/live-monitor"
                    trailingArrow
                  >
                    Open Live Room
                  </CtaButton>
                </div>
              </div>
            ))}

            <div className="surface-gloss-card p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-extrabold text-brand-950">
                  Recent Papers
                </h3>
                <Link
                  href="/teacher/exams"
                  className="font-display text-xs font-extrabold text-brand-600 hover:text-brand-800"
                >
                  Manage All
                </Link>
              </div>
              <div className="space-y-2">
                {exams.slice(0, 4).map((ex) => (
                  <div
                    key={ex.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-brand-100 bg-surface-pearl/70 px-3.5 py-2.5"
                  >
                    <div>
                      <p className="font-display text-xs sm:text-sm font-extrabold text-brand-950">
                        {ex.title}
                      </p>
                      <p className="text-[11px] font-medium text-ink-secondary">
                        {ex.classLevel} · {ex.questionIds.length} Questions ·{" "}
                        {ex.durationMinutes}m
                      </p>
                    </div>
                    <AdminStatusPill
                      status={
                        ex.status === "live"
                          ? "active"
                          : ex.status === "completed"
                            ? "completed"
                            : "pending"
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Theory Grading Queue & Assigned Classes */}
          <div className="lg:col-span-5 space-y-4">
            <div className="surface-gloss-card p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-base font-extrabold text-brand-950">
                    Theory Marking Queue
                  </h2>
                  <p className="text-xs font-medium text-ink-secondary">
                    Scripts with objective auto-scored, awaiting theory marks.
                  </p>
                </div>
                <PillBadge tone="sky" className="px-2.5 py-0.5 text-[10px]">
                  {pendingGrading.length} Pending
                </PillBadge>
              </div>

              {pendingGrading.length === 0 ? (
                <p className="rounded-2xl border border-brand-100 bg-surface-pearl p-4 text-xs font-semibold text-ink-secondary">
                  All submitted scripts have been graded and published!
                </p>
              ) : (
                <div className="space-y-2">
                  {pendingGrading.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between gap-2 rounded-2xl border border-brand-100 bg-surface-pearl/70 p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-display text-xs font-extrabold text-brand-950">
                          {sub.studentName} ({sub.studentRegNo})
                        </p>
                        <p className="truncate text-[11px] font-medium text-ink-secondary">
                          {sub.examTitle} · Obj {sub.objectiveScore}/
                          {sub.objectiveMax}
                        </p>
                      </div>
                      <CtaButton
                        variant="secondary"
                        size="xs"
                        href="/teacher/grading"
                      >
                        Grade
                      </CtaButton>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="surface-gloss-card p-4 sm:p-5 space-y-3">
              <h3 className="font-display text-base font-extrabold text-brand-950">
                Assigned Classes & Quick Actions
              </h3>
              <div className="flex flex-wrap gap-2">
                {teacher.assignedClasses.map((cls) => (
                  <PillBadge
                    key={cls}
                    tone="porcelain"
                    className="px-3 py-1 text-xs"
                  >
                    {cls}
                  </PillBadge>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <CtaButton
                  variant="secondary"
                  size="xs"
                  href="/teacher/question-bank"
                >
                  <BookMarked className="h-3.5 w-3.5" />
                  Add Question
                </CtaButton>
                <CtaButton
                  variant="secondary"
                  size="xs"
                  href="/teacher/analytics"
                >
                  <ClipboardList className="h-3.5 w-3.5" />
                  Broadsheets
                </CtaButton>
              </div>
            </div>
          </div>
        </div>
      </AdminWorkspaceSlab>
    </div>
  );
}

