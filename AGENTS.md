# Examinify — Project Memory & Architecture Contract

## 1. Project Overview & Vision
Examinify is a modern, enterprise-grade Online Exam Management System inspired by high-impact educational platforms (FiStudy). It provides:
- **Exam Discovery & Catalog**: Filter by category, difficulty, duration, certification.
- **Student Exam Runner**: Timed test session, interactive question palette, auto-saving, proctoring alerts, flag-for-review, and instant score summaries.
- **Examiner / Teacher Suite**: Exam authoring wizard, question bank management, and grading rubrics.
- **Analytics & Gradebook**: Score distributions, question performance analytics, and certificate generation.

## 2. Strict Architectural Invariants
All agents and contributors working in this codebase must adhere to the following non-negotiable rules:

### A. Zero Hardcoded Design Tokens
- **NEVER** use inline hex colors (e.g., `#2563eb`), rgb values, or arbitrary Tailwind values (e.g., `bg-[#2563eb]` or `p-[17px]`).
- All styles must use semantic CSS tokens defined in `src/index.css` via `@theme inline` (e.g., `bg-primary`, `text-primary-foreground`, `bg-card`, `border-border`, `text-muted-foreground`, `rounded-xl`).
- High-contrast, accessible WCAG AA compliant palette: Royal Indigo primary, Cerulean accent, crisp slate neutrals, semantic status colors for answered (`--status-success`), flagged (`--status-warning`), and critical (`--destructive`).

### B. Separation of UI and Logic
- **Presentational Components (UI Only)**: Must be pure functions receiving typed props and rendering JSX. No API calls, no timers, no business calculations inside view components.
- **Custom Headless Hooks (Logic Only)**: Encapsulate all state transitions, timers, localStorage caching, proctoring events, and API services (e.g., `useExamRunner`, `useExamTimer`, `useExamCatalog`).
- **Container / Page Components**: Thin glue orchestrating the headless hook and presentational components.

### C. Single Responsibility Principle (SRP)
- Every component must do ONE thing well.
- Question rendering is broken down into atomic question views (`MultipleChoiceQuestion.tsx`, `CodeEditorQuestion.tsx`, `EssayQuestion.tsx`) composed under `QuestionRenderer.tsx`.
- Timer display (`ExamTimerView.tsx`) does not calculate intervals; it only renders formatted seconds and urgency styling.
- Navigation palette (`ExamPaletteView.tsx`) only renders question jump buttons and status dots.

### D. Verification Protocol
Before finishing any task:
1. Run `npm run typecheck` (`tsc --noEmit`) to verify zero TypeScript errors.
2. Run `npm run lint` to verify code quality.
3. Verify that no raw hex values or arbitrary bracket classes were introduced.
4. Verify responsiveness and ensure pure light mode design system consistency (dark mode disabled).

## 3. Directory Layout
- `src/pages/`: Top-level application pages (`HomePage.tsx`, `AuthPage.tsx`, `SignInPage.tsx`, `SignUpPage.tsx`, `ForgotPasswordPage.tsx`, `CbtExamPage.tsx`, `StudentDashboardPage.tsx`)
- `src/components/`: Modular component domain folders and primitives
  - `auth/`: Authentication forms and modals
  - `cbt-exam/`: CBT exam preliminary, runner HUD, question palette, and result slips
  - `student-dashboard/`: Overview, classes, subjects, exams, and profile components
  - `hero/`, `home-features/`, `info/`, `cta/`, `navigation/`: Landing page components
  - `ui/`: Base UI primitives (`button.tsx`, `card.tsx`, `badge.tsx`, etc.)
- `src/hooks/`: Custom React hooks (`auth/`, `cbt-exam/`, `student-dashboard/`, `scroll/`, `simulator/`, `theme/`)
- `src/services/`: Data mocking and backend services (`auth/`, `cbt-exam/`, `student-dashboard/`)
- `src/types/`: Domain TypeScript models (`auth.ts`, `cbt.ts`, `student.ts`, `exam.ts`, `landing.ts`)
- `src/lib/`: Shared utility functions (`utils.ts`)
