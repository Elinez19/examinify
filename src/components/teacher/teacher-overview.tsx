"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  FileCheck2,
  Users,
} from "lucide-react";
import { AdminHeroBanner } from "@/components/admin/ui/admin-hero-banner";
import { AdminKpiCard } from "@/components/admin/ui/admin-kpi-card";
import { AdminSectionCard } from "@/components/admin/ui/admin-section-card";
import { usePortalStore } from "@/hooks/portal/use-portal-store";

export function TeacherOverviewWorkspace() {
  const { store, activeSessionTerm } = usePortalStore();

  const liveExams = store.exams.filter((exam) => exam.status === "live");
  const pendingReview = store.submissions.filter(
    (sub) => sub.gradingStatus === "needs_theory_review"
  );
  const assignedClassCount = store.teacher.assignedClasses.length;
  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : store.teacher.termLabel;

  return (
    <div className="space-y-6">
      <AdminHeroBanner
        eyebrow={`${store.teacher.department} · ${termLabel}`}
        title={`Welcome, ${store.teacher.name}`}
        description="Monitor active CBT sessions, grade pending theory responses, and review your class rosters and question bank."
        badgeLabel={
          liveExams.length > 0 ? "Live Invigilation Active" : "Assessment Ready"
        }
        badgeTone={liveExams.length > 0 ? "emerald" : "brand"}
        metrics={[
          { label: "Active Exams", value: `${liveExams.length}` },
          { label: "Classes", value: `${assignedClassCount}` },
          { label: "Question Bank", value: `${store.questions.length}` },
        ]}
        action={
          <Link
            href="/teacher/live-monitor"
            className="cta-surface-secondary inline-flex items-center gap-2 rounded-pill px-5 py-2.5 font-display text-xs font-extrabold transition-colors"
          >
            <Activity className="h-3.5 w-3.5" />
            Open Live Monitor
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminKpiCard
          label="Active Exams"
          value={String(liveExams.length)}
          badgeText={liveExams.length > 0 ? "Live" : "Idle"}
          badgeTone={liveExams.length > 0 ? "sky" : "blue"}
          tone={liveExams.length > 0 ? "ink" : "gloss"}
          icon={<ClipboardCheck className="h-5 w-5" />}
        />
        <AdminKpiCard
          label="Assigned Classes"
          value={String(assignedClassCount)}
          badgeText="Classes"
          badgeTone="blue"
          tone="gloss"
          icon={<Users className="h-5 w-5" />}
        />
        <AdminKpiCard
          label="Question Bank"
          value={String(store.questions.length)}
          badgeText={`${store.subjects.length} Subjects`}
          badgeTone="blue"
          tone="gloss"
          icon={<BookOpen className="h-5 w-5" />}
        />
        <AdminKpiCard
          label="Pending Grading"
          value={String(pendingReview.length)}
          badgeText={pendingReview.length > 0 ? "Action Needed" : "Clear"}
          badgeTone={pendingReview.length > 0 ? "porcelain" : "sky"}
          tone={pendingReview.length > 0 ? "ink" : "gloss"}
          icon={<FileCheck2 className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminSectionCard
          title="Theory Scripts Awaiting Review"
          description="Scripts containing subjective sections queued for your rubric marks."
          action={
            <Link
              href="/teacher/grading"
              className="inline-flex items-center gap-1 text-xs font-extrabold text-brand-700 hover:text-brand-950"
            >
              Open Grading
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          {pendingReview.length === 0 ? (
            <p className="py-6 text-center text-xs font-medium text-ink-secondary">
              All submitted theory responses have been graded and published.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingReview.map((sub) => (
                <div
                  key={sub.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-brand-100 bg-surface-pearl p-3.5"
                >
                  <div>
                    <p className="font-display text-sm font-extrabold text-brand-950">
                      {sub.studentName}
                    </p>
                    <p className="text-xs font-medium text-ink-secondary">
                      {sub.examTitle} · {sub.submittedAt}
                    </p>
                  </div>
                  <Link
                    href={`/teacher/grading?scriptId=${encodeURIComponent(sub.id)}`}
                    className="cta-surface-primary rounded-pill px-4 py-1.5 font-display text-xs font-extrabold text-ink-on-blue transition-colors"
                  >
                    Grade Script
                  </Link>
                </div>
              ))}
            </div>
          )}
        </AdminSectionCard>

        <AdminSectionCard
          title="Quick Navigation"
          description="Direct shortcuts to your focused teacher tables and workspaces."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/teacher/class-list"
              className="rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4 shadow-gloss-card transition-all hover:border-brand-400 hover:bg-surface-porcelain"
            >
              <Users className="h-5 w-5 text-brand-700" />
              <p className="mt-2 font-display text-sm font-extrabold text-brand-950">
                ClassList Roster
              </p>
              <p className="mt-0.5 text-xs font-medium text-ink-secondary">
                Inspect students and scripts across your classes.
              </p>
            </Link>
            <Link
              href="/teacher/subjects"
              className="rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4 shadow-gloss-card transition-all hover:border-brand-400 hover:bg-surface-porcelain"
            >
              <BookOpen className="h-5 w-5 text-brand-700" />
              <p className="mt-2 font-display text-sm font-extrabold text-brand-950">
                Subjects & Bank
              </p>
              <p className="mt-0.5 text-xs font-medium text-ink-secondary">
                Author or edit CBT items for your assigned subjects.
              </p>
            </Link>
            <Link
              href="/teacher/live-monitor"
              className="rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4 shadow-gloss-card transition-all hover:border-brand-400 hover:bg-surface-porcelain"
            >
              <Activity className="h-5 w-5 text-accent-success" />
              <p className="mt-2 font-display text-sm font-extrabold text-brand-950">
                Live Invigilation
              </p>
              <p className="mt-0.5 text-xs font-medium text-ink-secondary">
                Track active seats, extend time, and broadcast notices.
              </p>
            </Link>
            <Link
              href="/teacher/analytics"
              className="rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4 shadow-gloss-card transition-all hover:border-brand-400 hover:bg-surface-porcelain"
            >
              <FileCheck2 className="h-5 w-5 text-accent-gold" />
              <p className="mt-2 font-display text-sm font-extrabold text-brand-950">
                Score Broadsheets
              </p>
              <p className="mt-0.5 text-xs font-medium text-ink-secondary">
                Review published marks and export CSV reports.
              </p>
            </Link>
          </div>
        </AdminSectionCard>
      </div>
    </div>
  );
}
