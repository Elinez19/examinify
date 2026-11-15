"use client";

import * as React from "react";
import { CalendarDays } from "lucide-react";
import {
  AdminSelectField,
  AdminTextField,
} from "@/components/admin/ui/admin-form-controls";
import { CustomForm, FormSection } from "@/components/forms";
import type { AcademicSessionTerm } from "@/data/portal-mock-data";

export interface AcademicTermFormState {
  id: string;
  session: string;
  term: AcademicSessionTerm["term"];
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

export interface AcademicTermFormProps {
  formRef?: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formState: AcademicTermFormState;
  setFormState: React.Dispatch<React.SetStateAction<AcademicTermFormState>>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function AcademicTermForm({
  formRef,
  open,
  onOpenChange,
  formState,
  setFormState,
  onSubmit,
}: AcademicTermFormProps) {
  return (
    <CustomForm
      id="academic-term-inline-form"
      formRef={formRef}
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="Academic Calendar"
      title="Add Session / Term"
      description="Create an academic session term and optionally activate it across all portals."
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      submitLabel="Save Term"
      submitIcon={<CalendarDays className="h-3.5 w-3.5" />}
    >
      <FormSection title="Session & Term Window">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminTextField
            label="Academic Session *"
            value={formState.session}
            onChange={(e) =>
              setFormState((p) => ({ ...p, session: e.target.value }))
            }
            placeholder="2026/2027"
            required
          />
          <AdminSelectField<AcademicSessionTerm["term"]>
            label="Term *"
            value={formState.term}
            onChange={(val) => setFormState((p) => ({ ...p, term: val }))}
            options={[
              { id: "First Term", label: "First Term" },
              { id: "Second Term", label: "Second Term" },
              { id: "Third Term", label: "Third Term" },
            ]}
          />
          <AdminTextField
            label="Starts"
            value={formState.startsAt}
            onChange={(e) =>
              setFormState((p) => ({ ...p, startsAt: e.target.value }))
            }
          />
          <AdminTextField
            label="Ends"
            value={formState.endsAt}
            onChange={(e) =>
              setFormState((p) => ({ ...p, endsAt: e.target.value }))
            }
          />
        </div>

        <label className="mt-4 flex items-center gap-2 text-xs font-bold text-brand-900 cursor-pointer">
          <input
            type="checkbox"
            checked={formState.isActive}
            onChange={(e) =>
              setFormState((p) => ({ ...p, isActive: e.target.checked }))
            }
            className="h-4 w-4 accent-brand-700"
          />
          Set as active term immediately
        </label>
      </FormSection>
    </CustomForm>
  );
}
