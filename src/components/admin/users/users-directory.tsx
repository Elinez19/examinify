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
import {
  isTeachingStaffRole,
  type AccountStatus,
  type StaffProfile,
  type StaffRoleOption,
  type StaffType,
  type StudentProfile,
  type TeacherProfile,
} from "@/data/portal-mock-data";
import { cn } from "@/lib/utils";
import {
  createInitialStudentFormState,
  StudentRegistrationForm,
  type StudentRegistrationFormState,
} from "./student-registration-form";
import {
  createInitialStaffFormState,
  StaffRegistrationForm,
  staffRecordToFormState,
  type StaffRegistrationFormState,
} from "./staff-registration-form";
import { StudentClassAssignmentForm } from "./student-class-assignment-form";
import { TeacherAssignmentForm } from "./teacher-assignment-form";

type UserDirectoryTab = "students" | "staff";
type UserSortKey = "name" | "email" | "detail" | "status";

interface UnifiedStaffItem {
  id: string;
  kind: "teacher" | "staff";
  name: string;
  staffCode: string;
  email: string;
  staffType: StaffType;
  role: StaffRoleOption;
  avatarUrl?: string;
  status: AccountStatus;
  teacherData?: TeacherProfile;
  staffData?: StaffProfile;
}

export function UsersDirectory() {
  const {
    store,
    activeSessionTerm,
    saveStudentAccount,
    setStudentStatus,
    assignStudentClass,
    deleteStudentAccount,
    saveUnifiedStaff,
    setAnyStaffStatus,
    assignTeacherAssignments,
    deleteAnyStaffAccount,
  } = usePortalStore();

  const totalStaffCount = store.teachers.length + store.staff.length;

  const [activeTab, setActiveTab] = React.useState<UserDirectoryTab>("students");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [sortKey, setSortKey] = React.useState<UserSortKey>("name");
  const [sortDir, setSortDir] = React.useState<SortDirection>("asc");

  const studentFormRef = React.useRef<HTMLDivElement | null>(null);
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

  // Staff inline form state (used for all teachers, admins, and support staff)
  const [staffFormOpen, setStaffFormOpen] = React.useState(false);
  const [staffForm, setStaffForm] = React.useState<StaffRegistrationFormState>(
    () => createInitialStaffFormState(totalStaffCount)
  );
  const [assignTeacherTarget, setAssignTeacherTarget] =
    React.useState<TeacherProfile | null>(null);
  const [teacherClassesDraft, setTeacherClassesDraft] = React.useState<
    string[]
  >([]);
  const [teacherSubjectsDraft, setTeacherSubjectsDraft] = React.useState<
    string[]
  >([]);

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
      eyebrow: "Saved",
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

  // Staff handlers
  const resetStaffForm = () => {
    setStaffForm(createInitialStaffFormState(totalStaffCount));
  };

  const openAddStaff = () => {
    setActiveTab("staff");
    setAssignTeacherTarget(null);
    resetStaffForm();
    setStaffFormOpen(true);
    scrollFormIntoView(staffFormRef);
  };

  const openEditStaff = (row: UnifiedStaffItem) => {
    setActiveTab("staff");
    setAssignTeacherTarget(null);
    if (row.kind === "teacher" && row.teacherData) {
      setStaffForm(
        staffRecordToFormState(
          { kind: "teacher", data: row.teacherData },
          totalStaffCount
        )
      );
    } else if (row.staffData) {
      setStaffForm(
        staffRecordToFormState(
          { kind: "staff", data: row.staffData },
          totalStaffCount
        )
      );
    }
    setStaffFormOpen(true);
    scrollFormIntoView(staffFormRef);
  };

  const handleSaveStaff = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !staffForm.firstName.trim() ||
      !staffForm.lastName.trim() ||
      !staffForm.email.trim()
    ) {
      showErrorModal(
        "Missing Required Staff Fields",
        "Please enter the staff member's first name, surname, and email address before submitting."
      );
      return;
    }

    const fullName = [
      staffForm.firstName.trim(),
      staffForm.middleName.trim(),
      staffForm.lastName.trim(),
    ]
      .filter(Boolean)
      .join(" ");
    const wasEditing = Boolean(staffForm.id);

    saveUnifiedStaff({
      id: staffForm.id,
      schoolBranch: staffForm.schoolBranch,
      staffCode: staffForm.staffCode.trim(),
      firstName: staffForm.firstName.trim(),
      middleName: staffForm.middleName.trim() || undefined,
      lastName: staffForm.lastName.trim(),
      sex: staffForm.sex,
      maritalStatus: staffForm.maritalStatus,
      dateOfBirth: staffForm.dateOfBirth || undefined,
      country: staffForm.country,
      stateOfOrigin: staffForm.stateOfOrigin,
      cityOfResidence: staffForm.cityOfResidence.trim() || undefined,
      avatarUrl: staffForm.photoDataUrl || undefined,
      staffType: staffForm.staffType,
      role: staffForm.role,
      phoneType: staffForm.phoneType,
      phone: staffForm.phone.trim(),
      alternatePhone: staffForm.alternatePhone.trim() || undefined,
      emailType: staffForm.emailType,
      email: staffForm.email.trim().toLowerCase(),
      alternateEmail: staffForm.alternateEmail.trim() || undefined,
      nextOfKinName: staffForm.nextOfKinName.trim() || undefined,
      nextOfKinRelationship: staffForm.nextOfKinRelationship,
      nextOfKinPhone: staffForm.nextOfKinPhone.trim() || undefined,
      nextOfKinAddress: staffForm.nextOfKinAddress.trim() || undefined,
      password: staffForm.password || "Staff@2026",
      status: staffForm.status,
    });

    setStaffFormOpen(false);
    resetStaffForm();
    showSuccessModal(
      wasEditing ? "Staff Record Updated" : "Staff Registered",
      `${fullName} (${staffForm.staffCode}) has been saved to the staff directory.`
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

  const allStaffRows = React.useMemo<UnifiedStaffItem[]>(() => {
    const teacherRows: UnifiedStaffItem[] = store.teachers.map((t) => ({
      id: t.id,
      kind: "teacher",
      name: t.name,
      staffCode: t.staffId,
      email: t.email,
      staffType: t.staffType ?? "Academic",
      role: t.assignedRole ?? "Teacher",
      avatarUrl: t.avatarUrl,
      status: t.status,
      teacherData: t,
    }));
    const staffRows: UnifiedStaffItem[] = store.staff.map((s) => ({
      id: s.id,
      kind: "staff",
      name: s.name,
      staffCode: s.staffCode ?? `STF/${s.id.slice(-3).toUpperCase()}`,
      email: s.email,
      staffType: s.staffType ?? "Non-Academic",
      role: s.assignedRole ?? "Staff",
      avatarUrl: s.avatarUrl,
      status: s.status,
      staffData: s,
    }));
    return [...teacherRows, ...staffRows];
  }, [store.staff, store.teachers]);

  const filteredStaff = React.useMemo(() => {
    const list = allStaffRows.filter((item) => {
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q) ||
        item.staffType.toLowerCase().includes(q) ||
        item.staffCode.toLowerCase().includes(q)
      );
    });
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "email") cmp = a.email.localeCompare(b.email);
      else if (sortKey === "detail") cmp = a.role.localeCompare(b.role);
      else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [allStaffRows, q, sortDir, sortKey, statusFilter]);

  return (
    <div className="space-y-6">
      <AdminHeroBanner
        eyebrow={`School Directory · ${termLabel}`}
        title="Students & Staff Directory"
        description="Register students or school staff using the inline forms below, assign classes to students, and manage account access."
        badgeLabel="School Users"
        badgeTone="brand"
        metrics={[
          { label: "Students", value: `${store.students.length}` },
          { label: "Staff", value: `${totalStaffCount}` },
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
                id: "staff",
                label: `Staff (${totalStaffCount})`,
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

      {activeTab === "staff" && (
        <div className="space-y-4">
          <StaffRegistrationForm
            formRef={staffFormRef}
            open={staffFormOpen}
            onOpenChange={setStaffFormOpen}
            formState={staffForm}
            setFormState={setStaffForm}
            staffCount={totalStaffCount}
            onReset={resetStaffForm}
            onSubmit={handleSaveStaff}
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

      <AdminSectionCard
        title={
          activeTab === "students"
            ? "Student Accounts & Class Assignment"
            : "All School Staff"
        }
        description="Manage student and staff records using the registration forms above."
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
                      : "Staff Type & Role"
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

              {activeTab === "staff" &&
                filteredStaff.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-surface-mist/50 transition-colors"
                  >
                    <AdminTableCell>
                      <div className="flex items-center gap-2.5">
                        <AvatarBadge
                          name={row.name}
                          avatarUrl={row.avatarUrl}
                          size="sm"
                        />
                        <div>
                          <p className="font-extrabold text-brand-950">
                            {row.name}
                          </p>
                          <p className="text-[11px] font-mono text-ink-secondary">
                            {row.staffCode}
                          </p>
                        </div>
                      </div>
                    </AdminTableCell>
                    <AdminTableCell className="font-medium text-brand-800">
                      {row.email}
                    </AdminTableCell>
                    <AdminTableCell>
                      <p className="font-bold text-brand-950">
                        {row.staffType} · {row.role}
                      </p>
                      {row.teacherData &&
                        row.teacherData.assignedClasses.length > 0 && (
                          <p className="text-[11px] text-ink-secondary">
                            Classes: {row.teacherData.assignedClasses.join(", ")}
                          </p>
                        )}
                    </AdminTableCell>
                    <AdminTableCell>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase",
                          row.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        )}
                      >
                        {row.status}
                      </span>
                    </AdminTableCell>
                    <AdminTableCell className="text-right">
                      <AdminActionMenu
                        ariaLabel={`Actions for ${row.name}`}
                        items={[
                          {
                            id: "edit-stf",
                            label: "Edit Staff Details",
                            icon: <Edit3 className="h-3.5 w-3.5" />,
                            onClick: () => openEditStaff(row),
                          },
                          ...(row.teacherData && isTeachingStaffRole(row.role)
                            ? [
                                {
                                  id: "assign-tch",
                                  label: "Assign Classes & Subjects",
                                  icon: <UserCheck className="h-3.5 w-3.5" />,
                                  variant: "primary" as const,
                                  onClick: () => {
                                    setStaffFormOpen(false);
                                    setTeacherClassesDraft(
                                      row.teacherData!.assignedClasses
                                    );
                                    setTeacherSubjectsDraft(
                                      row.teacherData!.assignedSubjectIds
                                    );
                                    setAssignTeacherTarget(row.teacherData!);
                                    scrollFormIntoView(assignTeacherFormRef);
                                  },
                                },
                              ]
                            : []),
                          {
                            id: "toggle-stf",
                            label:
                              row.status === "active"
                                ? "Deactivate Access"
                                : "Activate Access",
                            icon: <Power className="h-3.5 w-3.5" />,
                            onClick: () =>
                              setAnyStaffStatus(
                                row.id,
                                row.status === "active" ? "inactive" : "active"
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
                                id: row.id,
                                label: row.name,
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
            if (deleteTarget.kind === "students") {
              deleteStudentAccount(deleteTarget.id);
            } else {
              deleteAnyStaffAccount(deleteTarget.id);
            }
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
