"use client";

import * as React from "react";
import { BookOpen } from "lucide-react";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import {
  AdminTextareaField,
  AdminTextField,
} from "@/components/admin/ui/admin-form-controls";
import { CtaButton } from "@/components/landing/ui/cta-button";
import type { QuestionItem, SubjectEnrollment } from "@/data/portal-mock-data";

export interface SubjectFormState {
  id: string;
  title: string;
  description: string;
}

export interface SubjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formState: SubjectFormState;
  setFormState: React.Dispatch<React.SetStateAction<SubjectFormState>>;
  onReset: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

/** Generate a unique subject code from a subject title when creating a subject. */
export function generateSubjectCode(
  title: string,
  existingSubjects: ReadonlyArray<SubjectEnrollment>
): string {
  const prefix =
    title
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 3)
      .toUpperCase() || "SUB";
  const used = new Set(existingSubjects.map((s) => s.code.toUpperCase()));
  let num = 101;
  while (used.has(`${prefix}-${num}`)) {
    num += 1;
  }
  return `${prefix}-${num}`;
}

/** Build a normalized SubjectEnrollment record from the simplified subject form state. */
export function buildSubjectFromForm(
  formState: SubjectFormState,
  subjects: ReadonlyArray<SubjectEnrollment>,
  questions: ReadonlyArray<QuestionItem>
): SubjectEnrollment {
  const existing = subjects.find((s) => s.id === formState.id);
  const title = formState.title.trim();
  const description = formState.description.trim();
  const code = existing?.code || generateSubjectCode(title, subjects);

  return {
    id: formState.id || `sub_${Date.now()}`,
    code,
    title,
    category: existing?.category ?? "Core",
    description,
    teacherName: existing?.teacherName ?? "Unassigned",
    assignedClasses: existing?.assignedClasses ?? [],
    assignedTeacherIds: existing?.assignedTeacherIds ?? [],
    classDescriptions: existing?.classDescriptions,
    schoolBranch: existing?.schoolBranch,
    nextExamAt: existing?.nextExamAt ?? "Not scheduled",
    topicsCovered: existing?.topicsCovered ?? 0,
    totalTopics: existing?.totalTopics ?? 10,
    questionCount: questions.filter((q) => q.subjectCode === code).length,
    passRate: existing?.passRate ?? 80,
    status: existing?.status ?? "active",
  };
}

export function SubjectForm({
  open,
  onOpenChange,
  formState,
  setFormState,
  onReset,
  onSubmit,
}: SubjectFormProps) {
  const isEditing = Boolean(formState.id);
  const internalFormRef = React.useRef<HTMLFormElement | null>(null);

  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="Subject Configuration"
      title={isEditing ? "Edit Subject" : "Create Subject"}
      description="Define the subject title and description for your school curriculum."
      size="md"
      isEditing={isEditing}
      editingBadgeText={formState.title || "Editing Subject"}
      onResetToCreate={onReset}
      footer={
        <>
          <CtaButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </CtaButton>
          <CtaButton
            type="button"
            variant="primary"
            size="sm"
            onClick={() => internalFormRef.current?.requestSubmit()}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>{isEditing ? "Save Subject Changes" : "Save Subject"}</span>
          </CtaButton>
        </>
      }
    >
      <form ref={internalFormRef} onSubmit={onSubmit} className="space-y-4">
        <AdminTextField
          label="Subject Title *"
          value={formState.title}
          onChange={(e) =>
            setFormState((p) => ({ ...p, title: e.target.value }))
          }
          placeholder="Physics"
          required
        />
        <AdminTextareaField
          label="Subject Description"
          value={formState.description}
          onChange={(e) =>
            setFormState((p) => ({ ...p, description: e.target.value }))
          }
          placeholder="Brief overview of curriculum scope, core topics, and learning objectives..."
          rows={3}
        />
      </form>
    </AdminModal>
  );
}
