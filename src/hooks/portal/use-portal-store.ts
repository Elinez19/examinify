"use client";

import * as React from "react";
import {
  computeLetterGrade,
  getInitialPortalStore,
  loadPortalStore,
  savePortalStore,
  type ExamSubmission,
  type PortalExam,
  type PortalExamStatus,
  type PortalStoreData,
  type QuestionItem,
  type StudentAccessibilityPrefs,
} from "@/data/portal-mock-data";

const SERVER_SNAPSHOT: PortalStoreData = getInitialPortalStore();

let clientSnapshot: PortalStoreData | null = null;
const storeListeners = new Set<() => void>();

function ensureClientSnapshot(): PortalStoreData {
  if (clientSnapshot === null) {
    clientSnapshot = loadPortalStore();
  }
  return clientSnapshot;
}

function setClientSnapshot(next: PortalStoreData) {
  clientSnapshot = next;
  savePortalStore(next);
  storeListeners.forEach((listener) => listener());
}

function subscribePortalStore(listener: () => void) {
  storeListeners.add(listener);
  const handleStorage = () => {
    clientSnapshot = loadPortalStore();
    storeListeners.forEach((l) => l());
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }
  return () => {
    storeListeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

const subscribeNoop = () => () => {};

export function usePortalStore() {
  const store = React.useSyncExternalStore(
    subscribePortalStore,
    ensureClientSnapshot,
    () => SERVER_SNAPSHOT
  );

  const hydrated = React.useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );

  const updateStore = React.useCallback(
    (updater: (prev: PortalStoreData) => PortalStoreData) => {
      const current = ensureClientSnapshot();
      const next = updater(current);
      setClientSnapshot(next);
    },
    []
  );

  const addOrUpdateQuestion = React.useCallback(
    (question: QuestionItem) => {
      updateStore((prev) => {
        const exists = prev.questions.some((q) => q.id === question.id);
        const questions = exists
          ? prev.questions.map((q) => (q.id === question.id ? question : q))
          : [question, ...prev.questions];
        return { ...prev, questions };
      });
    },
    [updateStore]
  );

  const deleteQuestion = React.useCallback(
    (questionId: string) => {
      updateStore((prev) => ({
        ...prev,
        questions: prev.questions.filter((q) => q.id !== questionId),
        exams: prev.exams.map((ex) => ({
          ...ex,
          questionIds: ex.questionIds.filter((id) => id !== questionId),
        })),
      }));
    },
    [updateStore]
  );

  const saveExam = React.useCallback(
    (exam: PortalExam) => {
      updateStore((prev) => {
        const exists = prev.exams.some((ex) => ex.id === exam.id);
        const exams = exists
          ? prev.exams.map((ex) => (ex.id === exam.id ? exam : ex))
          : [exam, ...prev.exams];
        return { ...prev, exams };
      });
    },
    [updateStore]
  );

  const updateExamStatus = React.useCallback(
    (examId: string, status: PortalExamStatus) => {
      updateStore((prev) => ({
        ...prev,
        exams: prev.exams.map((ex) =>
          ex.id === examId ? { ...ex, status } : ex
        ),
      }));
    },
    [updateStore]
  );

  const deleteExam = React.useCallback(
    (examId: string) => {
      updateStore((prev) => ({
        ...prev,
        exams: prev.exams.filter((ex) => ex.id !== examId),
      }));
    },
    [updateStore]
  );

  const submitExamAttempt = React.useCallback(
    (params: {
      exam: PortalExam;
      questions: QuestionItem[];
      answers: Record<string, string>;
      flaggedQuestionIds: string[];
      timeSpentSeconds: number;
      tabSwitchCount: number;
      isOfflineSimulated?: boolean;
    }): ExamSubmission => {
      let objectiveScore = 0;
      let objectiveMax = 0;
      let theoryMax = 0;

      for (const q of params.questions) {
        if (q.type === "theory") {
          theoryMax += q.marks;
        } else {
          objectiveMax += q.marks;
          const studentAnswer = (params.answers[q.id] ?? "").trim().toLowerCase();
          const correct = (q.correctAnswer ?? "").trim().toLowerCase();
          if (studentAnswer && correct && studentAnswer === correct) {
            objectiveScore += q.marks;
          }
        }
      }

      const totalMax = objectiveMax + theoryMax;
      const totalScore = objectiveScore;
      const percentage =
        totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
      const hasTheory = theoryMax > 0;
      const gradingStatus: ExamSubmission["gradingStatus"] = hasTheory
        ? "pending_theory"
        : params.exam.instantResult
          ? "published"
          : "auto_graded";

      const receiptCode =
        "EXM-SUB-" + String(Math.floor(10000 + Math.random() * 89999));

      const submission: ExamSubmission = {
        id: "sub_" + Date.now().toString(36),
        examId: params.exam.id,
        examCode: params.exam.code,
        examTitle: params.exam.title,
        subjectName: params.exam.subjectName,
        studentId: store.student.id,
        studentName: store.student.name,
        studentRegNo: store.student.regNo,
        classLevel: store.student.classLevel,
        submittedAt: new Date().toISOString(),
        receiptCode,
        syncStatus: params.isOfflineSimulated ? "queued_offline" : "synced",
        timeSpentSeconds: params.timeSpentSeconds,
        tabSwitchCount: params.tabSwitchCount,
        answers: params.answers,
        flaggedQuestionIds: params.flaggedQuestionIds,
        objectiveScore,
        objectiveMax,
        theoryScore: 0,
        theoryMax,
        totalScore,
        totalMax,
        percentage,
        grade: computeLetterGrade(percentage),
        gradingStatus,
        theoryScoresByQuestion: {},
        appealStatus: "none",
      };

      updateStore((prev) => ({
        ...prev,
        submissions: [submission, ...prev.submissions],
        liveCandidates: prev.liveCandidates.map((cand) =>
          cand.examId === params.exam.id && cand.regNo === prev.student.regNo
            ? {
                ...cand,
                status: "submitted",
                answeredCount: Object.keys(params.answers).filter(
                  (k) => params.answers[k]?.trim().length > 0
                ).length,
                remainingMinutes: 0,
                tabSwitches: params.tabSwitchCount,
                lastSyncAgo: "Just now",
              }
            : cand
        ),
      }));

      return submission;
    },
    [store.student, updateStore]
  );

  const gradeSubmission = React.useCallback(
    (
      submissionId: string,
      theoryScoresByQuestion: Record<string, number>,
      teacherFeedback: string,
      publish: boolean
    ) => {
      updateStore((prev) => ({
        ...prev,
        submissions: prev.submissions.map((sub) => {
          if (sub.id !== submissionId) return sub;
          const theoryScore = Object.values(theoryScoresByQuestion).reduce(
            (sum, val) => sum + (Number.isFinite(val) ? val : 0),
            0
          );
          const totalScore = sub.objectiveScore + theoryScore;
          const percentage =
            sub.totalMax > 0
              ? Math.round((totalScore / sub.totalMax) * 100)
              : 0;
          return {
            ...sub,
            theoryScoresByQuestion,
            theoryScore,
            totalScore,
            percentage,
            grade: computeLetterGrade(percentage),
            teacherFeedback,
            gradingStatus: publish ? "published" : "pending_theory",
          };
        }),
      }));
    },
    [updateStore]
  );

  const submitAppeal = React.useCallback(
    (submissionId: string, reason: string) => {
      updateStore((prev) => ({
        ...prev,
        submissions: prev.submissions.map((sub) =>
          sub.id === submissionId
            ? { ...sub, appealStatus: "submitted", appealReason: reason }
            : sub
        ),
      }));
    },
    [updateStore]
  );

  const extendCandidateTime = React.useCallback(
    (candidateId: string, extraMinutes: number) => {
      updateStore((prev) => ({
        ...prev,
        liveCandidates: prev.liveCandidates.map((cand) =>
          cand.id === candidateId
            ? {
                ...cand,
                remainingMinutes: cand.remainingMinutes + extraMinutes,
                status:
                  cand.status === "flagged" ? "in_progress" : cand.status,
              }
            : cand
        ),
      }));
    },
    [updateStore]
  );

  const forceSubmitCandidate = React.useCallback(
    (candidateId: string) => {
      updateStore((prev) => ({
        ...prev,
        liveCandidates: prev.liveCandidates.map((cand) =>
          cand.id === candidateId
            ? {
                ...cand,
                status: "submitted",
                remainingMinutes: 0,
                lastSyncAgo: "Force-submitted",
              }
            : cand
        ),
      }));
    },
    [updateStore]
  );

  const sendBroadcast = React.useCallback(
    (examId: string, message: string) => {
      updateStore((prev) => ({
        ...prev,
        broadcasts: [
          {
            id: "bcast_" + Date.now().toString(36),
            examId,
            message,
            sentAt: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            sender: prev.teacher.name,
          },
          ...prev.broadcasts,
        ],
      }));
    },
    [updateStore]
  );

  const updateAccessibility = React.useCallback(
    (patch: Partial<StudentAccessibilityPrefs>) => {
      updateStore((prev) => ({
        ...prev,
        accessibility: { ...prev.accessibility, ...patch },
      }));
    },
    [updateStore]
  );

  const resetDemoData = React.useCallback(() => {
    const fresh = getInitialPortalStore();
    setClientSnapshot(fresh);
  }, []);

  return {
    store,
    hydrated,
    addOrUpdateQuestion,
    deleteQuestion,
    saveExam,
    updateExamStatus,
    deleteExam,
    submitExamAttempt,
    gradeSubmission,
    submitAppeal,
    extendCandidateTime,
    forceSubmitCandidate,
    sendBroadcast,
    updateAccessibility,
    resetDemoData,
  };
}
