"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import {
  AdminSelectField,
  AdminTextareaField,
  AdminTextField,
} from "@/components/admin/ui/admin-form-controls";
import type {
  ClassArm,
  QuestionItem,
  QuestionType,
  SubjectEnrollment,
} from "@/data/portal-mock-data";
import { CustomForm } from "./custom-form";
import { FormSection } from "./form-section";

export interface QuestionBankFormState {
  id: string;
  subjectCode: string;
  topic: string;
  classLevel: string;
  type: QuestionType;
  difficulty: QuestionItem["difficulty"];
  marks: number;
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOptionId: string;
  correctOptionIds?: string[];
  acceptedAnswersText: string;
  markingGuide: string;
  explanation: string;
}

export interface QuestionBankFormProps {
  formRef?: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eyebrow?: string;
  formState: QuestionBankFormState;
  setFormState: React.Dispatch<React.SetStateAction<QuestionBankFormState>>;
  subjects: SubjectEnrollment[];
  classArms: ClassArm[];
  savedMessage?: string | null;
  onReset?: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

/**
 * Reusable Question Bank Authoring Inline Form
 * Shared between Admin Question Bank and Teacher Question Bank workspaces.
 */
export function QuestionBankForm({
  formRef,
  open,
  onOpenChange,
  eyebrow = "Question Bank Authoring",
  formState,
  setFormState,
  subjects,
  classArms,
  savedMessage,
  onReset,
  onSubmit,
}: QuestionBankFormProps) {
  const isEditing = Boolean(formState.id);

  return (
    <CustomForm
      id="question-bank-inline-form"
      formRef={formRef}
      open={open}
      onOpenChange={onOpenChange}
      eyebrow={eyebrow}
      title={isEditing ? "Edit Question Item" : "Add Question Item"}
      description="Configure question metadata, prompt, options, and marking key directly inline."
      isEditing={isEditing}
      editingBadgeText={formState.topic || formState.subjectCode}
      onResetToCreate={onReset}
      savedMessage={savedMessage}
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      submitLabel={isEditing ? "Save Question Changes" : "Save Question"}
      submitIcon={<Sparkles className="h-3.5 w-3.5" />}
    >
      <FormSection title="Question Classification & Marks">
        <div className="grid gap-4 sm:grid-cols-3">
          <AdminSelectField
            label="Subject *"
            value={formState.subjectCode}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                subjectCode: val,
              }))
            }
            options={subjects.map((sub) => ({
              id: sub.code,
              label: sub.title,
            }))}
          />

          <AdminSelectField<QuestionType>
            label="Question Type *"
            value={formState.type}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                type: val,
              }))
            }
            options={[
              { id: "objective", label: "Multi-choice" },
              { id: "multi_select", label: "Multi-Select" },
              { id: "fill_blank", label: "Fill in the gaps" },
              { id: "theory", label: "Theory" },
              { id: "essay", label: "Essay" },
            ]}
          />

          <AdminTextField
            label="Marks *"
            type="number"
            min={1}
            max={50}
            value={String(formState.marks)}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                marks: Number(event.target.value) || 1,
              }))
            }
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <AdminTextField
            label="Topic *"
            value={formState.topic}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, topic: event.target.value }))
            }
            placeholder="e.g. Linear Equations"
            required
          />
          <AdminSelectField
            label="Class Arm *"
            value={formState.classLevel}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                classLevel: val,
              }))
            }
            options={classArms.map((arm) => ({
              id: arm.name,
              label: arm.name,
            }))}
          />
          <AdminSelectField<QuestionItem["difficulty"]>
            label="Difficulty *"
            value={formState.difficulty}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                difficulty: val,
              }))
            }
            options={[
              { id: "Easy", label: "Easy" },
              { id: "Standard", label: "Standard" },
              { id: "Challenge", label: "Challenge" },
            ]}
          />
        </div>
      </FormSection>

      <FormSection title="Question Prompt & Answer Key">
        <div className="space-y-4">
          <AdminTextareaField
            label="Question Prompt *"
            value={formState.prompt}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, prompt: event.target.value }))
            }
            placeholder="Write the full question prompt..."
            rows={3}
            required
          />

          {(formState.type === "objective" ||
            formState.type === "multi_select") && (
            <div className="grid gap-3 sm:grid-cols-2">
              <AdminTextField
                label="Option A"
                value={formState.optionA}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    optionA: event.target.value,
                  }))
                }
              />
              <AdminTextField
                label="Option B"
                value={formState.optionB}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    optionB: event.target.value,
                  }))
                }
              />
              <AdminTextField
                label="Option C"
                value={formState.optionC}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    optionC: event.target.value,
                  }))
                }
              />
              <AdminTextField
                label="Option D"
                value={formState.optionD}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    optionD: event.target.value,
                  }))
                }
              />
            </div>
          )}

          {formState.type === "objective" && (
            <AdminSelectField
              label="Correct Option"
              className="max-w-xs"
              value={formState.correctOptionId}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  correctOptionId: val,
                }))
              }
              options={[
                { id: "a", label: "Option A" },
                { id: "b", label: "Option B" },
                { id: "c", label: "Option C" },
                { id: "d", label: "Option D" },
              ]}
            />
          )}

          {formState.type === "multi_select" && (
            <div className="space-y-2">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-brand-700">
                Correct Options (Select all that apply)
              </p>
              <div className="flex flex-wrap gap-2">
                {["a", "b", "c", "d"].map((optId) => {
                  const active = (formState.correctOptionIds ?? ["a"]).includes(optId);
                  return (
                    <button
                      key={optId}
                      type="button"
                      onClick={() =>
                        setFormState((prev) => {
                          const curr = prev.correctOptionIds ?? ["a"];
                          const next = curr.includes(optId)
                            ? curr.filter((x) => x !== optId)
                            : [...curr, optId];
                          return {
                            ...prev,
                            correctOptionIds: next.length > 0 ? next : [optId],
                          };
                        })
                      }
                      className={`rounded-pill border-2 px-3.5 py-1.5 text-xs font-extrabold transition-colors cursor-pointer ${
                        active
                          ? "border-brand-700 bg-brand-700 text-white"
                          : "border-brand-200 bg-surface-porcelain text-brand-800 hover:bg-surface-mist"
                      }`}
                    >
                      Option {optId.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {formState.type === "fill_blank" && (
            <AdminTextField
              label="Accepted Answers (comma separated)"
              value={formState.acceptedAnswersText}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  acceptedAnswersText: event.target.value,
                }))
              }
              placeholder="e.g. 2000, 2,000"
            />
          )}

          {(formState.type === "theory" || formState.type === "essay") && (
            <AdminTextareaField
              label={formState.type === "essay" ? "Essay Marking Guide" : "Marking Guide"}
              value={formState.markingGuide}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  markingGuide: event.target.value,
                }))
              }
              rows={2}
              placeholder="Step-by-step mark allocation..."
            />
          )}

          <AdminTextField
            label="Explanation (Optional)"
            value={formState.explanation}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                explanation: event.target.value,
              }))
            }
            placeholder="Displayed during student Study Mode"
          />
        </div>
      </FormSection>
    </CustomForm>
  );
}
