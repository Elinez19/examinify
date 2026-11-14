"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { ToolPattern } from "@/components/brand/exam-pattern";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { motionTokens } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface AdminSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Glossy Porcelain Pill Search Input with Tokenized Focus Ring
 */
export function AdminSearchInput({
  value,
  onChange,
  placeholder = "Search records...",
  className,
}: AdminSearchInputProps) {
  return (
    <div className={cn("relative w-full max-w-xs sm:max-w-sm", className)}>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-600"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-pill border-2 border-brand-100 bg-surface-porcelain pl-9 pr-9 font-sans text-xs sm:text-sm font-semibold text-ink-primary shadow-gloss-card transition-all placeholder:text-ink-muted focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-accent-sky/40"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-pill bg-surface-mist text-brand-700 hover:bg-brand-100 cursor-pointer"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

export interface AdminTextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

/**
 * Reusable Tokenized Form Field (Label + Glossy Porcelain Input + Optional Hint)
 */
export const AdminTextField = React.forwardRef<
  HTMLInputElement,
  AdminTextFieldProps
>(({ label, hint, leadingIcon, trailingIcon, className, id, ...props }, ref) => {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <div className="space-y-1.5 text-left">
      <label
        htmlFor={inputId}
        className="block font-display text-xs sm:text-[13px] font-extrabold tracking-tight text-brand-950"
      >
        {label}
      </label>
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
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-xl border-2 border-brand-100 bg-surface-porcelain px-3.5 py-2 font-sans text-xs sm:text-sm font-semibold text-ink-primary shadow-gloss-card transition-all placeholder:text-ink-muted focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-accent-sky/40 disabled:cursor-not-allowed disabled:opacity-60",
            leadingIcon && "pl-10",
            trailingIcon && "pr-10",
            className
          )}
          {...props}
        />
        {trailingIcon && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
            {trailingIcon}
          </div>
        )}
      </div>
      {hint && (
        <p className="text-[11px] font-medium text-ink-secondary">{hint}</p>
      )}
    </div>
  );
});
AdminTextField.displayName = "AdminTextField";

export interface AdminTextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
}

/**
 * Reusable Tokenized Textarea Field
 */
export const AdminTextareaField = React.forwardRef<
  HTMLTextAreaElement,
  AdminTextareaFieldProps
>(({ label, hint, className, id, rows = 3, ...props }, ref) => {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <div className="space-y-1.5 text-left">
      <label
        htmlFor={inputId}
        className="block font-display text-xs sm:text-[13px] font-extrabold tracking-tight text-brand-950"
      >
        {label}
      </label>
      <textarea
        id={inputId}
        ref={ref}
        rows={rows}
        className={cn(
          "flex w-full rounded-xl border-2 border-brand-100 bg-surface-porcelain px-3.5 py-2.5 font-sans text-xs sm:text-sm font-semibold text-ink-primary shadow-gloss-card transition-all placeholder:text-ink-muted focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-accent-sky/40 disabled:cursor-not-allowed disabled:opacity-60",
          className
        )}
        {...props}
      />
      {hint && (
        <p className="text-[11px] font-medium text-ink-secondary">{hint}</p>
      )}
    </div>
  );
});
AdminTextareaField.displayName = "AdminTextareaField";

export interface AdminSelectOption<T extends string = string> {
  readonly id: T;
  readonly label: string;
  readonly description?: string;
  readonly disabled?: boolean;
}

export interface AdminSelectFieldProps<T extends string = string> {
  label?: string;
  ariaLabel?: string;
  "aria-label"?: string;
  options: ReadonlyArray<AdminSelectOption<T>>;
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  hint?: string;
  disabled?: boolean;
  variant?: "field" | "filter";
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
}

const EMPTY_SUBSCRIBE = () => () => {};

/**
 * Reusable Tokenized Custom Select Dropdown Field
 * Uses a portal-mounted listbox styled strictly with Skilled4U design tokens:
 * glossy porcelain surfaces, electric-blue active option pills, specular shadows,
 * keyboard navigation, and viewport-aware positioning.
 */
export function AdminSelectField<T extends string = string>({
  label,
  ariaLabel,
  "aria-label": ariaLabelAttr,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  hint,
  disabled = false,
  variant = "field",
  className,
  triggerClassName,
  menuClassName,
}: AdminSelectFieldProps<T>) {
  const selectId = React.useId();
  const labelId = React.useId();
  const listboxId = React.useId();

  const [open, setOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1);
  const [coords, setCoords] = React.useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
    maxHeight: number;
    openUpward: boolean;
  }>({
    top: 0,
    left: 12,
    width: 220,
    maxHeight: 260,
    openUpward: false,
  });

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const optionRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const mounted = React.useSyncExternalStore(
    EMPTY_SUBSCRIBE,
    () => true,
    () => false
  );

  const selectedOption = React.useMemo(
    () => options.find((opt) => opt.id === value) ?? null,
    [options, value]
  );

  const findNextEnabledIndex = React.useCallback(
    (startIndex: number, step: 1 | -1) => {
      if (options.length === 0) return -1;
      for (let offset = 1; offset <= options.length; offset++) {
        const idx =
          (startIndex + offset * step + options.length) % options.length;
        if (!options[idx]?.disabled) return idx;
      }
      return -1;
    },
    [options]
  );

  const findEdgeEnabledIndex = React.useCallback(
    (fromEnd: boolean) => {
      if (options.length === 0) return -1;
      const start = fromEnd ? options.length - 1 : 0;
      const step = fromEnd ? -1 : 1;
      for (let i = 0; i < options.length; i++) {
        const idx = start + i * step;
        if (!options[idx]?.disabled) return idx;
      }
      return -1;
    },
    [options]
  );

  const updatePosition = React.useCallback(() => {
    const el = triggerRef.current;
    if (!el || typeof window === "undefined") return;

    const rect = el.getBoundingClientRect();
    const viewportPadding = 12;
    const desiredWidth = Math.min(
      Math.max(rect.width, variant === "filter" ? 196 : rect.width),
      window.innerWidth - viewportPadding * 2
    );
    const clampedLeft = Math.min(
      Math.max(viewportPadding, rect.left),
      Math.max(viewportPadding, window.innerWidth - desiredWidth - viewportPadding)
    );

    const spaceBelow = window.innerHeight - rect.bottom - viewportPadding;
    const spaceAbove = rect.top - viewportPadding;
    const estimatedHeight = Math.min(280, Math.max(88, options.length * 42 + 18));
    const openUpward = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;
    const availableSpace = openUpward ? spaceAbove : spaceBelow;

    setCoords({
      top: openUpward ? undefined : Math.max(viewportPadding, rect.bottom + 8),
      bottom: openUpward
        ? Math.max(viewportPadding, window.innerHeight - rect.top + 8)
        : undefined,
      left: clampedLeft,
      width: desiredWidth,
      maxHeight: Math.max(120, Math.min(280, availableSpace - 8)),
      openUpward,
    });
  }, [options.length, variant]);

  const openMenu = React.useCallback(
    (initialIndex?: number) => {
      if (disabled || options.length === 0) return;
      updatePosition();
      const selectedIdx = options.findIndex(
        (opt) => opt.id === value && !opt.disabled
      );
      const fallbackIdx =
        selectedIdx >= 0 ? selectedIdx : findEdgeEnabledIndex(false);
      setHighlightedIndex(
        initialIndex !== undefined && initialIndex >= 0
          ? initialIndex
          : fallbackIdx
      );
      setOpen(true);
    },
    [disabled, findEdgeEnabledIndex, options, updatePosition, value]
  );

  const closeMenu = React.useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) {
      triggerRef.current?.focus();
    }
  }, []);

  const commitSelection = React.useCallback(
    (opt: AdminSelectOption<T>) => {
      if (opt.disabled) return;
      onChange(opt.id);
      closeMenu(true);
    },
    [closeMenu, onChange]
  );

  React.useEffect(() => {
    if (!open) return;

    updatePosition();

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeMenu(true);
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightedIndex((prev) =>
          prev < 0 ? findEdgeEnabledIndex(false) : findNextEnabledIndex(prev, 1)
        );
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightedIndex((prev) =>
          prev < 0 ? findEdgeEnabledIndex(true) : findNextEnabledIndex(prev, -1)
        );
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        setHighlightedIndex(findEdgeEnabledIndex(false));
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        setHighlightedIndex(findEdgeEnabledIndex(true));
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
        const opt = options[highlightedIndex];
        if (opt && !opt.disabled) {
          commitSelection(opt);
        }
        return;
      }

      if (event.key === "Tab") {
        setOpen(false);
      }
    }

    function handleViewportChange() {
      updatePosition();
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("scroll", handleViewportChange, true);
    window.addEventListener("resize", handleViewportChange);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("scroll", handleViewportChange, true);
      window.removeEventListener("resize", handleViewportChange);
    };
  }, [
    closeMenu,
    commitSelection,
    findEdgeEnabledIndex,
    findNextEnabledIndex,
    highlightedIndex,
    open,
    options,
    updatePosition,
  ]);

  React.useEffect(() => {
    if (!open || highlightedIndex < 0) return;
    optionRefs.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, open]);

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (!open) {
      if (
        event.key === "ArrowDown" ||
        event.key === "ArrowUp" ||
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        openMenu(
          event.key === "ArrowUp" ? findEdgeEnabledIndex(true) : undefined
        );
      }
    }
  };

  const resolvedAriaLabel = ariaLabel ?? ariaLabelAttr;
  const isFilter = variant === "filter";

  return (
    <div
      className={cn(
        isFilter ? "inline-block text-left" : "space-y-1.5 text-left",
        className
      )}
    >
      {label && (
        <label
          id={labelId}
          htmlFor={selectId}
          className="block font-display text-xs sm:text-[13px] font-extrabold tracking-tight text-brand-950"
        >
          {label}
        </label>
      )}

      <button
        id={selectId}
        ref={triggerRef}
        type="button"
        disabled={disabled}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-labelledby={label ? labelId : undefined}
        aria-label={!label ? resolvedAriaLabel : undefined}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "group flex items-center justify-between gap-2.5 border-2 bg-surface-porcelain font-sans shadow-gloss-card transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-sky/40 focus-visible:border-brand-500 disabled:cursor-not-allowed disabled:opacity-60",
          isFilter
            ? "h-10 min-w-[155px] rounded-pill px-4 py-2 text-xs font-bold text-brand-900"
            : "h-10 w-full rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-ink-primary",
          open
            ? "border-brand-500 ring-4 ring-accent-sky/40"
            : "border-brand-100 hover:border-brand-300 hover:bg-surface-pearl/70",
          triggerClassName
        )}
      >
        <span
          className={cn(
            "truncate text-left",
            !selectedOption && "text-ink-muted"
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "grid h-5 w-5 shrink-0 place-items-center rounded-pill transition-colors",
            open
              ? "bg-brand-100 text-brand-700"
              : "bg-surface-mist text-brand-600 group-hover:bg-brand-100"
          )}
        >
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </span>
      </button>

      {hint && (
        <p className="text-[11px] font-medium text-ink-secondary">{hint}</p>
      )}

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={menuRef}
                id={listboxId}
                role="listbox"
                aria-labelledby={label ? labelId : undefined}
                aria-label={!label ? resolvedAriaLabel ?? "Select option" : undefined}
                initial={{
                  opacity: 0,
                  scale: 0.96,
                  y: coords.openUpward ? 6 : -6,
                }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                  y: coords.openUpward ? 4 : -4,
                }}
                transition={{ duration: motionTokens.duration.fast }}
                style={{
                  position: "fixed",
                  top: coords.top,
                  bottom: coords.bottom,
                  left: coords.left,
                  width: coords.width,
                }}
                className={cn(
                  "surface-gloss-card z-[70] overflow-hidden rounded-2xl border-2 border-brand-200 p-1.5 shadow-gloss-float text-left",
                  menuClassName
                )}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-[image:var(--gloss-sheen-white)] opacity-60"
                />

                <div
                  style={{ maxHeight: coords.maxHeight }}
                  className="relative z-10 space-y-1 overflow-y-auto no-scrollbar p-0.5"
                >
                  {options.map((opt, idx) => {
                    const isSelected = opt.id === value;
                    const isHighlighted = idx === highlightedIndex;

                    return (
                      <button
                        key={opt.id}
                        ref={(node) => {
                          optionRefs.current[idx] = node;
                        }}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        disabled={opt.disabled}
                        onMouseEnter={() => {
                          if (!opt.disabled) setHighlightedIndex(idx);
                        }}
                        onClick={() => commitSelection(opt)}
                        className={cn(
                          "flex w-full items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-left font-sans text-xs sm:text-[13px] transition-all cursor-pointer focus:outline-none",
                          opt.disabled && "opacity-45 cursor-not-allowed",
                          isSelected
                            ? "cta-surface-primary font-extrabold text-ink-on-blue"
                            : isHighlighted
                              ? "bg-surface-mist font-bold text-brand-700"
                              : "font-semibold text-ink-primary hover:bg-surface-mist hover:text-brand-700"
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <span className="block truncate">{opt.label}</span>
                          {opt.description && (
                            <span
                              className={cn(
                                "block truncate text-[10px] font-medium",
                                isSelected
                                  ? "text-ink-on-blue-muted"
                                  : "text-ink-secondary"
                              )}
                            >
                              {opt.description}
                            </span>
                          )}
                        </div>

                        {isSelected && (
                          <Check
                            className="h-3.5 w-3.5 shrink-0 text-accent-sky"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}

export interface AdminSelectPillsProps<T extends string = string> {
  label: string;
  options: ReadonlyArray<AdminSelectOption<T>>;
  value: T;
  onChange: (value: T) => void;
  columns?: 2 | 3 | 4 | 5;
}

/**
 * Tokenized Pill Choice Selector for Forms
 */
export function AdminSelectPills<T extends string = string>({
  label,
  options,
  value,
  onChange,
  columns = 4,
}: AdminSelectPillsProps<T>) {
  const gridColsClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 3
        ? "grid-cols-2 sm:grid-cols-3"
        : columns === 5
          ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
          : "grid-cols-2 sm:grid-cols-4";

  return (
    <div className="space-y-1.5 text-left">
      <span className="block font-display text-xs sm:text-[13px] font-extrabold tracking-tight text-brand-950">
        {label}
      </span>
      <div className={cn("grid gap-2", gridColsClass)}>
        {options.map((opt) => {
          const active = opt.id === value;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={cn(
                "rounded-xl px-3 py-2 font-display text-xs font-extrabold tracking-wide transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-sky",
                active
                  ? "cta-surface-primary text-ink-on-blue"
                  : "cta-surface-secondary text-brand-700 hover:border-brand-400"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export interface AdminInlineFormProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description: string;
  isEditing?: boolean;
  editingBadgeText?: string;
  onResetToCreate?: () => void;
  resetLabel?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  savedMessage?: string | null;
  children: React.ReactNode;
  formRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

/**
 * Reusable Inline Add / Edit / Manage Form Panel (replaces modal overlays)
 * Renders directly inside the page workspace with Cobalt header slab,
 * Add vs Edit mode indicator, feedback banner, and smooth collapse/expand.
 */
export function AdminInlineForm({
  id = "workspace-inline-form",
  eyebrow = "Add & Manage Record",
  title,
  description,
  isEditing = false,
  editingBadgeText,
  onResetToCreate,
  resetLabel = "Switch to Add New",
  open = true,
  onOpenChange,
  savedMessage,
  children,
  formRef,
  className,
}: AdminInlineFormProps) {
  return (
    <div
      id={id}
      ref={formRef}
      className={cn(
        "surface-gloss-card overflow-hidden border-2 transition-colors scroll-mt-24",
        isEditing ? "border-brand-400" : "border-brand-100",
        className
      )}
    >
      {/* Top Cobalt Slab Header */}
      <div
        className={cn(
          "relative overflow-hidden px-4 sm:px-6 py-4",
          isEditing ? "surface-slab-ink" : "surface-slab-blue"
        )}
      >
        <ToolPattern tone="on-blue" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <PillBadge
                tone={isEditing ? "sky" : "porcelain"}
                icon="dot"
                className="px-2.5 py-0.5 text-[10px]"
              >
                {isEditing
                  ? editingBadgeText || "Editing Selected Record"
                  : eyebrow}
              </PillBadge>

              {isEditing && (
                <span className="inline-flex items-center gap-1 rounded-pill bg-surface-porcelain/15 px-2.5 py-0.5 font-display text-[10px] font-extrabold text-accent-gold border border-accent-gold/40">
                  <Sparkles className="h-2.5 w-2.5" />
                  <span>Edit &amp; Manage Mode</span>
                </span>
              )}

              {savedMessage && (
                <span className="inline-flex items-center gap-1 rounded-pill bg-surface-porcelain px-2.5 py-0.5 font-display text-[11px] font-extrabold text-brand-950 shadow-gloss-card">
                  <CheckCircle2 className="h-3 w-3 text-accent-success" />
                  <span>{savedMessage}</span>
                </span>
              )}
            </div>

            <h2 className="font-display text-base sm:text-lg font-extrabold tracking-tight text-ink-on-blue">
              {title}
            </h2>
            <p className="text-xs font-medium text-ink-on-blue-muted max-w-2xl">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {isEditing && onResetToCreate && (
              <CtaButton
                type="button"
                variant="secondary"
                size="xs"
                onClick={onResetToCreate}
              >
                <RotateCcw className="h-3 w-3" />
                <span>{resetLabel}</span>
              </CtaButton>
            )}

            {onOpenChange && (
              <CtaButton
                type="button"
                variant="secondary"
                size="xs"
                onClick={() => onOpenChange(!open)}
              >
                {open ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" />
                    <span>Hide Form</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    <span>Open Form</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </>
                )}
              </CtaButton>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Inline Form Body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: motionTokens.duration.base }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-6 bg-surface-porcelain/95">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
