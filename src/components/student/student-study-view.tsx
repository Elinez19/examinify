"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, HelpCircle, RotateCcw, Sparkles, XCircle } from "lucide-react";
import { AdminHeroBanner } from "@/components/admin/ui/admin-hero-banner";
import { AdminSectionCard } from "@/components/admin/ui/admin-section-card";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type { QuestionItem } from "@/data/portal-mock-data";
import { cn } from "@/lib/utils";

export function StudentStudyWorkspace() {
  const { store } = usePortalStore();

  const mySubjects = store.subjects.filter(
    (subject) =>
      subject.status === "active" &&
      (subject.assignedClasses.length === 0 ||
        subject.assignedClasses.includes(store.student.classLevel))
  );

  const searchParams = useSearchParams();
  const urlSubject = searchParams.get("subject");
  const [selectedSubjectOverride, setSelectedSubjectOverride] =
    React.useState<string | null>(null);
  const subjectFilter = selectedSubjectOverride ?? urlSubject ?? "ALL";
  const setSubjectFilter = (code: string) => setSelectedSubjectOverride(code);

  const [selectedAnswers, setSelectedAnswers] = React.useState<
    Record<string, string | string[]>
  >({});
  const [revealedIds, setRevealedIds] = React.useState<Record<string, boolean>>({});

  const practiceQuestions = store.questions.filter((question) => {
    const allowedCode = mySubjects.some(
      (sub) => sub.code === question.subjectCode
    );
    if (!allowedCode) return false;
    if (subjectFilter === "ALL") return true;
    return question.subjectCode === subjectFilter;
  });

  const handleToggleMulti = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => {
      const current = Array.isArray(prev[questionId])
        ? (prev[questionId] as string[])
        : [];
      const exists = current.includes(optionId);
      return {
        ...prev,
        [questionId]: exists
          ? current.filter((id) => id !== optionId)
          : [...current, optionId],
      };
    });
  };

  const evaluateAnswer = (question: QuestionItem): boolean | null => {
    const answer = selectedAnswers[question.id];
    if (question.type === "objective") {
      if (typeof answer !== "string" || !answer) return null;
      return answer === question.correctOptionId;
    }
    if (question.type === "multi_select") {
      const selected = Array.isArray(answer) ? [...answer].sort() : [];
      if (selected.length === 0) return null;
      const expected = [...(question.correctOptionIds ?? [])].sort();
      return (
        selected.length === expected.length &&
        selected.every((val, idx) => val === expected[idx])
      );
    }
    if (question.type === "fill_blank") {
      if (typeof answer !== "string" || !answer.trim()) return null;
      const normalized = answer.trim().toLowerCase().replace(/,/g, "");
      const accepted = (question.acceptedAnswers ?? []).map((item) =>
        item.trim().toLowerCase().replace(/,/g, "")
      );
      return accepted.includes(normalized);
    }
    return null;
  };

  const revealedCount = Object.values(revealedIds).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <AdminHeroBanner
        eyebrow="Self-Paced Practice"
        title="Study Mode"
        description="Practice objective, multi-select, fill-in-the-blank, and theory questions with instant explanations — zero timer pressure."
        badgeLabel="Untimed Practice"
        badgeTone="amber"
        metrics={[
          { label: "Available Items", value: `${practiceQuestions.length}` },
          { label: "Checked", value: `${revealedCount}` },
          { label: "Class Arm", value: store.student.classLevel },
        ]}
        action={
          <button
            type="button"
            onClick={() => {
              setSelectedAnswers({});
              setRevealedIds({});
            }}
            className="cta-surface-secondary inline-flex items-center gap-2 rounded-pill px-4 py-2 font-display text-xs font-extrabold transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Practice
          </button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSubjectFilter("ALL")}
          className={cn(
            "rounded-pill px-4 py-2 font-display text-xs font-extrabold transition-colors cursor-pointer",
            subjectFilter === "ALL"
              ? "cta-surface-primary text-ink-on-blue"
              : "border-2 border-brand-100 bg-surface-porcelain text-brand-800 shadow-gloss-card hover:bg-surface-mist"
          )}
        >
          All Subjects
        </button>
        {mySubjects.map((subject) => (
          <button
            key={subject.id}
            type="button"
            onClick={() => setSubjectFilter(subject.code)}
            className={cn(
              "rounded-pill px-4 py-2 font-display text-xs font-extrabold transition-colors cursor-pointer",
              subjectFilter === subject.code
                ? "cta-surface-primary text-ink-on-blue"
                : "border-2 border-brand-100 bg-surface-porcelain text-brand-800 shadow-gloss-card hover:bg-surface-mist"
            )}
          >
            {subject.title} ({subject.code})
          </button>
        ))}
      </div>

      <AdminSectionCard
        title="Interactive Question Bank"
        description="Attempt any item below and click Check Answer to view the solution."
        action={<Sparkles className="h-4 w-4 text-accent-gold" />}
      >
        {practiceQuestions.length === 0 ? (
          <p className="py-8 text-center text-sm font-medium text-ink-secondary">
            No study questions found for this subject filter yet.
          </p>
        ) : (
          <div className="space-y-4">
            {practiceQuestions.map((question, index) => {
              const isRevealed = Boolean(revealedIds[question.id]);
              const isCorrect = isRevealed ? evaluateAnswer(question) : null;
              const currentAnswer = selectedAnswers[question.id];

              return (
                <div
                  key={question.id}
                  className="rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="cta-surface-primary rounded-full px-2.5 py-0.5 text-[10px] font-extrabold text-ink-on-blue">
                        Q{index + 1}
                      </span>
                      <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[10px] font-extrabold text-brand-900">
                        {question.subjectTitle}
                      </span>
                      <span className="text-[11px] font-bold text-ink-secondary">
                        {question.topic} · {question.difficulty}
                      </span>
                    </div>
                    <span className="text-[11px] font-extrabold text-brand-700">
                      {question.marks} marks
                    </span>
                  </div>

                  <p className="mt-3 text-sm sm:text-base font-bold text-brand-950">
                    {question.prompt}
                  </p>

                  {question.type === "objective" && question.options && (
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {question.options.map((opt) => {
                        const selected = currentAnswer === opt.id;
                        const isRight = question.correctOptionId === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              setSelectedAnswers((prev) => ({
                                ...prev,
                                [question.id]: opt.id,
                              }))
                            }
                            className={cn(
                              "flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-xs font-bold transition-colors cursor-pointer",
                              isRevealed && isRight
                                ? "border-emerald-400 bg-emerald-50 text-emerald-950"
                                : isRevealed && selected && !isRight
                                  ? "border-rose-300 bg-rose-50 text-rose-900"
                                  : selected
                                    ? "cta-surface-primary border-brand-500 text-ink-on-blue"
                                    : "border-brand-100 bg-surface-porcelain text-brand-900 hover:bg-surface-mist"
                            )}
                          >
                            <span className="uppercase">{opt.id}.</span>
                            <span>{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {question.type === "multi_select" && question.options && (
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {question.options.map((opt) => {
                        const arr = Array.isArray(currentAnswer)
                          ? currentAnswer
                          : [];
                        const selected = arr.includes(opt.id);
                        const isRight = (
                          question.correctOptionIds ?? []
                        ).includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleToggleMulti(question.id, opt.id)}
                            className={cn(
                              "flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-xs font-bold transition-colors cursor-pointer",
                              isRevealed && isRight
                                ? "border-emerald-400 bg-emerald-50 text-emerald-950"
                                : selected
                                  ? "cta-surface-primary border-brand-500 text-ink-on-blue"
                                  : "border-brand-100 bg-surface-porcelain text-brand-900 hover:bg-surface-mist"
                            )}
                          >
                            <span className="uppercase">[{selected ? "✓" : " "}] {opt.id}.</span>
                            <span>{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {question.type === "fill_blank" && (
                    <input
                      type="text"
                      value={typeof currentAnswer === "string" ? currentAnswer : ""}
                      onChange={(event) =>
                        setSelectedAnswers((prev) => ({
                          ...prev,
                          [question.id]: event.target.value,
                        }))
                      }
                      placeholder="Type your short answer..."
                      className="mt-3 w-full max-w-md rounded-xl border border-brand-200 bg-white px-3.5 py-2 text-xs font-bold text-ink-primary focus:border-brand-600 focus:outline-none"
                    />
                  )}

                  {question.type === "theory" && (
                    <textarea
                      rows={3}
                      value={typeof currentAnswer === "string" ? currentAnswer : ""}
                      onChange={(event) =>
                        setSelectedAnswers((prev) => ({
                          ...prev,
                          [question.id]: event.target.value,
                        }))
                      }
                      placeholder="Draft your workings / structured points before comparing with the marking guide..."
                      className="mt-3 w-full rounded-xl border border-brand-200 bg-white px-3.5 py-2.5 text-xs font-medium text-ink-primary focus:border-brand-600 focus:outline-none"
                    />
                  )}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setRevealedIds((prev) => ({
                          ...prev,
                          [question.id]: !prev[question.id],
                        }))
                      }
                      className="cta-surface-primary inline-flex items-center gap-1.5 rounded-pill px-4 py-1.5 font-display text-xs font-extrabold text-ink-on-blue transition-colors cursor-pointer"
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                      {isRevealed ? "Hide Answer Guide" : "Check Answer"}
                    </button>

                    {isRevealed && isCorrect === true && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                        Correct
                      </span>
                    )}
                    {isRevealed && isCorrect === false && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-rose-700">
                        <XCircle className="h-4 w-4" />
                        Review explanation below
                      </span>
                    )}
                  </div>

                  {isRevealed && (
                    <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs font-medium text-emerald-950">
                      {question.acceptedAnswers && (
                        <p className="font-bold">
                          Accepted Answers: {question.acceptedAnswers.join(" or ")}
                        </p>
                      )}
                      {question.markingGuide && (
                        <p className="font-bold">
                          Marking Guide: {question.markingGuide}
                        </p>
                      )}
                      {question.explanation && (
                        <p className="mt-1">{question.explanation}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </AdminSectionCard>
    </div>
  );
}

