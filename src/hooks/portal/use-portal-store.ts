"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  INITIAL_PORTAL_STORE,
  STORAGE_KEY,
  loadPortalStore,
  savePortalStore,
  type AcademicSessionTerm,
  type AccountStatus,
  type ClassArm,
  type ExamSubmission,
  type PortalExam,
  type PortalStoreData,
  type QuestionItem,
  type QuestionTypeConfig,
  type RoomBroadcast,
  type StaffProfile,
  type StudentAccessibilityPrefs,
  type StudentProfile,
  type SubjectEnrollment,
  type TeacherProfile,
  type TheoryScoreEntry,
} from "@/data/portal-mock-data";
import {
  clearPortalSessionCookie,
  setPortalSessionCookie,
  type PortalRole,
} from "@/lib/portal-auth";

let memoryStore: PortalStoreData = INITIAL_PORTAL_STORE;
let hydrated = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function hydrateFromStorage() {
  if (typeof window === "undefined" || hydrated) return;
  hydrated = true;
  memoryStore = loadPortalStore();
  notify();
}

function updateStore(updater: (prev: PortalStoreData) => PortalStoreData) {
  memoryStore = updater(memoryStore);
  savePortalStore(memoryStore);
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        memoryStore = loadPortalStore();
        notify();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return memoryStore;
}

function getServerSnapshot() {
  return INITIAL_PORTAL_STORE;
}

export function generateExamPassCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function usePortalStore() {
  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydratedState = useSyncExternalStore(
    subscribe,
    () => hydrated,
    () => false
  );

  useEffect(() => {
    hydrateFromStorage();
  }, []);

  const activeSessionTerm =
    store.academicTerms.find((term) => term.isActive) ?? store.academicTerms[0];

  const authenticateUser = useCallback(
    (
      emailInput: string,
      passwordInput: string
    ): { ok: true; role: PortalRole; userId: string } | { ok: false; error: string } => {
      hydrateFromStorage();
      const current = memoryStore;
      const email = emailInput.trim().toLowerCase();
      const password = passwordInput;

      const matchedStudent = current.students.find(
        (item) => item.email.toLowerCase() === email && item.password === password
      );
      if (matchedStudent) {
        if (matchedStudent.status === "inactive") {
          return {
            ok: false,
            error: "Your student account is currently deactivated. Contact your school administrator.",
          };
        }
        updateStore((prev) => ({ ...prev, student: matchedStudent }));
        setPortalSessionCookie({ role: "student", userId: matchedStudent.id });
        return { ok: true, role: "student", userId: matchedStudent.id };
      }

      const matchedTeacher = current.teachers.find(
        (item) => item.email.toLowerCase() === email && item.password === password
      );
      if (matchedTeacher) {
        if (matchedTeacher.status === "inactive") {
          return {
            ok: false,
            error: "Your teacher account is currently deactivated. Contact your school administrator.",
          };
        }
        updateStore((prev) => ({ ...prev, teacher: matchedTeacher }));
        setPortalSessionCookie({ role: "teacher", userId: matchedTeacher.id });
        return { ok: true, role: "teacher", userId: matchedTeacher.id };
      }

      const matchedStaff = current.staff.find(
        (item) => item.email.toLowerCase() === email && item.password === password
      );
      if (matchedStaff) {
        if (matchedStaff.status === "inactive") {
          return {
            ok: false,
            error: "Your administrator account is currently deactivated.",
          };
        }
        setPortalSessionCookie({ role: "admin", userId: matchedStaff.id });
        return { ok: true, role: "admin", userId: matchedStaff.id };
      }

      return {
        ok: false,
        error: "Invalid email or password. Please verify your school credentials.",
      };
    },
    []
  );

  const signOutUser = useCallback(() => {
    clearPortalSessionCookie();
  }, []);

  const updateStudentProfile = useCallback(
    (payload: { firstName: string; lastName: string; avatarUrl?: string }) => {
      const firstName = payload.firstName.trim();
      const lastName = payload.lastName.trim();
      const fullName = `${firstName} ${lastName}`.trim();
      updateStore((prev) => {
        const updatedStudent: StudentProfile = {
          ...prev.student,
          firstName,
          lastName,
          name: fullName,
          avatarUrl: payload.avatarUrl ?? prev.student.avatarUrl,
        };
        return {
          ...prev,
          student: updatedStudent,
          students: prev.students.map((item) =>
            item.id === updatedStudent.id ? updatedStudent : item
          ),
        };
      });
    },
    []
  );

  const changeStudentPassword = useCallback(
    (
      currentPassword: string,
      newPassword: string
    ): { ok: true } | { ok: false; error: string } => {
      if (memoryStore.student.password !== currentPassword) {
        return { ok: false, error: "Current password does not match your account." };
      }
      if (newPassword.trim().length < 6) {
        return { ok: false, error: "New password must be at least 6 characters long." };
      }
      updateStore((prev) => {
        const updatedStudent: StudentProfile = {
          ...prev.student,
          password: newPassword,
        };
        return {
          ...prev,
          student: updatedStudent,
          students: prev.students.map((item) =>
            item.id === updatedStudent.id ? updatedStudent : item
          ),
        };
      });
      return { ok: true };
    },
    []
  );

  // Admin: Student registration, edit, class assignment, activation, deletion
  const saveStudentAccount = useCallback((student: StudentProfile) => {
    updateStore((prev) => {
      const exists = prev.students.some((item) => item.id === student.id);
      const nextStudents = exists
        ? prev.students.map((item) => (item.id === student.id ? student : item))
        : [student, ...prev.students];
      return {
        ...prev,
        students: nextStudents,
        student: prev.student.id === student.id ? student : prev.student,
      };
    });
  }, []);

  const setStudentStatus = useCallback((studentId: string, status: AccountStatus) => {
    updateStore((prev) => ({
      ...prev,
      students: prev.students.map((item) =>
        item.id === studentId ? { ...item, status } : item
      ),
      student:
        prev.student.id === studentId ? { ...prev.student, status } : prev.student,
    }));
  }, []);

  const assignStudentClass = useCallback(
    (studentId: string, classArmId: string) => {
      updateStore((prev) => {
        const arm = prev.classArms.find((item) => item.id === classArmId);
        if (!arm) return prev;
        const patch = {
          classArmId: arm.id,
          classLevel: arm.name,
          wing: arm.arm,
        };
        return {
          ...prev,
          students: prev.students.map((item) =>
            item.id === studentId ? { ...item, ...patch } : item
          ),
          student:
            prev.student.id === studentId ? { ...prev.student, ...patch } : prev.student,
        };
      });
    },
    []
  );

  const deleteStudentAccount = useCallback((studentId: string) => {
    updateStore((prev) => ({
      ...prev,
      students: prev.students.filter((item) => item.id !== studentId),
    }));
  }, []);

  // Admin: Teacher registration, edit, assignments, activation, deletion
  const saveTeacherAccount = useCallback((teacher: TeacherProfile) => {
    updateStore((prev) => {
      const exists = prev.teachers.some((item) => item.id === teacher.id);
      const nextTeachers = exists
        ? prev.teachers.map((item) => (item.id === teacher.id ? teacher : item))
        : [teacher, ...prev.teachers];
      return {
        ...prev,
        teachers: nextTeachers,
        teacher: prev.teacher.id === teacher.id ? teacher : prev.teacher,
      };
    });
  }, []);

  const setTeacherStatus = useCallback((teacherId: string, status: AccountStatus) => {
    updateStore((prev) => ({
      ...prev,
      teachers: prev.teachers.map((item) =>
        item.id === teacherId ? { ...item, status } : item
      ),
      teacher:
        prev.teacher.id === teacherId ? { ...prev.teacher, status } : prev.teacher,
    }));
  }, []);

  const assignTeacherAssignments = useCallback(
    (teacherId: string, assignedClasses: string[], assignedSubjectIds: string[]) => {
      updateStore((prev) => {
        const targetTeacher = prev.teachers.find((item) => item.id === teacherId);
        const teacherName = targetTeacher?.name ?? "";
        return {
          ...prev,
          teachers: prev.teachers.map((item) =>
            item.id === teacherId
              ? { ...item, assignedClasses, assignedSubjectIds }
              : item
          ),
          teacher:
            prev.teacher.id === teacherId
              ? { ...prev.teacher, assignedClasses, assignedSubjectIds }
              : prev.teacher,
          subjects: prev.subjects.map((subj) => {
            const isAssigned = assignedSubjectIds.includes(subj.id);
            const hasTeacher = subj.assignedTeacherIds.includes(teacherId);
            if (isAssigned && !hasTeacher) {
              return {
                ...subj,
                assignedTeacherIds: [...subj.assignedTeacherIds, teacherId],
                teacherName: subj.teacherName || teacherName,
              };
            }
            if (!isAssigned && hasTeacher) {
              return {
                ...subj,
                assignedTeacherIds: subj.assignedTeacherIds.filter(
                  (id) => id !== teacherId
                ),
              };
            }
            return subj;
          }),
        };
      });
    },
    []
  );

  const deleteTeacherAccount = useCallback((teacherId: string) => {
    updateStore((prev) => ({
      ...prev,
      teachers: prev.teachers.filter((item) => item.id !== teacherId),
    }));
  }, []);

  // Admin: Staff/Admin registration, edit, activation, deletion
  const saveStaffAccount = useCallback((staff: StaffProfile) => {
    updateStore((prev) => {
      const exists = prev.staff.some((item) => item.id === staff.id);
      const nextStaff = exists
        ? prev.staff.map((item) => (item.id === staff.id ? staff : item))
        : [staff, ...prev.staff];
      return { ...prev, staff: nextStaff };
    });
  }, []);

  const setStaffStatus = useCallback((staffId: string, status: AccountStatus) => {
    updateStore((prev) => ({
      ...prev,
      staff: prev.staff.map((item) =>
        item.id === staffId ? { ...item, status } : item
      ),
    }));
  }, []);

  const deleteStaffAccount = useCallback((staffId: string) => {
    updateStore((prev) => ({
      ...prev,
      staff: prev.staff.filter((item) => item.id !== staffId),
    }));
  }, []);

  // Admin: Academic Sessions & Active Term
  const saveAcademicTerm = useCallback((term: AcademicSessionTerm) => {
    updateStore((prev) => {
      const exists = prev.academicTerms.some((item) => item.id === term.id);
      let nextTerms = exists
        ? prev.academicTerms.map((item) => (item.id === term.id ? term : item))
        : [term, ...prev.academicTerms];
      if (term.isActive) {
        nextTerms = nextTerms.map((item) => ({
          ...item,
          isActive: item.id === term.id,
        }));
      }
      const active = nextTerms.find((item) => item.isActive) ?? nextTerms[0];
      const termLabel = active ? `${active.term} · ${active.session}` : prev.student.termLabel;
      return {
        ...prev,
        academicTerms: nextTerms,
        student: { ...prev.student, termLabel },
        teacher: { ...prev.teacher, termLabel },
        students: prev.students.map((s) => ({ ...s, termLabel })),
        teachers: prev.teachers.map((t) => ({ ...t, termLabel })),
      };
    });
  }, []);

  const setActiveAcademicTerm = useCallback((termId: string) => {
    updateStore((prev) => {
      const nextTerms = prev.academicTerms.map((item) => ({
        ...item,
        isActive: item.id === termId,
      }));
      const active = nextTerms.find((item) => item.isActive);
      const termLabel = active ? `${active.term} · ${active.session}` : prev.student.termLabel;
      return {
        ...prev,
        academicTerms: nextTerms,
        student: { ...prev.student, termLabel },
        teacher: { ...prev.teacher, termLabel },
        students: prev.students.map((s) => ({ ...s, termLabel })),
        teachers: prev.teachers.map((t) => ({ ...t, termLabel })),
      };
    });
  }, []);

  const deleteAcademicTerm = useCallback((termId: string) => {
    updateStore((prev) => ({
      ...prev,
      academicTerms: prev.academicTerms.filter((item) => item.id !== termId),
    }));
  }, []);

  // Admin: Class Arms
  const saveClassArm = useCallback((arm: ClassArm) => {
    updateStore((prev) => {
      const exists = prev.classArms.some((item) => item.id === arm.id);
      const nextArms = exists
        ? prev.classArms.map((item) => (item.id === arm.id ? arm : item))
        : [arm, ...prev.classArms];
      return { ...prev, classArms: nextArms };
    });
  }, []);

  const deleteClassArm = useCallback((armId: string) => {
    updateStore((prev) => ({
      ...prev,
      classArms: prev.classArms.filter((item) => item.id !== armId),
    }));
  }, []);

  // Admin: Subjects + Class & Teacher assignment
  const saveSubject = useCallback((subject: SubjectEnrollment) => {
    updateStore((prev) => {
      const exists = prev.subjects.some((item) => item.id === subject.id);
      const nextSubjects = exists
        ? prev.subjects.map((item) => (item.id === subject.id ? subject : item))
        : [subject, ...prev.subjects];
      return { ...prev, subjects: nextSubjects };
    });
  }, []);

  const deleteSubject = useCallback((subjectId: string) => {
    updateStore((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((item) => item.id !== subjectId),
    }));
  }, []);

  // Admin: Question Types
  const saveQuestionType = useCallback((qType: QuestionTypeConfig) => {
    updateStore((prev) => {
      const exists = prev.questionTypes.some((item) => item.id === qType.id);
      const nextTypes = exists
        ? prev.questionTypes.map((item) => (item.id === qType.id ? qType : item))
        : [...prev.questionTypes, qType];
      return { ...prev, questionTypes: nextTypes };
    });
  }, []);

  const toggleQuestionType = useCallback((typeId: string) => {
    updateStore((prev) => ({
      ...prev,
      questionTypes: prev.questionTypes.map((item) =>
        item.id === typeId ? { ...item, enabled: !item.enabled } : item
      ),
    }));
  }, []);

  // Questions
  const addOrUpdateQuestion = useCallback((question: QuestionItem) => {
    updateStore((prev) => {
      const exists = prev.questions.some((q) => q.id === question.id);
      const nextQuestions = exists
        ? prev.questions.map((q) => (q.id === question.id ? question : q))
        : [question, ...prev.questions];
      return {
        ...prev,
        questions: nextQuestions,
        subjects: prev.subjects.map((sub) =>
          sub.code === question.subjectCode
            ? {
                ...sub,
                questionCount: nextQuestions.filter((q) => q.subjectCode === sub.code)
                  .length,
              }
            : sub
        ),
      };
    });
  }, []);

  const deleteQuestion = useCallback((questionId: string) => {
    updateStore((prev) => {
      const nextQuestions = prev.questions.filter((q) => q.id !== questionId);
      return {
        ...prev,
        questions: nextQuestions,
        exams: prev.exams.map((exam) => ({
          ...exam,
          questionIds: exam.questionIds.filter((id) => id !== questionId),
        })),
      };
    });
  }, []);

  // Exams & Pass Codes / PINs
  const saveExam = useCallback((exam: PortalExam) => {
    updateStore((prev) => {
      const exists = prev.exams.some((e) => e.id === exam.id);
      const pin = exam.passCode || exam.accessPin || generateExamPassCode();
      const withPassCode: PortalExam = {
        ...exam,
        passCode: pin,
        accessPin: pin,
      };
      const nextExams = exists
        ? prev.exams.map((e) => (e.id === exam.id ? withPassCode : e))
        : [withPassCode, ...prev.exams];
      return {
        ...prev,
        exams: nextExams,
      };
    });
  }, []);

  const updateExamStatus = useCallback(
    (examId: string, status: PortalExam["status"]) => {
      updateStore((prev) => ({
        ...prev,
        exams: prev.exams.map((e) => (e.id === examId ? { ...e, status } : e)),
      }));
    },
    []
  );

  const rotateExamPassCode = useCallback((examId: string, customPin?: string) => {
    const nextPin = customPin?.trim() || generateExamPassCode();
    updateStore((prev) => ({
      ...prev,
      exams: prev.exams.map((e) =>
        e.id === examId ? { ...e, passCode: nextPin, accessPin: nextPin } : e
      ),
    }));
    return nextPin;
  }, []);

  const toggleExamProctoring = useCallback((examId: string) => {
    updateStore((prev) => ({
      ...prev,
      exams: prev.exams.map((e) =>
        e.id === examId
          ? { ...e, proctoringEnabled: !e.proctoringEnabled }
          : e
      ),
    }));
  }, []);

  const deleteExam = useCallback((examId: string) => {
    updateStore((prev) => ({
      ...prev,
      exams: prev.exams.filter((e) => e.id !== examId),
    }));
  }, []);

  const submitExamAttempt = useCallback(
    (payload: {
      exam: PortalExam;
      questions?: QuestionItem[];
      answers: Record<string, string | string[]>;
      flaggedQuestionIds?: string[];
      timeSpentSeconds?: number;
      timeSpentMinutes?: number;
      tabSwitchCount?: number;
      tabSwitches?: number;
      isOfflineSimulated?: boolean;
    }) => {
      const examQuestions =
        payload.questions && payload.questions.length > 0
          ? payload.questions
          : store.questions.filter((q) =>
              payload.exam.questionIds.includes(q.id)
            );

      let objectiveEarned = 0;
      let objectiveTotal = 0;
      let theoryTotal = 0;

      for (const question of examQuestions) {
        const answer = payload.answers[question.id];
        if (question.type === "theory") {
          theoryTotal += question.marks;
          continue;
        }

        objectiveTotal += question.marks;

        if (
          question.type === "objective" ||
          question.type === "mcq" ||
          question.type === "true_false"
        ) {
          const expected = question.correctOptionId ?? question.correctAnswer;
          if (typeof answer === "string" && answer === expected) {
            objectiveEarned += question.marks;
          }
        } else if (question.type === "multi_select") {
          const selected = Array.isArray(answer) ? [...answer].sort() : [];
          const expected = [...(question.correctOptionIds ?? [])].sort();
          if (
            selected.length === expected.length &&
            selected.every((val, idx) => val === expected[idx])
          ) {
            objectiveEarned += question.marks;
          }
        } else if (
          question.type === "fill_blank" ||
          question.type === "short_answer"
        ) {
          const normalized =
            typeof answer === "string"
              ? answer.trim().toLowerCase().replace(/,/g, "")
              : "";
          const accepted = (
            question.acceptedAnswers ??
            (question.correctAnswer ? [question.correctAnswer] : [])
          ).map((item) => item.trim().toLowerCase().replace(/,/g, ""));
          if (normalized && accepted.includes(normalized)) {
            objectiveEarned += question.marks;
          }
        }
      }

      const spentSeconds =
        payload.timeSpentSeconds ??
        (payload.timeSpentMinutes ? payload.timeSpentMinutes * 60 : 60);
      const spentMinutes =
        payload.timeSpentMinutes ?? Math.max(1, Math.round(spentSeconds / 60));
      const tabSwitches =
        payload.tabSwitchCount ?? payload.tabSwitches ?? 0;
      const totalMax = objectiveTotal + theoryTotal;
      const pct = totalMax > 0 ? Math.round((objectiveEarned / totalMax) * 100) : 0;
      const grade =
        pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : pct >= 50 ? "D" : "F";
      const receiptCode = `EXM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

      const submission: ExamSubmission = {
        id: `sub_${Date.now()}`,
        examId: payload.exam.id,
        examTitle: payload.exam.title,
        subjectCode: payload.exam.subjectCode,
        subjectName: payload.exam.subjectTitle,
        classLevel: store.student.classLevel,
        studentId: store.student.id,
        studentName: store.student.name,
        admissionNo: store.student.admissionNo,
        studentRegNo: store.student.admissionNo,
        receiptCode,
        submittedAt: "Just now",
        timeSpentMinutes: Math.max(1, spentMinutes),
        timeSpentSeconds: spentSeconds,
        answers: payload.answers,
        objectiveEarned,
        objectiveTotal,
        theoryEarned: 0,
        theoryTotal,
        objectiveScore: objectiveEarned,
        objectiveMax: objectiveTotal,
        theoryScore: 0,
        theoryMax: theoryTotal,
        totalScore: objectiveEarned,
        totalMax,
        percentage: pct,
        grade,
        syncStatus: payload.isOfflineSimulated ? "local_pending" : "synced",
        theoryScores: {},
        theoryScoresByQuestion: {},
        gradingStatus: theoryTotal > 0 ? "needs_theory_review" : "published",
        tabSwitches,
        tabSwitchCount: tabSwitches,
        appealStatus: "none",
      };

      updateStore((prev) => ({
        ...prev,
        submissions: [
          submission,
          ...prev.submissions.filter(
            (item) =>
              !(
                item.examId === payload.exam.id &&
                item.studentId === store.student.id
              )
          ),
        ],
        liveCandidates: prev.liveCandidates.map((cand) =>
          cand.studentName === store.student.name
            ? {
                ...cand,
                progressPercent: 100,
                answeredCount: examQuestions.length,
                timeRemainingMinutes: 0,
                status: "submitted",
                lastHeartbeat: "Submitted",
              }
            : cand
        ),
      }));

      return submission;
    },
    [store.questions, store.student.admissionNo, store.student.classLevel, store.student.id, store.student.name]
  );

  const gradeSubmission = useCallback(
    (
      submissionId: string,
      theoryScores: Record<string, TheoryScoreEntry>,
      overallFeedback: string,
      publishNow: boolean
    ) => {
      updateStore((prev) => ({
        ...prev,
        submissions: prev.submissions.map((sub) => {
          if (sub.id !== submissionId) return sub;
          const theoryEarned = Object.values(theoryScores).reduce(
            (sum, entry) => sum + entry.score,
            0
          );
          return {
            ...sub,
            theoryScores,
            theoryEarned,
            overallFeedback,
            gradingStatus: publishNow ? "published" : sub.gradingStatus,
            appealStatus:
              sub.appealStatus === "pending" && publishNow
                ? "resolved"
                : sub.appealStatus,
          };
        }),
      }));
    },
    []
  );

  const submitAppeal = useCallback((submissionId: string, reason: string) => {
    updateStore((prev) => ({
      ...prev,
      submissions: prev.submissions.map((sub) =>
        sub.id === submissionId
          ? {
              ...sub,
              appealStatus: "pending",
              appealReason: reason,
            }
          : sub
      ),
    }));
  }, []);

  const extendCandidateTime = useCallback(
    (candidateId: string, extraMinutes = 5) => {
      updateStore((prev) => ({
        ...prev,
        liveCandidates: prev.liveCandidates.map((cand) =>
          cand.id === candidateId
            ? {
                ...cand,
                timeRemainingMinutes: cand.timeRemainingMinutes + extraMinutes,
              }
            : cand
        ),
      }));
    },
    []
  );

  const forceSubmitCandidate = useCallback((candidateId: string) => {
    updateStore((prev) => ({
      ...prev,
      liveCandidates: prev.liveCandidates.map((cand) =>
        cand.id === candidateId
          ? {
              ...cand,
              status: "submitted",
              timeRemainingMinutes: 0,
              lastHeartbeat: "Force submitted by invigilator",
            }
          : cand
      ),
    }));
  }, []);

  const flagCandidateSession = useCallback((candidateId: string) => {
    updateStore((prev) => ({
      ...prev,
      liveCandidates: prev.liveCandidates.map((cand) =>
        cand.id === candidateId
          ? {
              ...cand,
              status: cand.status === "flagged" ? "active" : "flagged",
              tabSwitchCount:
                cand.status === "flagged" ? cand.tabSwitchCount : cand.tabSwitchCount + 1,
            }
          : cand
      ),
    }));
  }, []);

  const sendBroadcast = useCallback(
    (examId: string, message: string, urgency: RoomBroadcast["urgency"] = "info") => {
      const nextBroadcast: RoomBroadcast = {
        id: `brd_${Date.now()}`,
        examId,
        senderName: store.teacher.name,
        message,
        sentAt: "Just now",
        urgency,
      };
      updateStore((prev) => ({
        ...prev,
        broadcasts: [nextBroadcast, ...prev.broadcasts],
      }));
    },
    [store.teacher.name]
  );

  const updateAccessibility = useCallback(
    (patch: Partial<StudentAccessibilityPrefs>) => {
      updateStore((prev) => ({
        ...prev,
        accessibility: { ...prev.accessibility, ...patch },
      }));
    },
    []
  );

  const resetDemoData = useCallback(() => {
    updateStore(() => INITIAL_PORTAL_STORE);
  }, []);

  return {
    store,
    hydrated: hydratedState,
    activeSessionTerm,
    authenticateUser,
    signOutUser,
    updateStudentProfile,
    changeStudentPassword,
    saveStudentAccount,
    setStudentStatus,
    assignStudentClass,
    deleteStudentAccount,
    saveTeacherAccount,
    setTeacherStatus,
    assignTeacherAssignments,
    deleteTeacherAccount,
    saveStaffAccount,
    setStaffStatus,
    deleteStaffAccount,
    saveAcademicTerm,
    setActiveAcademicTerm,
    deleteAcademicTerm,
    saveClassArm,
    deleteClassArm,
    saveSubject,
    deleteSubject,
    saveQuestionType,
    toggleQuestionType,
    addOrUpdateQuestion,
    deleteQuestion,
    saveExam,
    updateExamStatus,
    rotateExamPassCode,
    toggleExamProctoring,
    deleteExam,
    submitExamAttempt,
    gradeSubmission,
    submitAppeal,
    extendCandidateTime,
    forceSubmitCandidate,
    flagCandidateSession,
    sendBroadcast,
    updateAccessibility,
    resetDemoData,
  };
}
