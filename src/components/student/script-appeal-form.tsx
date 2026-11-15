"use client";

import * as React from "react";
import { Award } from "lucide-react";
import { AdminTextareaField } from "@/components/admin/ui/admin-form-controls";
import { CustomForm, FormSection } from "@/components/forms";
import type { ExamSubmission } from "@/data/portal-mock-data";

export interface ScriptAppealFormProps {
  formRef?: React.RefObject<HTMLDivElement | null>;
  target: ExamSubmission | null;
  onClose: () => void;
  reason: string;
  setReason: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

/**
 * Reusable Student Script Remark Appeal Inline Form
 * Replaces the modal remark dialog so score clarification stays within workspace flow.
 */
export function ScriptAppealForm({
  formRef,
  target,
  onClose,
  reason,
  setReason,
  onSubmit,
}: ScriptAppealFormProps) {
  return (
    <CustomForm
      id="script-appeal-inline-form"
      formRef={formRef}
      open={Boolean(target)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      eyebrow="Score Clarification"
      title={target ? `Request Remark · ${target.examTitle}` : "Request Script Remark"}
      description={
        target
          ? `Submit a focused remark request for ${target.examTitle} (${target.subjectCode}).`
          : "Specify the question number and marking point you would like reviewed."
      }
      isEditing={Boolean(target)}
      editingBadgeText={target?.subjectCode}
      onSubmit={onSubmit}
      onCancel={onClose}
      submitLabel="Submit Appeal"
      submitIcon={<Award className="h-3.5 w-3.5" />}
    >
      <FormSection title="Appeal Justification">
        <AdminTextareaField
          label="Reason for Appeal *"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Specify the question number and marking point you would like reviewed..."
          rows={4}
          required
        />
      </FormSection>
    </CustomForm>
  );
}
