"use client";

import * as React from "react";
import { CalendarDays } from "lucide-react";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import {
  AdminTextareaField,
  AdminTextField,
} from "@/components/admin/ui/admin-form-controls";
import { CtaButton } from "@/components/landing/ui/cta-button";
import type { AcademicSession } from "@/data/portal-mock-data";

export interface AcademicSessionFormState {
  id: string;
  session: string;
  description: string;
  startDate: string;
  stopDate: string;
}

export interface AcademicSessionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formState: AcademicSessionFormState;
  setFormState: React.Dispatch<React.SetStateAction<AcademicSessionFormState>>;
  onReset: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

/** Build a normalized AcademicSession record from the modal form state. */
export function buildAcademicSessionFromForm(
  formState: AcademicSessionFormState,
  existingSessions: ReadonlyArray<AcademicSession>
): AcademicSession {
  const existing = existingSessions.find((item) => item.id === formState.id);
  return {
    id: formState.id || `ses_${Date.now()}`,
    session: formState.session.trim(),
    description: formState.description.trim(),
    startDate: formState.startDate.trim(),
    stopDate: formState.stopDate.trim(),
    isActive: existing?.isActive ?? false,
  };
}

export function AcademicSessionForm({
  open,
  onOpenChange,
  formState,
  setFormState,
  onReset,
  onSubmit,
}: AcademicSessionFormProps) {
  const isEditing = Boolean(formState.id);
  const internalFormRef = React.useRef<HTMLFormElement | null>(null);

  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="Academic Calendar"
      title={isEditing ? "Edit Session" : "Create Session"}
      description="Configure the academic session name, description, and start/stop dates."
      size="md"
      isEditing={isEditing}
      editingBadgeText={formState.session || "Editing Session"}
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
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{isEditing ? "Save Session Changes" : "Save Session"}</span>
          </CtaButton>
        </>
      }
    >
      <form ref={internalFormRef} onSubmit={onSubmit} className="space-y-4">
        <AdminTextField
          label="Session *"
          value={formState.session}
          onChange={(e) =>
            setFormState((p) => ({ ...p, session: e.target.value }))
          }
          placeholder="e.g. 2026/2027"
          required
        />
        <AdminTextareaField
          label="Description"
          value={formState.description}
          onChange={(e) =>
            setFormState((p) => ({ ...p, description: e.target.value }))
          }
          placeholder="Optional description of this academic session..."
          rows={3}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminTextField
            label="Start Date *"
            type="date"
            value={formState.startDate}
            onChange={(e) =>
              setFormState((p) => ({ ...p, startDate: e.target.value }))
            }
            required
          />
          <AdminTextField
            label="Stop Date *"
            type="date"
            value={formState.stopDate}
            onChange={(e) =>
              setFormState((p) => ({ ...p, stopDate: e.target.value }))
            }
            required
          />
        </div>
      </form>
    </AdminModal>
  );
}
