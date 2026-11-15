"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  FileSearch,
  MessageSquareWarning,
  Play,
  ShieldCheck,
} from "lucide-react";
import { AdminHeroBanner } from "@/components/admin/ui/admin-hero-banner";
import { AdminSectionCard } from "@/components/admin/ui/admin-section-card";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminDialogModal } from "@/components/admin/ui/admin-dialog-modal";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type { ExamSubmission } from "@/data/portal-mock-data";
import { cn } from "@/lib/utils";
import { ScriptAppealForm } from "./script-appeal-form";

type ExamFilterTab = "all" | "live" | "scheduled" | "results";

export function StudentExamsWorkspace() {
  const { store, submitAppeal } = usePortalStore();
  const [activeTab, setActiveTab] = React.useState<ExamFilterTab>("all");
  const [reviewSubmission, setReviewSubmission] =
    React.useState<ExamSubmission | null>(null);
  const [appealTarget, setAppealTarget] =
    React.useState<ExamSubmission | null>(null);
  const [appealReason, setAppealReason] = React.useState("");
  const [appealNotice, setAppealNotice] = React.useState<string | null>(null);
  const [feedbackDialog, setFeedbackDialog] = React.useState<{
    variant: "success" | "warning";
    title: string;
    description: string;
  } | null>(null);
  const appealFormRef = React.useRef<HTMLDivElement | null>(null);

  const myExams = store.exams.filter(
    (exam) =>
      exam.classLevel === store.student.classLevel ||
      exam.classLevel.startsWith(store.student.classLevel.split(" ")[0] ?? "")
  );

  const mySubmissions = store.submissions.filter(
    (sub) => sub.studentId === store.student.id
  );

  const filteredExams = myExams.filter((exam) => {
    if (activeTab === "live") return exam.status === "live";
    if (activeTab === "scheduled") return exam.status === "scheduled";
    if (activeTab === "results") return false;
    return true;
  });

  const handleAppealSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!appealTarget) return;
    if (!appealReason.trim()) {
      setFeedbackDialog({
        variant: "warning",
        title: "Appeal Reason Required",
        description:
          "Please describe the question number and marking point you want reviewed.",
      });
      return;
    }
    const examTitle = appealTarget.examTitle;
    submitAppeal(appealTarget.id, appealReason.trim());
    const message = `Remark appeal submitted for ${examTitle}. Your subject teacher will review it.`;
    setAppealNotice(message);
    setAppealTarget(null);
    setAppealReason("");
    setFeedbackDialog({
      variant: "success",
      title: "Remark Appeal Submitted",
      description: message,
    });
  };

  return (
    <div className="space-y-6">
      <AdminHeroBanner
        eyebrow="Assessment Portal"
        title="Examinations & Scripts"
        description={`Launch active computer-based assessments for ${store.student.classLevel}, check upcoming dates, and review marked scripts.`}
        badgeLabel="Proctored CBT"
        badgeTone="brand"
        metrics={[
          {
            label: "Live Now",
            value: `${myExams.filter((item) => item.status === "live").length}`,
          },
          {
            label: "Upcoming",
            value: `${myExams.filter((item) => item.status === "scheduled").length}`,
          },
          { label: "Submitted", value: `${mySubmissions.length}` },
        ]}
      />

      {appealNotice && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-900">
          <span>{appealNotice}</span>
          <button
            type="button"
            onClick={() => setAppealNotice(null)}
            className="text-emerald-700 underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: "all", label: "All Assessments" },
            { id: "live", label: "Live CBTs" },
            { id: "scheduled", label: "Upcoming Schedule" },
            { id: "results", label: `Published & Submitted (${mySubmissions.length})` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-pill px-4 py-2 font-display text-xs font-extrabold transition-colors cursor-pointer",
              activeTab === tab.id
                ? "cta-surface-primary text-ink-on-blue"
                : "border-2 border-brand-100 bg-surface-porcelain text-brand-800 shadow-gloss-card hover:bg-surface-mist"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab !== "results" && (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredExams.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-brand-100 bg-white p-8 text-center text-sm font-medium text-ink-secondary">
              No examinations match this filter right now.
            </div>
          ) : (
            filteredExams.map((exam) => {
              const submitted = mySubmissions.find(
                (item) => item.examId === exam.id
              );
              return (
                <div
                  key={exam.id}
                  className="flex flex-col justify-between rounded-3xl border border-brand-200/80 bg-white p-5 shadow-xs"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[11px] font-extrabold text-brand-900">
                        {exam.subjectCode} · {exam.subjectTitle}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase",
                          exam.status === "live"
                            ? "bg-emerald-100 text-emerald-800"
                            : exam.status === "scheduled"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-700"
                        )}
                      >
                        {exam.status}
                      </span>
                    </div>

                    <h3 className="mt-3 font-display text-lg font-extrabold text-brand-950">
                      {exam.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-ink-secondary">
                      {Array.isArray(exam.instructions)
                        ? exam.instructions.join(" ")
                        : exam.instructions}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-brand-800">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-brand-500" />
                        {exam.durationMinutes} mins
                      </span>
                      <span>{exam.questionIds.length} Questions</span>
                      <span>{exam.totalMarks} Marks</span>
                      {exam.proctoringEnabled && (
                        <span className="inline-flex items-center gap-1 text-emerald-700">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Proctored
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-brand-100 pt-4">
                    <span className="text-xs font-semibold text-ink-secondary">
                      {exam.scheduledFor}
                    </span>

                    {submitted ? (
                      <button
                        type="button"
                        onClick={() => setReviewSubmission(submitted)}
                        className="cta-surface-secondary inline-flex items-center gap-1.5 rounded-pill px-3.5 py-2 font-display text-xs font-extrabold transition-colors cursor-pointer"
                      >
                        <FileSearch className="h-3.5 w-3.5" />
                        View Script
                      </button>
                    ) : exam.status === "live" ? (
                      <Link
                        href={`/exam/${exam.id}`}
                        className="cta-surface-primary inline-flex items-center gap-1.5 rounded-pill px-4 py-2 font-display text-xs font-extrabold text-ink-on-blue transition-colors"
                      >
                        <Play className="h-3.5 w-3.5" />
                        Start Examination
                      </Link>
                    ) : (
                      <span className="rounded-xl bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-600">
                        Not Yet Open
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {(activeTab === "all" || activeTab === "results") && (
        <div className="space-y-6">
          <ScriptAppealForm
            formRef={appealFormRef}
            target={appealTarget}
            onClose={() => setAppealTarget(null)}
            reason={appealReason}
            setReason={setAppealReason}
            onSubmit={handleAppealSubmit}
          />

          <AdminSectionCard
            title="Submitted Scripts & Published Results"
            description="Inspect question-by-question feedback or submit an inline remark appeal."
          >
          {mySubmissions.length === 0 ? (
            <p className="py-6 text-center text-sm font-medium text-ink-secondary">
              You have not submitted any examination scripts yet.
            </p>
          ) : (
            <div className="space-y-3">
              {mySubmissions.map((sub) => {
                const earned = sub.objectiveEarned + sub.theoryEarned;
                const total = sub.objectiveTotal + sub.theoryTotal;
                const pct = total > 0 ? Math.round((earned / total) * 100) : 0;
                return (
                  <div
                    key={sub.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[10px] font-extrabold text-brand-900">
                          {sub.subjectCode}
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase",
                            sub.gradingStatus === "published"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          )}
                        >
                          {sub.gradingStatus === "published"
                            ? "Published"
                            : "Theory Pending Review"}
                        </span>
                        {sub.appealStatus === "pending" && (
                          <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-rose-800">
                            Appeal Under Review
                          </span>
                        )}
                      </div>
                      <p className="font-display text-sm sm:text-base font-extrabold text-brand-950">
                        {sub.examTitle}
                      </p>
                      <p className="text-xs font-medium text-ink-secondary">
                        Submitted {sub.submittedAt} · {sub.timeSpentMinutes} mins spent
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="rounded-2xl border border-brand-200 bg-white px-4 py-2 text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-brand-500">
                          Score
                        </p>
                        <p className="font-display text-base font-black text-brand-950">
                          {earned}/{total} ({pct}%)
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setReviewSubmission(sub)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-brand-200 bg-white px-3.5 py-2 text-xs font-extrabold text-brand-900 hover:bg-brand-50 transition-colors cursor-pointer"
                      >
                        <FileSearch className="h-3.5 w-3.5" />
                        Review Script
                      </button>

                      {sub.gradingStatus === "published" &&
                        sub.appealStatus !== "pending" && (
                          <button
                            type="button"
                            onClick={() => {
                              setAppealTarget(sub);
                              setAppealReason("");
                              window.requestAnimationFrame(() => {
                                appealFormRef.current?.scrollIntoView({
                                  behavior: "smooth",
                                  block: "start",
                                });
                              });
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-extrabold text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer"
                          >
                            <MessageSquareWarning className="h-3.5 w-3.5" />
                            Request Remark
                          </button>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          </AdminSectionCard>
        </div>
      )}

      {/* Contextual Script Review Modal */}
      <AdminModal
        open={Boolean(reviewSubmission)}
        onOpenChange={(open) => {
          if (!open) setReviewSubmission(null);
        }}
        eyebrow="Marked Script Breakdown"
        title={reviewSubmission?.examTitle ?? "Script Review"}
        description={
          reviewSubmission
            ? `Submitted ${reviewSubmission.submittedAt} · Objective: ${reviewSubmission.objectiveEarned}/${reviewSubmission.objectiveTotal} · Theory: ${reviewSubmission.theoryEarned}/${reviewSubmission.theoryTotal}`
            : undefined
        }
        size="lg"
      >
        {reviewSubmission && (
          <div className="space-y-4">
            {reviewSubmission.overallFeedback && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs font-medium text-emerald-950">
                <p className="font-extrabold uppercase tracking-wider text-emerald-800">
                  Teacher Feedback
                </p>
                <p className="mt-1">{reviewSubmission.overallFeedback}</p>
              </div>
            )}

            <div className="space-y-3">
              {store.questions
                .filter((question) =>
                  Object.prototype.hasOwnProperty.call(
                    reviewSubmission.answers ?? {},
                    question.id
                  )
                )
                .map((question, idx) => {
                  const ans = reviewSubmission.answers?.[question.id];
                  const theoryEntry = (
                    reviewSubmission.theoryScores ??
                    reviewSubmission.theoryScoresByQuestion
                  )?.[question.id];
                  return (
                    <div
                      key={question.id}
                      className="rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4"
                    >
                      <div className="flex items-center justify-between gap-2 text-[11px] font-extrabold uppercase tracking-wider text-brand-600">
                        <span>
                          Question {idx + 1} · {question.type.replace("_", " ")}
                        </span>
                        <span>{question.marks} marks</span>
                      </div>
                      <p className="mt-1.5 text-sm font-bold text-brand-950">
                        {question.prompt}
                      </p>
                      <p className="mt-2 rounded-xl bg-white p-2.5 text-xs font-medium text-ink-primary border border-brand-100">
                        Your response:{" "}
                        <span className="font-bold">
                          {Array.isArray(ans) ? ans.join(", ") : String(ans || "No response")}
                        </span>
                      </p>
                      {theoryEntry && (
                        <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Scored {theoryEntry.score}/{theoryEntry.maxScore} —{" "}
                          {theoryEntry.comment}
                        </p>
                      )}
                      {question.explanation && (
                        <p className="mt-2 text-xs font-medium text-ink-secondary">
                          Note: {question.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </AdminModal>

      <AdminDialogModal
        open={Boolean(feedbackDialog)}
        onOpenChange={(open) => {
          if (!open) setFeedbackDialog(null);
        }}
        variant={feedbackDialog?.variant ?? "success"}
        eyebrow={
          feedbackDialog?.variant === "warning"
            ? "Validation"
            : "Appeal Submitted"
        }
        title={feedbackDialog?.title ?? ""}
        description={feedbackDialog?.description}
        cancelLabel="Done"
      />
    </div>
  );
}
