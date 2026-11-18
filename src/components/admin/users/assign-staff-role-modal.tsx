"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminSelectField } from "@/components/admin/ui/admin-form-controls";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { ASSIGNABLE_STAFF_ROLE_OPTIONS } from "@/components/forms";
import type { StaffRoleOption } from "@/data/portal-mock-data";

export interface StaffRoleModalOption {
  id: string;
  name: string;
}

export interface AssignStaffRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffOptions: ReadonlyArray<StaffRoleModalOption>;
  selectedStaffId: string;
  onChangeStaff: (staffId: string) => void;
  selectedRole: StaffRoleOption | "";
  onChangeRole: (role: StaffRoleOption) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function AssignStaffRoleModal({
  open,
  onOpenChange,
  staffOptions,
  selectedStaffId,
  onChangeStaff,
  selectedRole,
  onChangeRole,
  onSubmit,
}: AssignStaffRoleModalProps) {
  const internalFormRef = React.useRef<HTMLFormElement | null>(null);

  const selectedStaff = staffOptions.find((item) => item.id === selectedStaffId);
  const canSave = Boolean(selectedStaffId && selectedRole);

  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="Staff Role Assignment"
      title="Assign Staff Role"
      description="Select a registered staff member and choose the role they hold in the school."
      size="md"
      isEditing={Boolean(selectedStaff)}
      editingBadgeText={selectedStaff?.name}
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
            <span>Save Staff Role</span>
          </CtaButton>
        </>
      }
    >
      <form ref={internalFormRef} onSubmit={onSubmit} className="space-y-4">
        <AdminSelectField
          label="Name *"
          placeholder="Select staff name"
          value={selectedStaffId}
          onChange={onChangeStaff}
          options={
            staffOptions.length > 0
              ? staffOptions.map((item) => ({
                  id: item.id,
                  label: item.name,
                }))
              : [
                  {
                    id: "",
                    label: "No registered staff found",
                    disabled: true,
                  },
                ]
          }
        />

        <AdminSelectField<StaffRoleOption | "">
          label="Role *"
          placeholder="Select role"
          value={selectedRole}
          onChange={(role) => {
            if (role) onChangeRole(role);
          }}
          options={ASSIGNABLE_STAFF_ROLE_OPTIONS}
        />
      </form>
    </AdminModal>
  );
}
