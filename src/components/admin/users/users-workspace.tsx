"use client";

import * as React from "react";
import {
  Edit3,
  GraduationCap,
  Plus,
  Power,
  Shield,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import { AdminHeroBanner } from "@/components/admin/ui/admin-hero-banner";
import { AdminSectionCard } from "@/components/admin/ui/admin-section-card";
import {
  AdminSearchInput,
  AdminSelectField,
} from "@/components/admin/ui/admin-form-controls";
import {
  AdminSortableTableHead,
  AdminTableCell,
  AdminTableHead,
  type SortDirection,
} from "@/components/admin/ui/admin-data-table";
import { AdminActionMenu } from "@/components/admin/ui/admin-action-menu";
import {
  AdminDialogModal,
  type ModalVariant,
} from "@/components/admin/ui/admin-dialog-modal";
import { AvatarBadge } from "@/components/portal/avatar-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type {
  StaffProfile,
  StudentProfile,
  TeacherProfile,
} from "@/data/portal-mock-data";
import { cn } from "@/lib/utils";
import {
  createInitialStudentFormState,
  StudentRegistrationForm,
  type StudentRegistrationFormState,
} from "./student-registration-form";
import {
  createInitialTeacherFormState,
  TeacherRegistrationForm,
  type TeacherRegistrationFormState,
} from "./teacher-registration-form";
import {
  createInitialStaffFormState,
  StaffRegistrationForm,
  type StaffRegistrationFormState,
} from "./staff-registration-form";
import { StudentClassAssignmentForm } from "./student-class-assignment-form";
import { TeacherAssignmentForm } from "./teacher-assignment-form";

type UserDirectoryTab = "students" | "teachers" | "staff";
type UserSortKey = "name" | "email" | "detail" | "status";

export function UsersWorkspace() {
  const {
    store,
    activeSessionTerm,
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
  } = usePortalStore();

  const [activeTab, setActiveTab] = React.useState<UserDirectoryTab>("students");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [sortKey, setSortKey] = React.useState<UserSortKey>("name");
  const [sortDir, setSortDir] = React.useState<SortDirection>("asc");

  // Inline form refs
  const studentFormRef = React.useRef<HTMLDivElement | null>(null);
  const teacherFormRef = React.useRef<HTMLDivElement | null>(null);
  const staffFormRef = React.useRef<HTMLDivElement | null>(null);
  const assignClassFormRef = React.useRef<HTMLDivElement | null>(null);
  const assignTeacherFormRef = React.useRef<HTMLDivElement | null>(null);

  const scrollFormIntoView = (ref: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  // Student inline form state
  const [studentFormOpen, setStudentFormOpen] = React.useState(false);
  const [studentForm, setStudentForm] =
    React.useState<StudentRegistrationFormState>(() =>
      createInitialStudentFormState(
        store.classArms,
        store.academicTerms,
        store.students.length
      )
    );
  const [assignClassTarget, setAssignClassTarget] =
    React.useState<StudentProfile | null>(null);
  const [selectedClassArmId, setSelectedClassArmId] = React.useState("");

  // Teacher inline form state
  const [teacherFormOpen, setTeacherFormOpen] = React.useState(false);
  const [teacherForm, setTeacherForm] =
    React.useState<TeacherRegistrationFormState>(() =>
      createInitialTeacherFormState(
        store.classArms,
        store.subjects,
        store.teachers.length
      )
    );
  const [assignTeacherTarget, setAssignTeacherTarget] =
    React.useState<TeacherProfile | null>(null);
  const [teacherClassesDraft, setTeacherClassesDraft] = React.useState<string[]>(
    []
  );
  const [teacherSubjectsDraft, setTeacherSubjectsDraft] = React.useState<
    string[]
  >([]);

  // Staff/Admin inline form state
  const [staffFormOpen, setStaffFormOpen] = React.useState(false);
  const [staffForm, setStaffForm] = React.useState<StaffRegistrationFormState>(
    () => createInitialStaffFormState(store.staff.length)
  );

  // Feedback (Success / Error) & Delete Confirmation Modals
  const [feedbackModal, setFeedbackModal] = React.useState<{
    variant: ModalVariant;
    eyebrow: string;
    title: string;
    description: string;
  } | null>(null);

  const [deleteTarget, setDeleteTarget] = React.useState<{
    kind: UserDirectoryTab;
    id: string;
    label: string;
  } | null>(null);

  const showErrorModal = (title: string, description: string) => {
    setFeedbackModal({
      variant: "danger",
      eyebrow: "Validation Error",
      title,
      description,
    });
  };

  const showSuccessModal = (title: string, description: string) => {
    setFeedbackModal({
      variant: "success",
      eyebrow: "Operation Completed",
      title,
      description,
    });
  };

  const toggleSort = (key: UserSortKey) => {
    if (sortKey === key) setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : store.student.termLabel;

  // Student handlers
  const resetStudentForm = () => {
    setStudentForm(
      createInitialStudentFormState(
        store.classArms,
        store.academicTerms,
        store.students.length
      )
    );
  };

  const openAddStudent = () => {
    setActiveTab("students");
    setAssignClassTarget(null);
    resetStudentForm();
    setStudentFormOpen(true);
    scrollFormIntoView(studentFormRef);
  };

  const openEditStudent = (stu: StudentProfile) => {
    setActiveTab("students");
    setAssignClassTarget(null);
    setStudentForm({
      ...createInitialStudentFormState(
        store.classArms,
        store.academicTerms,
        store.students.length
      ),
      id: stu.id,
      schoolBranch: stu.schoolBranch ?? "Main Campus (Guzape)",
      admissionNo: stu.admissionNo,
      firstName: stu.firstName,
      middleName: stu.middleName ?? "",
      lastName: stu.lastName,
      sex: stu.sex ?? "Male",
      country: stu.country ?? "Nigeria",
      stateOfOrigin: stu.stateOfOrigin ?? "FCT Abuja",
      cityOfResidence: stu.cityOfResidence ?? "",
      dateOfBirth: stu.dateOfBirth ?? "",
      photoDataUrl:
        stu.avatarUrl && stu.avatarUrl.startsWith("data:image/")
          ? stu.avatarUrl
          : "",
      classArmId: stu.classArmId,
      entrySession: stu.entrySession ?? termLabel,
      password: stu.password,
      status: stu.status,
      phoneType: stu.phoneType ?? "Father",
      phone: stu.phone,
      emailType: stu.emailType ?? "Portal Primary",
      email: stu.email,
      alternateEmail: stu.alternateEmail ?? "",
      parentId: stu.parentId ?? "",
      parentFirstName: stu.parentFirstName ?? "",
      parentMiddleName: stu.parentMiddleName ?? "",
      parentSurname: stu.parentSurname ?? "",
      parentSex: stu.parentSex ?? "Male",
      parentRelationship: stu.parentRelationship ?? "Father",
      parentMaritalStatus: stu.parentMaritalStatus ?? "Married",
      parentCountry: stu.parentCountry ?? "Nigeria",
      parentState: stu.parentState ?? "FCT Abuja",
    });
    setStudentFormOpen(true);
    scrollFormIntoView(studentFormRef);
  };

  const handleSaveStudent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!studentForm.firstName.trim() || !studentForm.email.trim()) {
      showErrorModal(
        "Missing Required Student Fields",
        "Please provide the student's first name, surname, and email address before submitting."
      );
      return;
    }

    const arm =
      store.classArms.find((a) => a.id === studentForm.classArmId) ??
      store.classArms[0];
    const fullName = [
      studentForm.firstName.trim(),
      studentForm.middleName.trim(),
      studentForm.lastName.trim(),
    ]
      .filter(Boolean)
      .join(" ");
    const existing = store.students.find((s) => s.id === studentForm.id);

    saveStudentAccount({
      id: studentForm.id || `stu_${Date.now()}`,
      firstName: studentForm.firstName.trim(),
      middleName: studentForm.middleName.trim() || undefined,
      lastName: studentForm.lastName.trim(),
      name: fullName,
      email: studentForm.email.trim().toLowerCase(),
      emailType: studentForm.emailType,
      alternateEmail: studentForm.alternateEmail.trim() || undefined,
      phone: studentForm.phone.trim(),
      phoneType: studentForm.phoneType,
      admissionNo: studentForm.admissionNo.trim(),
      schoolBranch: studentForm.schoolBranch,
      sex: studentForm.sex,
      country: studentForm.country,
      stateOfOrigin: studentForm.stateOfOrigin,
      cityOfResidence: studentForm.cityOfResidence.trim() || undefined,
      dateOfBirth: studentForm.dateOfBirth || undefined,
      entrySession: studentForm.entrySession,
      classArmId: arm?.id ?? "arm_jss3a",
      classLevel: arm?.name ?? "JSS 3A",
      wing: arm?.arm ?? "General",
      termLabel,
      schoolName: store.student.schoolName,
      avatarUrl: studentForm.photoDataUrl || existing?.avatarUrl || "avatar-1",
      password: studentForm.password || "Student@2026",
      status: studentForm.status,
      parentId: studentForm.parentId.trim() || undefined,
      parentFirstName: studentForm.parentFirstName.trim() || undefined,
      parentMiddleName: studentForm.parentMiddleName.trim() || undefined,
      parentSurname: studentForm.parentSurname.trim() || undefined,
      parentSex: studentForm.parentSex,
      parentRelationship: studentForm.parentRelationship,
      parentMaritalStatus: studentForm.parentMaritalStatus,
      parentCountry: studentForm.parentCountry,
      parentState: studentForm.parentState,
    });

    const wasEditing = Boolean(studentForm.id);
    setStudentFormOpen(false);
    resetStudentForm();
    showSuccessModal(
      wasEditing ? "Student Record Updated" : "Student Registered",
      `${fullName} (${studentForm.admissionNo}) has been saved to ${arm?.name ?? "the class directory"}.`
    );
  };

  // Teacher handlers
  const resetTeacherForm = () => {
    setTeacherForm(
      createInitialTeacherFormState(
        store.classArms,
        store.subjects,
        store.teachers.length
      )
    );
  };

  const openAddTeacher = () => {
    setActiveTab("teachers");
    setAssignTeacherTarget(null);
    resetTeacherForm();
    setTeacherFormOpen(true);
    scrollFormIntoView(teacherFormRef);
  };

  const openEditTeacher = (tch: TeacherProfile) => {
    setActiveTab("teachers");
    setAssignTeacherTarget(null);
    const detectedPrefix =
      tch.displayPrefix ??
      (tch.name.startsWith("Mrs.")
        ? "Mrs."
        : tch.name.startsWith("Ms.")
          ? "Ms."
          : tch.name.startsWith("Dr.")
            ? "Dr."
            : tch.name.startsWith("Prof.")
              ? "Prof."
              : "Mr.");
    setTeacherForm({
      ...createInitialTeacherFormState(
        store.classArms,
        store.subjects,
        store.teachers.length
      ),
      id: tch.id,
      schoolBranch: tch.schoolBranch ?? "Main Campus (Guzape)",
      staffId: tch.staffId,
      displayPrefix: detectedPrefix,
      firstName: tch.firstName,
      middleName: tch.middleName ?? "",
      lastName: tch.lastName,
      sex: tch.sex ?? "Male",
      maritalStatus: tch.maritalStatus ?? "Married",
      dateOfBirth: tch.dateOfBirth ?? "",
      country: tch.country ?? "Nigeria",
      stateOfOrigin: tch.stateOfOrigin ?? "FCT Abuja",
      cityOfResidence: tch.cityOfResidence ?? "",
      photoDataUrl:
        tch.avatarUrl && tch.avatarUrl.startsWith("data:image/")
          ? tch.avatarUrl
          : "",
      department: tch.department,
      qualification: tch.qualification ?? "B.Sc (Ed)",
      employmentType: tch.employmentType ?? "Full-Time",
      employmentDate: tch.employmentDate ?? "",
      assignedClasses: tch.assignedClasses,
      assignedSubjectIds: tch.assignedSubjectIds,
      phoneType: tch.phoneType ?? "Personal Mobile",
      phone: tch.phone,
      alternatePhone: tch.alternatePhone ?? "",
      emailType: tch.emailType ?? "Official School",
      email: tch.email,
      alternateEmail: tch.alternateEmail ?? "",
      nextOfKinName: tch.nextOfKinName ?? "",
      nextOfKinRelationship: tch.nextOfKinRelationship ?? "Spouse",
      nextOfKinPhone: tch.nextOfKinPhone ?? "",
      nextOfKinAddress: tch.nextOfKinAddress ?? "",
      password: tch.password,
      status: tch.status,
    });
    setTeacherFormOpen(true);
    scrollFormIntoView(teacherFormRef);
  };

  const handleSaveTeacher = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!teacherForm.firstName.trim() || !teacherForm.email.trim()) {
      showErrorModal(
        "Missing Required Teacher Fields",
        "Please provide the teacher's first name, surname, and email address before submitting."
      );
      return;
    }

    const prefix = teacherForm.displayPrefix
      ? `${teacherForm.displayPrefix} `
      : "";
    const fullName = [
      prefix.trim(),
      teacherForm.firstName.trim(),
      teacherForm.middleName.trim(),
      teacherForm.lastName.trim(),
    ]
      .filter(Boolean)
      .join(" ");
    const existing = store.teachers.find((t) => t.id === teacherForm.id);

    saveTeacherAccount({
      id: teacherForm.id || `tch_${Date.now()}`,
      displayPrefix: teacherForm.displayPrefix,
      firstName: teacherForm.firstName.trim(),
      middleName: teacherForm.middleName.trim() || undefined,
      lastName: teacherForm.lastName.trim(),
      name: fullName,
      email: teacherForm.email.trim().toLowerCase(),
      emailType: teacherForm.emailType,
      alternateEmail: teacherForm.alternateEmail.trim() || undefined,
      phone: teacherForm.phone.trim(),
      phoneType: teacherForm.phoneType,
      alternatePhone: teacherForm.alternatePhone.trim() || undefined,
      staffId: teacherForm.staffId.trim(),
      schoolBranch: teacherForm.schoolBranch,
      sex: teacherForm.sex,
      maritalStatus: teacherForm.maritalStatus,
      dateOfBirth: teacherForm.dateOfBirth || undefined,
      country: teacherForm.country,
      stateOfOrigin: teacherForm.stateOfOrigin,
      cityOfResidence: teacherForm.cityOfResidence.trim() || undefined,
      department: teacherForm.department.trim(),
      qualification: teacherForm.qualification.trim() || undefined,
      employmentType: teacherForm.employmentType,
      employmentDate: teacherForm.employmentDate || undefined,
      assignedClasses: teacherForm.assignedClasses,
      assignedSubjectIds: teacherForm.assignedSubjectIds,
      termLabel,
      schoolName: store.teacher.schoolName,
      avatarUrl: teacherForm.photoDataUrl || existing?.avatarUrl || "avatar-5",
      password: teacherForm.password || "Teacher@2026",
      status: teacherForm.status,
      nextOfKinName: teacherForm.nextOfKinName.trim() || undefined,
      nextOfKinRelationship: teacherForm.nextOfKinRelationship,
      nextOfKinPhone: teacherForm.nextOfKinPhone.trim() || undefined,
      nextOfKinAddress: teacherForm.nextOfKinAddress.trim() || undefined,
    });

    const wasEditing = Boolean(teacherForm.id);
    setTeacherFormOpen(false);
    resetTeacherForm();
    showSuccessModal(
      wasEditing ? "Teacher Record Updated" : "Teacher Registered",
      `${fullName} (${teacherForm.staffId}) has been saved to the faculty directory.`
    );
  };

  // Staff handlers
  const resetStaffForm = () => {
    setStaffForm(createInitialStaffFormState(store.staff.length));
  };

  const openAddStaff = () => {
    setActiveTab("staff");
    resetStaffForm();
    setStaffFormOpen(true);
    scrollFormIntoView(staffFormRef);
  };

  const openEditStaff = (staff: StaffProfile) => {
    setActiveTab("staff");
    setStaffForm({
      ...createInitialStaffFormState(store.staff.length),
      id: staff.id,
      schoolBranch: staff.schoolBranch ?? "Main Campus (Guzape)",
      staffCode: staff.staffCode ?? `STF/ADM/${staff.id.slice(-3).toUpperCase()}`,
      displayPrefix: staff.displayPrefix ?? "Mr.",
      firstName: staff.firstName,
      middleName: staff.middleName ?? "",
      lastName: staff.lastName,
      sex: staff.sex ?? "Male",
      maritalStatus: staff.maritalStatus ?? "Married",
      dateOfBirth: staff.dateOfBirth ?? "",
      country: staff.country ?? "Nigeria",
      stateOfOrigin: staff.stateOfOrigin ?? "FCT Abuja",
      cityOfResidence: staff.cityOfResidence ?? "",
      photoDataUrl:
        staff.avatarUrl && staff.avatarUrl.startsWith("data:image/")
          ? staff.avatarUrl
          : "",
      roleTitle: staff.roleTitle,
      departmentUnit: staff.departmentUnit ?? "Examination Governance",
      employmentType: staff.employmentType ?? "Full-Time",
      employmentDate: staff.employmentDate ?? "",
      adminScope: staff.adminScope,
      permissions: staff.permissions,
      phoneType: staff.phoneType ?? "Personal Mobile",
      phone: staff.phone,
      alternatePhone: staff.alternatePhone ?? "",
      emailType: staff.emailType ?? "Official School",
      email: staff.email,
      alternateEmail: staff.alternateEmail ?? "",
      nextOfKinName: staff.nextOfKinName ?? "",
      nextOfKinRelationship: staff.nextOfKinRelationship ?? "Spouse",
      nextOfKinPhone: staff.nextOfKinPhone ?? "",
      nextOfKinAddress: staff.nextOfKinAddress ?? "",
      password: staff.password,
      status: staff.status,
    });
    setStaffFormOpen(true);
    scrollFormIntoView(staffFormRef);
  };

  const handleSaveStaff = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!staffForm.firstName.trim() || !staffForm.email.trim()) {
      showErrorModal(
        "Missing Required Staff Fields",
        "Please provide the staff member's first name, surname, and email address before submitting."
      );
      return;
    }

    const prefix = staffForm.displayPrefix ? `${staffForm.displayPrefix} ` : "";
    const fullName = [
      prefix.trim(),
      staffForm.firstName.trim(),
      staffForm.middleName.trim(),
      staffForm.lastName.trim(),
    ]
      .filter(Boolean)
      .join(" ");
    const existing = store.staff.find((s) => s.id === staffForm.id);

    saveStaffAccount({
      id: staffForm.id || `adm_${Date.now()}`,
      displayPrefix: staffForm.displayPrefix,
      firstName: staffForm.firstName.trim(),
      middleName: staffForm.middleName.trim() || undefined,
      lastName: staffForm.lastName.trim(),
      name: fullName,
      email: staffForm.email.trim().toLowerCase(),
      emailType: staffForm.emailType,
      alternateEmail: staffForm.alternateEmail.trim() || undefined,
      phone: staffForm.phone.trim(),
      phoneType: staffForm.phoneType,
      alternatePhone: staffForm.alternatePhone.trim() || undefined,
      staffCode: staffForm.staffCode.trim(),
      schoolBranch: staffForm.schoolBranch,
      sex: staffForm.sex,
      maritalStatus: staffForm.maritalStatus,
      dateOfBirth: staffForm.dateOfBirth || undefined,
      country: staffForm.country,
      stateOfOrigin: staffForm.stateOfOrigin,
      cityOfResidence: staffForm.cityOfResidence.trim() || undefined,
      roleTitle: staffForm.roleTitle.trim() || "Staff Administrator",
      departmentUnit: staffForm.departmentUnit,
      employmentType: staffForm.employmentType,
      employmentDate: staffForm.employmentDate || undefined,
      adminScope: staffForm.adminScope,
      permissions: staffForm.permissions.trim(),
      avatarUrl: staffForm.photoDataUrl || existing?.avatarUrl || "avatar-2",
      password: staffForm.password || "Admin@2026",
      status: staffForm.status,
      lastActive: "Updated now",
      nextOfKinName: staffForm.nextOfKinName.trim() || undefined,
      nextOfKinRelationship: staffForm.nextOfKinRelationship,
      nextOfKinPhone: staffForm.nextOfKinPhone.trim() || undefined,
      nextOfKinAddress: staffForm.nextOfKinAddress.trim() || undefined,
    });

    const wasEditing = Boolean(staffForm.id);
    setStaffFormOpen(false);
    resetStaffForm();
    showSuccessModal(
      wasEditing ? "Staff Record Updated" : "Staff Account Created",
      `${fullName} (${staffForm.staffCode}) has been saved to the staff & admin directory.`
    );
  };

  const q = searchQuery.trim().toLowerCase();

  const filteredStudents = React.useMemo(() => {
    const list = store.students.filter((item) => {
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        (item.name ?? "").toLowerCase().includes(q) ||
        (item.email ?? "").toLowerCase().includes(q) ||
        (item.admissionNo ?? "").toLowerCase().includes(q) ||
        (item.classLevel ?? "").toLowerCase().includes(q)
      );
    });
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = (a.name ?? "").localeCompare(b.name ?? "");
      else if (sortKey === "email")
        cmp = (a.email ?? "").localeCompare(b.email ?? "");
      else if (sortKey === "detail")
        cmp = (a.classLevel ?? "").localeCompare(b.classLevel ?? "");
      else if (sortKey === "status")
        cmp = (a.status ?? "").localeCompare(b.status ?? "");
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [q, sortDir, sortKey, statusFilter, store.students]);

  const filteredTeachers = React.useMemo(() => {
    const list = store.teachers.filter((item) => {
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        (item.name ?? "").toLowerCase().includes(q) ||
        (item.email ?? "").toLowerCase().includes(q) ||
        (item.department ?? "").toLowerCase().includes(q)
      );
    });
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = (a.name ?? "").localeCompare(b.name ?? "");
      else if (sortKey === "email")
        cmp = (a.email ?? "").localeCompare(b.email ?? "");
      else if (sortKey === "detail")
        cmp = (a.department ?? "").localeCompare(b.department ?? "");
      else if (sortKey === "status")
        cmp = (a.status ?? "").localeCompare(b.status ?? "");
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [q, sortDir, sortKey, statusFilter, store.teachers]);

  const filteredStaff = React.useMemo(() => {
    const list = store.staff.filter((item) => {
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        (item.name ?? "").toLowerCase().includes(q) ||
        (item.email ?? "").toLowerCase().includes(q) ||
        (item.roleTitle ?? "").toLowerCase().includes(q)
      );
    });
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = (a.name ?? "").localeCompare(b.name ?? "");
      else if (sortKey === "email")
        cmp = (a.email ?? "").localeCompare(b.email ?? "");
      else if (sortKey === "detail")
        cmp = (a.roleTitle ?? "").localeCompare(b.roleTitle ?? "");
      else if (sortKey === "status")
        cmp = (a.status ?? "").localeCompare(b.status ?? "");
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [q, sortDir, sortKey, statusFilter, store.staff]);

  return (
    <div className="space-y-6">
      <AdminHeroBanner
        eyebrow={`School Directory · ${termLabel}`}
        title="Users, Classes & Access Control"
        description="Register students, teachers, and staff using full inline forms; assign teachers to classes and subjects; assign class arms to students; and manage portal access."
        badgeLabel="Full Admin Control"
        badgeTone="brand"
        metrics={[
          { label: "Students", value: `${store.students.length}` },
          { label: "Teachers", value: `${store.teachers.length}` },
          { label: "Staff & Admins", value: `${store.staff.length}` },
        ]}
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openAddStudent}
              className="cta-surface-secondary inline-flex items-center gap-1.5 rounded-pill px-4 py-2 font-display text-xs font-extrabold transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Student
            </button>
            <button
              type="button"
              onClick={openAddTeacher}
              className="inline-flex items-center gap-1.5 rounded-pill border border-surface-porcelain/35 bg-surface-porcelain/15 px-4 py-2 font-display text-xs font-extrabold text-ink-on-blue transition-colors hover:bg-surface-porcelain/25 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Teacher
            </button>
            <button
              type="button"
              onClick={openAddStaff}
              className="inline-flex items-center gap-1.5 rounded-pill border border-surface-porcelain/35 bg-surface-porcelain/15 px-4 py-2 font-display text-xs font-extrabold text-ink-on-blue transition-colors hover:bg-surface-porcelain/25 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Staff
            </button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(
            [
              {
                id: "students",
                label: `Students (${store.students.length})`,
                icon: GraduationCap,
              },
              {
                id: "teachers",
                label: `Teachers (${store.teachers.length})`,
                icon: Users,
              },
              {
                id: "staff",
                label: `Staff & Admins (${store.staff.length})`,
                icon: Shield,
              },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-pill px-4 py-2 font-display text-xs font-extrabold transition-colors cursor-pointer",
                  activeTab === tab.id
                    ? "cta-surface-primary text-ink-on-blue"
                    : "border-2 border-brand-100 bg-surface-porcelain text-brand-800 shadow-gloss-card hover:bg-surface-mist"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Inline Registration & Allocation Forms per Active Directory Tab */}
      {activeTab === "students" && (
        <div className="space-y-4">
          <StudentRegistrationForm
            formRef={studentFormRef}
            open={studentFormOpen}
            onOpenChange={setStudentFormOpen}
            formState={studentForm}
            setFormState={setStudentForm}
            classArms={store.classArms}
            academicTerms={store.academicTerms}
            studentCount={store.students.length}
            onReset={resetStudentForm}
            onSubmit={handleSaveStudent}
            onPhotoError={(msg) => showErrorModal("Photo Upload Error", msg)}
          />

          <StudentClassAssignmentForm
            formRef={assignClassFormRef}
            target={assignClassTarget}
            selectedClassArmId={selectedClassArmId}
            onChangeClassArmId={setSelectedClassArmId}
            classArms={store.classArms}
            onCancel={() => setAssignClassTarget(null)}
            onSubmit={(e) => {
              e.preventDefault();
              if (!assignClassTarget) return;
              assignStudentClass(assignClassTarget.id, selectedClassArmId);
              const assignedName = assignClassTarget.name;
              setAssignClassTarget(null);
              showSuccessModal(
                "Class Assigned",
                `${assignedName} has been moved to the selected class arm.`
              );
            }}
          />
        </div>
      )}

      {activeTab === "teachers" && (
        <div className="space-y-4">
          <TeacherRegistrationForm
            formRef={teacherFormRef}
            open={teacherFormOpen}
            onOpenChange={setTeacherFormOpen}
            formState={teacherForm}
            setFormState={setTeacherForm}
            classArms={store.classArms}
            subjects={store.subjects}
            teacherCount={store.teachers.length}
            onReset={resetTeacherForm}
            onSubmit={handleSaveTeacher}
            onPhotoError={(msg) => showErrorModal("Photo Upload Error", msg)}
          />

          <TeacherAssignmentForm
            formRef={assignTeacherFormRef}
            target={assignTeacherTarget}
            classesDraft={teacherClassesDraft}
            setClassesDraft={setTeacherClassesDraft}
            subjectsDraft={teacherSubjectsDraft}
            setSubjectsDraft={setTeacherSubjectsDraft}
            classArms={store.classArms}
            subjects={store.subjects}
            onCancel={() => setAssignTeacherTarget(null)}
            onSubmit={(e) => {
              e.preventDefault();
              if (!assignTeacherTarget) return;
              assignTeacherAssignments(
                assignTeacherTarget.id,
                teacherClassesDraft,
                teacherSubjectsDraft
              );
              const teacherName = assignTeacherTarget.name;
              setAssignTeacherTarget(null);
              showSuccessModal(
                "Teaching Assignments Saved",
                `Updated class arms and subjects for ${teacherName}.`
              );
            }}
          />
        </div>
      )}

      {activeTab === "staff" && (
        <StaffRegistrationForm
          formRef={staffFormRef}
          open={staffFormOpen}
          onOpenChange={setStaffFormOpen}
          formState={staffForm}
          setFormState={setStaffForm}
          staffCount={store.staff.length}
          onReset={resetStaffForm}
          onSubmit={handleSaveStaff}
          onPhotoError={(msg) => showErrorModal("Photo Upload Error", msg)}
        />
      )}

      <AdminSectionCard
        title={
          activeTab === "students"
            ? "Student Accounts & Class Assignment"
            : activeTab === "teachers"
              ? "Teacher Accounts & Subject/Class Allocations"
              : "Administrative & Support Staff"
        }
        description="Manage student, teacher, and staff records directly with the inline registration forms above; modals are reserved for confirmations and status alerts."
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="w-full sm:w-72">
            <AdminSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search name, email, ID..."
            />
          </div>
          <AdminSelectField
            variant="filter"
            aria-label="Filter account status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { id: "ALL", label: "All Statuses" },
              { id: "active", label: "Active" },
              { id: "inactive", label: "Inactive" },
            ]}
          />
        </div>

        <div className="overflow-x-auto rounded-2xl border-2 border-brand-100 bg-surface-porcelain">
          <table className="w-full text-left text-xs">
            <thead className="border-b-2 border-brand-100 bg-surface-pearl">
              <tr>
                <AdminSortableTableHead
                  label="User"
                  sortKey="name"
                  activeSortKey={sortKey}
                  sortDirection={sortDir}
                  onSort={toggleSort}
                />
                <AdminSortableTableHead
                  label="Email"
                  sortKey="email"
                  activeSortKey={sortKey}
                  sortDirection={sortDir}
                  onSort={toggleSort}
                />
                <AdminSortableTableHead
                  label={
                    activeTab === "students"
                      ? "Class Arm"
                      : activeTab === "teachers"
                        ? "Classes & Subjects"
                        : "Role Title"
                  }
                  sortKey="detail"
                  activeSortKey={sortKey}
                  sortDirection={sortDir}
                  onSort={toggleSort}
                />
                <AdminSortableTableHead
                  label="Status"
                  sortKey="status"
                  activeSortKey={sortKey}
                  sortDirection={sortDir}
                  onSort={toggleSort}
                />
                <AdminTableHead className="text-right">Actions</AdminTableHead>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100 bg-white">
              {activeTab === "students" &&
                filteredStudents.map((stu) => (
                  <tr
                    key={stu.id}
                    className="hover:bg-surface-mist/50 transition-colors"
                  >
                    <AdminTableCell>
                      <div className="flex items-center gap-2.5">
                        <AvatarBadge
                          name={stu.name}
                          avatarUrl={stu.avatarUrl}
                          size="sm"
                        />
                        <div>
                          <p className="font-extrabold text-brand-950">
                            {stu.name}
                          </p>
                          <p className="text-[11px] font-mono text-ink-secondary">
                            {stu.admissionNo}
                          </p>
                        </div>
                      </div>
                    </AdminTableCell>
                    <AdminTableCell className="font-medium text-brand-800">
                      {stu.email}
                    </AdminTableCell>
                    <AdminTableCell>
                      <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[11px] font-extrabold text-brand-900">
                        {stu.classLevel}
                      </span>
                    </AdminTableCell>
                    <AdminTableCell>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase",
                          stu.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        )}
                      >
                        {stu.status}
                      </span>
                    </AdminTableCell>
                    <AdminTableCell className="text-right">
                      <AdminActionMenu
                        ariaLabel={`Actions for ${stu.name}`}
                        items={[
                          {
                            id: "edit-stu",
                            label: "Edit Student Details",
                            icon: <Edit3 className="h-3.5 w-3.5" />,
                            onClick: () => openEditStudent(stu),
                          },
                          {
                            id: "assign-cls",
                            label: "Assign Class Arm",
                            icon: <GraduationCap className="h-3.5 w-3.5" />,
                            variant: "primary",
                            onClick: () => {
                              setStudentFormOpen(false);
                              setSelectedClassArmId(stu.classArmId);
                              setAssignClassTarget(stu);
                              scrollFormIntoView(assignClassFormRef);
                            },
                          },
                          {
                            id: "toggle-stu",
                            label:
                              stu.status === "active"
                                ? "Deactivate Account"
                                : "Activate Account",
                            icon: <Power className="h-3.5 w-3.5" />,
                            onClick: () =>
                              setStudentStatus(
                                stu.id,
                                stu.status === "active" ? "inactive" : "active"
                              ),
                          },
                          {
                            id: "del-stu",
                            label: "Remove Student",
                            icon: <Trash2 className="h-3.5 w-3.5" />,
                            variant: "danger",
                            dividerBefore: true,
                            onClick: () =>
                              setDeleteTarget({
                                kind: "students",
                                id: stu.id,
                                label: stu.name,
                              }),
                          },
                        ]}
                      />
                    </AdminTableCell>
                  </tr>
                ))}

              {activeTab === "teachers" &&
                filteredTeachers.map((tch) => (
                  <tr
                    key={tch.id}
                    className="hover:bg-surface-mist/50 transition-colors"
                  >
                    <AdminTableCell>
                      <div className="flex items-center gap-2.5">
                        <AvatarBadge
                          name={tch.name}
                          avatarUrl={tch.avatarUrl}
                          size="sm"
                        />
                        <div>
                          <p className="font-extrabold text-brand-950">
                            {tch.name}
                          </p>
                          <p className="text-[11px] text-ink-secondary">
                            {tch.staffId} · {tch.department}
                          </p>
                        </div>
                      </div>
                    </AdminTableCell>
                    <AdminTableCell className="font-medium text-brand-800">
                      {tch.email}
                    </AdminTableCell>
                    <AdminTableCell>
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold text-brand-950">
                          Classes: {tch.assignedClasses.join(", ") || "None"}
                        </p>
                        <p className="text-[11px] font-medium text-ink-secondary">
                          Subjects:{" "}
                          {tch.assignedSubjectIds
                            .map(
                              (sid) =>
                                store.subjects.find((s) => s.id === sid)?.title ??
                                sid
                            )
                            .join(", ") || "None"}
                        </p>
                      </div>
                    </AdminTableCell>
                    <AdminTableCell>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase",
                          tch.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        )}
                      >
                        {tch.status}
                      </span>
                    </AdminTableCell>
                    <AdminTableCell className="text-right">
                      <AdminActionMenu
                        ariaLabel={`Actions for ${tch.name}`}
                        items={[
                          {
                            id: "edit-tch",
                            label: "Edit Teacher Profile",
                            icon: <Edit3 className="h-3.5 w-3.5" />,
                            onClick: () => openEditTeacher(tch),
                          },
                          {
                            id: "assign-tch",
                            label: "Assign Classes & Subjects",
                            icon: <UserCheck className="h-3.5 w-3.5" />,
                            variant: "primary",
                            onClick: () => {
                              setTeacherFormOpen(false);
                              setTeacherClassesDraft(tch.assignedClasses);
                              setTeacherSubjectsDraft(tch.assignedSubjectIds);
                              setAssignTeacherTarget(tch);
                              scrollFormIntoView(assignTeacherFormRef);
                            },
                          },
                          {
                            id: "toggle-tch",
                            label:
                              tch.status === "active"
                                ? "Deactivate Account"
                                : "Activate Account",
                            icon: <Power className="h-3.5 w-3.5" />,
                            onClick: () =>
                              setTeacherStatus(
                                tch.id,
                                tch.status === "active" ? "inactive" : "active"
                              ),
                          },
                          {
                            id: "del-tch",
                            label: "Remove Teacher",
                            icon: <Trash2 className="h-3.5 w-3.5" />,
                            variant: "danger",
                            dividerBefore: true,
                            onClick: () =>
                              setDeleteTarget({
                                kind: "teachers",
                                id: tch.id,
                                label: tch.name,
                              }),
                          },
                        ]}
                      />
                    </AdminTableCell>
                  </tr>
                ))}

              {activeTab === "staff" &&
                filteredStaff.map((stf) => (
                  <tr
                    key={stf.id}
                    className="hover:bg-surface-mist/50 transition-colors"
                  >
                    <AdminTableCell>
                      <div className="flex items-center gap-2.5">
                        <AvatarBadge
                          name={stf.name}
                          avatarUrl={stf.avatarUrl}
                          size="sm"
                        />
                        <div>
                          <p className="font-extrabold text-brand-950">
                            {stf.name}
                          </p>
                          <p className="text-[11px] text-ink-secondary">
                            {stf.staffCode ? `${stf.staffCode} · ` : ""}
                            {stf.lastActive}
                          </p>
                        </div>
                      </div>
                    </AdminTableCell>
                    <AdminTableCell className="font-medium text-brand-800">
                      {stf.email}
                    </AdminTableCell>
                    <AdminTableCell>
                      <p className="font-bold text-brand-950">{stf.roleTitle}</p>
                      <p className="text-[11px] text-ink-secondary line-clamp-1">
                        {stf.permissions}
                      </p>
                    </AdminTableCell>
                    <AdminTableCell>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase",
                          stf.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        )}
                      >
                        {stf.status}
                      </span>
                    </AdminTableCell>
                    <AdminTableCell className="text-right">
                      <AdminActionMenu
                        ariaLabel={`Actions for ${stf.name}`}
                        items={[
                          {
                            id: "edit-stf",
                            label: "Edit Staff Account",
                            icon: <Edit3 className="h-3.5 w-3.5" />,
                            onClick: () => openEditStaff(stf),
                          },
                          {
                            id: "toggle-stf",
                            label:
                              stf.status === "active"
                                ? "Deactivate Access"
                                : "Activate Access",
                            icon: <Power className="h-3.5 w-3.5" />,
                            onClick: () =>
                              setStaffStatus(
                                stf.id,
                                stf.status === "active" ? "inactive" : "active"
                              ),
                          },
                          {
                            id: "del-stf",
                            label: "Remove Staff",
                            icon: <Trash2 className="h-3.5 w-3.5" />,
                            variant: "danger",
                            dividerBefore: true,
                            onClick: () =>
                              setDeleteTarget({
                                kind: "staff",
                                id: stf.id,
                                label: stf.name,
                              }),
                          },
                        ]}
                      />
                    </AdminTableCell>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </AdminSectionCard>

      {/* Success / Error Modal */}
      <AdminDialogModal
        open={Boolean(feedbackModal)}
        onOpenChange={(open) => {
          if (!open) setFeedbackModal(null);
        }}
        variant={feedbackModal?.variant ?? "primary"}
        eyebrow={feedbackModal?.eyebrow}
        title={feedbackModal?.title ?? ""}
        description={feedbackModal?.description}
        confirmLabel="OK"
        cancelLabel="Close"
        onConfirm={() => setFeedbackModal(null)}
      />

      {/* Delete Confirmation Modal */}
      <AdminDialogModal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        variant="danger"
        title="Remove User Account?"
        description={
          deleteTarget
            ? `Permanently remove "${deleteTarget.label}" from the portal directory?`
            : undefined
        }
        confirmLabel="Confirm Delete"
        onConfirm={() => {
          if (deleteTarget) {
            if (deleteTarget.kind === "students")
              deleteStudentAccount(deleteTarget.id);
            else if (deleteTarget.kind === "teachers")
              deleteTeacherAccount(deleteTarget.id);
            else deleteStaffAccount(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
