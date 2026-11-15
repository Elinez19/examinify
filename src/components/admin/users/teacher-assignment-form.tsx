"use client";

import * as React from "react";
import { CheckCircle2, UserCheck } from "lucide-react";
import { CustomForm, FormSection } from "@/components/forms";
import type {
  ClassArm,
  SubjectEnrollment,
  TeacherProfile,
} from "@/data/portal-mock-data";
import { cn } from "@/lib/utils";

export interface TeacherAssignmentFormProps {
  formRef?: React.RefObject<HTMLDivElement | null>;
  target: TeacherProfile | null;
  classesDraft: string[];
  setClassesDraft: React.Dispatch<React.SetStateAction<string[]>>;
  subjectsDraft: string[];
  setSubjectsDraft: React.Dispatch<React.SetStateAction<string[]>>;
  classArms: ClassArm[];
  subjects: SubjectEnrollment[];
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function TeacherAssignmentForm({
  formRef,
  target,
  classesDraft,
  setClassesDraft,
  subjectsDraft,
  setSubjectsDraft,
  classArms,
  subjects,
  onCancel,
  onSubmit,
}: TeacherAssignmentFormProps) {
  if (!target) return null;

  return (
    <CustomForm
      id="teacher-assignment-form"
      formRef={formRef}
      open={Boolean(target)}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
      eyebrow="Teaching Assignments"
      title={`Assign Classes & Subjects · ${target.name}`}
      description={`Manage class arms and subjects allocated to ${target.staffId}.`}
      isEditing
      editingBadgeText={target.department}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitLabel="Save Assignments"
      submitIcon={<UserCheck className="h-3.5 w-3.5" />}
    >
      <FormSection title="Class Arms & Subject Allocations">
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-brand-900">
              Assign Class Arms
            </p>
            <div className="flex flex-wrap gap-2">
              {classArms.map((arm) => {
                const selected = classesDraft.includes(arm.name);
                return (
                  <button
                    key={arm.id}
                    type="button"
                    onClick={() =>
                      setClassesDraft((prev) =>
                        selected
                          ? prev.filter((item) => item !== arm.name)
                          : [...prev, arm.name]
                      )
                    }
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 font-display text-xs font-extrabold transition-colors cursor-pointer",
                      selected
                        ? "cta-surface-primary text-ink-on-blue"
                        : "border-2 border-brand-100 bg-surface-porcelain text-brand-800 hover:bg-surface-mist"
                    )}
                  >
                    {selected && <CheckCircle2 className="h-3 w-3" />}
                    {arm.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-brand-900">
              Assign Subjects
            </p>
            <div className="flex flex-wrap gap-2">
              {subjects.map((sub) => {
                const selected = subjectsDraft.includes(sub.id);
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() =>
                      setSubjectsDraft((prev) =>
                        selected
                          ? prev.filter((item) => item !== sub.id)
                          : [...prev, sub.id]
                      )
                    }
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold transition-colors cursor-pointer",
                      selected
                        ? "bg-emerald-700 text-white"
                        : "border border-brand-200 bg-white text-brand-800 hover:bg-surface-mist"
                    )}
                  >
                    {selected && <CheckCircle2 className="h-3 w-3" />}
                    {sub.title} ({sub.code})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </FormSection>
    </CustomForm>
  );
}
