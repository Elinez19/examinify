"use client";

import * as React from "react";
import { Eye, EyeOff, Save, UserPlus } from "lucide-react";
import {
  AdminInlineForm,
  AdminSelectField,
  AdminSelectPills,
  AdminTextField,
} from "@/components/admin/ui/admin-form-controls";
import { CtaButton } from "@/components/landing/ui/cta-button";
import {
  ADMIN_SCOPE_OPTIONS,
  ADMIN_STATUS_OPTIONS,
  ARTISAN_KYC_OPTIONS,
  CUSTOMER_STATUS_OPTIONS,
  USER_GROUP_OPTIONS,
} from "./constants";
import type {
  AdminAccountStatus,
  AdminScopeOption,
  ArtisanKycStatus,
  ArtisanUserFormData,
  CustomerAccountStatus,
  FormUserGroup,
} from "./types";

export interface ArtisanUserFormProps {
  formRef: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ArtisanUserFormData;
  onUpdateField: <K extends keyof ArtisanUserFormData>(
    field: K,
    value: ArtisanUserFormData[K]
  ) => void;
  onSetFormGroup: (group: FormUserGroup) => void;
  onReset: () => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  savedMessage: string | null;
}

export function ArtisanUserForm({
  formRef,
  open,
  onOpenChange,
  formData,
  onUpdateField,
  onSetFormGroup,
  onReset,
  onSubmit,
  saving,
  savedMessage,
}: ArtisanUserFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isEditing = Boolean(formData.editingId);
  const isAdminEdit = isEditing && formData.formGroup === "admin";

  const getFormTitle = () => {
    if (isAdminEdit) {
      return "Edit Administrator Details";
    }
    if (isEditing) {
      return `Edit ${
        formData.formGroup === "artisan"
          ? "Teacher"
          : "Student"
      } Account`;
    }
    return formData.formGroup === "artisan"
      ? "Add & Verify New Teacher"
      : formData.formGroup === "customer"
        ? "Enroll Student Profile"
        : "Grant Administrator Access";
  };

  const getSubmitLabel = () => {
    if (saving) return "Saving...";
    if (isAdminEdit) {
      return "Save changes";
    }
    if (isEditing) {
      return `Update ${
        formData.formGroup === "artisan" ? "Teacher" : "Student"
      }`;
    }
    return formData.formGroup === "artisan"
      ? "Add & Verify Teacher"
      : formData.formGroup === "customer"
        ? "Enroll Student"
        : "Add Administrator";
  };

  return (
    <AdminInlineForm
      formRef={formRef}
      eyebrow={isAdminEdit ? "Administrator Edit Desk" : "Inline Identity & Credentials Form"}
      title={getFormTitle()}
      description={
        isAdminEdit
          ? "Update identity details, active email, phone contact, credentials, and access scope with single-action confirmation."
          : "Manage school accounts directly. Switch role below to enroll a student, onboard a verified teacher/invigilator, or grant administrator privileges."
      }
      isEditing={isEditing}
      editingBadgeText={formData.name || "User"}
      onResetToCreate={onReset}
      open={open}
      onOpenChange={onOpenChange}
      savedMessage={savedMessage}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* User Role Group Selector (Hidden during admin edit for focus) */}
        {!isAdminEdit && (
          <AdminSelectPills
            label="Account Role Type"
            options={USER_GROUP_OPTIONS}
            value={formData.formGroup}
            onChange={(g) => onSetFormGroup(g as FormUserGroup)}
            columns={3}
          />
        )}

        {/* Admin-Specific Identity & Credentials Layout */}
        {formData.formGroup === "admin" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <AdminTextField
                label="Full Legal Name"
                value={formData.name}
                onChange={(e) => onUpdateField("name", e.target.value)}
                required
              />
              <AdminTextField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => onUpdateField("email", e.target.value)}
                required
              />
              <AdminTextField
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => onUpdateField("phone", e.target.value)}
                required
              />
              <AdminTextField
                label={isEditing ? "Password (Leave blank to keep)" : "Admin Password"}
                type={showPassword ? "text" : "password"}
                placeholder={isEditing ? "Leave blank to keep current" : "Min 8 characters"}
                value={formData.password || ""}
                onChange={(e) => onUpdateField("password", e.target.value)}
                hint={
                  isEditing
                    ? "Leave blank to preserve current password"
                    : "Temporary or permanent password (min 8 chars)"
                }
                trailingIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-ink-muted hover:text-brand-900 cursor-pointer p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AdminSelectField<AdminScopeOption>
                label="System Access Level & RBAC Scope"
                options={ADMIN_SCOPE_OPTIONS}
                value={formData.adminScope}
                onChange={(sc) => onUpdateField("adminScope", sc)}
                hint="Controls cryptographic permissions for verification, appeals, and admin management."
              />
              <AdminTextField
                label="Job Designation / Role Title"
                placeholder="e.g. Chief Examinations Officer"
                value={formData.roleTitle}
                onChange={(e) => onUpdateField("roleTitle", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AdminTextField
                label="Assigned System Permissions Note"
                placeholder="e.g. Teacher verification, exam oversight, and school support"
                value={formData.permissions}
                onChange={(e) => onUpdateField("permissions", e.target.value)}
                required
              />
              <AdminSelectPills
                label="Administrator Account Standing"
                options={ADMIN_STATUS_OPTIONS}
                value={formData.adminStatus}
                onChange={(st) =>
                  onUpdateField("adminStatus", st as AdminAccountStatus)
                }
                columns={3}
              />
            </div>
          </div>
        ) : (
          <>
            {/* Shared Basic Identity Fields for Artisan & Customer */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <AdminTextField
                label="Full Legal Name"
                value={formData.name}
                onChange={(e) => onUpdateField("name", e.target.value)}
                required
              />
              <AdminTextField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => onUpdateField("email", e.target.value)}
                required
              />
              <AdminTextField
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => onUpdateField("phone", e.target.value)}
                required
              />
              <AdminTextField
                label="Campus / Class Wing"
                value={formData.city}
                onChange={(e) => onUpdateField("city", e.target.value)}
                required
              />
            </div>

            {/* Dynamic Fields: Teacher */}
            {formData.formGroup === "artisan" && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <AdminTextField
                    label="Primary Subject & Department"
                    value={formData.trade}
                    onChange={(e) => onUpdateField("trade", e.target.value)}
                    required
                  />
                  <AdminTextField
                    label="Invigilation Allowance (NGN)"
                    type="number"
                    min={1000}
                    value={formData.hourlyRateNumeric}
                    onChange={(e) =>
                      onUpdateField("hourlyRateNumeric", e.target.value)
                    }
                    required
                  />
                  <AdminTextField
                    label="Staff / TRCN Reg Number"
                    value={formData.ninNumber}
                    onChange={(e) => onUpdateField("ninNumber", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <AdminTextField
                    label="Assigned Class Band"
                    value={formData.bankName}
                    onChange={(e) => onUpdateField("bankName", e.target.value)}
                    required
                  />
                  <AdminTextField
                    label="Teacher Staff ID"
                    value={formData.bankAccountNumber}
                    onChange={(e) =>
                      onUpdateField("bankAccountNumber", e.target.value)
                    }
                    required
                  />
                  <AdminSelectPills
                    label="Teacher Verification Status"
                    options={ARTISAN_KYC_OPTIONS}
                    value={formData.kycStatus}
                    onChange={(st) =>
                      onUpdateField("kycStatus", st as ArtisanKycStatus)
                    }
                    columns={3}
                  />
                </div>
              </>
            )}

            {/* Dynamic Fields: Student */}
            {formData.formGroup === "customer" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AdminSelectPills
                  label="Student Account Standing"
                  options={CUSTOMER_STATUS_OPTIONS}
                  value={formData.customerStatus}
                  onChange={(st) =>
                    onUpdateField("customerStatus", st as CustomerAccountStatus)
                  }
                  columns={3}
                />
              </div>
            )}
          </>
        )}

        {/* Submission Actions: Single focused CTA for Admin Edit */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-surface-frost">
          {isEditing && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-semibold text-ink-secondary hover:text-brand-900 transition-colors px-2 py-1 cursor-pointer"
            >
              Cancel
            </button>
          )}
          <CtaButton
            type="submit"
            variant="primary"
            size="sm"
            disabled={saving}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                <span>{getSubmitLabel()}</span>
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>{getSubmitLabel()}</span>
              </>
            )}
          </CtaButton>
        </div>
      </form>
    </AdminInlineForm>
  );
}

