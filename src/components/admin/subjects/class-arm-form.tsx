"use client";

import * as React from "react";
import { GraduationCap } from "lucide-react";
import {
  AdminSelectField,
  AdminTextField,
} from "@/components/admin/ui/admin-form-controls";
import { CustomForm, FormSection } from "@/components/forms";
import type { TeacherProfile } from "@/data/portal-mock-data";

export interface ClassArmFormState {
  id: string;
  name: string;
  level: string;
  arm: string;
  classTeacherId: string;
  capacity: number;
}

export interface ClassArmFormProps {
  formRef?: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formState: ClassArmFormState;
  setFormState: React.Dispatch<React.SetStateAction<ClassArmFormState>>;
  teachers: TeacherProfile[];
  onReset: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function ClassArmForm({
  formRef,
  open,
  onOpenChange,
  formState,
  setFormState,
  teachers,
  onReset,
  onSubmit,
}: ClassArmFormProps) {
  const isEditing = Boolean(formState.id);

  return (
    <CustomForm
      id="class-arm-inline-form"
      formRef={formRef}
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="Class Setup"
      title={isEditing ? "Edit Class Arm" : "Create Class Arm"}
      description="Configure class arm designation, academic level, seating capacity, and assigned form teacher."
      isEditing={isEditing}
      editingBadgeText={formState.name || "Editing Class Arm"}
      onResetToCreate={onReset}
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      submitLabel={isEditing ? "Save Class Changes" : "Save Class Arm"}
      submitIcon={<GraduationCap className="h-3.5 w-3.5" />}
    >
      <FormSection title="Class Arm & Form Teacher">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AdminTextField
            label="Class Arm Name *"
            value={formState.name}
            onChange={(e) =>
              setFormState((p) => ({ ...p, name: e.target.value }))
            }
            placeholder="e.g. SSS 2A"
            required
          />
          <AdminTextField
            label="Level"
            value={formState.level}
            onChange={(e) =>
              setFormState((p) => ({ ...p, level: e.target.value }))
            }
            placeholder="SSS 2"
          />
          <AdminTextField
            label="Arm / Wing"
            value={formState.arm}
            onChange={(e) =>
              setFormState((p) => ({ ...p, arm: e.target.value }))
            }
            placeholder="Science Wing"
          />
          <AdminTextField
            label="Seat Capacity"
            type="number"
            min={5}
            value={String(formState.capacity)}
            onChange={(e) =>
              setFormState((p) => ({
                ...p,
                capacity: Number(e.target.value) || 30,
              }))
            }
          />
          <div className="sm:col-span-2">
            <AdminSelectField
              label="Assign Class Teacher"
              value={formState.classTeacherId}
              onChange={(val) =>
                setFormState((p) => ({ ...p, classTeacherId: val }))
              }
              options={teachers.map((t) => ({
                id: t.id,
                label: t.name,
              }))}
            />
          </div>
        </div>
      </FormSection>
    </CustomForm>
  );
}
