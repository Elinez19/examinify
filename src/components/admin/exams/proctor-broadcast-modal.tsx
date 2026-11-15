"use client";

import * as React from "react";
import { Megaphone } from "lucide-react";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminTextareaField } from "@/components/admin/ui/admin-form-controls";
import { CtaButton } from "@/components/landing/ui/cta-button";

export interface ProctorBroadcastModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
  setMessage: (msg: string) => void;
  onConfirm: () => void;
}

export function ProctorBroadcastModal({
  open,
  onOpenChange,
  message,
  setMessage,
  onConfirm,
}: ProctorBroadcastModalProps) {
  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="School Proctoring Notice"
      title="Send Proctoring Broadcast"
      description="Deliver an immediate invigilation announcement to all active candidate seats."
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
            disabled={!message.trim()}
            onClick={onConfirm}
          >
            <Megaphone className="h-3.5 w-3.5" />
            <span>Broadcast Now</span>
          </CtaButton>
        </>
      }
    >
      <AdminTextareaField
        label="Proctor Notice *"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="e.g. All candidates remain seated during sync..."
        rows={3}
        required
      />
    </AdminModal>
  );
}
