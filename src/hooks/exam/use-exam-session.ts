"use client";

import * as React from "react";
import type {
  ExamSubmission,
  PortalExam,
  QuestionItem,
} from "@/data/portal-mock-data";

export type ExamStage = "lobby" | "active" | "submitted";

interface PersistedAttempt {
  examId: string;
  remainingSeconds: number;
  answers: Record<string, string>;
  flaggedIds: string[];
  visitedIds: string[];
  currentIndex: number;
  tabSwitchCount: number;
  isOfflineSimulated: boolean;
}

function attemptStorageKey(examId: string) {
  return `examinify_active_attempt_${examId}`;
}

export function useExamSession({
  exam,
  questions,
  onFinalizeSubmit,
}: {
  exam: PortalExam | undefined;
  questions: QuestionItem[];
  onFinalizeSubmit: (payload: {
    exam: PortalExam;
    questions: QuestionItem[];
    answers: Record<string, string>;
    flaggedQuestionIds: string[];
    timeSpentSeconds: number;
    tabSwitchCount: number;
    isOfflineSimulated: boolean;
  }) => ExamSubmission;
}) {
  const [stage, setStage] = React.useState<ExamStage>("lobby");
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [flaggedIds, setFlaggedIds] = React.useState<string[]>([]);
  const [visitedIds, setVisitedIds] = React.useState<string[]>([]);
  const [remainingSeconds, setRemainingSeconds] = React.useState(
    (exam?.durationMinutes ?? 30) * 60
  );
  const [tabSwitchCount, setTabSwitchCount] = React.useState(0);
  const [tabWarningOpen, setTabWarningOpen] = React.useState(false);
  const [isOfflineSimulated, setIsOfflineSimulated] = React.useState(false);
  const [lastSavedAt, setLastSavedAt] = React.useState<string>("Ready");
  const [submission, setSubmission] = React.useState<ExamSubmission | null>(
    null
  );

  const hasResumableAttempt = React.useSyncExternalStore(
    () => () => {},
    () => {
      if (!exam || typeof window === "undefined") return false;
      try {
        const raw = window.localStorage.getItem(attemptStorageKey(exam.id));
        if (!raw) return false;
        const parsed = JSON.parse(raw) as PersistedAttempt;
        return parsed.remainingSeconds > 0;
      } catch {
        return false;
      }
    },
    () => false
  );

  // Persist active state continuously
  React.useEffect(() => {
    if (!exam || stage !== "active" || typeof window === "undefined") return;
    const payload: PersistedAttempt = {
      examId: exam.id,
      remainingSeconds,
      answers,
      flaggedIds,
      visitedIds,
      currentIndex,
      tabSwitchCount,
      isOfflineSimulated,
    };
    try {
      window.localStorage.setItem(
        attemptStorageKey(exam.id),
        JSON.stringify(payload)
      );
    } catch {
      // ignore
    }
  }, [
    exam,
    stage,
    remainingSeconds,
    answers,
    flaggedIds,
    visitedIds,
    currentIndex,
    tabSwitchCount,
    isOfflineSimulated,
  ]);

  const submitExam = React.useCallback(() => {
    if (!exam) return;
    const totalSeconds = exam.durationMinutes * 60;
    const timeSpentSeconds = Math.max(1, totalSeconds - remainingSeconds);
    const result = onFinalizeSubmit({
      exam,
      questions,
      answers,
      flaggedQuestionIds: flaggedIds,
      timeSpentSeconds,
      tabSwitchCount,
      isOfflineSimulated,
    });
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(attemptStorageKey(exam.id));
    }
    setSubmission(result);
    setStage("submitted");
  }, [
    exam,
    remainingSeconds,
    onFinalizeSubmit,
    questions,
    answers,
    flaggedIds,
    tabSwitchCount,
    isOfflineSimulated,
  ]);

  // Keep latest submitExam in a ref for timer expiration
  const submitExamRef = React.useRef(submitExam);
  React.useEffect(() => {
    submitExamRef.current = submitExam;
  }, [submitExam]);

  // Countdown Timer
  React.useEffect(() => {
    if (stage !== "active") return;
    const interval = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          submitExamRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [stage]);

  // Focus / Tab-switch detection during live/scheduled exams
  React.useEffect(() => {
    if (stage !== "active" || !exam || exam.status === "practice") return;
    const handleVisibility = () => {
      if (document.hidden) {
        setTabSwitchCount((c) => c + 1);
        setTabWarningOpen(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [stage, exam]);

  const startFreshExam = React.useCallback(() => {
    if (!exam) return;
    setCurrentIndex(0);
    setAnswers({});
    setFlaggedIds([]);
    setVisitedIds(questions[0] ? [questions[0].id] : []);
    setRemainingSeconds(exam.durationMinutes * 60);
    setTabSwitchCount(0);
    setTabWarningOpen(false);
    setLastSavedAt(
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
    setStage("active");
  }, [exam, questions]);

  const resumeSavedExam = React.useCallback(() => {
    if (!exam || typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(attemptStorageKey(exam.id));
      if (!raw) {
        startFreshExam();
        return;
      }
      const parsed = JSON.parse(raw) as PersistedAttempt;
      setAnswers(parsed.answers ?? {});
      setFlaggedIds(parsed.flaggedIds ?? []);
      setVisitedIds(parsed.visitedIds ?? []);
      setCurrentIndex(
        Math.min(parsed.currentIndex ?? 0, Math.max(0, questions.length - 1))
      );
      setRemainingSeconds(parsed.remainingSeconds ?? exam.durationMinutes * 60);
      setTabSwitchCount(parsed.tabSwitchCount ?? 0);
      setIsOfflineSimulated(Boolean(parsed.isOfflineSimulated));
      setLastSavedAt("Recovered locally");
      setStage("active");
    } catch {
      startFreshExam();
    }
  }, [exam, questions.length, startFreshExam]);

  const goToQuestion = React.useCallback(
    (index: number) => {
      if (index < 0 || index >= questions.length) return;
      setCurrentIndex(index);
      const qId = questions[index]?.id;
      if (qId) {
        setVisitedIds((prev) => (prev.includes(qId) ? prev : [...prev, qId]));
      }
    },
    [questions]
  );

  const setAnswer = React.useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setLastSavedAt(
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
  }, []);

  const clearAnswer = React.useCallback((questionId: string) => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  }, []);

  const toggleFlag = React.useCallback((questionId: string) => {
    setFlaggedIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  }, []);

  // Keyboard shortcuts while in active hall
  React.useEffect(() => {
    if (stage !== "active") return;
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      const key = e.key.toLowerCase();
      if (e.key === "ArrowRight" || key === "n") {
        e.preventDefault();
        goToQuestion(Math.min(questions.length - 1, currentIndex + 1));
      } else if (e.key === "ArrowLeft" || key === "p") {
        e.preventDefault();
        goToQuestion(Math.max(0, currentIndex - 1));
      } else if (key === "f") {
        e.preventDefault();
        toggleFlag(currentQ.id);
      } else if (
        (currentQ.type === "mcq" || currentQ.type === "true_false") &&
        currentQ.options
      ) {
        const keyMap: Record<string, number> = {
          "1": 0,
          a: 0,
          "2": 1,
          b: 1,
          "3": 2,
          c: 2,
          "4": 3,
          d: 3,
        };
        const idx = keyMap[key];
        if (idx !== undefined && currentQ.options[idx]) {
          e.preventDefault();
          setAnswer(currentQ.id, currentQ.options[idx].id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stage, questions, currentIndex, goToQuestion, toggleFlag, setAnswer]);

  return {
    stage,
    currentIndex,
    currentQuestion: questions[currentIndex],
    answers,
    flaggedIds,
    visitedIds,
    remainingSeconds,
    tabSwitchCount,
    tabWarningOpen,
    setTabWarningOpen,
    isOfflineSimulated,
    setIsOfflineSimulated,
    lastSavedAt,
    submission,
    hasResumableAttempt,
    startFreshExam,
    resumeSavedExam,
    goToQuestion,
    setAnswer,
    clearAnswer,
    toggleFlag,
    submitExam,
  };
}

