"use client";

import * as React from "react";
import { Megaphone } from "lucide-react";
import { AdminTextareaField } from "@/components/admin/ui/admin-form-controls";
import { CustomForm, FormSection } from "@/components/forms";

export interface ProctorBroadcastFormProps {
  formRef?: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
  setMessage: (msg: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function ProctorBroadcastForm({
  formRef,
  open,
  onOpenChange,
  message,
  setMessage,
  onSubmit,
}: ProctorBroadcastFormProps) {
  return (
    <CustomForm
      id="proctor-broadcast-inline-form"
      formRef={formRef}
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="School Proctoring Notice"
      title="Send Proctoring Broadcast"
      description="Deliver an immediate invigilation announcement to all active candidate seats."
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      submitLabel="Broadcast Now"
      submitIcon={<Megaphone className="h-3.5 w-3.5" />}
    >
      <FormSection title="Broadcast Notice Message">
        <AdminTextareaField
          label="Proctor Notice *"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. All candidates remain seated during sync..."
          rows={3}
          required
        />
      </FormSection>
    </CustomForm>
  );
}
