"use client";

import * as React from "react";
import { CheckCircle2, MessageSquareWarning, Send } from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import { AdminTextareaField } from "@/components/admin/ui/admin-form-controls";
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import { useAdminToast } from "@/components/admin/ui/admin-toast";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type { ExamSubmission, QuestionItem } from "@/data/portal-mock-data";
import { cn } from "@/lib/utils";

function GradingDetailPanel({
  selected,
  theoryQuestions,
  onSaveGrade,
}: {
  selected: ExamSubmission;
  theoryQuestions: QuestionItem[];
  onSaveGrade: (
    submissionId: string,
    scoresMap: Record<string, number>,
    feedback: string,
    publish: boolean
  ) => void;
}) {
  const [scoresMap, setScoresMap] = React.useState<Record<string, number>>(
    () => selected.theoryScoresByQuestion ?? {}
  );
  const [feedback, setFeedback] = React.useState<string>(
    () => selected.teacherFeedback ?? ""
  );

  return (
    <div className="surface-gloss-card p-5 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-brand-100 pb-4">
        <div>
          <PillBadge tone="sky" className="px-2.5 py-0.5 text-[10px]">
            {selected.studentRegNo} · {selected.classLevel}
          </PillBadge>
          <h3 className="mt-1.5 font-display text-lg sm:text-xl font-extrabold text-brand-950">
            {selected.studentName} — {selected.examTitle}
          </h3>
          <p className="text-xs font-semibold text-ink-secondary">
            Auto-Scored Objective: {selected.objectiveScore} /{" "}
            {selected.objectiveMax} marks
          </p>
        </div>

        <div className="rounded-2xl border-2 border-brand-100 bg-surface-pearl px-4 py-2 text-right">
          <span className="block text-[10px] font-bold uppercase text-ink-muted">
            Running Total
          </span>
          <span className="font-display text-lg font-extrabold text-brand-700">
            {selected.objectiveScore +
              Object.values(scoresMap).reduce(
                (a, b) => a + (Number(b) || 0),
                0
              )}{" "}
            / {selected.totalMax}
          </span>
        </div>
      </div>

      {selected.appealReason && (
        <div className="rounded-2xl border-2 border-accent-gold bg-surface-porcelain p-3.5 text-xs font-semibold text-brand-950">
          <span className="font-display font-extrabold text-brand-700">
            Student Appeal Note:{" "}
          </span>
          {selected.appealReason}
        </div>
      )}

      {theoryQuestions.length === 0 ? (
        <div className="rounded-2xl border border-brand-100 bg-surface-pearl p-4 text-xs font-semibold text-ink-secondary">
          This paper contains objective questions only (auto-scored{" "}
          {selected.objectiveScore}/{selected.objectiveMax}). You can add
          feedback and publish below.
        </div>
      ) : (
        <div className="space-y-4">
          {theoryQuestions.map((q, idx) => {
            const val = scoresMap[q.id] ?? 0;
            const studentAns = selected.answers[q.id] ?? "No response typed.";
            return (
              <div
                key={q.id}
                className="rounded-2xl border-2 border-brand-100 bg-surface-pearl/70 p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-xs font-extrabold text-brand-700">
                    Theory Item {idx + 1} · {q.topic} (Max {q.marks} marks)
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="font-display text-xs font-extrabold text-brand-950">
                      Award Marks:
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={q.marks}
                      value={val}
                      onChange={(e) => {
                        const num = Math.min(
                          q.marks,
                          Math.max(0, Number(e.target.value) || 0)
                        );
                        setScoresMap((prev) => ({
                          ...prev,
                          [q.id]: num,
                        }));
                      }}
                      className="h-9 w-20 rounded-xl border-2 border-brand-200 bg-surface-porcelain px-2.5 text-center font-display text-sm font-extrabold text-brand-950"
                    />
                  </div>
                </div>

                <p className="text-sm font-bold text-brand-950">{q.stem}</p>

                {q.rubric && (
                  <div className="rounded-xl border border-brand-200 bg-brand-50/70 p-2.5 text-xs font-medium text-brand-900">
                    <span className="font-display font-extrabold">Rubric: </span>
                    {q.rubric}
                  </div>
                )}

                <div className="rounded-xl border border-brand-100 bg-surface-porcelain p-3">
                  <span className="block font-display text-[10px] font-extrabold uppercase text-ink-muted">
                    Student Written Response
                  </span>
                  <p className="mt-1 whitespace-pre-wrap text-xs sm:text-sm font-semibold text-brand-950">
                    {studentAns}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AdminTextareaField
        label="Educator Feedback Note"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Optional coaching note for the student..."
        rows={2}
      />

      <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
        <CtaButton
          variant="secondary"
          size="xs"
          onClick={() =>
            onSaveGrade(selected.id, scoresMap, feedback.trim(), false)
          }
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Save Draft
        </CtaButton>
        <CtaButton
          variant="primary"
          size="xs"
          onClick={() =>
            onSaveGrade(selected.id, scoresMap, feedback.trim(), true)
          }
        >
          <Send className="h-3.5 w-3.5" />
          Publish Grade to Student
        </CtaButton>
      </div>
    </div>
  );
}

export function TeacherGradingWorkspace() {
  const { store, gradeSubmission } = usePortalStore();
  const toast = useAdminToast();

  const [selectedId, setSelectedId] = React.useState<string>(
    store.submissions.find((s) => s.gradingStatus === "pending_theory")?.id ??
      store.submissions[0]?.id ??
      ""
  );

  const selected = React.useMemo(
    () =>
      store.submissions.find((s) => s.id === selectedId) ??
      store.submissions[0],
    [store.submissions, selectedId]
  );

  const theoryQuestions = React.useMemo(() => {
    if (!selected) return [];
    const exam = store.exams.find((e) => e.id === selected.examId);
    if (!exam) return [];
    return exam.questionIds
      .map((id) => store.questions.find((q) => q.id === id))
      .filter((q): q is QuestionItem => Boolean(q))
      .filter((q) => q.type === "theory");
  }, [selected, store.exams, store.questions]);

  const handleSave = (
    submissionId: string,
    scoresMap: Record<string, number>,
    feedbackText: string,
    publish: boolean
  ) => {
    gradeSubmission(submissionId, scoresMap, feedbackText, publish);
    toast.success(
      publish ? "Result Graded & Published" : "Grading Draft Saved",
      `${selected?.studentName ?? "Candidate"} · ${selected?.examTitle ?? ""}`
    );
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <AdminHeroBanner
        eyebrow="Theory Marking & Moderation"
        eyebrowIcon="shield"
        headline="Grade Theory Scripts & Publish."
        highlightWords={["Grade", "Publish."]}
        subtitle="Objective items are auto-scored. Review essay steps against your rubric, assign theory marks, and publish straight to student portals."
        primaryCta={{
          label: "View Class Broadsheets",
          href: "/teacher/analytics",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Left Queue */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-extrabold text-brand-950">
                Submitted Scripts ({store.submissions.length})
              </h2>
            </div>

            <div className="space-y-2">
              {store.submissions.map((sub) => {
                const active = selected?.id === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedId(sub.id)}
                    className={cn(
                      "w-full text-left rounded-2xl border-2 p-3.5 transition-all cursor-pointer space-y-1.5",
                      active
                        ? "cta-surface-primary border-brand-400 text-ink-on-blue"
                        : "bg-surface-porcelain border-brand-100 text-brand-950 hover:border-brand-300"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-xs sm:text-sm font-extrabold truncate">
                        {sub.studentName}
                      </span>
                      <AdminStatusPill
                        status={
                          sub.gradingStatus === "pending_theory"
                            ? "pending"
                            : "completed"
                        }
                      />
                    </div>
                    <p
                      className={cn(
                        "truncate text-[11px] font-semibold",
                        active ? "text-ink-on-blue-muted" : "text-ink-secondary"
                      )}
                    >
                      {sub.examTitle}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span>{sub.receiptCode}</span>
                      <span>
                        Obj {sub.objectiveScore}/{sub.objectiveMax}
                      </span>
                    </div>
                    {sub.appealStatus === "submitted" && (
                      <span className="inline-flex items-center gap-1 rounded-pill bg-accent-gold px-2 py-0.5 font-display text-[10px] font-extrabold text-brand-950">
                        <MessageSquareWarning className="h-3 w-3" />
                        Appeal Requested
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Grading Canvas */}
          <div className="lg:col-span-8">
            {!selected ? (
              <div className="surface-gloss-card p-8 text-center">
                <p className="font-display text-base font-extrabold text-brand-950">
                  No scripts available to grade
                </p>
              </div>
            ) : (
              <GradingDetailPanel
                key={selected.id}
                selected={selected}
                theoryQuestions={theoryQuestions}
                onSaveGrade={handleSave}
              />
            )}
          </div>
        </div>
      </AdminWorkspaceSlab>
    </div>
  );
}
