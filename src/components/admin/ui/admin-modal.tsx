"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, RotateCcw, X } from "lucide-react";
import { ToolPattern } from "@/components/brand/exam-pattern";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { cn } from "@/lib/utils";

export interface AdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  formRef?: React.RefObject<HTMLDivElement | null>;
  isEditing?: boolean;
  editingBadgeText?: string;
  onResetToCreate?: () => void;
  savedMessage?: string | null;
}

const SIZE_CLASSES: Record<NonNullable<AdminModalProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

/**
 * Contextual Overlay Modal built strictly with Examinify design system tokens.
 * Matches the Cobalt surface-slab-blue header + surface-gloss-card dialog chrome.
 */
export function AdminModal({
  open,
  onOpenChange,
  eyebrow = "Examinify Workspace",
  title,
  description,
  children,
  footer,
  size = "lg",
  formRef,
  isEditing,
  editingBadgeText,
  onResetToCreate,
  savedMessage,
}: AdminModalProps) {
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-modal-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-brand-950/65 backdrop-blur-sm"
          />

          <motion.div
            ref={formRef}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "surface-gloss-card relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-card border-2 border-surface-porcelain",
              SIZE_CLASSES[size]
            )}
          >
            {/* Cobalt Glossy Header Slab */}
            <div className="surface-slab-blue relative flex items-start justify-between gap-4 overflow-hidden px-5 py-4 sm:px-6 sm:py-5">
              <ToolPattern tone="on-blue" />

              <div className="relative z-10 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <PillBadge
                    tone="porcelain"
                    icon="dot"
                    className="px-2.5 py-0.5 text-[10px]"
                  >
                    {eyebrow}
                  </PillBadge>
                  {isEditing && editingBadgeText && (
                    <PillBadge
                      tone="sky"
                      icon="none"
                      className="px-2.5 py-0.5 text-[10px]"
                    >
                      {editingBadgeText}
                    </PillBadge>
                  )}
                </div>
                <h2
                  id="admin-modal-title"
                  className="mt-2 font-display text-lg font-extrabold tracking-tight text-ink-on-blue sm:text-xl"
                >
                  {title}
                </h2>
                {description && (
                  <p className="mt-1 text-xs font-medium text-ink-on-blue-muted">
                    {description}
                  </p>
                )}
              </div>

              <div className="relative z-10 flex shrink-0 items-center gap-2">
                {isEditing && onResetToCreate && (
                  <button
                    type="button"
                    onClick={onResetToCreate}
                    className="inline-flex items-center gap-1 rounded-pill border border-surface-porcelain/30 bg-surface-porcelain/15 px-3 py-1.5 font-display text-[11px] font-bold text-ink-on-blue transition-colors hover:bg-surface-porcelain/25 cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    New
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  aria-label="Close modal"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-surface-porcelain/30 bg-surface-porcelain/15 text-ink-on-blue transition-colors hover:bg-surface-porcelain/25 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-surface-porcelain px-5 py-4 sm:px-6 sm:py-5">
              {savedMessage && (
                <div className="mb-4 flex items-center gap-2 rounded-2xl border-2 border-accent-success/40 bg-accent-success/10 px-3.5 py-2.5 text-xs font-bold text-brand-950">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-success" />
                  <span>{savedMessage}</span>
                </div>
              )}
              {children}
            </div>

            {footer && (
              <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-surface-frost bg-surface-pearl px-5 py-3.5 sm:px-6">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
