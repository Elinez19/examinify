"use client";

import * as React from "react";
import { Activity } from "lucide-react";
import {
  AdminTextareaField,
  AdminTextField,
} from "@/components/admin/ui/admin-form-controls";
import { CustomForm, FormSection } from "@/components/forms";
import type {
  ExamSubmission,
  QuestionItem,
  TheoryScoreEntry,
} from "@/data/portal-mock-data";

export interface ScriptGradingFormProps {
  formRef?: React.RefObject<HTMLDivElement | null>;
  target: ExamSubmission | null;
  onClose: () => void;
  questions: QuestionItem[];
  theoryInputs: Record<string, TheoryScoreEntry>;
  setTheoryInputs: React.Dispatch<
    React.SetStateAction<Record<string, TheoryScoreEntry>>
  >;
  overallFeedback: string;
  setOverallFeedback: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

/**
 * Reusable Theory Script Grading Inline Form
 * Displays subjective answers alongside rubric guides for inline scoring and publication.
 */
export function ScriptGradingForm({
  formRef,
  target,
  onClose,
  questions,
  theoryInputs,
  setTheoryInputs,
  overallFeedback,
  setOverallFeedback,
  onSubmit,
}: ScriptGradingFormProps) {
  return (
    <CustomForm
      id="script-grading-inline-form"
      formRef={formRef}
      open={Boolean(target)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      eyebrow={target?.admissionNo ?? "Theory Grading"}
      title={target ? `Grade Script · ${target.studentName}` : "Grade Script"}
      description={
        target?.examTitle ??
        "Score subjective candidate answers and publish official results."
      }
      isEditing={Boolean(target)}
      editingBadgeText={target ? "Grading Script" : undefined}
      onSubmit={onSubmit}
      onCancel={onClose}
      submitLabel="Save & Publish Score"
      submitIcon={<Activity className="h-3.5 w-3.5" />}
    >
      {target && (
        <>
          <FormSection title="Theory Questions & Rubric Scoring">
            <div className="space-y-4">
              {Object.entries(theoryInputs).length === 0 ? (
                <p className="rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4 text-xs font-medium text-ink-secondary">
                  No subjective theory questions were present on this
                  assessment. You can still attach overall feedback and publish.
                </p>
              ) : (
                Object.entries(theoryInputs).map(([qId, entry]) => {
                  const question = questions.find((item) => item.id === qId);
                  const studentResp = target.answers[qId];
                  return (
                    <div
                      key={qId}
                      className="space-y-3 rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4"
                    >
                      <p className="text-xs font-extrabold text-brand-950">
                        {question?.prompt ?? "Theory Question"}
                      </p>
                      <div className="rounded-xl border border-brand-100 bg-white p-3 text-xs font-medium text-ink-primary">
                        Candidate answer:{" "}
                        <span className="font-bold">
                          {Array.isArray(studentResp)
                            ? studentResp.join(", ")
                            : String(studentResp || "No response provided")}
                        </span>
                      </div>
                      {question?.markingGuide && (
                        <p className="text-[11px] font-semibold text-emerald-800">
                          Guide: {question.markingGuide}
                        </p>
                      )}
                      <div className="grid gap-3 sm:grid-cols-3">
                        <AdminTextField
                          label={`Score (Max ${entry.maxScore})`}
                          type="number"
                          min={0}
                          max={entry.maxScore}
                          value={String(entry.score)}
                          onChange={(event) => {
                            const raw = Number(event.target.value) || 0;
                            const clamped = Math.max(
                              0,
                              Math.min(entry.maxScore, raw)
                            );
                            setTheoryInputs((prev) => ({
                              ...prev,
                              [qId]: { ...prev[qId], score: clamped },
                            }));
                          }}
                        />
                        <div className="sm:col-span-2">
                          <AdminTextField
                            label="Marker Remark"
                            value={entry.comment}
                            onChange={(event) =>
                              setTheoryInputs((prev) => ({
                                ...prev,
                                [qId]: {
                                  ...prev[qId],
                                  comment: event.target.value,
                                },
                              }))
                            }
                            placeholder="Brief marking note..."
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </FormSection>

          <FormSection title="Overall Script Feedback">
            <AdminTextareaField
              label="Overall Script Feedback"
              value={overallFeedback}
              onChange={(event) => setOverallFeedback(event.target.value)}
              rows={3}
              placeholder="Summary feedback visible to the student..."
            />
          </FormSection>
        </>
      )}
    </CustomForm>
  );
}
