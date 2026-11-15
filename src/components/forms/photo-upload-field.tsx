"use client";

import * as React from "react";
import { Camera, Trash2, Upload, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PhotoUploadFieldProps {
  value?: string;
  onChange: (dataUrl: string) => void;
  onError?: (message: string) => void;
  label?: string;
  className?: string;
}

/**
 * Reusable Passport Photo Upload Card
 * Displays a "NO PHOTO AVAILABLE" placeholder or uploaded photo preview,
 * file selector, and tokenized Attach Photo CTA button.
 */
export function PhotoUploadField({
  value,
  onChange,
  onError,
  label = "Passport Photograph",
  className,
}: PhotoUploadFieldProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = React.useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onError?.("Please select a valid image file (PNG, JPG, or WEBP).");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      onError?.("Photo size must be 2MB or smaller.");
      event.target.value = "";
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };
    reader.onerror = () => {
      onError?.("Unable to read the selected image file.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4 text-center shadow-gloss-card",
        className
      )}
    >
      <p className="font-display text-[11px] font-extrabold uppercase tracking-wider text-brand-900">
        {label}
      </p>

      <div className="my-3 flex h-36 w-32 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-brand-200 bg-surface-porcelain shadow-inner">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Uploaded passport preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 px-2 text-ink-muted">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-surface-mist text-brand-400">
              <User className="h-7 w-7" />
            </div>
            <span className="font-display text-[10px] font-extrabold uppercase tracking-wider text-brand-800/70">
              No Photo Available
            </span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
        aria-label={`Upload ${label}`}
      />

      <p className="mb-2 max-w-full truncate text-[11px] font-medium text-ink-secondary">
        {fileName || (value ? "Photo attached" : "No file chosen")}
      </p>

      <div className="flex w-full flex-col gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-brand-200 bg-surface-porcelain px-3 py-2 font-display text-xs font-extrabold text-brand-800 shadow-gloss-card transition-colors hover:bg-surface-mist cursor-pointer"
        >
          <Camera className="h-3.5 w-3.5 text-brand-600" />
          <span>Choose File</span>
        </button>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-accent-gold/60 bg-accent-gold px-3 py-2 font-display text-xs font-extrabold text-brand-950 shadow-gloss-card transition-opacity hover:opacity-95 cursor-pointer"
        >
          <Upload className="h-3.5 w-3.5" />
          <span>Attach Photo</span>
        </button>

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setFileName("");
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="inline-flex w-full items-center justify-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
          >
            <Trash2 className="h-3 w-3" />
            <span>Remove Photo</span>
          </button>
        )}
      </div>
    </div>
  );
}
