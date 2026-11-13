"use client";

import * as React from "react";
import {
  Calculator,
  CalendarClock,
  CheckCircle2,
  Clock,
  KeyRound,
  Play,
  Radio,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import { AdminSearchInput } from "@/components/admin/ui/admin-form-controls";
import { AdminSegmentedTabs } from "@/components/admin/ui/admin-segmented-tabs";
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type { PortalExamStatus } from "@/data/portal-mock-data";

type ExamFilter = "all" | "live" | "scheduled" | "practice" | "completed";

export function StudentExamsWorkspace() {
  const { store } = usePortalStore();
  const [filter, setFilter] = React.useState<ExamFilter>("all");
  const [search, setSearch] = React.useState("");

  const visibleExams = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return store.exams.filter((exam) => {
      if (exam.status === "draft") return false;
      if (filter !== "all" && exam.status !== filter) return false;
      if (!q) return true;
      return (
        exam.title.toLowerCase().includes(q) ||
        exam.subjectName.toLowerCase().includes(q) ||
        exam.code.toLowerCase().includes(q)
      );
    });
  }, [store.exams, filter, search]);

  const counts = React.useMemo(() => {
    const nonDraft = store.exams.filter((e) => e.status !== "draft");
    const countOf = (st: PortalExamStatus) =>
      nonDraft.filter((e) => e.status === st).length;
    return {
      all: nonDraft.length,
      live: countOf("live"),
      scheduled: countOf("scheduled"),
      practice: countOf("practice"),
      completed: countOf("completed"),
    };
  }, [store.exams]);

  return (
    <div className="space-y-3 sm:space-y-4">
      <AdminHeroBanner
        eyebrow="CBT Timetable & Practice Hall"
        eyebrowIcon="shield"
        headline="Your Scheduled Exams & Drills."
        highlightWords={["Scheduled", "Exams"]}
        subtitle="Check room assignments, access PINs, and offline readiness before launching into the distraction-free CBT exam hall."
        primaryCta={{
          label: "Results & Scripts",
          href: "/student/results",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <AdminSegmentedTabs
            layoutId="student-exams-tabs"
            ariaLabel="Filter student exams"
            value={filter}
            onChange={setFilter}
            options={[
              { id: "all", label: "All", count: counts.all },
              { id: "live", label: "Live Now", count: counts.live },
              { id: "scheduled", label: "Scheduled", count: counts.scheduled },
              { id: "practice", label: "Practice", count: counts.practice },
              { id: "completed", label: "Completed", count: counts.completed },
            ]}
          />

          <AdminSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search exam title, subject or code..."
          />
        </div>

        {/* Exam Cards Grid */}
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {visibleExams.length === 0 ? (
            <div className="surface-gloss-card col-span-full p-8 text-center">
              <p className="font-display text-base font-extrabold text-brand-950">
                No exams match this filter
              </p>
              <p className="mt-1 text-xs font-medium text-ink-secondary">
                Try switching tabs or clearing your search query.
              </p>
            </div>
          ) : (
            visibleExams.map((exam) => {
              const isLive = exam.status === "live";
              const submission = store.submissions.find(
                (s) =>
                  s.examId === exam.id &&
                  s.studentId === store.student.id &&
                  exam.status !== "practice"
              );

              return (
                <article
                  key={exam.id}
                  className={
                    isLive
                      ? "surface-slab-ink rounded-card border-2 border-brand-600 p-5 text-ink-on-blue flex flex-col justify-between gap-4"
                      : "surface-gloss-card p-5 flex flex-col justify-between gap-4"
                  }
                >
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {isLive ? (
                          <span className="inline-flex items-center gap-1.5 rounded-pill bg-accent-gold px-2.5 py-0.5 font-display text-[10px] font-extrabold text-brand-950">
                            <Radio className="h-3 w-3 animate-pulse" />
                            LIVE EXAM
                          </span>
                        ) : (
                          <AdminStatusPill
                            status={
                              exam.status === "completed"
                                ? "completed"
                                : exam.status === "practice"
                                  ? "active"
                                  : "pending"
                            }
                          />
                        )}
                        <PillBadge
                          tone={isLive ? "blue" : "sky"}
                          className="px-2.5 py-0.5 text-[10px]"
                        >
                          {exam.subjectName}
                        </PillBadge>
                      </div>

                      <span
                        className={
                          isLive
                            ? "font-mono text-[11px] font-bold text-accent-sky"
                            : "font-mono text-[11px] font-bold text-brand-600"
                        }
                      >
                        {exam.code}
                      </span>
                    </div>

                    <h3
                      className={
                        isLive
                          ? "font-display text-lg font-extrabold text-ink-on-blue"
                          : "font-display text-lg font-extrabold text-brand-950"
                      }
                    >
                      {exam.title}
                    </h3>

                    <div
                      className={
                        isLive
                          ? "grid grid-cols-2 gap-2 text-xs font-semibold text-ink-on-blue-muted"
                          : "grid grid-cols-2 gap-2 text-xs font-semibold text-ink-secondary"
                      }
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        {exam.durationMinutes} minutes
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                        {exam.scheduledDate} · {exam.scheduledTime}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                        {exam.questionIds.length} Questions · {exam.teacherName}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Wifi className="h-3.5 w-3.5 shrink-0 text-accent-success" />
                        {exam.venue}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {exam.allowCalculator && (
                        <span
                          className={
                            isLive
                              ? "inline-flex items-center gap-1 rounded-pill bg-brand-950/60 px-2.5 py-0.5 text-[10px] font-bold text-ink-on-blue-muted"
                              : "inline-flex items-center gap-1 rounded-pill bg-surface-pearl px-2.5 py-0.5 text-[10px] font-bold text-brand-700 border border-brand-100"
                          }
                        >
                          <Calculator className="h-3 w-3" />
                          Calculator Enabled
                        </span>
                      )}
                      {exam.accessPin && (
                        <span
                          className={
                            isLive
                              ? "inline-flex items-center gap-1 rounded-pill bg-brand-950/60 px-2.5 py-0.5 font-mono text-[10px] font-bold text-accent-gold"
                              : "inline-flex items-center gap-1 rounded-pill bg-brand-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-brand-700 border border-brand-100"
                          }
                        >
                          <KeyRound className="h-3 w-3" />
                          Gate PIN: {exam.accessPin}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-brand-200/30 pt-3">
                    <span
                      className={
                        isLive
                          ? "text-[11px] font-semibold text-ink-on-blue-muted"
                          : "text-[11px] font-semibold text-ink-muted"
                      }
                    >
                      Pass Mark: {exam.passMarkPercent}%
                    </span>

                    {submission ? (
                      <CtaButton
                        variant="secondary"
                        size="xs"
                        href="/student/results"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent-success" />
                        Submitted · View Result
                      </CtaButton>
                    ) : (
                      <CtaButton
                        variant={isLive || exam.status === "practice" ? "primary" : "secondary"}
                        size="xs"
                        href={`/exam/${exam.id}`}
                        trailingArrow
                      >
                        <Play className="h-3.5 w-3.5" />
                        {isLive
                          ? "Enter Exam Hall"
                          : exam.status === "practice"
                            ? "Launch Practice"
                            : "Open Pre-Exam Lobby"}
                      </CtaButton>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </AdminWorkspaceSlab>
    </div>
  );
}

