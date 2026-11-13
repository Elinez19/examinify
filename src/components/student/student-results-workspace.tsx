"use client";

import * as React from "react";
import {
  Award,
  CheckCircle2,
  Eye,
  FileText,
  MessageSquareWarning,
  Printer,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import { AdminKpiCard } from "@/components/admin/ui/admin-kpi-card";
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import {
  AdminDataTable,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin/ui/admin-data-table";
import { AdminDialogModal } from "@/components/admin/ui/admin-dialog-modal";
import { AdminTextareaField } from "@/components/admin/ui/admin-form-controls";
import { useAdminToast } from "@/components/admin/ui/admin-toast";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type { ExamSubmission } from "@/data/portal-mock-data";

export function StudentResultsWorkspace() {
  const { store, submitAppeal } = usePortalStore();
  const toast = useAdminToast();

  const [reviewSubmission, setReviewSubmission] =
    React.useState<ExamSubmission | null>(null);
  const [appealTarget, setAppealTarget] =
    React.useState<ExamSubmission | null>(null);
  const [appealReason, setAppealReason] = React.useState("");

  const mySubmissions = React.useMemo(
    () => store.submissions.filter((s) => s.studentId === store.student.id),
    [store.submissions, store.student.id]
  );

  const published = mySubmissions.filter(
    (s) => s.gradingStatus === "published" || s.gradingStatus === "auto_graded"
  );
  const pendingCount = mySubmissions.filter(
    (s) => s.gradingStatus === "pending_theory"
  ).length;
  const averagePct =
    published.length > 0
      ? Math.round(
          published.reduce((sum, s) => sum + s.percentage, 0) / published.length
        )
      : 0;
  const highestPct =
    published.length > 0
      ? Math.max(...published.map((s) => s.percentage))
      : 0;

  const reviewQuestions = React.useMemo(() => {
    if (!reviewSubmission) return [];
    const exam = store.exams.find((e) => e.id === reviewSubmission.examId);
    if (!exam) return [];
    return exam.questionIds
      .map((id) => store.questions.find((q) => q.id === id))
      .filter((q): q is NonNullable<typeof q> => Boolean(q));
  }, [reviewSubmission, store.exams, store.questions]);

  const handleConfirmAppeal = () => {
    if (!appealTarget || appealReason.trim().length < 8) {
      toast.error(
        "Provide Appeal Details",
        "Please enter at least 8 characters describing the question or mark concern."
      );
      return;
    }
    submitAppeal(appealTarget.id, appealReason.trim());
    toast.success(
      "Remark Appeal Submitted",
      `Appeal logged for ${appealTarget.examTitle}.`
    );
    setAppealTarget(null);
    setAppealReason("");
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <AdminHeroBanner
        eyebrow="Published Broadsheets & Script Review"
        eyebrowIcon="shield"
        headline="Results, Grades & Script Reviews."
        highlightWords={["Results,", "Script", "Reviews."]}
        subtitle="Inspect objective and theory scores, review question-by-question explanations, print official slips, or raise a remark appeal."
        primaryCta={{
          label: "Print Result Slip",
          onClick: () => window.print(),
          variant: "secondary",
          icon: <Printer className="h-3.5 w-3.5" />,
        }}
        secondaryCta={{
          label: "Back to Exams",
          href: "/student/exams",
          variant: "primary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          <AdminKpiCard
            label="Term Average"
            value={`${averagePct}%`}
            numericValue={averagePct}
            suffix="%"
            badgeText={`${published.length} Graded Scripts`}
            badgeTone="blue"
            tone="ink"
            icon={<Award className="h-4 w-4 text-accent-gold" />}
          />
          <AdminKpiCard
            label="Highest Score"
            value={`${highestPct}%`}
            numericValue={highestPct}
            suffix="%"
            badgeText="Top Subject Mark"
            badgeTone="sky"
            icon={<CheckCircle2 className="h-4 w-4 text-accent-success" />}
          />
          <AdminKpiCard
            label="Total Submissions"
            value={String(mySubmissions.length)}
            numericValue={mySubmissions.length}
            badgeText="All Receipts Saved"
            badgeTone="porcelain"
            icon={<FileText className="h-4 w-4 text-brand-600" />}
          />
          <AdminKpiCard
            label="Awaiting Theory Grading"
            value={String(pendingCount)}
            numericValue={pendingCount}
            badgeText={pendingCount > 0 ? "Teacher Marking" : "All Graded"}
            badgeTone="sky"
            icon={<ShieldCheck className="h-4 w-4 text-brand-600" />}
          />
        </div>

        <div className="mt-6">
          <AdminDataTable
            title="Submitted Exam Scripts"
            subtitle="Click Review Script to inspect individual questions, answers, and teacher feedback."
            badge={`${mySubmissions.length} Scripts`}
          >
            <AdminTable>
              <AdminTableHeader>
                <AdminTableRow>
                  <AdminTableHead>Exam & Receipt</AdminTableHead>
                  <AdminTableHead>Subject</AdminTableHead>
                  <AdminTableHead>Objective</AdminTableHead>
                  <AdminTableHead>Theory</AdminTableHead>
                  <AdminTableHead>Total / Grade</AdminTableHead>
                  <AdminTableHead>Status</AdminTableHead>
                  <AdminTableHead className="text-right">
                    Actions
                  </AdminTableHead>
                </AdminTableRow>
              </AdminTableHeader>
              <AdminTableBody>
                {mySubmissions.length === 0 ? (
                  <AdminTableRow>
                    <AdminTableCell colSpan={7} className="py-8 text-center">
                      <p className="font-display text-sm font-extrabold text-brand-950">
                        No submitted scripts yet
                      </p>
                    </AdminTableCell>
                  </AdminTableRow>
                ) : (
                  mySubmissions.map((sub) => {
                    const isPendingTheory =
                      sub.gradingStatus === "pending_theory";
                    return (
                      <AdminTableRow key={sub.id}>
                        <AdminTableCell>
                          <p className="font-display text-xs sm:text-sm font-extrabold text-brand-950">
                            {sub.examTitle}
                          </p>
                          <p className="font-mono text-[11px] font-semibold text-ink-secondary">
                            {sub.receiptCode} ·{" "}
                            {new Date(sub.submittedAt).toLocaleDateString()}
                          </p>
                        </AdminTableCell>
                        <AdminTableCell>
                          <PillBadge
                            tone="sky"
                            className="px-2.5 py-0.5 text-[10px]"
                          >
                            {sub.subjectName}
                          </PillBadge>
                        </AdminTableCell>
                        <AdminTableCell>
                          <span className="font-display text-xs font-extrabold text-brand-950">
                            {sub.objectiveScore} / {sub.objectiveMax}
                          </span>
                        </AdminTableCell>
                        <AdminTableCell>
                          <span className="text-xs font-semibold text-ink-secondary">
                            {sub.theoryMax === 0
                              ? "N/A"
                              : isPendingTheory
                                ? `Pending (${sub.theoryMax} max)`
                                : `${sub.theoryScore} / ${sub.theoryMax}`}
                          </span>
                        </AdminTableCell>
                        <AdminTableCell>
                          {isPendingTheory ? (
                            <span className="font-display text-xs font-bold text-ink-muted">
                              Awaiting total
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-display text-sm font-extrabold text-brand-950">
                                {sub.percentage}%
                              </span>
                              <PillBadge
                                tone="blue"
                                className="px-2 py-0.5 text-[10px]"
                              >
                                {sub.grade}
                              </PillBadge>
                            </div>
                          )}
                        </AdminTableCell>
                        <AdminTableCell>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <AdminStatusPill
                              status={
                                isPendingTheory ? "pending" : "completed"
                              }
                            />
                            {sub.appealStatus === "submitted" && (
                              <PillBadge
                                tone="porcelain"
                                className="px-2 py-0.5 text-[10px]"
                              >
                                Appeal Open
                              </PillBadge>
                            )}
                          </div>
                        </AdminTableCell>
                        <AdminTableCell className="text-right">
                          <div className="inline-flex items-center gap-2">
                            <CtaButton
                              variant="secondary"
                              size="xs"
                              onClick={() => setReviewSubmission(sub)}
                            >
                              <Eye className="h-3 w-3" />
                              Review
                            </CtaButton>
                            {sub.appealStatus !== "submitted" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setAppealTarget(sub);
                                  setAppealReason("");
                                }}
                                className="inline-flex items-center gap-1 rounded-pill border border-brand-200 bg-surface-porcelain px-2.5 py-1.5 font-display text-[11px] font-extrabold text-brand-700 hover:bg-brand-50 cursor-pointer"
                              >
                                <MessageSquareWarning className="h-3 w-3" />
                                Appeal
                              </button>
                            )}
                          </div>
                        </AdminTableCell>
                      </AdminTableRow>
                    );
                  })
                )}
              </AdminTableBody>
            </AdminTable>
          </AdminDataTable>
        </div>

        {/* Script Review Panel (Inline Gloss Card when selected) */}
        {reviewSubmission && (
          <div className="mt-6 surface-gloss-card p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-brand-100 pb-4">
              <div>
                <PillBadge tone="sky" className="px-2.5 py-0.5 text-[10px]">
                  Script Review · {reviewSubmission.receiptCode}
                </PillBadge>
                <h3 className="mt-1.5 font-display text-lg font-extrabold text-brand-950">
                  {reviewSubmission.examTitle}
                </h3>
                {reviewSubmission.teacherFeedback && (
                  <p className="mt-1 rounded-xl border border-brand-200 bg-brand-50/70 px-3 py-2 text-xs font-semibold text-brand-900">
                    Teacher Note: {reviewSubmission.teacherFeedback}
                  </p>
                )}
              </div>
              <CtaButton
                variant="secondary"
                size="xs"
                onClick={() => setReviewSubmission(null)}
              >
                Close Review
              </CtaButton>
            </div>

            <div className="space-y-3">
              {reviewQuestions.map((q, idx) => {
                const studentAns = reviewSubmission.answers[q.id] ?? "";
                const isTheory = q.type === "theory";
                const isCorrect =
                  !isTheory &&
                  studentAns.trim().toLowerCase() ===
                    (q.correctAnswer ?? "").trim().toLowerCase();

                return (
                  <div
                    key={q.id}
                    className="rounded-2xl border-2 border-brand-100 bg-surface-pearl/70 p-4 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-display text-xs font-extrabold text-brand-700">
                        Question {idx + 1} · {q.topic} ({q.marks} marks)
                      </span>
                      {isTheory ? (
                        <PillBadge tone="porcelain" className="px-2.5 py-0.5 text-[10px]">
                          {reviewSubmission.gradingStatus === "pending_theory"
                            ? "Pending Theory Mark"
                            : `Scored ${reviewSubmission.theoryScoresByQuestion[q.id] ?? 0} / ${q.marks}`}
                        </PillBadge>
                      ) : isCorrect ? (
                        <span className="inline-flex items-center gap-1 font-display text-xs font-extrabold text-accent-success">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Correct (+{q.marks})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-display text-xs font-extrabold text-accent-warm">
                          <XCircle className="h-3.5 w-3.5" />
                          Incorrect (0/{q.marks})
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-semibold text-brand-950">
                      {q.stem}
                    </p>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
                      <div className="rounded-xl border border-brand-100 bg-surface-porcelain p-2.5">
                        <span className="block font-display text-[10px] font-extrabold uppercase text-ink-muted">
                          Your Answer
                        </span>
                        <span className="mt-0.5 block font-semibold text-brand-950 whitespace-pre-wrap">
                          {studentAns || "No answer recorded"}
                        </span>
                      </div>
                      {!isTheory && q.correctAnswer && (
                        <div className="rounded-xl border border-brand-100 bg-surface-porcelain p-2.5">
                          <span className="block font-display text-[10px] font-extrabold uppercase text-ink-muted">
                            Correct Key
                          </span>
                          <span className="mt-0.5 block font-semibold text-accent-success">
                            {q.correctAnswer}
                          </span>
                        </div>
                      )}
                    </div>

                    {q.explanation && (
                      <p className="text-xs font-medium text-ink-secondary">
                        Explanation: {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </AdminWorkspaceSlab>

      {/* Appeal Modal */}
      <AdminDialogModal
        open={Boolean(appealTarget)}
        onOpenChange={(open) => {
          if (!open) setAppealTarget(null);
        }}
        eyebrow="Result Remark Request"
        title={`Appeal ${appealTarget?.examTitle ?? "Script"}`}
        description="Explain which question number or marking rubric item you would like your subject teacher to review."
        confirmLabel="Submit Appeal"
        onConfirm={handleConfirmAppeal}
      >
        <AdminTextareaField
          label="Reason for Remark Request"
          value={appealReason}
          onChange={(e) => setAppealReason(e.target.value)}
          placeholder="e.g., In Question 5, my elimination steps reached the correct final values n=425, p=200..."
          rows={4}
        />
      </AdminDialogModal>
    </div>
  );
}

