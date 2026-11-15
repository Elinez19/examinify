"use client";

import * as React from "react";
import { RotateCcw, Save, X } from "lucide-react";
import { AdminInlineForm } from "@/components/admin/ui/admin-form-controls";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { cn } from "@/lib/utils";

export interface CustomFormProps {
  id?: string;
  formRef?: React.RefObject<HTMLDivElement | null>;
  eyebrow?: string;
  title: string;
  description: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isEditing?: boolean;
  editingBadgeText?: string;
  onResetToCreate?: () => void;
  resetLabel?: string;
  savedMessage?: string | null;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  submitIcon?: React.ReactNode;
  isSubmitting?: boolean;
  hideFooter?: boolean;
  footerExtra?: React.ReactNode;
  className?: string;
  formClassName?: string;
  children: React.ReactNode;
}

/**
 * CustomForm
 * Reusable normal inline form container built strictly with Examinify design tokens.
 * Replaces modal form overlays across Admin, Teacher, and Student workspaces.
 */
export function CustomForm({
  id,
  formRef,
  eyebrow,
  title,
  description,
  open = true,
  onOpenChange,
  isEditing = false,
  editingBadgeText,
  onResetToCreate,
  resetLabel = "Switch to Add New",
  savedMessage,
  onSubmit,
  onCancel,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  submitIcon,
  isSubmitting = false,
  hideFooter = false,
  footerExtra,
  className,
  formClassName,
  children,
}: CustomFormProps) {
  return (
    <AdminInlineForm
      id={id}
      formRef={formRef}
      eyebrow={eyebrow}
      title={title}
      description={description}
      isEditing={isEditing}
      editingBadgeText={editingBadgeText}
      onResetToCreate={onResetToCreate}
      resetLabel={resetLabel}
      open={open}
      onOpenChange={onOpenChange}
      savedMessage={savedMessage}
      className={className}
    >
      <form onSubmit={onSubmit} className={cn("space-y-5", formClassName)}>
        {children}

        {!hideFooter && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-surface-frost pt-4">
            <div className="flex flex-wrap items-center gap-2">{footerExtra}</div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 ml-auto">
              {isEditing && onResetToCreate && (
                <CtaButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={onResetToCreate}
                  disabled={isSubmitting}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{resetLabel}</span>
                </CtaButton>
              )}

              {onCancel && (
                <CtaButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  <X className="h-3.5 w-3.5" />
                  <span>{cancelLabel}</span>
                </CtaButton>
              )}

              <CtaButton
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting}
              >
                {submitIcon ?? <Save className="h-3.5 w-3.5" />}
                <span>{isSubmitting ? "Saving..." : submitLabel}</span>
              </CtaButton>
            </div>
          </div>
        )}
      </form>
    </AdminInlineForm>
  );
}
