"use client";

import * as React from "react";
import { CalendarClock } from "lucide-react";
import {
  AdminSelectField,
  AdminTextareaField,
  AdminTextField,
} from "@/components/admin/ui/admin-form-controls";
import { CustomForm, FormSection } from "@/components/forms";
import type {
  ClassArm,
  PortalExam,
  SubjectEnrollment,
} from "@/data/portal-mock-data";

export interface ExamScheduleFormState {
  id: string;
  title: string;
  subjectCode: string;
  classLevel: string;
  scheduledFor: string;
  durationMinutes: number;
  passCode: string;
  status: PortalExam["status"];
  proctoringEnabled: boolean;
  instructions: string;
}

export interface ExamScheduleFormProps {
  formRef?: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formState: ExamScheduleFormState;
  setFormState: React.Dispatch<React.SetStateAction<ExamScheduleFormState>>;
  subjects: SubjectEnrollment[];
  classArms: ClassArm[];
  onReset: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function ExamScheduleForm({
  formRef,
  open,
  onOpenChange,
  formState,
  setFormState,
  subjects,
  classArms,
  onReset,
  onSubmit,
}: ExamScheduleFormProps) {
  const isEditing = Boolean(formState.id);

  return (
    <CustomForm
      id="exam-schedule-inline-form"
      formRef={formRef}
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="Exam Scheduler"
      title={isEditing ? "Edit Exam Schedule & Proctoring" : "Schedule New Exam"}
      description="Configure examination timing, access pass code, class arm allocation, and focus-switch proctoring rules."
      isEditing={isEditing}
      editingBadgeText={formState.subjectCode || "Editing Schedule"}
      onResetToCreate={onReset}
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      submitLabel={isEditing ? "Save Schedule Changes" : "Save Schedule"}
      submitIcon={<CalendarClock className="h-3.5 w-3.5" />}
    >
      <FormSection title="Examination Details & Timetable">
        <div className="space-y-4">
          <AdminTextField
            label="Examination Title *"
            value={formState.title}
            onChange={(e) =>
              setFormState((p) => ({ ...p, title: e.target.value }))
            }
            placeholder="e.g. JSS 3 Mathematics Final CBT"
            required
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <AdminSelectField
              label="Subject *"
              value={formState.subjectCode}
              onChange={(val) =>
                setFormState((p) => ({ ...p, subjectCode: val }))
              }
              options={subjects.map((sub) => ({
                id: sub.code,
                label: `${sub.title} (${sub.code})`,
              }))}
            />
            <AdminSelectField
              label="Class Arm *"
              value={formState.classLevel}
              onChange={(val) =>
                setFormState((p) => ({ ...p, classLevel: val }))
              }
              options={classArms.map((arm) => ({
                id: arm.name,
                label: arm.name,
              }))}
            />
            <AdminTextField
              label="Duration (mins) *"
              type="number"
              min={5}
              value={String(formState.durationMinutes)}
              onChange={(e) =>
                setFormState((p) => ({
                  ...p,
                  durationMinutes: Number(e.target.value) || 30,
                }))
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <AdminTextField
              label="Date & Time Slot *"
              value={formState.scheduledFor}
              onChange={(e) =>
                setFormState((p) => ({ ...p, scheduledFor: e.target.value }))
              }
            />
            <AdminTextField
              label="Pass Code / PIN *"
              value={formState.passCode}
              onChange={(e) =>
                setFormState((p) => ({ ...p, passCode: e.target.value }))
              }
              required
            />
            <AdminSelectField<PortalExam["status"]>
              label="Status *"
              value={formState.status}
              onChange={(val) => setFormState((p) => ({ ...p, status: val }))}
              options={[
                { id: "scheduled", label: "Scheduled" },
                { id: "live", label: "Live Now" },
                { id: "draft", label: "Draft" },
                { id: "completed", label: "Completed" },
              ]}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Proctoring Rules & Candidate Instructions">
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-xs font-bold text-brand-900 cursor-pointer">
            <input
              type="checkbox"
              checked={formState.proctoringEnabled}
              onChange={(e) =>
                setFormState((p) => ({
                  ...p,
                  proctoringEnabled: e.target.checked,
                }))
              }
              className="h-4 w-4 accent-brand-700"
            />
            Enforce focus-switch proctoring alerts during exam
          </label>

          <AdminTextareaField
            label="Candidate Instructions"
            value={formState.instructions}
            onChange={(e) =>
              setFormState((p) => ({ ...p, instructions: e.target.value }))
            }
            rows={2}
          />
        </div>
      </FormSection>
    </CustomForm>
  );
}
