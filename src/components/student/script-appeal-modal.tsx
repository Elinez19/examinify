"use client";

import * as React from "react";
import { Award } from "lucide-react";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminTextareaField } from "@/components/admin/ui/admin-form-controls";
import { CtaButton } from "@/components/landing/ui/cta-button";
import type { ExamSubmission } from "@/data/portal-mock-data";

export interface ScriptAppealModalProps {
  target: ExamSubmission | null;
  onClose: () => void;
  reason: string;
  setReason: (value: string) => void;
  onConfirm: () => void;
}

export function ScriptAppealModal({
  target,
  onClose,
  reason,
  setReason,
  onConfirm,
}: ScriptAppealModalProps) {
  return (
    <AdminModal
      open={Boolean(target)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      eyebrow="Score Clarification"
      title={target ? `Request Remark · ${target.examTitle}` : "Request Remark"}
      description={
        target
          ? `Submit a remark request for ${target.examTitle} (${target.subjectCode}).`
          : undefined
      }
      isEditing={Boolean(target)}
      editingBadgeText={target?.subjectCode}
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
            disabled={!reason.trim()}
            onClick={onConfirm}
          >
            <Award className="h-3.5 w-3.5" />
            <span>Submit Appeal</span>
          </CtaButton>
        </>
      }
    >
      <AdminTextareaField
        label="Reason for Appeal *"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="Specify the question number and marking point you would like reviewed..."
        rows={4}
        required
      />
    </AdminModal>
  );
}
