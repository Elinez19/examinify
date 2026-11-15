"use client";

import * as React from "react";
import { KeyRound, RefreshCw } from "lucide-react";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminTextField } from "@/components/admin/ui/admin-form-controls";
import { CtaButton } from "@/components/landing/ui/cta-button";
import type { PortalExam } from "@/data/portal-mock-data";

export interface ExamPasscodeModalProps {
  target: PortalExam | null;
  pinDraft: string;
  setPinDraft: (pin: string) => void;
  onGeneratePin: () => string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ExamPasscodeModal({
  target,
  pinDraft,
  setPinDraft,
  onGeneratePin,
  onClose,
  onConfirm,
}: ExamPasscodeModalProps) {
  return (
    <AdminModal
      open={Boolean(target)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      eyebrow="Exam Access Control"
      title={
        target
          ? `Manage Exam Pass Code · ${target.subjectCode}`
          : "Manage Pass Code"
      }
      description={
        target
          ? `Rotate or set the 6-digit CBT entry PIN for "${target.title}".`
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
            disabled={!pinDraft.trim()}
            onClick={onConfirm}
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>Save Pass Code</span>
          </CtaButton>
        </>
      }
    >
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[200px] flex-1">
          <AdminTextField
            label="6-Digit Exam Pass Code / PIN *"
            value={pinDraft}
            onChange={(e) => setPinDraft(e.target.value)}
            required
          />
        </div>
        <CtaButton
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setPinDraft(onGeneratePin())}
          className="h-10"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Regenerate PIN</span>
        </CtaButton>
      </div>
    </AdminModal>
  );
}
