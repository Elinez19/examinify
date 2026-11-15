"use client";

import type { RefObject, FormEvent } from "react";
import { Plus, Save } from "lucide-react";
import { CustomForm } from "@/components/forms/custom-form";
import {
  AdminSelectPills,
  AdminTextareaField,
  AdminTextField,
} from "@/components/admin/ui/admin-form-controls";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { DISPUTE_STATUS_OPTIONS } from "./constants";
import type { DisputeStatus } from "./types";

export interface DisputeCaseFormProps {
  formRef: RefObject<HTMLDivElement | null>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingId: string | null;
  editingCaseCode: string | null;
  bookingCode: string;
  setBookingCode: (code: string) => void;
  clientName: string;
  setClientName: (name: string) => void;
  artisanName: string;
  setArtisanName: (name: string) => void;
  serviceTitle: string;
  setServiceTitle: (title: string) => void;
  escrowAmount: string;
  setEscrowAmount: (amt: string) => void;
  status: DisputeStatus;
  setStatus: (status: DisputeStatus) => void;
  reason: string;
  setReason: (reason: string) => void;
  savedMessage: string | null;
  onReset: () => void;
  onSubmit: (e: FormEvent) => void;
}

export function DisputeCaseForm({
  formRef,
  open,
  onOpenChange,
  editingId,
  editingCaseCode,
  bookingCode,
  setBookingCode,
  clientName,
  setClientName,
  artisanName,
  setArtisanName,
  serviceTitle,
  setServiceTitle,
  escrowAmount,
  setEscrowAmount,
  status,
  setStatus,
  reason,
  setReason,
  savedMessage,
  onReset,
  onSubmit,
}: DisputeCaseFormProps) {
  return (
    <div className="mt-6">
      <CustomForm
        formRef={formRef}
        eyebrow="Inline Result Appeal & Remark Form"
        title={
          editingId
            ? `Edit & Review Appeal ${editingCaseCode || editingId}`
            : "Log & Review Student Result Appeal"
        }
        description="Log a candidate remarking request, pause result publication during script inspection, or select any row below to record the final outcome."
        isEditing={Boolean(editingId)}
        editingBadgeText={`Appeal ${editingCaseCode || ""}`}
        onResetToCreate={onReset}
        open={open}
        onOpenChange={onOpenChange}
        savedMessage={savedMessage}
        onSubmit={onSubmit}
        hideFooter
      >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <AdminTextField
              label="Exam Session Code"
              value={bookingCode}
              onChange={(e) => setBookingCode(e.target.value)}
              required
            />
            <AdminTextField
              label="Student Full Name"
              placeholder="e.g. Chidinma Nwosu"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
            <AdminTextField
              label="Subject Teacher / Grader"
              value={artisanName}
              onChange={(e) => setArtisanName(e.target.value)}
              required
            />
            <AdminTextField
              label="Exam Paper Title"
              value={serviceTitle}
              onChange={(e) => setServiceTitle(e.target.value)}
              required
            />
            <AdminTextField
              label="Remark Fee / Credit (NGN)"
              type="number"
              min={1000}
              value={escrowAmount}
              onChange={(e) => setEscrowAmount(e.target.value)}
              required
            />
          </div>

          <AdminSelectPills
            label="Appeal & Result Release State"
            options={DISPUTE_STATUS_OPTIONS}
            value={status}
            onChange={setStatus}
            columns={3}
          />

          <AdminTextareaField
            label="Appeal Reason & Examiner Notes"
            placeholder="Document the candidate's question appeal, script verification notes, and final score adjustment..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            required
          />

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
            <CtaButton type="submit" variant="primary" size="sm">
              {editingId ? (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Appeal Decision</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Open Appeal &amp; Hold Score</span>
                </>
              )}
            </CtaButton>
          </div>
        </CustomForm>
    </div>
  );
}

