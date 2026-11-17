"use client";

import * as React from "react";
import { Award, CheckCircle2, FileSearch, MessageSquareWarning } from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import { AdminSearchInput } from "@/components/admin/ui/admin-form-controls";
import {
  AdminDataTable,
  AdminEmptyState,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin/ui/admin-data-table";
import { AdminActionMenu } from "@/components/admin/ui/admin-action-menu";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import { AdminDialogModal } from "@/components/admin/ui/admin-dialog-modal";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type { ExamSubmission } from "@/data/portal-mock-data";
import { ScriptAppealModal } from "./script-appeal-modal";

export function StudentResultsWorkspace() {
  const { store, activeSessionTerm, submitAppeal } = usePortalStore();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [reviewSubmission, setReviewSubmission] =
    React.useState<ExamSubmission | null>(null);
  const [appealTarget, setAppealTarget] =
    React.useState<ExamSubmission | null>(null);
  const [appealReason, setAppealReason] = React.useState("");
  const [feedbackDialog, setFeedbackDialog] = React.useState<{
    variant: "success" | "warning";
    title: string;
    description: string;
  } | null>(null);

  const mySubmissions = store.submissions.filter(
    (sub) => sub.studentId === store.student.id
  );

  const q = searchQuery.trim().toLowerCase();
  const filteredSubmissions = mySubmissions.filter(
    (sub) =>
      !q ||
      sub.examTitle.toLowerCase().includes(q) ||
      sub.subjectCode.toLowerCase().includes(q)
  );

  const handleAppealConfirm = () => {
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
    setAppealTarget(null);
    setAppealReason("");
    setFeedbackDialog({
      variant: "success",
      title: "Remark Appeal Submitted",
      description: `Remark appeal submitted for ${examTitle}. Your subject teacher will review it.`,
    });
  };

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : store.student.termLabel;

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Examinations · ${termLabel}`}
        eyebrowIcon="dot"
        headline="Results & Marked Scripts."
        highlightWords={["Results", "Scripts."]}
        subtitle="Inspect question-by-question feedback in a review modal or submit a remark appeal via modal."
        primaryCta={{
          label: "Live & Upcoming Exams",
          href: "/student/exams",
          variant: "primary",
          trailingArrow: true,
        }}
        secondaryCta={{
          label: "Study Mode",
          href: "/student/study-mode",
          variant: "secondary",
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <AdminSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search exam title or subject code..."
          />
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Submitted Scripts & Published Results"
            subtitle="Review marked answers or request a remark on published scores."
            badge={`${filteredSubmissions.length} scripts`}
          >
            {filteredSubmissions.length === 0 ? (
              <AdminEmptyState
                title="No Submitted Scripts Yet"
                description="Once you complete a CBT examination, your score and marked script will appear here."
                icon={<Award className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminTableHead>Subject</AdminTableHead>
                    <AdminTableHead>Examination</AdminTableHead>
                    <AdminTableHead>Score</AdminTableHead>
                    <AdminTableHead>Percent</AdminTableHead>
                    <AdminTableHead>Status</AdminTableHead>
                    <AdminTableHead className="text-right">
                      Actions
                    </AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredSubmissions.map((sub) => {
                    const earned = sub.objectiveEarned + sub.theoryEarned;
                    const total = sub.objectiveTotal + sub.theoryTotal;
                    const pct =
                      total > 0 ? Math.round((earned / total) * 100) : 0;
                    return (
                      <AdminTableRow key={sub.id}>
                        <AdminTableCell>
                          <PillBadge
                            tone="sky"
                            className="px-2.5 py-0.5 text-[10px]"
                          >
                            {sub.subjectCode}
                          </PillBadge>
                        </AdminTableCell>
                        <AdminTableCell>
                          <p className="font-display font-extrabold text-brand-950">
                            {sub.examTitle}
                          </p>
                          <p className="text-[11px] font-medium text-ink-secondary">
                            Submitted {sub.submittedAt} ·{" "}
                            {sub.timeSpentMinutes} mins spent
                          </p>
                        </AdminTableCell>
                        <AdminTableCell className="font-extrabold text-brand-950">
                          {earned} / {total}
                        </AdminTableCell>
                        <AdminTableCell className="font-display font-extrabold text-accent-success">
                          {pct}%
                        </AdminTableCell>
                        <AdminTableCell>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <AdminStatusPill
                              status={
                                sub.gradingStatus === "published"
                                  ? "Published"
                                  : "Pending"
                              }
                              variant={
                                sub.gradingStatus === "published"
                                  ? "success"
                                  : "warning"
                              }
                            />
                            {sub.appealStatus === "pending" && (
                              <AdminStatusPill
                                status="Appeal Review"
                                variant="danger"
                              />
                            )}
                          </div>
                        </AdminTableCell>
                        <AdminTableCell className="text-right">
                          <AdminActionMenu
                            ariaLabel={`Actions for ${sub.examTitle}`}
                            items={[
                              {
                                id: "review",
                                label: "Review Marked Script",
                                icon: <FileSearch className="h-3.5 w-3.5" />,
                                variant: "primary",
                                onClick: () => setReviewSubmission(sub),
                              },
                              ...(sub.gradingStatus === "published" &&
                              sub.appealStatus !== "pending"
                                ? [
                                    {
                                      id: "appeal",
                                      label: "Request Remark",
                                      icon: (
                                        <MessageSquareWarning className="h-3.5 w-3.5" />
                                      ),
                                      onClick: () => {
                                        setAppealReason("");
                                        setAppealTarget(sub);
                                      },
                                    },
                                  ]
                                : []),
                            ]}
                          />
                        </AdminTableCell>
                      </AdminTableRow>
                    );
                  })}
                </AdminTableBody>
              </AdminTable>
            )}
          </AdminDataTable>
        </div>
      </AdminWorkspaceSlab>

      <ScriptAppealModal
        target={appealTarget}
        onClose={() => setAppealTarget(null)}
        reason={appealReason}
        setReason={setAppealReason}
        onConfirm={handleAppealConfirm}
      />

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
        footer={
          <CtaButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setReviewSubmission(null)}
          >
            Close
          </CtaButton>
        }
      >
        {reviewSubmission && (
          <div className="space-y-4">
            {reviewSubmission.overallFeedback && (
              <div className="rounded-2xl border border-accent-success/40 bg-accent-success/10 p-3.5 text-xs font-medium text-brand-950">
                <p className="font-extrabold uppercase tracking-wider text-accent-success">
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
                      <p className="mt-2 rounded-xl border border-brand-100 bg-surface-porcelain p-2.5 text-xs font-medium text-ink-primary">
                        Your response:{" "}
                        <span className="font-bold">
                          {Array.isArray(ans)
                            ? ans.join(", ")
                            : String(ans || "No response")}
                        </span>
                      </p>
                      {theoryEntry && (
                        <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-accent-success">
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
