"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  KeyRound,
  Play,
  Radio,
  Wifi,
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

export function StudentOverviewWorkspace() {
  const { store } = usePortalStore();
  const { student, exams, subjects, submissions } = store;

  const mySubmissions = submissions.filter((s) => s.studentId === student.id);
  const publishedResults = mySubmissions.filter(
    (s) => s.gradingStatus === "published" || s.gradingStatus === "auto_graded"
  );
  const avgScore =
    publishedResults.length > 0
      ? Math.round(
          publishedResults.reduce((sum, s) => sum + s.percentage, 0) /
            publishedResults.length
        )
      : 0;

  const liveExams = exams.filter((e) => e.status === "live");
  const primaryExam = liveExams[0] ?? exams.find((e) => e.status === "scheduled");
  const upcomingAndPractice = exams.filter(
    (e) => e.status === "live" || e.status === "scheduled" || e.status === "practice"
  );

  return (
    <div className="space-y-3 sm:space-y-4">
      <AdminHeroBanner
        eyebrow={`${student.schoolName} · ${student.term}`}
        eyebrowIcon="dot"
        headline={`Welcome back, ${student.name}.`}
        highlightWords={[student.name]}
        subtitle={`Candidate ${student.regNo} (${student.classLevel}). Your offline-ready CBT packs are synced. Enter live assessments, drill practice papers, or review published scripts.`}
        primaryCta={
          primaryExam
            ? {
                label:
                  primaryExam.status === "live"
                    ? "Enter Live Exam Hall"
                    : "View Scheduled Exams",
                href:
                  primaryExam.status === "live"
                    ? `/exam/${primaryExam.id}`
                    : "/student/exams",
                variant: "primary",
                icon: <Play className="h-3.5 w-3.5" />,
                trailingArrow: true,
              }
            : {
                label: "Browse Practice Drills",
                href: "/student/exams",
                variant: "primary",
                trailingArrow: true,
              }
        }
        secondaryCta={{
          label: "Results & Scripts",
          href: "/student/results",
          variant: "secondary",
        }}
        rightSlot={
          <div className="hidden xl:flex items-center gap-3.5 pr-1">
            <Float amplitude={5} duration={4.8}>
              <OffsetRing size="md" faceTone="ink" className="h-20 w-20 text-xs">
                <div className="space-y-0.5 leading-tight">
                  <span className="block text-accent-sky text-lg font-extrabold">
                    {avgScore}%
                  </span>
                  <span className="block text-[9px] font-bold text-ink-on-blue-muted">
                    Term Avg
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
                    {liveExams.length} Live
                  </span>
                  <span className="block text-[8px] font-bold text-ink-secondary">
                    Exam Hall
                  </span>
                </div>
              </OffsetRing>
            </Float>
          </div>
        }
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          <AdminKpiCard
            label="Live & Upcoming Exams"
            value={String(
              exams.filter((e) => e.status === "live" || e.status === "scheduled")
                .length
            )}
            numericValue={
              exams.filter((e) => e.status === "live" || e.status === "scheduled")
                .length
            }
            badgeText={`${liveExams.length} Live Right Now`}
            badgeTone="blue"
            badgeIcon="dot"
            icon={<ClipboardCheck className="h-4 w-4 text-accent-gold" />}
            tone="ink"
          />
          <AdminKpiCard
            label="Completed Papers"
            value={String(mySubmissions.length)}
            numericValue={mySubmissions.length}
            badgeText="All Scripts Synced"
            badgeTone="sky"
            icon={<CheckCircle2 className="h-4 w-4 text-accent-success" />}
          />
          <AdminKpiCard
            label="Published Average"
            value={`${avgScore}%`}
            numericValue={avgScore}
            suffix="%"
            badgeText="First Term Standing"
            badgeTone="porcelain"
            icon={<Award className="h-4 w-4 text-brand-600" />}
          />
          <AdminKpiCard
            label="Enrolled Subjects"
            value={String(subjects.length)}
            numericValue={subjects.length}
            badgeText="Offline Drills Cached"
            badgeTone="sky"
            icon={<BookOpen className="h-4 w-4 text-brand-600" />}
          />
        </div>

        {/* Main Grid: Live & Upcoming Exams + Recent Results */}
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-extrabold text-brand-950">
                  Exam Hall & Practice Queue
                </h2>
                <p className="text-xs font-medium text-ink-secondary">
                  Launch live CBT sittings or sharpen speed with offline practice drills.
                </p>
              </div>
              <Link
                href="/student/exams"
                className="inline-flex items-center gap-1 font-display text-xs font-extrabold text-brand-600 hover:text-brand-800"
              >
                All Exams <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingAndPractice.slice(0, 3).map((exam) => {
                const isLive = exam.status === "live";
                const alreadySubmitted = mySubmissions.some(
                  (s) => s.examId === exam.id && exam.status !== "practice"
                );

                return (
                  <article
                    key={exam.id}
                    className={
                      isLive
                        ? "surface-slab-ink rounded-card border-2 border-brand-600 p-4 sm:p-5 text-ink-on-blue"
                        : "surface-gloss-card p-4 sm:p-5"
                    }
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          {isLive ? (
                            <span className="inline-flex items-center gap-1.5 rounded-pill bg-accent-gold px-2.5 py-0.5 font-display text-[10px] font-extrabold text-brand-950">
                              <Radio className="h-3 w-3 animate-pulse" />
                              LIVE NOW
                            </span>
                          ) : (
                            <AdminStatusPill
                              status={
                                exam.status === "practice"
                                  ? "active"
                                  : "pending"
                              }
                            />
                          )}
                          <span
                            className={
                              isLive
                                ? "font-mono text-[11px] font-bold text-accent-sky"
                                : "font-mono text-[11px] font-bold text-brand-600"
                            }
                          >
                            {exam.code}
                          </span>
                          {exam.offlineReady && (
                            <span
                              className={
                                isLive
                                  ? "inline-flex items-center gap-1 rounded-pill bg-brand-950/60 px-2 py-0.5 text-[10px] font-bold text-ink-on-blue-muted"
                                  : "inline-flex items-center gap-1 rounded-pill bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700 border border-brand-100"
                              }
                            >
                              <Wifi className="h-2.5 w-2.5 text-accent-success" />
                              Offline Ready
                            </span>
                          )}
                        </div>

                        <h3
                          className={
                            isLive
                              ? "font-display text-base sm:text-lg font-extrabold text-ink-on-blue"
                              : "font-display text-base sm:text-lg font-extrabold text-brand-950"
                          }
                        >
                          {exam.title}
                        </h3>

                        <div
                          className={
                            isLive
                              ? "flex flex-wrap items-center gap-3 text-xs font-semibold text-ink-on-blue-muted"
                              : "flex flex-wrap items-center gap-3 text-xs font-semibold text-ink-secondary"
                          }
                        >
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {exam.durationMinutes} mins
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <CalendarClock className="h-3.5 w-3.5" />
                            {exam.scheduledDate} · {exam.scheduledTime}
                          </span>
                          <span>{exam.questionIds.length} Questions</span>
                          {exam.accessPin && (
                            <span className="inline-flex items-center gap-1 rounded-pill bg-brand-950/50 px-2 py-0.5 font-mono text-[10px] text-accent-gold">
                              <KeyRound className="h-2.5 w-2.5" />
                              PIN: {exam.accessPin}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0">
                        {alreadySubmitted ? (
                          <CtaButton
                            variant="secondary"
                            size="xs"
                            href="/student/results"
                          >
                            Submitted · View Status
                          </CtaButton>
                        ) : (
                          <CtaButton
                            variant={isLive ? "primary" : "secondary"}
                            size="xs"
                            href={`/exam/${exam.id}`}
                            trailingArrow
                          >
                            {isLive
                              ? "Start Exam"
                              : exam.status === "practice"
                                ? "Start Practice"
                                : "Preview Lobby"}
                          </CtaButton>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Right 5 Cols: Subject Mastery + Latest Result */}
          <div className="lg:col-span-5 space-y-4">
            <div className="surface-gloss-card p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="font-display text-base font-extrabold text-brand-950">
                    Subject Readiness
                  </h2>
                  <p className="text-xs font-medium text-ink-secondary">
                    Mastery across your enrolled {student.classLevel} subjects
                  </p>
                </div>
                <PillBadge tone="sky" className="px-2.5 py-0.5 text-[10px]">
                  {subjects.length} Active
                </PillBadge>
              </div>

              <div className="space-y-3">
                {subjects.map((sub) => (
                  <div
                    key={sub.id}
                    className="rounded-2xl border border-brand-100 bg-surface-pearl/70 p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-display text-xs font-extrabold text-brand-950">
                          {sub.title}
                        </p>
                        <p className="text-[11px] font-medium text-ink-secondary">
                          {sub.teacherName} · {sub.nextAssessment}
                        </p>
                      </div>
                      <span className="font-display text-xs font-extrabold text-brand-700">
                        {sub.masteryPercent}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-pill bg-brand-100">
                      <div
                        className="h-full rounded-pill bg-brand-600 transition-all"
                        style={{ width: `${sub.masteryPercent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Results Snapshot */}
            <div className="surface-gloss-card p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-extrabold text-brand-950">
                  Recent Submissions
                </h2>
                <Link
                  href="/student/results"
                  className="font-display text-xs font-extrabold text-brand-600 hover:text-brand-800"
                >
                  View All
                </Link>
              </div>

              {mySubmissions.length === 0 ? (
                <p className="text-xs font-medium text-ink-secondary">
                  No scripts submitted yet this term.
                </p>
              ) : (
                <div className="space-y-2">
                  {mySubmissions.slice(0, 3).map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between gap-2 rounded-2xl border border-brand-100 bg-surface-pearl/70 px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-display text-xs font-extrabold text-brand-950">
                          {sub.examTitle}
                        </p>
                        <p className="text-[11px] font-medium text-ink-secondary">
                          {sub.receiptCode} ·{" "}
                          {sub.gradingStatus === "pending_theory"
                            ? `Obj ${sub.objectiveScore}/${sub.objectiveMax} (Awaiting theory)`
                            : `${sub.totalScore}/${sub.totalMax} (${sub.percentage}%)`}
                        </p>
                      </div>
                      <AdminStatusPill
                        status={
                          sub.gradingStatus === "pending_theory"
                            ? "pending"
                            : "completed"
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminWorkspaceSlab>
    </div>
  );
}

