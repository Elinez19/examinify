"use client";

import * as React from "react";
import { Plus, Save } from "lucide-react";
import {
  AdminInlineForm,
  AdminSelectPills,
  AdminTextField,
} from "@/components/admin/ui/admin-form-controls";
import { CtaButton } from "@/components/landing/ui/cta-button";
import {
  BOOKING_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from "./constants";
import type {
  BookingFormData,
  BookingStatus,
  PaymentStatus,
} from "./types";

export interface BookingDispatchFormProps {
  formRef: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingId: string | null;
  editingCode: string | null;
  formData: BookingFormData;
  onUpdateField: <K extends keyof BookingFormData>(
    field: K,
    value: BookingFormData[K]
  ) => void;
  onSetBookingStatus: (status: BookingStatus) => void;
  onSetPaymentStatus: (status: PaymentStatus) => void;
  onReset: () => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  savedMessage: string | null;
}

export function BookingDispatchForm({
  formRef,
  open,
  onOpenChange,
  editingId,
  editingCode,
  formData,
  onUpdateField,
  onSetBookingStatus,
  onSetPaymentStatus,
  onReset,
  onSubmit,
  saving,
  savedMessage,
}: BookingDispatchFormProps) {
  return (
    <AdminInlineForm
      formRef={formRef}
      eyebrow="Inline CBT Exam & Session Form"
      title={
        editingId
          ? `Edit Exam Session ${editingCode || editingId}`
          : "Schedule & Configure CBT Exam Session"
      }
      description="Schedule a candidate or class CBT session, assign a supervising invigilator, or update exam delivery and grading status from the table below."
      isEditing={Boolean(editingId)}
      editingBadgeText={`Session ${editingCode || ""}`}
      onResetToCreate={onReset}
      open={open}
      onOpenChange={onOpenChange}
      savedMessage={savedMessage}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AdminTextField
            label="Candidate / Class Representative"
            value={formData.clientName}
            onChange={(e) => onUpdateField("clientName", e.target.value)}
            required
          />
          <AdminTextField
            label="Student / School Email"
            type="email"
            value={formData.clientEmail}
            onChange={(e) => onUpdateField("clientEmail", e.target.value)}
            required
          />
          <AdminTextField
            label="Guardian / Contact Phone"
            value={formData.clientPhone}
            onChange={(e) => onUpdateField("clientPhone", e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AdminTextField
            label="Exam Paper & Subject"
            value={formData.serviceTitle}
            onChange={(e) => onUpdateField("serviceTitle", e.target.value)}
            required
          />
          <AdminTextField
            label="Assigned Invigilator / Teacher"
            value={formData.artisanName}
            onChange={(e) => onUpdateField("artisanName", e.target.value)}
            required
          />
          <AdminTextField
            label="Duration (Minutes) / Pass Mark"
            type="number"
            min={10}
            value={formData.agreedAmount}
            onChange={(e) => onUpdateField("agreedAmount", e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AdminTextField
            label="CBT Lab / Exam Hall"
            value={formData.address}
            onChange={(e) => onUpdateField("address", e.target.value)}
            required
          />
          <AdminTextField
            label="Exam Date"
            type="date"
            value={formData.scheduledDate}
            onChange={(e) => onUpdateField("scheduledDate", e.target.value)}
            required
          />
          <AdminTextField
            label="Session Time Window"
            value={formData.scheduledTime}
            onChange={(e) => onUpdateField("scheduledTime", e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AdminSelectPills
            label="Exam Session Status"
            options={BOOKING_STATUS_OPTIONS}
            value={formData.bookingStatus}
            onChange={onSetBookingStatus}
            columns={5}
          />
          <AdminSelectPills
            label="Sync & Grading Status"
            options={PAYMENT_STATUS_OPTIONS}
            value={formData.paymentStatus}
            onChange={onSetPaymentStatus}
            columns={4}
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-surface-frost">
          {editingId && (
            <CtaButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={onReset}
            >
              Cancel Edit
            </CtaButton>
          )}
          <CtaButton
            type="submit"
            variant="primary"
            size="sm"
            disabled={saving}
          >
            {editingId ? (
              <>
                <Save className="h-4 w-4" />
                <span>{saving ? "Saving..." : "Update Exam Session"}</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>
                  {saving ? "Scheduling..." : "Create & Schedule Session"}
                </span>
              </>
            )}
          </CtaButton>
        </div>
      </form>
    </AdminInlineForm>
  );
}

