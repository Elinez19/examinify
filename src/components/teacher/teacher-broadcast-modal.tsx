"use client";

import * as React from "react";
import { Megaphone } from "lucide-react";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import {
  AdminSelectField,
  AdminTextareaField,
} from "@/components/admin/ui/admin-form-controls";
import { CtaButton } from "@/components/landing/ui/cta-button";
import type { PortalExam } from "@/data/portal-mock-data";

export interface TeacherBroadcastModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exams: PortalExam[];
  examId: string;
  setExamId: (id: string) => void;
  urgency: "info" | "warning";
  setUrgency: (val: "info" | "warning") => void;
  message: string;
  setMessage: (val: string) => void;
  onConfirm: () => void;
}

export function TeacherBroadcastModal({
  open,
  onOpenChange,
  exams,
  examId,
  setExamId,
  urgency,
  setUrgency,
  message,
  setMessage,
  onConfirm,
}: TeacherBroadcastModalProps) {
  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="Live Room Notice"
      title="Broadcast Notice to Candidates"
      description="Send an instant invigilation announcement to all active seats in the selected examination."
      size="md"
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
            disabled={!message.trim() || !examId}
            onClick={onConfirm}
          >
            <Megaphone className="h-3.5 w-3.5" />
            <span>Deliver Broadcast</span>
          </CtaButton>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminSelectField
            label="Target Assessment *"
            value={examId}
            onChange={setExamId}
            options={exams.map((exam) => ({
              id: exam.id,
              label: `${exam.subjectCode} · ${exam.title}`,
            }))}
          />
          <AdminSelectField<"info" | "warning">
            label="Urgency Level"
            value={urgency}
            onChange={setUrgency}
            options={[
              { id: "info", label: "Standard Info Notice" },
              { id: "warning", label: "Urgent Proctoring Warning" },
            ]}
          />
        </div>

        <AdminTextareaField
          label="Announcement Message *"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="e.g. You have 10 minutes remaining. Review all answers before final submission..."
          rows={3}
          required
        />
      </div>
    </AdminModal>
  );
}
