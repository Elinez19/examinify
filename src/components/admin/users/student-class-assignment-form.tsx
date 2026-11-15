"use client";

import * as React from "react";
import { GraduationCap } from "lucide-react";
import { AdminSelectField } from "@/components/admin/ui/admin-form-controls";
import { CustomForm, FormSection } from "@/components/forms";
import type { ClassArm, StudentProfile } from "@/data/portal-mock-data";

export interface StudentClassAssignmentFormProps {
  formRef?: React.RefObject<HTMLDivElement | null>;
  target: StudentProfile | null;
  selectedClassArmId: string;
  onChangeClassArmId: (id: string) => void;
  classArms: ClassArm[];
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function StudentClassAssignmentForm({
  formRef,
  target,
  selectedClassArmId,
  onChangeClassArmId,
  classArms,
  onCancel,
  onSubmit,
}: StudentClassAssignmentFormProps) {
  if (!target) return null;

  return (
    <CustomForm
      id="student-class-assignment-form"
      formRef={formRef}
      open={Boolean(target)}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
      eyebrow="Class Allocation"
      title={`Assign Class · ${target.name}`}
      description={`Move ${target.admissionNo} to an active class arm for CBT seating and exam access.`}
      isEditing
      editingBadgeText={target.classLevel}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitLabel="Confirm Class"
      submitIcon={<GraduationCap className="h-3.5 w-3.5" />}
    >
      <FormSection title="Target Class Arm">
        <AdminSelectField
          label="Select Class Arm *"
          value={selectedClassArmId}
          onChange={onChangeClassArmId}
          options={classArms.map((arm) => ({
            id: arm.id,
            label: `${arm.name} · ${arm.arm}`,
          }))}
        />
      </FormSection>
    </CustomForm>
  );
}
