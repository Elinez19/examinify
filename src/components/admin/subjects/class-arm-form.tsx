"use client";

import * as React from "react";
import { GraduationCap } from "lucide-react";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import {
  AdminSelectField,
  AdminTextField,
  type AdminSelectOption,
} from "@/components/admin/ui/admin-form-controls";
import { CtaButton } from "@/components/landing/ui/cta-button";
import type {
  ClassArm,
  ClassClassification,
} from "@/data/portal-mock-data";

export const CLASS_CLASSIFICATION_OPTIONS: ReadonlyArray<
  AdminSelectOption<ClassClassification>
> = [
  { id: "NURSERY", label: "NURSERY" },
  { id: "PRIMARY", label: "PRIMARY" },
  { id: "SECONDARY", label: "SECONDARY" },
];

export interface ClassArmFormState {
  id: string;
  name: string;
  classification: ClassClassification;
}

export interface ClassArmFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formState: ClassArmFormState;
  setFormState: React.Dispatch<React.SetStateAction<ClassArmFormState>>;
  onReset: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

/** Build a normalized ClassArm record from the modal form state. */
export function buildClassArmFromForm(
  formState: ClassArmFormState,
  existingArms: ReadonlyArray<ClassArm>
): ClassArm {
  const existing = existingArms.find((arm) => arm.id === formState.id);
  const name = formState.name.trim();

  return {
    id: formState.id || `arm_${Date.now()}`,
    name,
    classification: formState.classification,
    level: existing?.level || name,
    arm: existing?.arm || formState.classification,
    classTeacherId: existing?.classTeacherId ?? "",
    capacity: existing?.capacity ?? 40,
    status: existing?.status ?? "active",
  };
}

export function ClassArmForm({
  open,
  onOpenChange,
  formState,
  setFormState,
  onReset,
  onSubmit,
}: ClassArmFormProps) {
  const isEditing = Boolean(formState.id);
  const internalFormRef = React.useRef<HTMLFormElement | null>(null);

  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="Class Setup"
      title={isEditing ? "Edit Class Arm" : "Create Class Arm"}
      description="Enter the arm name and select its school classification."
      size="md"
      isEditing={isEditing}
      editingBadgeText={formState.name || "Editing Class Arm"}
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
            <GraduationCap className="h-3.5 w-3.5" />
            <span>{isEditing ? "Save Class Changes" : "Save Class Arm"}</span>
          </CtaButton>
        </>
      }
    >
      <form ref={internalFormRef} onSubmit={onSubmit} className="space-y-4">
        <AdminTextField
          label="Arm Name *"
          value={formState.name}
          onChange={(e) =>
            setFormState((p) => ({ ...p, name: e.target.value }))
          }
          placeholder="e.g. SSS 2A"
          required
        />
        <AdminSelectField<ClassClassification>
          label="Classification *"
          options={CLASS_CLASSIFICATION_OPTIONS}
          value={formState.classification}
          onChange={(classification) =>
            setFormState((p) => ({ ...p, classification }))
          }
          placeholder="Select classification"
        />
      </form>
    </AdminModal>
  );
}
