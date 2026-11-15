"use client";

import * as React from "react";
import { GraduationCap } from "lucide-react";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminSelectField } from "@/components/admin/ui/admin-form-controls";
import { CtaButton } from "@/components/landing/ui/cta-button";
import type { ClassArm, StudentProfile } from "@/data/portal-mock-data";

export interface AssignStudentClassModalProps {
  target: StudentProfile | null;
  selectedClassArmId: string;
  onChangeClassArmId: (id: string) => void;
  classArms: ClassArm[];
  onClose: () => void;
  onConfirm: () => void;
}

export function AssignStudentClassModal({
  target,
  selectedClassArmId,
  onChangeClassArmId,
  classArms,
  onClose,
  onConfirm,
}: AssignStudentClassModalProps) {
  return (
    <AdminModal
      open={Boolean(target)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      eyebrow="Class Allocation"
      title={target ? `Assign Class · ${target.name}` : "Assign Class Arm"}
      description={
        target
          ? `Move ${target.admissionNo} to an active class arm for CBT seating and exam access.`
          : undefined
      }
      isEditing={Boolean(target)}
      editingBadgeText={target?.classLevel}
      size="md"
      footer={
        <>
          <CtaButton type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </CtaButton>
          <CtaButton
            type="button"
            variant="primary"
            size="sm"
            disabled={!selectedClassArmId}
            onClick={onConfirm}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Confirm Class</span>
          </CtaButton>
        </>
      }
    >
      <div className="space-y-4">
        <AdminSelectField
          label="Target Class Arm *"
          value={selectedClassArmId}
          onChange={onChangeClassArmId}
          options={classArms.map((arm) => ({
            id: arm.id,
            label: `${arm.name} · ${arm.arm}`,
          }))}
        />
      </div>
    </AdminModal>
  );
}
