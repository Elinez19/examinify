"use client";

import type { RefObject, FormEvent } from "react";
import { Save, ShieldCheck } from "lucide-react";
import { CustomForm } from "@/components/forms/custom-form";
import {
  AdminSelectPills,
  AdminTextField,
} from "@/components/admin/ui/admin-form-controls";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { POLICY_CATEGORY_OPTIONS, POLICY_STATUS_OPTIONS } from "./constants";
import type { PolicyGroup, PolicyStatus } from "./types";

export interface PlatformPolicyFormProps {
  formRef: RefObject<HTMLDivElement | null>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingId: string | null;

  // Global settings
  platformFeePercent: string;
  setPlatformFeePercent: (v: string) => void;
  artisanSharePercent: string;
  setArtisanSharePercent: (v: string) => void;
  dispatchRadiusKm: string;
  setDispatchRadiusKm: (v: string) => void;
  disputeWindowHours: string;
  setDisputeWindowHours: (v: string) => void;
  supportEmail: string;
  setSupportEmail: (v: string) => void;
  supportPhone: string;
  setSupportPhone: (v: string) => void;

  // Individual policy
  policyTitle: string;
  setPolicyTitle: (title: string) => void;
  policyKeyCode: string;
  setPolicyKeyCode: (code: string) => void;
  policyValue: string;
  setPolicyValue: (val: string) => void;
  policyDescription: string;
  setPolicyDescription: (desc: string) => void;
  policyCategory: PolicyGroup;
  setPolicyCategory: (cat: PolicyGroup) => void;
  policyStatus: PolicyStatus;
  setPolicyStatus: (status: PolicyStatus) => void;

  savedMessage: string | null;
  onReset: () => void;
  onSubmit: (e: FormEvent) => void;
}

export function PlatformPolicyForm({
  formRef,
  open,
  onOpenChange,
  editingId,
  platformFeePercent,
  setPlatformFeePercent,
  artisanSharePercent,
  setArtisanSharePercent,
  dispatchRadiusKm,
  setDispatchRadiusKm,
  disputeWindowHours,
  setDisputeWindowHours,
  supportEmail,
  setSupportEmail,
  supportPhone,
  setSupportPhone,
  policyTitle,
  setPolicyTitle,
  policyKeyCode,
  setPolicyKeyCode,
  policyValue,
  setPolicyValue,
  policyDescription,
  setPolicyDescription,
  policyCategory,
  setPolicyCategory,
  policyStatus,
  setPolicyStatus,
  savedMessage,
  onReset,
  onSubmit,
}: PlatformPolicyFormProps) {
  return (
    <div className="mt-6">
      <CustomForm
        formRef={formRef}
        eyebrow="Inline Examinify Settings & Policy Form"
        title={
          editingId
            ? `Edit & Manage Setting: ${policyTitle}`
            : "Add, Edit & Manage Examinify Settings"
        }
        description="Configure billing splits, offline auto-save intervals, and support channels—or add and edit individual CBT governance policy rules."
        isEditing={Boolean(editingId)}
        editingBadgeText={`Key: ${policyKeyCode}`}
        onResetToCreate={onReset}
        open={open}
        onOpenChange={onOpenChange}
        savedMessage={savedMessage}
        onSubmit={onSubmit}
        formClassName="space-y-5"
        hideFooter
      >
          {/* Global Platform Parameters */}
          {!editingId && (
            <div className="space-y-4 pb-4 border-b border-surface-frost">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <AdminTextField
                  label="Partner School Share (%)"
                  type="number"
                  value={artisanSharePercent}
                  onChange={(e) => setArtisanSharePercent(e.target.value)}
                  required
                />
                <AdminTextField
                  label="Platform License Fee (%)"
                  type="number"
                  value={platformFeePercent}
                  onChange={(e) => setPlatformFeePercent(e.target.value)}
                  required
                />
                <AdminTextField
                  label="Offline Auto-Save (sec)"
                  type="number"
                  value={dispatchRadiusKm}
                  onChange={(e) => setDispatchRadiusKm(e.target.value)}
                  required
                />
                <AdminTextField
                  label="Appeal Claim Window (Hours)"
                  type="number"
                  value={disputeWindowHours}
                  onChange={(e) => setDisputeWindowHours(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AdminTextField
                  label="Student & Teacher Support Email"
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  required
                />
                <AdminTextField
                  label="CBT Operations Hotline"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Add / Edit Individual Policy Setting Rule */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <AdminTextField
                label="Policy / Setting Title"
                placeholder="e.g. Strict Browser Tab Lockdown"
                value={policyTitle}
                onChange={(e) => setPolicyTitle(e.target.value)}
                required={Boolean(editingId)}
              />
              <AdminTextField
                label="Config Key Code"
                placeholder="e.g. STRICT_LOCKDOWN_MODE"
                value={policyKeyCode}
                onChange={(e) => setPolicyKeyCode(e.target.value)}
              />
              <AdminTextField
                label="Configured Value"
                placeholder="e.g. Auto-submit on 3 switches"
                value={policyValue}
                onChange={(e) => setPolicyValue(e.target.value)}
                required={Boolean(editingId)}
              />
              <AdminTextField
                label="Policy Description"
                placeholder="CBT scope and enforcement note"
                value={policyDescription}
                onChange={(e) => setPolicyDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <AdminSelectPills
                label="Policy Category"
                options={POLICY_CATEGORY_OPTIONS}
                value={policyCategory}
                onChange={setPolicyCategory}
                columns={3}
              />
              <AdminSelectPills
                label="Enforcement Status"
                options={POLICY_STATUS_OPTIONS}
                value={policyStatus}
                onChange={setPolicyStatus}
                columns={2}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-surface-frost">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink-secondary">
              <ShieldCheck className="h-4 w-4 text-accent-success shrink-0" />
              <span>
                Teacher credential &amp; lockdown verification required
                before publishing live CBT exams
              </span>
            </div>

            <div className="flex items-center gap-2.5">
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
                <Save className="h-4 w-4" />
                <span>
                  {editingId
                    ? "Update Policy Setting"
                    : policyTitle.trim()
                      ? "Add & Save Policy Setting"
                      : "Save Examinify Settings"}
                </span>
              </CtaButton>
            </div>
          </div>
      </CustomForm>
    </div>
  );
}

