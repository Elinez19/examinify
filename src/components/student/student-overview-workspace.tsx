"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Clock,
  Play,
  Sparkles,
} from "lucide-react";
import { AdminHeroBanner } from "@/components/admin/ui/admin-hero-banner";
import { AdminKpiCard } from "@/components/admin/ui/admin-kpi-card";
import { AdminSectionCard } from "@/components/admin/ui/admin-section-card";
import { usePortalStore } from "@/hooks/portal/use-portal-store";

export function StudentOverviewWorkspace() {
  const { store, activeSessionTerm } = usePortalStore();

  const mySubjects = store.subjects.filter(
    (subject) =>
      subject.status === "active" &&
      (subject.assignedClasses.length === 0 ||
        subject.assignedClasses.includes(store.student.classLevel))
  );

  const myExams = store.exams.filter(
    (exam) =>
      exam.classLevel === store.student.classLevel ||
      exam.classLevel.startsWith(store.student.classLevel.split(" ")[0] ?? "")
  );

  const liveExams = myExams.filter((exam) => exam.status === "live");
  const upcomingExams = myExams.filter((exam) => exam.status === "scheduled");

  const mySubmissions = store.submissions.filter(
    (sub) => sub.studentId === store.student.id
  );
  const publishedSubs = mySubmissions.filter(
    (sub) => sub.gradingStatus === "published"
  );

  const avgScore =
    publishedSubs.length > 0
      ? Math.round(
          publishedSubs.reduce((acc, sub) => {
            const total = sub.objectiveTotal + sub.theoryTotal;
            const earned = sub.objectiveEarned + sub.theoryEarned;
            return acc + (total > 0 ? (earned / total) * 100 : 0);
          }, 0) / publishedSubs.length
        )
      : 0;

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : store.student.termLabel;

  return (
    <div className="space-y-6">
      <AdminHeroBanner
        eyebrow={`${store.student.schoolName} · ${termLabel}`}
        title={`Welcome back, ${store.student.firstName}`}
        description={`Track your ${store.student.classLevel} subjects, enter live computer-based examinations, or practice in Study Mode.`}
        badgeLabel="Offline Sync Active"
        badgeTone="emerald"
        metrics={[
          { label: "Class Arm", value: store.student.classLevel },
          { label: "Enrolled Subjects", value: `${mySubjects.length}` },
          { label: "Live CBTs", value: `${liveExams.length}` },
        ]}
        action={
          liveExams[0] ? (
            <Link
              href={`/exam/${liveExams[0].id}`}
              className="cta-surface-secondary inline-flex items-center gap-2 rounded-pill px-5 py-2.5 font-display text-xs font-extrabold transition-colors"
            >
              <Play className="h-3.5 w-3.5" />
              Enter Live Exam
            </Link>
          ) : (
            <Link
              href="/student/study-mode"
              className="cta-surface-secondary inline-flex items-center gap-2 rounded-pill px-5 py-2.5 font-display text-xs font-extrabold transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Open Study Mode
            </Link>
          )
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminKpiCard
          label="Live Examinations"
          value={String(liveExams.length)}
          badgeText={liveExams.length > 0 ? "Live Now" : "Clear"}
          badgeTone="sky"
          tone={liveExams.length > 0 ? "ink" : "gloss"}
          icon={<Play className="h-5 w-5" />}
        />
        <AdminKpiCard
          label="Scheduled Upcoming"
          value={String(upcomingExams.length)}
          badgeText="Confirmed"
          badgeTone="blue"
          tone="gloss"
          icon={<CalendarClock className="h-5 w-5" />}
        />
        <AdminKpiCard
          label="Class Subjects"
          value={String(mySubjects.length)}
          badgeText={store.student.classLevel}
          badgeTone="blue"
          tone="gloss"
          icon={<BookOpen className="h-5 w-5" />}
        />
        <AdminKpiCard
          label="Published Average"
          value={publishedSubs.length > 0 ? `${avgScore}%` : "—"}
          badgeText={`${publishedSubs.length} script${publishedSubs.length === 1 ? "" : "s"}`}
          badgeTone="porcelain"
          tone="ink"
          icon={<Award className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <AdminSectionCard
          title="Active & Upcoming Examinations"
          description="Verify your exam pass code with your invigilator before starting."
          className="lg:col-span-2"
          action={
            <Link
              href="/student/exams"
              className="inline-flex items-center gap-1 text-xs font-extrabold text-brand-700 hover:text-brand-950"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          <div className="space-y-3">
            {myExams.slice(0, 4).map((exam) => {
              const submitted = mySubmissions.find(
                (sub) => sub.examId === exam.id
              );
              return (
                <div
                  key={exam.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[10px] font-extrabold text-brand-900">
                        {exam.subjectCode}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                          exam.status === "live"
                            ? "bg-emerald-100 text-emerald-800"
                            : exam.status === "scheduled"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {exam.status}
                      </span>
                    </div>
                    <p className="font-display text-sm sm:text-base font-extrabold text-brand-950">
                      {exam.title}
                    </p>
                    <p className="flex flex-wrap items-center gap-3 text-xs font-medium text-ink-secondary">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-brand-500" />
                        {exam.durationMinutes} mins · {exam.totalMarks} marks
                      </span>
                      <span>{exam.scheduledFor}</span>
                    </p>
                  </div>

                  <div>
                    {submitted ? (
                      <Link
                        href="/student/exams"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-extrabold text-emerald-800"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Submitted
                      </Link>
                    ) : exam.status === "live" ? (
                      <Link
                        href={`/exam/${exam.id}`}
                        className="cta-surface-primary inline-flex items-center gap-1.5 rounded-pill px-4 py-2 font-display text-xs font-extrabold text-ink-on-blue transition-colors"
                      >
                        <Play className="h-3.5 w-3.5" />
                        Start CBT
                      </Link>
                    ) : (
                      <span className="inline-flex items-center rounded-xl border border-brand-200 bg-white px-3 py-1.5 text-xs font-bold text-brand-700">
                        {exam.scheduledFor}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title="Quick Study & Class Access"
          description="Jump straight into your class subjects or self-paced revision."
        >
          <div className="space-y-3">
            {mySubjects.map((subject) => (
              <div
                key={subject.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-white p-3.5"
              >
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-extrabold text-brand-950">
                    {subject.title}
                  </p>
                  <p className="truncate text-[11px] font-medium text-ink-secondary">
                    {subject.code} · {subject.teacherName}
                  </p>
                </div>
                <Link
                  href={`/student/study-mode?subject=${encodeURIComponent(subject.code)}`}
                  className="cta-surface-secondary shrink-0 rounded-pill px-3.5 py-1.5 font-display text-[11px] font-extrabold transition-colors"
                >
                  Practice
                </Link>
              </div>
            ))}
          </div>
        </AdminSectionCard>
      </div>
    </div>
  );
}
