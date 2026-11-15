"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Structured Form Section with Examinify cobalt-tinted section bar and porcelain body.
 * Matches detailed school portal registration layouts using Examinify design tokens.
 */
export function FormSection({
  title,
  subtitle,
  icon,
  children,
  className,
}: FormSectionProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border-2 border-brand-100 bg-surface-porcelain shadow-gloss-card",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-brand-100 bg-gradient-to-r from-brand-100/90 via-surface-mist to-brand-50 px-4 py-2.5 sm:px-5">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-brand-600 text-ink-on-blue shadow-sm">
              {icon}
            </span>
          )}
          <h3 className="font-display text-xs sm:text-sm font-extrabold tracking-tight text-brand-950">
            {title}
          </h3>
        </div>
        {subtitle && (
          <span className="text-[11px] font-semibold text-ink-secondary">
            {subtitle}
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5 bg-surface-porcelain">{children}</div>
    </section>
  );
}
