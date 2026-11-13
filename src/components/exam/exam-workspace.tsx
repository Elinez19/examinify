"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Calculator,
  CheckCircle2,
  Clock,
  Eraser,
  Flag,
  Grid,
  KeyRound,
  Lock,
  Megaphone,
  Play,
  RotateCcw,
  Send,
  ShieldCheck,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { OffsetRing } from "@/components/brand/offset-ring";
import { ToolPattern } from "@/components/brand/exam-pattern";
import { AdminDialogModal } from "@/components/admin/ui/admin-dialog-modal";
import { AdminTextField } from "@/components/admin/ui/admin-form-controls";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { ExamCalculator } from "@/components/exam/exam-calculator";
import { useExamSession } from "@/hooks/exam/use-exam-session";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import { cn } from "@/lib/utils";

function formatClock(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hrs > 0
    ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
    : `${pad(mins)}:${pad(secs)}`;
}

type PaletteFilter = "all" | "unanswered" | "flagged";

export function ExamWorkspace({ examId }: { examId: string }) {
  const { store, hydrated, submitExamAttempt } = usePortalStore();

  const exam = React.useMemo(
    () => store.exams.find((e) => e.id === examId),
    [store.exams, examId]
  );

  const questions = React.useMemo(() => {
    if (!exam) return [];
    return exam.questionIds
      .map((id) => store.questions.find((q) => q.id === id))
      .filter((q): q is NonNullable<typeof q> => Boolean(q));
  }, [exam, store.questions]);

  const examBroadcasts = React.useMemo(
    () => store.broadcasts.filter((b) => b.examId === examId),
    [store.broadcasts, examId]
  );

  const session = useExamSession({
    exam,
    questions,
    onFinalizeSubmit: submitExamAttempt,
  });

  const [pinInput, setPinInput] = React.useState("");
  const [pinError, setPinError] = React.useState("");
  const [calcOpen, setCalcOpen] = React.useState(false);
  const [paletteOpenMobile, setPaletteOpenMobile] = React.useState(false);
  const [paletteFilter, setPaletteFilter] = React.useState<PaletteFilter>("all");
  const [confirmSubmitOpen, setConfirmSubmitOpen] = React.useState(false);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-pearl p-6">
        <div className="surface-gloss-card p-8 text-center space-y-2">
          <p className="font-display text-lg font-extrabold text-brand-950">
            Loading Examinify Exam Hall...
          </p>
          <p className="text-xs font-semibold text-ink-secondary">
            Verifying offline question bundle
          </p>
        </div>
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-pearl p-6">
        <div className="surface-gloss-card max-w-md w-full p-7 text-center space-y-4">
          <PillBadge tone="sky">Exam Unavailable</PillBadge>
          <h1 className="font-display text-2xl font-extrabold text-brand-950">
            Paper Not Found
          </h1>
          <p className="text-sm font-medium text-ink-secondary">
            This exam session may have been archived or has no published questions yet.
          </p>
          <CtaButton variant="primary" size="md" href="/student/exams">
            Return to Student Exams
          </CtaButton>
        </div>
      </div>
    );
  }

  const answeredCount = questions.filter(
    (q) => (session.answers[q.id] ?? "").trim().length > 0
  ).length;
  const unansweredCount = questions.length - answeredCount;
  const flaggedCount = session.flaggedIds.length;

  const fontScaleClass =
    store.accessibility.fontSize === "xlarge"
      ? "text-lg sm:text-xl"
      : store.accessibility.fontSize === "large"
        ? "text-base sm:text-lg"
        : "text-sm sm:text-base";

  /* -------------------------------------------------------------------------
   * STAGE 1: PRE-EXAM LOBBY & VERIFICATION GATE
   * -----------------------------------------------------------------------*/
  if (session.stage === "lobby") {
    const handleStart = (e: React.FormEvent) => {
      e.preventDefault();
      if (exam.accessPin && pinInput.trim() !== exam.accessPin) {
        setPinError(
          `Invalid Exam Gate PIN. Enter ${exam.accessPin} provided by your invigilator.`
        );
        return;
      }
      setPinError("");
      session.startFreshExam();
    };

    return (
      <div className="min-h-screen bg-surface-pearl px-4 py-6 sm:py-10 flex items-center justify-center">
        <div className="w-full max-w-4xl space-y-5">
          <div className="flex items-center justify-between gap-3">
            <BrandLogo tone="on-light" size="sm" />
            <Link
              href="/student/exams"
              className="inline-flex items-center gap-1.5 rounded-pill border-2 border-brand-100 bg-surface-porcelain px-3.5 py-1.5 font-display text-xs font-extrabold text-brand-700 hover:bg-brand-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Timetable
            </Link>
          </div>

          <div className="surface-slab-blue relative overflow-hidden rounded-slab p-6 sm:p-8 text-ink-on-blue">
            <ToolPattern tone="on-blue" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <PillBadge tone="porcelain" icon="shield" className="px-3 py-1 text-xs">
                  {exam.code} · {exam.subjectName}
                </PillBadge>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold leading-tight">
                  {exam.title}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-ink-on-blue-muted">
                  {store.student.name} ({store.student.regNo}) ·{" "}
                  {store.student.classLevel} · {exam.venue}
                </p>
              </div>
              <OffsetRing size="md" faceTone="ink" className="h-24 w-24 shrink-0">
                <div className="text-center leading-tight">
                  <span className="block font-display text-xl font-extrabold text-accent-sky">
                    {exam.durationMinutes}m
                  </span>
                  <span className="block text-[10px] font-bold text-ink-on-blue-muted">
                    {questions.length} Items
                  </span>
                </div>
              </OffsetRing>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            <div className="md:col-span-7 surface-gloss-card p-5 sm:p-6 space-y-4">
              <h2 className="font-display text-lg font-extrabold text-brand-950">
                Candidate Instructions & Rules
              </h2>
              <ul className="space-y-2.5">
                {exam.instructions.map((rule, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-ink-secondary"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-success" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-brand-100">
                <span className="inline-flex items-center gap-1.5 rounded-pill bg-brand-50 px-3 py-1 font-display text-[11px] font-extrabold text-brand-700 border border-brand-100">
                  <Wifi className="h-3.5 w-3.5 text-accent-success" />
                  Offline Bundle Cached
                </span>
                {exam.allowCalculator && (
                  <span className="inline-flex items-center gap-1.5 rounded-pill bg-brand-50 px-3 py-1 font-display text-[11px] font-extrabold text-brand-700 border border-brand-100">
                    <Calculator className="h-3.5 w-3.5 text-brand-600" />
                    Calculator Allowed
                  </span>
                )}
              </div>
            </div>

            <form
              onSubmit={handleStart}
              className="md:col-span-5 surface-gloss-card p-5 sm:p-6 flex flex-col justify-between gap-4"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-brand-600" />
                  <h2 className="font-display text-base font-extrabold text-brand-950">
                    Exam Hall Gate
                  </h2>
                </div>

                {exam.accessPin ? (
                  <div className="space-y-1.5">
                    <AdminTextField
                      label="Invigilator Access PIN"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      placeholder={`Enter ${exam.accessPin}`}
                      leadingIcon={<KeyRound className="h-4 w-4" />}
                      hint={`Demo invigilator PIN for this paper: ${exam.accessPin}`}
                    />
                    {pinError && (
                      <p className="text-xs font-bold text-accent-warm">
                        {pinError}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs font-semibold text-ink-secondary">
                    No gate PIN required for this session. Start whenever you are ready.
                  </p>
                )}

                <div className="rounded-2xl border border-brand-100 bg-surface-pearl/80 p-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-display text-xs font-extrabold text-brand-950">
                      Simulate Offline Lab Mode
                    </p>
                    <p className="text-[11px] font-medium text-ink-secondary">
                      Test local autosave & offline submission queue
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      session.setIsOfflineSimulated((v) => !v)
                    }
                    className={cn(
                      "rounded-pill px-3 py-1 font-display text-[11px] font-extrabold cursor-pointer transition-colors",
                      session.isOfflineSimulated
                        ? "bg-accent-gold text-brand-950"
                        : "bg-brand-100 text-brand-700"
                    )}
                  >
                    {session.isOfflineSimulated ? "Offline ON" : "Online"}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {session.hasResumableAttempt && (
                  <CtaButton
                    variant="secondary"
                    size="md"
                    type="button"
                    onClick={session.resumeSavedExam}
                    className="w-full"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Resume Saved Attempt
                  </CtaButton>
                )}
                <CtaButton
                  variant="primary"
                  size="md"
                  type="submit"
                  className="w-full"
                  trailingArrow
                >
                  <Play className="h-4 w-4" />
                  Start Exam Now
                </CtaButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------
   * STAGE 3: POST-SUBMISSION RECEIPT
   * -----------------------------------------------------------------------*/
  if (session.stage === "submitted" && session.submission) {
    const sub = session.submission;
    const showImmediateScore =
      exam.instantResult || sub.theoryMax === 0;

    return (
      <div className="min-h-screen bg-surface-pearl px-4 py-8 flex items-center justify-center">
        <div className="surface-gloss-card w-full max-w-2xl p-6 sm:p-8 space-y-6 text-center">
          <div className="mx-auto inline-flex">
            <OffsetRing size="lg" faceTone="blue">
              <CheckCircle2 className="h-9 w-9 text-accent-gold" />
            </OffsetRing>
          </div>

          <div className="space-y-1.5">
            <PillBadge tone="sky" icon="shield">
              Receipt · {sub.receiptCode}
            </PillBadge>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-950">
              Exam Script Submitted!
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-ink-secondary">
              {sub.examTitle} · {sub.studentName} ({sub.studentRegNo})
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="rounded-2xl border border-brand-100 bg-surface-pearl p-3">
              <span className="block text-[10px] font-bold uppercase text-ink-muted">
                Sync Status
              </span>
              <span className="mt-0.5 block font-display text-xs font-extrabold text-brand-950">
                {sub.syncStatus === "queued_offline"
                  ? "Queued Locally"
                  : "Synced to Host"}
              </span>
            </div>
            <div className="rounded-2xl border border-brand-100 bg-surface-pearl p-3">
              <span className="block text-[10px] font-bold uppercase text-ink-muted">
                Time Spent
              </span>
              <span className="mt-0.5 block font-display text-xs font-extrabold text-brand-950">
                {formatClock(sub.timeSpentSeconds)}
              </span>
            </div>
            <div className="rounded-2xl border border-brand-100 bg-surface-pearl p-3">
              <span className="block text-[10px] font-bold uppercase text-ink-muted">
                Objective Score
              </span>
              <span className="mt-0.5 block font-display text-xs font-extrabold text-brand-950">
                {sub.objectiveScore} / {sub.objectiveMax}
              </span>
            </div>
            <div className="rounded-2xl border border-brand-100 bg-surface-pearl p-3">
              <span className="block text-[10px] font-bold uppercase text-ink-muted">
                Tab Alerts
              </span>
              <span className="mt-0.5 block font-display text-xs font-extrabold text-brand-950">
                {sub.tabSwitchCount} logged
              </span>
            </div>
          </div>

          {showImmediateScore ? (
            <div className="surface-slab-ink rounded-2xl p-4 text-ink-on-blue">
              <p className="text-xs font-bold uppercase text-accent-sky">
                Instant Result Summary
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold">
                {sub.percentage}% · Grade {sub.grade}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-brand-100 bg-brand-50/70 p-4 text-xs font-semibold text-brand-900">
              Your objective items are auto-scored ({sub.objectiveScore}/
              {sub.objectiveMax}). Theory responses are queued for{" "}
              <span className="font-extrabold">{exam.teacherName}</span> to grade
              and publish.
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <CtaButton variant="primary" size="md" href="/student/results">
              View Results & Scripts
            </CtaButton>
            <CtaButton variant="secondary" size="md" href="/student">
              Student Dashboard
            </CtaButton>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------
   * STAGE 2: ACTIVE CBT EXAM HALL
   * -----------------------------------------------------------------------*/
  const currentQ = session.currentQuestion;
  const currentAnswer = currentQ ? session.answers[currentQ.id] ?? "" : "";
  const isFlagged = currentQ
    ? session.flaggedIds.includes(currentQ.id)
    : false;
  const isLastQuestion = session.currentIndex === questions.length - 1;
  const isCriticalTime = session.remainingSeconds <= 60;
  const isLowTime = session.remainingSeconds <= 300 && !isCriticalTime;

  const filteredQuestionIndices = questions
    .map((q, idx) => ({ q, idx }))
    .filter(({ q }) => {
      if (paletteFilter === "flagged") return session.flaggedIds.includes(q.id);
      if (paletteFilter === "unanswered")
        return !(session.answers[q.id] ?? "").trim();
      return true;
    });

  const paletteContent = (
    <div className="flex h-full flex-col justify-between gap-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-sm font-extrabold text-brand-950">
            Question Navigator
          </h2>
          <span className="font-mono text-xs font-bold text-brand-700">
            {answeredCount}/{questions.length}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1 rounded-xl bg-surface-pearl p-1 border border-brand-100">
          {(
            [
              { id: "all", label: `All (${questions.length})` },
              { id: "unanswered", label: `Left (${unansweredCount})` },
              { id: "flagged", label: `Flag (${flaggedCount})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPaletteFilter(tab.id)}
              className={cn(
                "rounded-lg px-2 py-1 font-display text-[10px] font-extrabold transition-colors cursor-pointer",
                paletteFilter === tab.id
                  ? "bg-brand-600 text-ink-on-blue"
                  : "text-ink-secondary hover:bg-brand-50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-2">
          {filteredQuestionIndices.map(({ q, idx }) => {
            const answered = (session.answers[q.id] ?? "").trim().length > 0;
            const flagged = session.flaggedIds.includes(q.id);
            const visited = session.visitedIds.includes(q.id);
            const active = idx === session.currentIndex;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  session.goToQuestion(idx);
                  setPaletteOpenMobile(false);
                }}
                aria-label={`Jump to question ${idx + 1}`}
                className={cn(
                  "relative h-10 rounded-xl font-display text-xs font-extrabold transition-all cursor-pointer border-2",
                  active && "ring-4 ring-accent-sky",
                  flagged
                    ? "bg-accent-gold text-brand-950 border-brand-950/30"
                    : answered
                      ? "cta-surface-primary text-ink-on-blue border-brand-500"
                      : visited
                        ? "bg-surface-mist text-brand-950 border-brand-300"
                        : "bg-surface-porcelain text-ink-secondary border-brand-100 hover:border-brand-300"
                )}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend + Shortcuts */}
      <div className="space-y-3 border-t border-brand-100 pt-3">
        <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold text-ink-secondary">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-brand-600" />
            Answered ({answeredCount})
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-accent-gold" />
            Flagged ({flaggedCount})
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-surface-mist border border-brand-300" />
            Visited
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-surface-porcelain border border-brand-200" />
            Not Visited
          </span>
        </div>

        {store.accessibility.showKeyboardHints && (
          <div className="rounded-xl border border-brand-100 bg-surface-pearl/80 p-2.5 text-[10px] font-semibold text-ink-secondary space-y-1">
            <p className="font-display font-extrabold text-brand-950">
              Keyboard Shortcuts
            </p>
            <p>A–D: Choose option · F: Flag · P/N: Prev/Next</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-surface-pearl text-ink-primary">
      {/* Top Sticky Exam Bar */}
      <header className="sticky top-0 z-30 border-b-2 border-brand-100 bg-surface-porcelain/95 backdrop-blur-md px-3 sm:px-6 py-2.5 shadow-gloss-card">
        <div className="mx-auto max-w-[1500px] flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-3 min-w-0">
            <BrandLogo tone="on-light" size="sm" />
            <div className="hidden sm:block border-l border-brand-100 pl-3 min-w-0">
              <p className="truncate font-display text-sm font-extrabold text-brand-950">
                {exam.title}
              </p>
              <p className="truncate text-[11px] font-semibold text-ink-secondary">
                {store.student.name} · {store.student.regNo}
              </p>
            </div>
          </div>

          {/* Center / Right Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Sync / Offline Badge */}
            <span
              className={cn(
                "hidden md:inline-flex items-center gap-1.5 rounded-pill px-3 py-1 font-display text-[11px] font-extrabold border",
                session.isOfflineSimulated
                  ? "border-accent-gold bg-surface-porcelain text-brand-950"
                  : "border-brand-100 bg-surface-pearl text-brand-700"
              )}
            >
              {session.isOfflineSimulated ? (
                <WifiOff className="h-3.5 w-3.5 text-accent-gold" />
              ) : (
                <Wifi className="h-3.5 w-3.5 text-accent-success" />
              )}
              {session.isOfflineSimulated
                ? `Local Save Only (${session.lastSavedAt})`
                : `Auto-Saved · ${session.lastSavedAt}`}
            </span>

            {session.tabSwitchCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-pill border border-accent-warm bg-surface-mist px-2.5 py-1 font-display text-[11px] font-extrabold text-accent-warm-deep">
                <AlertTriangle className="h-3 w-3" />
                {session.tabSwitchCount} Focus Alert
              </span>
            )}

            {/* Countdown Clock */}
            <div
              className={cn(
                "inline-flex items-center gap-1.5 rounded-pill px-3.5 py-1.5 font-mono text-sm font-extrabold border-2",
                isCriticalTime
                  ? "animate-pulse border-accent-warm bg-surface-mist text-accent-warm-deep"
                  : isLowTime
                    ? "border-accent-gold bg-surface-porcelain text-brand-950"
                    : "cta-surface-primary border-brand-400 text-ink-on-blue"
              )}
            >
              <Clock className="h-4 w-4" />
              <span>{formatClock(session.remainingSeconds)}</span>
            </div>

            {exam.allowCalculator && (
              <button
                type="button"
                onClick={() => setCalcOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-pill border-2 border-brand-200 bg-surface-porcelain px-3 py-1.5 font-display text-xs font-extrabold text-brand-700 hover:bg-brand-50 cursor-pointer"
              >
                <Calculator className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Calculator</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setPaletteOpenMobile(true)}
              className="lg:hidden inline-flex items-center gap-1.5 rounded-pill border-2 border-brand-200 bg-surface-porcelain px-3 py-1.5 font-display text-xs font-extrabold text-brand-700 cursor-pointer"
            >
              <Grid className="h-3.5 w-3.5" />
              {answeredCount}/{questions.length}
            </button>

            <CtaButton
              variant="primary"
              size="xs"
              onClick={() => setConfirmSubmitOpen(true)}
            >
              <Send className="h-3.5 w-3.5" />
              Submit
            </CtaButton>
          </div>
        </div>
      </header>

      {/* Tab-Switch Warning Strip */}
      {session.tabWarningOpen && (
        <div className="bg-brand-950 text-ink-on-blue px-4 py-2 text-xs font-semibold flex items-center justify-between gap-3">
          <div className="mx-auto max-w-[1500px] w-full flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-accent-gold shrink-0" />
              Window focus change detected and logged for invigilation review (
              {session.tabSwitchCount} alert
              {session.tabSwitchCount > 1 ? "s" : ""}). Stay inside the exam hall.
            </span>
            <button
              type="button"
              onClick={() => session.setTabWarningOpen(false)}
              className="rounded-pill bg-brand-800 px-2.5 py-0.5 font-display text-[11px] font-extrabold text-accent-sky cursor-pointer"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* Teacher Room Broadcast Strip */}
      {examBroadcasts.length > 0 && (
        <div className="bg-brand-50 border-b border-brand-200 px-4 py-2">
          <div className="mx-auto max-w-[1500px] flex items-center gap-2 text-xs font-semibold text-brand-900">
            <Megaphone className="h-3.5 w-3.5 text-brand-600 shrink-0" />
            <span className="font-display font-extrabold">
              Invigilator Notice ({examBroadcasts[0].sentAt}):
            </span>
            <span className="truncate">{examBroadcasts[0].message}</span>
          </div>
        </div>
      )}

      {/* Main Split Workspace */}
      <main className="mx-auto w-full max-w-[1500px] flex-1 p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Question Canvas */}
        <section className="lg:col-span-8 xl:col-span-9 flex flex-col justify-between gap-4">
          {currentQ && (
            <div className="surface-gloss-card p-5 sm:p-7 space-y-5 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-100 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <PillBadge tone="blue" className="px-3 py-1 text-xs">
                    Question {session.currentIndex + 1} of {questions.length}
                  </PillBadge>
                  <PillBadge tone="sky" className="px-2.5 py-1 text-[11px]">
                    {currentQ.topic}
                  </PillBadge>
                  <span className="rounded-pill border border-brand-100 bg-surface-pearl px-2.5 py-1 font-display text-[11px] font-extrabold text-brand-700">
                    {currentQ.marks} Marks
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => session.toggleFlag(currentQ.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 font-display text-xs font-extrabold border-2 transition-colors cursor-pointer",
                    isFlagged
                      ? "border-brand-950/30 bg-accent-gold text-brand-950"
                      : "border-brand-100 bg-surface-pearl text-brand-700 hover:bg-brand-50"
                  )}
                >
                  {isFlagged ? (
                    <Bookmark className="h-3.5 w-3.5 fill-current" />
                  ) : (
                    <Flag className="h-3.5 w-3.5" />
                  )}
                  {isFlagged ? "Flagged for Review" : "Flag Question"}
                </button>
              </div>

              {currentQ.passage && (
                <div className="rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4 text-xs sm:text-sm font-medium leading-relaxed text-ink-secondary">
                  {currentQ.passage}
                </div>
              )}

              {currentQ.diagramLabel && (
                <div className="rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/60 px-4 py-3 flex items-center gap-2.5 text-xs font-bold text-brand-800">
                  <ShieldCheck className="h-4 w-4 text-brand-600 shrink-0" />
                  <span>{currentQ.diagramLabel}</span>
                </div>
              )}

              <div
                className={cn(
                  "font-display font-extrabold leading-relaxed text-brand-950",
                  fontScaleClass
                )}
              >
                {currentQ.stem}
              </div>

              {/* Answer Input by Question Type */}
              {(currentQ.type === "mcq" || currentQ.type === "true_false") &&
                currentQ.options && (
                  <div className="space-y-2.5 pt-1">
                    {currentQ.options.map((opt) => {
                      const selected = currentAnswer === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => session.setAnswer(currentQ.id, opt.id)}
                          className={cn(
                            "w-full flex items-center gap-3.5 rounded-2xl border-2 p-3.5 sm:p-4 text-left transition-all cursor-pointer",
                            selected
                              ? "cta-surface-primary border-brand-400 text-ink-on-blue shadow-cta-primary"
                              : store.accessibility.highContrastOptions
                                ? "border-brand-400 bg-surface-porcelain text-brand-950 hover:bg-brand-50"
                                : "border-brand-100 bg-surface-porcelain text-brand-950 hover:border-brand-300 hover:bg-surface-pearl"
                          )}
                        >
                          <span
                            className={cn(
                              "grid h-8 w-8 shrink-0 place-items-center rounded-xl font-display text-xs font-extrabold border",
                              selected
                                ? "border-surface-porcelain bg-surface-porcelain text-brand-700"
                                : "border-brand-200 bg-surface-pearl text-brand-700"
                            )}
                          >
                            {opt.label}
                          </span>
                          <span
                            className={cn(
                              "font-sans font-semibold",
                              fontScaleClass
                            )}
                          >
                            {opt.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

              {currentQ.type === "short_answer" && (
                <div className="space-y-2 pt-1 max-w-md">
                  <label className="block font-display text-xs font-extrabold text-brand-700">
                    Your Short Answer
                  </label>
                  <input
                    type="text"
                    value={currentAnswer}
                    onChange={(e) =>
                      session.setAnswer(currentQ.id, e.target.value)
                    }
                    placeholder="Type your exact answer here..."
                    className="h-12 w-full rounded-2xl border-2 border-brand-200 bg-surface-porcelain px-4 font-sans text-base font-bold text-brand-950 shadow-gloss-card focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-accent-sky/40"
                  />
                </div>
              )}

              {currentQ.type === "theory" && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="font-display text-xs font-extrabold text-brand-700">
                      Essay / Step-by-Step Solution
                    </label>
                    <span className="font-mono text-[11px] font-bold text-ink-muted">
                      {currentAnswer.trim()
                        ? currentAnswer.trim().split(/\s+/).length
                        : 0}{" "}
                      words
                    </span>
                  </div>
                  <textarea
                    rows={7}
                    value={currentAnswer}
                    onChange={(e) =>
                      session.setAnswer(currentQ.id, e.target.value)
                    }
                    placeholder="Write your full working or structured response here..."
                    className="w-full rounded-2xl border-2 border-brand-200 bg-surface-porcelain p-4 font-sans text-sm sm:text-base font-semibold leading-relaxed text-brand-950 shadow-gloss-card focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-accent-sky/40"
                  />
                </div>
              )}
            </div>
          )}

          {/* Bottom Controls */}
          <div className="surface-gloss-card p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <CtaButton
                variant="secondary"
                size="xs"
                disabled={session.currentIndex === 0}
                onClick={() => session.goToQuestion(session.currentIndex - 1)}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Previous
              </CtaButton>

              {currentQ && currentAnswer && (
                <button
                  type="button"
                  onClick={() => session.clearAnswer(currentQ.id)}
                  className="inline-flex items-center gap-1.5 rounded-pill border border-brand-200 bg-surface-porcelain px-3 py-1.5 font-display text-xs font-extrabold text-ink-secondary hover:bg-brand-50 cursor-pointer"
                >
                  <Eraser className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isLastQuestion ? (
                <CtaButton
                  variant="primary"
                  size="xs"
                  onClick={() =>
                    session.goToQuestion(session.currentIndex + 1)
                  }
                >
                  Save & Next
                  <ArrowRight className="h-3.5 w-3.5" />
                </CtaButton>
              ) : (
                <CtaButton
                  variant="primary"
                  size="xs"
                  onClick={() => setConfirmSubmitOpen(true)}
                >
                  <Send className="h-3.5 w-3.5" />
                  Review & Submit
                </CtaButton>
              )}
            </div>
          </div>
        </section>

        {/* Desktop Question Palette */}
        <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
          <div className="surface-gloss-card sticky top-20 p-4 sm:p-5">
            {paletteContent}
          </div>
        </aside>
      </main>

      {/* Mobile Palette Drawer */}
      {paletteOpenMobile && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div
            onClick={() => setPaletteOpenMobile(false)}
            className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm"
          />
          <div className="relative z-10 h-full w-80 max-w-[85vw] bg-surface-porcelain p-5 shadow-gloss-float overflow-y-auto">
            <div className="flex justify-end pb-2">
              <button
                type="button"
                onClick={() => setPaletteOpenMobile(false)}
                className="grid h-8 w-8 place-items-center rounded-pill bg-surface-pearl text-brand-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {paletteContent}
          </div>
        </div>
      )}

      {/* Calculator Floating Tool */}
      <ExamCalculator open={calcOpen} onClose={() => setCalcOpen(false)} />

      {/* Submit Confirmation Modal */}
      <AdminDialogModal
        open={confirmSubmitOpen}
        onOpenChange={setConfirmSubmitOpen}
        eyebrow="Final Exam Submission"
        title="Submit Your Exam Script?"
        description="Once submitted, your answers are sealed with a timestamped receipt and cannot be edited."
        variant={unansweredCount > 0 ? "warning" : "success"}
        confirmLabel="Confirm & Submit"
        onConfirm={() => {
          setConfirmSubmitOpen(false);
          session.submitExam();
        }}
      >
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border border-brand-100 bg-surface-pearl p-2.5">
            <span className="block font-display text-lg font-extrabold text-brand-600">
              {answeredCount}
            </span>
            <span className="text-[11px] font-bold text-ink-secondary">
              Answered
            </span>
          </div>
          <div className="rounded-xl border border-brand-100 bg-surface-pearl p-2.5">
            <span className="block font-display text-lg font-extrabold text-accent-warm">
              {unansweredCount}
            </span>
            <span className="text-[11px] font-bold text-ink-secondary">
              Unanswered
            </span>
          </div>
          <div className="rounded-xl border border-brand-100 bg-surface-pearl p-2.5">
            <span className="block font-display text-lg font-extrabold text-brand-950">
              {flaggedCount}
            </span>
            <span className="text-[11px] font-bold text-ink-secondary">
              Flagged
            </span>
          </div>
        </div>
      </AdminDialogModal>
    </div>
  );
}

