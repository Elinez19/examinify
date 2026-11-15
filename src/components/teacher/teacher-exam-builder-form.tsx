"use client";

import * as React from "react";
import { CalendarPlus } from "lucide-react";
import {
  AdminSelectField,
  AdminTextareaField,
  AdminTextField,
} from "@/components/admin/ui/admin-form-controls";
import { CustomForm, FormSection } from "@/components/forms";
import type {
  ClassArm,
  PortalExam,
  QuestionItem,
  SubjectEnrollment,
} from "@/data/portal-mock-data";

export interface TeacherExamFormState {
  id: string;
  title: string;
  subjectCode: string;
  classLevel: string;
  scheduledFor: string;
  durationMinutes: number;
  status: PortalExam["status"];
  instructions: string;
  questionIds: string[];
}

export interface TeacherExamBuilderFormProps {
  formRef?: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formState: TeacherExamFormState;
  setFormState: React.Dispatch<React.SetStateAction<TeacherExamFormState>>;
  subjects: SubjectEnrollment[];
  classArms: ClassArm[];
  questions: QuestionItem[];
  onReset: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

/**
 * Reusable Teacher Exam Builder Inline Form
 * Configures CBT assessment metadata, timing, class allocation, and instructions.
 */
export function TeacherExamBuilderForm({
  formRef,
  open,
  onOpenChange,
  formState,
  setFormState,
  subjects,
  classArms,
  questions,
  onReset,
  onSubmit,
}: TeacherExamBuilderFormProps) {
  const isEditing = Boolean(formState.id);

  return (
    <CustomForm
      id="teacher-exam-builder-inline-form"
      formRef={formRef}
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="Assessment Builder"
      title={isEditing ? "Edit Assessment" : "Create New Exam"}
      description="Configure assessment details, schedule timing, target class arm, and candidate instructions."
      isEditing={isEditing}
      editingBadgeText={formState.subjectCode || "Editing Assessment"}
      onResetToCreate={onReset}
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      submitLabel={isEditing ? "Save Exam Changes" : "Create Exam"}
      submitIcon={<CalendarPlus className="h-3.5 w-3.5" />}
    >
      <FormSection title="Assessment Identity & Allocation">
        <div className="space-y-4">
          <AdminTextField
            label="Exam Title *"
            value={formState.title}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, title: event.target.value }))
            }
            placeholder="e.g. JSS 3 Mathematics First Term CBT"
            required
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <AdminSelectField
              label="Subject *"
              value={formState.subjectCode}
              onChange={(code) =>
                setFormState((prev) => ({
                  ...prev,
                  subjectCode: code,
                  questionIds: questions
                    .filter((q) => q.subjectCode === code)
                    .map((q) => q.id),
                }))
              }
              options={subjects.map((sub) => ({
                id: sub.code,
                label: `${sub.title} (${sub.code})`,
              }))}
            />

            <AdminSelectField
              label="Target Class Arm *"
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

            <AdminTextField
              label="Duration (Minutes) *"
              type="number"
              min={5}
              max={180}
              value={String(formState.durationMinutes)}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  durationMinutes: Number(event.target.value) || 30,
                }))
              }
            />
          </div>

          <p className="text-[11px] font-semibold text-ink-secondary">
            Automatically linked{" "}
            <span className="font-extrabold text-brand-900">
              {formState.questionIds.length}
            </span>{" "}
            question bank item(s) for{" "}
            <span className="font-mono font-bold text-brand-900">
              {formState.subjectCode}
            </span>
            .
          </p>
        </div>
      </FormSection>

      <FormSection title="Schedule & Candidate Instructions">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminTextField
              label="Schedule Label *"
              value={formState.scheduledFor}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  scheduledFor: event.target.value,
                }))
              }
              placeholder="e.g. Fri, Nov 20 · 09:00 AM"
            />
            <AdminSelectField<PortalExam["status"]>
              label="Status *"
              value={formState.status}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  status: val,
                }))
              }
              options={[
                { id: "scheduled", label: "Scheduled" },
                { id: "live", label: "Live Now" },
                { id: "draft", label: "Draft" },
                { id: "completed", label: "Completed" },
              ]}
            />
          </div>

          <AdminTextareaField
            label="Candidate Instructions"
            value={formState.instructions}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                instructions: event.target.value,
              }))
            }
            rows={3}
            placeholder="One instruction per line..."
          />
        </div>
      </FormSection>
    </CustomForm>
  );
}
