---
description: Enforces Separation of Concerns (UI vs Logic), Single Responsibility Principle (SRP), and clean code standards.
globs: ["src/**/*.{ts,tsx}"]
always_on: true
---

# Examinify Architecture Standards

## 1. Separation of Concerns (UI vs. Logic)
- **Presentational Components**:
  - Focus purely on view rendering and layout.
  - Must NOT contain `useEffect` timers, complex data transforms, or direct API/storage calls.
  - All event handlers and data must be accepted via typed props.
- **Custom Headless Hooks**:
  - Encapsulate all logic, side effects, state machines, and calculations.
  - Must return plain data and dispatch functions, completely agnostic of styling or DOM.
- **Containers / Pages**:
  - Act as the orchestrator wiring the custom hooks to the presentational components.

## 2. Single Responsibility Principle (SRP)
- Keep files lean and focused. If a component exceeds ~150 lines or manages more than one distinct sub-view, extract sub-components.
- Exam question rendering must use sub-views (`MultipleChoiceQuestion`, `CodeEditorQuestion`, `EssayQuestion`) coordinated by `QuestionRenderer`.
- Palettes, timers, proctor banners, and question headers must be independent components.

## 3. No Redundant or Verbose Code
- Shared types belong in `@/types/` or feature-specific `types/`. Never duplicate interface definitions.
- Eliminate copy-pasted UI markup; extract reusable atoms into `@/components/common/` or `@/components/ui/`.
- Maintain strict TypeScript typings; avoid `any`.
