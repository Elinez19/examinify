"use client";

import * as React from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IdGeneratorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => string;
  generateLabel?: string;
  placeholder?: string;
  required?: boolean;
  leadingIcon?: React.ReactNode;
  hint?: string;
  className?: string;
}

/**
 * Reusable ID Field with inline "Generate ID" trigger
 * Styled with Examinify's porcelain input surface and gold/cobalt action badge.
 */
export function IdGeneratorField({
  label,
  value,
  onChange,
  onGenerate,
  generateLabel = "Generate ID",
  placeholder,
  required = false,
  leadingIcon,
  hint,
  className,
}: IdGeneratorFieldProps) {
  const inputId = React.useId();

  return (
    <div className={cn("space-y-1.5 text-left", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor={inputId}
          className="block font-display text-xs sm:text-[13px] font-extrabold tracking-tight text-brand-950"
        >
          {label}
          {required && <span className="ml-0.5 text-rose-600">*</span>}
        </label>

        <button
          type="button"
          onClick={() => onChange(onGenerate())}
          className="inline-flex items-center gap-1 rounded-lg border border-accent-gold/70 bg-accent-gold/25 px-2 py-0.5 font-display text-[10px] font-extrabold text-brand-950 transition-colors hover:bg-accent-gold/40 cursor-pointer"
        >
          <Sparkles className="h-2.5 w-2.5 text-brand-700" />
          <span>{generateLabel}</span>
          <RefreshCw className="h-2.5 w-2.5 text-brand-700" />
        </button>
      </div>

      <div className="relative">
        {leadingIcon && (
          <span
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-600"
            aria-hidden="true"
          >
            {leadingIcon}
          </span>
        )}
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          className={cn(
            "flex h-10 w-full rounded-xl border-2 border-brand-100 bg-surface-porcelain px-3.5 py-2 font-mono text-xs sm:text-sm font-bold text-ink-primary shadow-gloss-card transition-all placeholder:font-sans placeholder:font-medium placeholder:text-ink-muted focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-accent-sky/40",
            leadingIcon && "pl-10"
          )}
        />
      </div>

      {hint && (
        <p className="text-[11px] font-medium text-ink-secondary">{hint}</p>
      )}
    </div>
  );
}
