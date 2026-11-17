"use client";

import * as React from "react";
import { CalendarDays } from "lucide-react";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import {
  AdminTextareaField,
  AdminTextField,
} from "@/components/admin/ui/admin-form-controls";
import { CtaButton } from "@/components/landing/ui/cta-button";
import type { AcademicTerm } from "@/data/portal-mock-data";

export interface AcademicTermFormState {
  id: string;
  term: string;
  description: string;
}

export interface AcademicTermFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formState: AcademicTermFormState;
  setFormState: React.Dispatch<React.SetStateAction<AcademicTermFormState>>;
  onReset?: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

/** Build a normalized AcademicTerm record from the modal form state. */
export function buildAcademicTermFromForm(
  formState: AcademicTermFormState,
  existingTerms: ReadonlyArray<AcademicTerm>
): AcademicTerm {
  const existing = existingTerms.find((item) => item.id === formState.id);
  return {
    id: formState.id || `trm_${Date.now()}`,
    term: formState.term.trim(),
    description: formState.description.trim(),
    isActive: existing?.isActive ?? false,
  };
}

export function AcademicTermForm({
  open,
  onOpenChange,
  formState,
  setFormState,
  onReset,
  onSubmit,
}: AcademicTermFormProps) {
  const isEditing = Boolean(formState.id);
  const internalFormRef = React.useRef<HTMLFormElement | null>(null);

  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="Academic Terms"
      title={isEditing ? "Edit Term" : "Create Term"}
      description="Enter the term name and optional description."
      size="md"
      isEditing={isEditing}
      editingBadgeText={formState.term || "Editing Term"}
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
            <span>{isEditing ? "Save Term Changes" : "Save Term"}</span>
          </CtaButton>
        </>
      }
    >
      <form ref={internalFormRef} onSubmit={onSubmit} className="space-y-4">
        <AdminTextField
          label="Term *"
          value={formState.term}
          onChange={(e) =>
            setFormState((p) => ({ ...p, term: e.target.value }))
          }
          placeholder="e.g. First Term"
          required
        />
        <AdminTextareaField
          label="Description"
          value={formState.description}
          onChange={(e) =>
            setFormState((p) => ({ ...p, description: e.target.value }))
          }
          placeholder="Optional description of this academic term..."
          rows={3}
        />
      </form>
    </AdminModal>
  );
}
