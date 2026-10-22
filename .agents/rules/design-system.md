---
description: Enforces the Examinify Design System and forbids any hardcoded tokens or colors.
globs: ["src/**/*.{ts,tsx,css}"]
always_on: true
---

# Examinify Design System Rule

## 1. Zero Hardcoded Values
- **Forbidden**: Raw color strings (`#...`, `rgb(...)`, `hsl(...)`) in JSX or CSS modules.
- **Forbidden**: Arbitrary Tailwind classes (`bg-[#1e293b]`, `text-[#ffffff]`, `w-[342px]`, `p-[13px]`).
- **Required**: Use semantic tokens provided by the design system in `src/index.css`:
  - Surfaces: `bg-background`, `bg-card`, `bg-popover`, `bg-muted`
  - Foregrounds: `text-foreground`, `text-card-foreground`, `text-muted-foreground`
  - Brand & Accents: `bg-primary`, `text-primary-foreground`, `bg-secondary`, `bg-accent`
  - Exam Statuses: `text-status-success`, `bg-status-success/15`, `text-status-warning`, `bg-status-warning/15`, `text-destructive`, `bg-destructive/15`
  - Borders & Outlines: `border-border`, `ring-ring`, `ring-offset-background`
  - Radii: `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full`

## 2. shadcn/ui Usage
- Build on top of shadcn/ui components in `@/components/ui`.
- Never duplicate primitives that shadcn provides (e.g. do not write custom raw `<button>` elements when `@/components/ui/button` can be used).
- Use `cn(...)` from `@/lib/utils` for conditional class combinations.
