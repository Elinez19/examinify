"use client";

import * as React from "react";
import { Send } from "lucide-react";
import {
  AdminSelectField,
  AdminTextareaField,
} from "@/components/admin/ui/admin-form-controls";
import { CustomForm, FormSection } from "@/components/forms";
import type { PortalExam } from "@/data/portal-mock-data";

export interface TeacherBroadcastFormProps {
  formRef?: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exams: PortalExam[];
  examId: string;
  setExamId: (examId: string) => void;
  urgency: "info" | "warning";
  setUrgency: (urgency: "info" | "warning") => void;
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

/**
 * Reusable Live Invigilation Broadcast Notice Inline Form
 * Dispatches real-time reminders and warnings to active examination workstations.
 */
export function TeacherBroadcastForm({
  formRef,
  open,
  onOpenChange,
  exams,
  examId,
  setExamId,
  urgency,
  setUrgency,
  message,
  setMessage,
  onSubmit,
}: TeacherBroadcastFormProps) {
  return (
    <CustomForm
      id="teacher-broadcast-inline-form"
      formRef={formRef}
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="Live Invigilation Notice"
      title="Send Notice to Active Candidates"
      description="Broadcast real-time exam reminders or urgent invigilation instructions to active CBT workstations."
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      submitLabel="Broadcast Notice"
      submitIcon={<Send className="h-3.5 w-3.5" />}
    >
      <FormSection title="Target Assessment & Message">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminSelectField
              label="Target Examination *"
              value={examId}
              onChange={setExamId}
              options={exams.map((exam) => ({
                id: exam.id,
                label: exam.title,
              }))}
            />

            <AdminSelectField<"info" | "warning">
              label="Notice Urgency *"
              value={urgency}
              onChange={setUrgency}
              options={[
                { id: "info", label: "Standard Instruction" },
                { id: "warning", label: "Urgent Reminder" },
              ]}
            />
          </div>

          <AdminTextareaField
            label="Notice Message *"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="e.g. You have 10 minutes remaining..."
            rows={3}
            required
          />
        </div>
      </FormSection>
    </CustomForm>
  );
}
