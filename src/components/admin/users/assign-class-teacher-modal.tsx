"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminSelectField } from "@/components/admin/ui/admin-form-controls";
import { CtaButton } from "@/components/landing/ui/cta-button";
import type { ClassArm, TeacherProfile } from "@/data/portal-mock-data";

export interface AssignClassTeacherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teachers: ReadonlyArray<TeacherProfile>;
  classArms: ReadonlyArray<ClassArm>;
  selectedTeacherId: string;
  onChangeTeacher: (teacherId: string) => void;
  selectedClassArmId: string;
  onChangeClassArm: (classArmId: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function AssignClassTeacherModal({
  open,
  onOpenChange,
  teachers,
  classArms,
  selectedTeacherId,
  onChangeTeacher,
  selectedClassArmId,
  onChangeClassArm,
  onSubmit,
}: AssignClassTeacherModalProps) {
  const internalFormRef = React.useRef<HTMLFormElement | null>(null);

  const selectedTeacher = teachers.find((t) => t.id === selectedTeacherId);
  const selectedArm = classArms.find((arm) => arm.id === selectedClassArmId);
  const currentAssignedTeacher = selectedArm?.classTeacherId
    ? teachers.find((t) => t.id === selectedArm.classTeacherId)
    : undefined;

  const canSave = Boolean(selectedTeacherId && selectedClassArmId);

  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="Class Allocation"
      title="Assign Class to Teacher"
      description="Select a registered teacher and choose the class arm they will oversee from the drop-down options."
      size="md"
      isEditing={Boolean(selectedArm?.classTeacherId)}
      editingBadgeText={selectedArm?.name}
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
            disabled={!canSave}
            onClick={() => internalFormRef.current?.requestSubmit()}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Save Assignment</span>
          </CtaButton>
        </>
      }
    >
      <form ref={internalFormRef} onSubmit={onSubmit} className="space-y-4">
        <AdminSelectField
          label="Teacher *"
          placeholder="Select teacher"
          value={selectedTeacherId}
          onChange={onChangeTeacher}
          options={
            teachers.length > 0
              ? teachers.map((t) => ({
                  id: t.id,
                  label: t.name,
                  description: `${t.staffId} · ${t.assignedRole ?? "Teacher"}`,
                }))
              : [
                  {
                    id: "",
                    label: "No registered teachers found",
                    disabled: true,
                  },
                ]
          }
        />

        <AdminSelectField
          label="Class Arm *"
          placeholder="Select class arm"
          value={selectedClassArmId}
          onChange={onChangeClassArm}
          options={
            classArms.length > 0
              ? classArms.map((arm) => {
                  const holder = teachers.find(
                    (t) => t.id === arm.classTeacherId
                  );
                  return {
                    id: arm.id,
                    label: `${arm.name} (${arm.classification})`,
                    description: holder
                      ? `${arm.arm} · Current: ${holder.name}`
                      : `${arm.arm} · Unassigned`,
                  };
                })
              : [
                  {
                    id: "",
                    label: "No class arms configured",
                    disabled: true,
                  },
                ]
          }
        />

        {selectedArm &&
          currentAssignedTeacher &&
          selectedTeacher &&
          currentAssignedTeacher.id !== selectedTeacher.id && (
            <p className="rounded-xl border border-brand-200/80 bg-surface-mist px-3 py-2 text-xs font-semibold text-brand-900">
              {selectedArm.name} is currently assigned to{" "}
              <span className="font-extrabold">
                {currentAssignedTeacher.name}
              </span>
              . Saving will reassign this class to{" "}
              <span className="font-extrabold">{selectedTeacher.name}</span>.
            </p>
          )}
      </form>
    </AdminModal>
  );
}
