"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  INITIAL_PORTAL_STORE,
  STORAGE_KEY,
  getSchoolTypeForLevel,
  isTeachingStaffRole,
  loadPortalStore,
  savePortalStore,
  type AcademicSession,
  type AcademicSessionTerm,
  type AcademicTerm,
  type AccountStatus,
  type ClassArm,
  type ExamSubmission,
  type PortalExam,
  type PortalStoreData,
  type QuestionItem,
  type QuestionTypeConfig,
  type RoomBroadcast,
  type StaffProfile,
  type StaffRoleOption,
  type StaffType,
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

export interface UnifiedStaffInput {
  id: string;
  schoolBranch: string;
  staffCode: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  sex: string;
  maritalStatus: string;
  dateOfBirth?: string;
  country: string;
  stateOfOrigin: string;
  cityOfResidence?: string;
  avatarUrl?: string;
  staffType: StaffType;
  role: StaffRoleOption;
  phoneType: string;
  phone: string;
  alternatePhone?: string;
  emailType: string;
  email: string;
  alternateEmail?: string;
  nextOfKinName?: string;
  nextOfKinRelationship?: string;
  nextOfKinPhone?: string;
  nextOfKinAddress?: string;
  password: string;
  status: AccountStatus;
}

function resolveAdminScope(role: StaffRoleOption): StaffProfile["adminScope"] {
  if (role === "Admin" || role === "Principal") return "super_admin";
  if (role === "Exam Officer") return "kyc_moderator";
  return "dispatch_support";
}

function resolveRolePermissions(role: StaffRoleOption): string {
  switch (role) {
    case "Admin":
      return "Full school portal access";
    case "Principal":
      return "School leadership, exams & academic review";
    case "Exam Officer":
      return "Exam scheduling, PINs, question bank & appeals";
    case "Class Teacher":
      return "Class list, teaching, grading & live monitor";
    case "Subject Teacher":
      return "Subject question bank, exams & grading";
    case "Teacher":
      return "Teaching, question bank, exams & grading";
    default:
      return "General school staff access";
  }
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

  const activeSession =
    store.academicSessions.find((s) => s.isActive) ?? store.academicSessions[0];
  const activeTermRecord =
    store.terms.find((t) => t.isActive) ?? store.terms[0];
  const fallbackSessionTerm =
    store.academicTerms.find((term) => term.isActive) ?? store.academicTerms[0];
  const activeSessionTerm: AcademicSessionTerm | undefined =
    activeSession && activeTermRecord
      ? {
          id: `${activeSession.id}::${activeTermRecord.id}`,
          session: activeSession.session,
          term: activeTermRecord.term,
          isActive: true,
          startsAt: activeSession.startDate,
          endsAt: activeSession.stopDate,
        }
      : fallbackSessionTerm;

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
          schoolType: arm.schoolType ?? getSchoolTypeForLevel(arm.level || arm.name),
          schoolBranch: arm.schoolBranch ?? prev.student.schoolBranch,
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

  const saveUnifiedStaff = useCallback((input: UnifiedStaffInput) => {
    updateStore((prev) => {
      const existingTeacher = prev.teachers.find((t) => t.id === input.id);
      const existingStaff = prev.staff.find((s) => s.id === input.id);
      const fullName = [
        input.firstName.trim(),
        input.middleName?.trim(),
        input.lastName.trim(),
      ]
        .filter(Boolean)
        .join(" ");
      const activeTerm =
        prev.academicTerms.find((t) => t.isActive) ?? prev.academicTerms[0];
      const termLabel = activeTerm
        ? `${activeTerm.term} · ${activeTerm.session}`
        : prev.teacher.termLabel;

      if (isTeachingStaffRole(input.role)) {
        const recordId =
          input.id || `tch_${Date.now()}`;
        const nextTeacher: TeacherProfile = {
          id: recordId,
          firstName: input.firstName.trim(),
          middleName: input.middleName?.trim() || undefined,
          lastName: input.lastName.trim(),
          name: fullName,
          email: input.email.trim().toLowerCase(),
          emailType: input.emailType,
          alternateEmail: input.alternateEmail?.trim() || undefined,
          phone: input.phone.trim(),
          phoneType: input.phoneType,
          alternatePhone: input.alternatePhone?.trim() || undefined,
          staffId: input.staffCode.trim(),
          staffType: input.staffType,
          assignedRole: input.role,
          schoolType: existingTeacher?.schoolType ?? prev.teacher.schoolType ?? "College",
          schoolBranch: input.schoolBranch,
          sex: input.sex,
          maritalStatus: input.maritalStatus,
          dateOfBirth: input.dateOfBirth || undefined,
          country: input.country,
          stateOfOrigin: input.stateOfOrigin,
          cityOfResidence: input.cityOfResidence?.trim() || undefined,
          department: existingTeacher?.department || "General",
          assignedClasses: existingTeacher?.assignedClasses ?? [],
          assignedSubjectIds: existingTeacher?.assignedSubjectIds ?? [],
          termLabel,
          schoolName: prev.teacher.schoolName,
          avatarUrl:
            input.avatarUrl ||
            existingTeacher?.avatarUrl ||
            existingStaff?.avatarUrl ||
            "avatar-5",
          password: input.password || "Staff@2026",
          status: input.status,
          nextOfKinName: input.nextOfKinName?.trim() || undefined,
          nextOfKinRelationship: input.nextOfKinRelationship,
          nextOfKinPhone: input.nextOfKinPhone?.trim() || undefined,
          nextOfKinAddress: input.nextOfKinAddress?.trim() || undefined,
        };
        const existsInTeachers = prev.teachers.some((t) => t.id === recordId);
        return {
          ...prev,
          teachers: existsInTeachers
            ? prev.teachers.map((t) => (t.id === recordId ? nextTeacher : t))
            : [nextTeacher, ...prev.teachers],
          teacher: prev.teacher.id === recordId ? nextTeacher : prev.teacher,
          staff: prev.staff.filter((s) => s.id !== recordId),
        };
      }

      const recordId = input.id || `adm_${Date.now()}`;
      const nextStaff: StaffProfile = {
        id: recordId,
        firstName: input.firstName.trim(),
        middleName: input.middleName?.trim() || undefined,
        lastName: input.lastName.trim(),
        name: fullName,
        email: input.email.trim().toLowerCase(),
        emailType: input.emailType,
        alternateEmail: input.alternateEmail?.trim() || undefined,
        phone: input.phone.trim(),
        phoneType: input.phoneType,
        alternatePhone: input.alternatePhone?.trim() || undefined,
        staffCode: input.staffCode.trim(),
        staffType: input.staffType,
        assignedRole: input.role,
        schoolBranch: input.schoolBranch,
        sex: input.sex,
        maritalStatus: input.maritalStatus,
        dateOfBirth: input.dateOfBirth || undefined,
        country: input.country,
        stateOfOrigin: input.stateOfOrigin,
        cityOfResidence: input.cityOfResidence?.trim() || undefined,
        roleTitle: input.role,
        adminScope: resolveAdminScope(input.role),
        permissions: resolveRolePermissions(input.role),
        avatarUrl:
          input.avatarUrl ||
          existingStaff?.avatarUrl ||
          existingTeacher?.avatarUrl ||
          "avatar-2",
        password: input.password || "Staff@2026",
        status: input.status,
        lastActive: existingStaff?.lastActive ?? "Updated now",
        nextOfKinName: input.nextOfKinName?.trim() || undefined,
        nextOfKinRelationship: input.nextOfKinRelationship,
        nextOfKinPhone: input.nextOfKinPhone?.trim() || undefined,
        nextOfKinAddress: input.nextOfKinAddress?.trim() || undefined,
      };
      const existsInStaff = prev.staff.some((s) => s.id === recordId);
      return {
        ...prev,
        staff: existsInStaff
          ? prev.staff.map((s) => (s.id === recordId ? nextStaff : s))
          : [nextStaff, ...prev.staff],
        teachers: prev.teachers.filter((t) => t.id !== recordId),
      };
    });
  }, []);

  const assignStaffRole = useCallback(
    (staffId: string, newRole: StaffRoleOption) => {
      updateStore((prev) => {
        const existingTeacher = prev.teachers.find((t) => t.id === staffId);
        const existingStaff = prev.staff.find((s) => s.id === staffId);
        if (!existingTeacher && !existingStaff) return prev;

        const activeTerm =
          prev.academicTerms.find((t) => t.isActive) ?? prev.academicTerms[0];
        const termLabel = activeTerm
          ? `${activeTerm.term} · ${activeTerm.session}`
          : prev.teacher.termLabel;

        if (isTeachingStaffRole(newRole)) {
          if (existingTeacher) {
            const updated: TeacherProfile = {
              ...existingTeacher,
              assignedRole: newRole,
            };
            return {
              ...prev,
              teachers: prev.teachers.map((t) =>
                t.id === staffId ? updated : t
              ),
              teacher: prev.teacher.id === staffId ? updated : prev.teacher,
            };
          }
          const src = existingStaff!;
          const converted: TeacherProfile = {
            id: src.id,
            firstName: src.firstName,
            middleName: src.middleName,
            lastName: src.lastName,
            name: src.name,
            email: src.email,
            emailType: src.emailType,
            alternateEmail: src.alternateEmail,
            phone: src.phone,
            phoneType: src.phoneType,
            alternatePhone: src.alternatePhone,
            staffId: src.staffCode || `STF/${src.id.slice(-3).toUpperCase()}`,
            staffType: src.staffType ?? "Academic",
            assignedRole: newRole,
            schoolBranch: src.schoolBranch,
            sex: src.sex,
            dateOfBirth: src.dateOfBirth,
            maritalStatus: src.maritalStatus,
            country: src.country,
            stateOfOrigin: src.stateOfOrigin,
            cityOfResidence: src.cityOfResidence,
            department: src.departmentUnit || "General",
            assignedClasses: [],
            assignedSubjectIds: [],
            termLabel,
            schoolName: prev.teacher.schoolName,
            avatarUrl: src.avatarUrl || "avatar-5",
            password: src.password,
            status: src.status,
            nextOfKinName: src.nextOfKinName,
            nextOfKinRelationship: src.nextOfKinRelationship,
            nextOfKinPhone: src.nextOfKinPhone,
            nextOfKinAddress: src.nextOfKinAddress,
          };
          return {
            ...prev,
            teachers: [converted, ...prev.teachers],
            staff: prev.staff.filter((s) => s.id !== staffId),
          };
        }

        if (existingStaff) {
          const updated: StaffProfile = {
            ...existingStaff,
            assignedRole: newRole,
            roleTitle: newRole,
            adminScope: resolveAdminScope(newRole),
            permissions: resolveRolePermissions(newRole),
          };
          return {
            ...prev,
            staff: prev.staff.map((s) => (s.id === staffId ? updated : s)),
          };
        }
        const src = existingTeacher!;
        const converted: StaffProfile = {
          id: src.id,
          firstName: src.firstName,
          middleName: src.middleName,
          lastName: src.lastName,
          name: src.name,
          email: src.email,
          emailType: src.emailType,
          alternateEmail: src.alternateEmail,
          phone: src.phone,
          phoneType: src.phoneType,
          alternatePhone: src.alternatePhone,
          staffCode: src.staffId,
          staffType: src.staffType ?? "Academic",
          assignedRole: newRole,
          schoolBranch: src.schoolBranch,
          sex: src.sex,
          dateOfBirth: src.dateOfBirth,
          maritalStatus: src.maritalStatus,
          country: src.country,
          stateOfOrigin: src.stateOfOrigin,
          cityOfResidence: src.cityOfResidence,
          roleTitle: newRole,
          adminScope: resolveAdminScope(newRole),
          permissions: resolveRolePermissions(newRole),
          avatarUrl: src.avatarUrl || "avatar-2",
          password: src.password,
          status: src.status,
          lastActive: "Updated now",
          nextOfKinName: src.nextOfKinName,
          nextOfKinRelationship: src.nextOfKinRelationship,
          nextOfKinPhone: src.nextOfKinPhone,
          nextOfKinAddress: src.nextOfKinAddress,
        };
        return {
          ...prev,
          staff: [converted, ...prev.staff],
          teachers: prev.teachers.filter((t) => t.id !== staffId),
        };
      });
    },
    []
  );

  const setAnyStaffStatus = useCallback(
    (staffId: string, status: AccountStatus) => {
      updateStore((prev) => ({
        ...prev,
        teachers: prev.teachers.map((item) =>
          item.id === staffId ? { ...item, status } : item
        ),
        teacher:
          prev.teacher.id === staffId ? { ...prev.teacher, status } : prev.teacher,
        staff: prev.staff.map((item) =>
          item.id === staffId ? { ...item, status } : item
        ),
      }));
    },
    []
  );

  const deleteAnyStaffAccount = useCallback((staffId: string) => {
    updateStore((prev) => ({
      ...prev,
      teachers: prev.teachers.filter((item) => item.id !== staffId),
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

  // Admin: Academic Sessions (separated)
  const syncCalendarLabel = (
    prev: PortalStoreData,
    academicSessions: AcademicSession[],
    terms: AcademicTerm[]
  ) => {
    const activeSes =
      academicSessions.find((s) => s.isActive) ?? academicSessions[0];
    const activeTrm = terms.find((t) => t.isActive) ?? terms[0];
    const termLabel =
      activeSes && activeTrm
        ? `${activeTrm.term} · ${activeSes.session}`
        : prev.student.termLabel;
    return {
      academicSessions,
      terms,
      student: { ...prev.student, termLabel },
      teacher: { ...prev.teacher, termLabel },
      students: prev.students.map((s) => ({ ...s, termLabel })),
      teachers: prev.teachers.map((t) => ({ ...t, termLabel })),
    };
  };

  const saveAcademicSession = useCallback((session: AcademicSession) => {
    updateStore((prev) => {
      const exists = prev.academicSessions.some(
        (item) => item.id === session.id
      );
      let nextSessions = exists
        ? prev.academicSessions.map((item) =>
            item.id === session.id ? session : item
          )
        : [session, ...prev.academicSessions];
      if (session.isActive) {
        nextSessions = nextSessions.map((item) => ({
          ...item,
          isActive: item.id === session.id,
        }));
      }
      return {
        ...prev,
        ...syncCalendarLabel(prev, nextSessions, prev.terms),
      };
    });
  }, []);

  const setActiveAcademicSession = useCallback((sessionId: string) => {
    updateStore((prev) => {
      const nextSessions = prev.academicSessions.map((item) => ({
        ...item,
        isActive: item.id === sessionId,
      }));
      return {
        ...prev,
        ...syncCalendarLabel(prev, nextSessions, prev.terms),
      };
    });
  }, []);

  const deleteAcademicSession = useCallback((sessionId: string) => {
    updateStore((prev) => {
      const nextSessions = prev.academicSessions.filter(
        (item) => item.id !== sessionId
      );
      return {
        ...prev,
        ...syncCalendarLabel(prev, nextSessions, prev.terms),
      };
    });
  }, []);

  // Admin: Academic Terms (separated)
  const saveTermRecord = useCallback((term: AcademicTerm) => {
    updateStore((prev) => {
      const exists = prev.terms.some((item) => item.id === term.id);
      let nextTerms = exists
        ? prev.terms.map((item) => (item.id === term.id ? term : item))
        : [term, ...prev.terms];
      if (term.isActive) {
        nextTerms = nextTerms.map((item) => ({
          ...item,
          isActive: item.id === term.id,
        }));
      }
      return {
        ...prev,
        ...syncCalendarLabel(prev, prev.academicSessions, nextTerms),
      };
    });
  }, []);

  const setActiveTermRecord = useCallback((termId: string) => {
    updateStore((prev) => {
      const nextTerms = prev.terms.map((item) => ({
        ...item,
        isActive: item.id === termId,
      }));
      return {
        ...prev,
        ...syncCalendarLabel(prev, prev.academicSessions, nextTerms),
      };
    });
  }, []);

  const deleteTermRecord = useCallback((termId: string) => {
    updateStore((prev) => {
      const nextTerms = prev.terms.filter((item) => item.id !== termId);
      return {
        ...prev,
        ...syncCalendarLabel(prev, prev.academicSessions, nextTerms),
      };
    });
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

  const assignClassToTeacher = useCallback(
    (teacherId: string, classArmId: string) => {
      updateStore((prev) => {
        const targetTeacher = prev.teachers.find((t) => t.id === teacherId);
        const targetArm = prev.classArms.find((arm) => arm.id === classArmId);
        if (!targetTeacher || !targetArm) return prev;

        const nextClassArms = prev.classArms.map((arm) =>
          arm.id === classArmId ? { ...arm, classTeacherId: teacherId } : arm
        );

        const nextTeachers = prev.teachers.map((t) =>
          t.id === teacherId
            ? {
                ...t,
                assignedClasses: Array.from(
                  new Set([...t.assignedClasses, targetArm.name])
                ),
              }
            : t
        );

        return {
          ...prev,
          classArms: nextClassArms,
          teachers: nextTeachers,
          teacher:
            prev.teacher.id === teacherId
              ? {
                  ...prev.teacher,
                  assignedClasses: Array.from(
                    new Set([...prev.teacher.assignedClasses, targetArm.name])
                  ),
                }
              : prev.teacher,
        };
      });
    },
    []
  );

  const unassignClassTeacher = useCallback((classArmId: string) => {
    updateStore((prev) => ({
      ...prev,
      classArms: prev.classArms.map((arm) =>
        arm.id === classArmId ? { ...arm, classTeacherId: "" } : arm
      ),
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

  const assignSubjectsToClass = useCallback(
    (
      className: string,
      branch: string,
      assignments: Array<{
        subjectId: string;
        assigned: boolean;
        description?: string;
      }>
    ) => {
      const assignmentMap = new Map(
        assignments.map((item) => [item.subjectId, item])
      );
      updateStore((prev) => ({
        ...prev,
        subjects: prev.subjects.map((sub) => {
          const entry = assignmentMap.get(sub.id);
          if (!entry) return sub;
          const nextClasses = entry.assigned
            ? Array.from(new Set([...sub.assignedClasses, className]))
            : sub.assignedClasses.filter((cls) => cls !== className);
          const nextDescriptions = { ...(sub.classDescriptions ?? {}) };
          if (entry.assigned && entry.description?.trim()) {
            nextDescriptions[className] = entry.description.trim();
          } else if (!entry.assigned || !entry.description?.trim()) {
            delete nextDescriptions[className];
          }
          return {
            ...sub,
            schoolBranch: branch || sub.schoolBranch,
            assignedClasses: nextClasses,
            classDescriptions: nextDescriptions,
          };
        }),
      }));
    },
    []
  );

  const removeSubjectClassAssignments = useCallback(
    (pairs: Array<{ subjectId: string; className: string }>) => {
      updateStore((prev) => ({
        ...prev,
        subjects: prev.subjects.map((sub) => {
          const matchingClasses = new Set(
            pairs
              .filter((pair) => pair.subjectId === sub.id)
              .map((pair) => pair.className)
          );
          if (matchingClasses.size === 0) return sub;
          const nextDescriptions = { ...(sub.classDescriptions ?? {}) };
          for (const cls of matchingClasses) {
            delete nextDescriptions[cls];
          }
          return {
            ...sub,
            assignedClasses: sub.assignedClasses.filter(
              (cls) => !matchingClasses.has(cls)
            ),
            classDescriptions: nextDescriptions,
          };
        }),
      }));
    },
    []
  );

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
        if (question.type === "theory" || question.type === "essay") {
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
          const totalScore = (sub.objectiveEarned ?? 0) + theoryEarned;
          const totalMax = (sub.objectiveTotal ?? 0) + (sub.theoryTotal ?? 0);
          const percentage =
            totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
          const grade =
            percentage >= 80
              ? "A"
              : percentage >= 70
                ? "B"
                : percentage >= 60
                  ? "C"
                  : percentage >= 50
                    ? "D"
                    : "F";
          return {
            ...sub,
            theoryScores,
            theoryScoresByQuestion: theoryScores,
            theoryEarned,
            theoryScore: theoryEarned,
            totalScore,
            totalMax,
            percentage,
            grade,
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
    saveUnifiedStaff,
    assignStaffRole,
    setAnyStaffStatus,
    deleteAnyStaffAccount,
    saveAcademicTerm,
    setActiveAcademicTerm,
    deleteAcademicTerm,
    saveAcademicSession,
    setActiveAcademicSession,
    deleteAcademicSession,
    saveTermRecord,
    setActiveTermRecord,
    deleteTermRecord,
    saveClassArm,
    deleteClassArm,
    assignClassToTeacher,
    unassignClassTeacher,
    saveSubject,
    deleteSubject,
    assignSubjectsToClass,
    removeSubjectClassAssignments,
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
