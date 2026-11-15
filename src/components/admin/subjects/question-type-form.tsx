"use client";

import * as React from "react";
import { ShieldCheck } from "lucide-react";
import {
  AdminSelectField,
  AdminTextField,
  AdminTextareaField,
} from "@/components/admin/ui/admin-form-controls";
import { CustomForm, FormSection } from "@/components/forms";
import type { QuestionType } from "@/data/portal-mock-data";

export interface QuestionTypeFormState {
  id: string;
  code: QuestionType;
  label: string;
  description: string;
  autoGradable: boolean;
  enabled: boolean;
}

export interface QuestionTypeFormProps {
  formRef?: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formState: QuestionTypeFormState;
  setFormState: React.Dispatch<React.SetStateAction<QuestionTypeFormState>>;
  onReset: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function QuestionTypeForm({
  formRef,
  open,
  onOpenChange,
  formState,
  setFormState,
  onReset,
  onSubmit,
}: QuestionTypeFormProps) {
  const isEditing = Boolean(formState.id);

  return (
    <CustomForm
      id="question-type-inline-form"
      formRef={formRef}
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="CBT Assessment Format"
      title={isEditing ? "Edit Question Type" : "Add Question Type"}
      description="Configure CBT question format labels, grading mode, and availability across exams."
      isEditing={isEditing}
      editingBadgeText={formState.label || "Editing Format"}
      onResetToCreate={onReset}
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      submitLabel={isEditing ? "Save Format Changes" : "Save Question Type"}
      submitIcon={<ShieldCheck className="h-3.5 w-3.5" />}
    >
      <FormSection title="Question Format Details">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AdminTextField
            label="Format Label *"
            value={formState.label}
            onChange={(e) =>
              setFormState((p) => ({ ...p, label: e.target.value }))
            }
            placeholder="e.g. Objective (MCQ)"
            required
          />
          <AdminSelectField<QuestionType>
            label="Format Code *"
            value={formState.code}
            onChange={(val) => setFormState((p) => ({ ...p, code: val }))}
            options={[
              { id: "objective", label: "objective" },
              { id: "multi_select", label: "multi_select" },
              { id: "fill_blank", label: "fill_blank" },
              { id: "theory", label: "theory" },
              { id: "mcq", label: "mcq" },
              { id: "true_false", label: "true_false" },
              { id: "short_answer", label: "short_answer" },
            ]}
          />
          <AdminSelectField<"auto" | "rubric">
            label="Grading Mode"
            value={formState.autoGradable ? "auto" : "rubric"}
            onChange={(val) =>
              setFormState((p) => ({ ...p, autoGradable: val === "auto" }))
            }
            options={[
              { id: "auto", label: "Auto-Graded" },
              { id: "rubric", label: "Rubric Graded" },
            ]}
          />
        </div>

        <AdminTextareaField
          label="Description *"
          value={formState.description}
          onChange={(e) =>
            setFormState((p) => ({ ...p, description: e.target.value }))
          }
          placeholder="Describe how candidates answer this question type..."
          rows={2}
          required
        />

        <label className="flex items-center gap-2 text-xs font-bold text-brand-950 cursor-pointer">
          <input
            type="checkbox"
            checked={formState.enabled}
            onChange={(e) =>
              setFormState((p) => ({ ...p, enabled: e.target.checked }))
            }
            className="h-4 w-4 rounded border-brand-300 accent-brand-600"
          />
          Enable this question type for CBT exam creation
        </label>
      </FormSection>
    </CustomForm>
  );
}
