---
name: examinify-platform
description: >-
  Comprehensive guide and workflows for building, extending, and maintaining
  features in the Examinify Online Exam Management System. Use when creating
  question types, exam runner logic, authoring tools, analytics, or verifying design system compliance.
---

# Examinify Platform Engineering Skill

This skill provides standard procedures and architectural recipes for developing features within the **Examinify** online exam management platform.

---

## 1. Core Platform Domains

1. **Catalog & Discovery**: FiStudy-inspired educational landing, category exploration, exam search, difficulty & certification filters.
2. **Exam Runner Engine**: Timed test sessions, interactive question palette, auto-saving, proctoring alerts, flag-for-review, and instant score summaries.
3. **Exam Authoring Suite**: Question bank creation, rubric definitions, scoring formulas, and test scheduling.
4. **Analytics & Gradebook**: Candidate performance distributions, question breakdown, and certificate issuance.

---

## 2. Recipe: Adding a New Question Type

When implementing a new question type (e.g., Audio Response, Matching, Fill-in-the-blank):

1. **Define Domain Model**:
   - Add the question model to `src/types/exam.ts` with discriminated union type `IQuestion`.
2. **Implement Pure Presentational Component**:
   - Location: `src/features/exam-runner/components/QuestionRenderer/<Type>Question.tsx`
   - Must be 100% pure presentational: accepts `question`, `userAnswer`, `onChange`, and `disabled`.
   - Uses semantic design tokens (`bg-card`, `border-border`, `text-foreground`).
3. **Wire into `QuestionRenderer.tsx`**:
   - Add the new type case to the switch statement in `QuestionRenderer.tsx`.
4. **Update Validation & Scoring Logic**:
   - In `src/features/exam-runner/services/scoring.service.ts`, implement the automated or manual evaluation rule.

---

## 3. Recipe: Adding a shadcn/ui Component

1. Install or place the component in `src/components/ui/<component>.tsx`.
2. Audit the component to ensure it uses CSS variables mapped in `src/index.css`:
   - `bg-background`, `text-foreground`, `border-border`, `ring-ring`.
3. Never use raw hex codes or arbitrary Tailwind bracket syntax (`[#...]`).

---

## 4. Pre-Completion Verification Checklist

Run these commands before completing any feature:

```bash
# 1. Strict TypeScript check
npm run typecheck

# 2. Check for rogue hardcoded colors in src/
# In PowerShell:
Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts,*.css | Select-String -Pattern '#[0-9a-fA-F]{3,6}'
```

Ensure:
- Zero type errors.
- No business logic embedded in JSX view components.
- Responsive across mobile, tablet, and desktop viewports.
- Pure light mode design system consistency (dark mode disabled).
