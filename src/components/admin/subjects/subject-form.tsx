"use client";

import * as React from "react";
import { BookOpen } from "lucide-react";
import { AdminTextField } from "@/components/admin/ui/admin-form-controls";
import { CustomForm, FormSection } from "@/components/forms";
import type { ClassArm, TeacherProfile } from "@/data/portal-mock-data";
import { cn } from "@/lib/utils";

export interface SubjectFormState {
  id: string;
  code: string;
  title: string;
  category: string;
  assignedClasses: string[];
  assignedTeacherIds: string[];
}

export interface SubjectFormProps {
  formRef?: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formState: SubjectFormState;
  setFormState: React.Dispatch<React.SetStateAction<SubjectFormState>>;
  classArms: ClassArm[];
  teachers: TeacherProfile[];
  onReset: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function SubjectForm({
  formRef,
  open,
  onOpenChange,
  formState,
  setFormState,
  classArms,
  teachers,
  onReset,
  onSubmit,
}: SubjectFormProps) {
  const isEditing = Boolean(formState.id);

  return (
    <CustomForm
      id="subject-inline-form"
      formRef={formRef}
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="Subject Configuration"
      title={isEditing ? "Edit Subject & Allocations" : "Create Subject"}
      description="Define subject code, curriculum category, assigned class arms, and teaching faculty."
      isEditing={isEditing}
      editingBadgeText={formState.code || "Editing Subject"}
      onResetToCreate={onReset}
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      submitLabel={isEditing ? "Save Subject Changes" : "Save Subject"}
      submitIcon={<BookOpen className="h-3.5 w-3.5" />}
    >
      <FormSection title="Subject Identity">
        <div className="grid gap-4 sm:grid-cols-3">
          <AdminTextField
            label="Subject Code *"
            value={formState.code}
            onChange={(e) =>
              setFormState((p) => ({ ...p, code: e.target.value }))
            }
            placeholder="PHY-101"
            required
          />
          <AdminTextField
            label="Subject Title *"
            value={formState.title}
            onChange={(e) =>
              setFormState((p) => ({ ...p, title: e.target.value }))
            }
            placeholder="Physics"
            required
          />
          <AdminTextField
            label="Curriculum Category"
            value={formState.category}
            onChange={(e) =>
              setFormState((p) => ({ ...p, category: e.target.value }))
            }
            placeholder="Core STEM"
          />
        </div>
      </FormSection>

      <FormSection title="Class Arm & Teacher Allocations">
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-brand-900">
              Assign to Class Arms
            </p>
            <div className="flex flex-wrap gap-2">
              {classArms.map((arm) => {
                const selected = formState.assignedClasses.includes(arm.name);
                return (
                  <button
                    key={arm.id}
                    type="button"
                    onClick={() =>
                      setFormState((p) => ({
                        ...p,
                        assignedClasses: selected
                          ? p.assignedClasses.filter((c) => c !== arm.name)
                          : [...p.assignedClasses, arm.name],
                      }))
                    }
                    className={cn(
                      "rounded-pill px-3 py-1 font-display text-xs font-extrabold cursor-pointer transition-colors",
                      selected
                        ? "cta-surface-primary text-ink-on-blue"
                        : "border-2 border-brand-100 bg-surface-porcelain text-brand-800 hover:bg-surface-mist"
                    )}
                  >
                    {arm.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-brand-900">
              Assign Subject Teachers
            </p>
            <div className="flex flex-wrap gap-2">
              {teachers.map((t) => {
                const selected = formState.assignedTeacherIds.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() =>
                      setFormState((p) => ({
                        ...p,
                        assignedTeacherIds: selected
                          ? p.assignedTeacherIds.filter((id) => id !== t.id)
                          : [...p.assignedTeacherIds, t.id],
                      }))
                    }
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-extrabold cursor-pointer transition-colors",
                      selected
                        ? "bg-emerald-700 text-white"
                        : "border border-brand-200 bg-white text-brand-800 hover:bg-surface-mist"
                    )}
                  >
                    {t.name}
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
