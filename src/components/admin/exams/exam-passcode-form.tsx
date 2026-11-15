"use client";

import * as React from "react";
import { KeyRound, RefreshCw } from "lucide-react";
import { AdminTextField } from "@/components/admin/ui/admin-form-controls";
import { CustomForm, FormSection } from "@/components/forms";
import type { PortalExam } from "@/data/portal-mock-data";

export interface ExamPasscodeFormProps {
  formRef?: React.RefObject<HTMLDivElement | null>;
  target: PortalExam | null;
  pinDraft: string;
  setPinDraft: (pin: string) => void;
  onGeneratePin: () => string;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function ExamPasscodeForm({
  formRef,
  target,
  pinDraft,
  setPinDraft,
  onGeneratePin,
  onCancel,
  onSubmit,
}: ExamPasscodeFormProps) {
  if (!target) return null;

  return (
    <CustomForm
      id="exam-passcode-inline-form"
      formRef={formRef}
      open={Boolean(target)}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
      eyebrow="Exam Access Control"
      title={`Manage Exam Pass Code · ${target.subjectCode}`}
      description={`Rotate or set the 6-digit CBT entry PIN for "${target.title}".`}
      isEditing
      editingBadgeText={target.classLevel}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitLabel="Save Pass Code"
      submitIcon={<KeyRound className="h-3.5 w-3.5" />}
    >
      <FormSection title="6-Digit Exam Pass Code / PIN">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <AdminTextField
              label="Exam Pass Code / PIN *"
              value={pinDraft}
              onChange={(e) => setPinDraft(e.target.value)}
              required
            />
          </div>
          <button
            type="button"
            onClick={() => setPinDraft(onGeneratePin())}
            className="cta-surface-secondary inline-flex h-10 items-center gap-1.5 rounded-xl px-4 font-display text-xs font-extrabold cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Regenerate PIN
          </button>
        </div>
      </FormSection>
    </CustomForm>
  );
}
