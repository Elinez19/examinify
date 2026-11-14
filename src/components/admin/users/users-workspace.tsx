"use client";

import * as React from "react";
import {
  CheckCircle2,
  Edit3,
  GraduationCap,
  KeyRound,
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
  AdminTextField,
} from "@/components/admin/ui/admin-form-controls";
import {
  AdminSortableTableHead,
  AdminTableCell,
  AdminTableHead,
  type SortDirection,
} from "@/components/admin/ui/admin-data-table";
import { AdminActionMenu } from "@/components/admin/ui/admin-action-menu";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminDialogModal } from "@/components/admin/ui/admin-dialog-modal";
import { AvatarBadge } from "@/components/portal/avatar-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type {
  AccountStatus,
  StaffProfile,
  StudentProfile,
  TeacherProfile,
} from "@/data/portal-mock-data";
import { cn } from "@/lib/utils";

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

  // Student contextual modals
  const [studentModalOpen, setStudentModalOpen] = React.useState(false);
  const [studentForm, setStudentForm] = React.useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    admissionNo: "",
    classArmId: store.classArms[0]?.id ?? "arm_jss3a",
    password: "Student@2026",
    status: "active" as AccountStatus,
  });
  const [assignClassTarget, setAssignClassTarget] =
    React.useState<StudentProfile | null>(null);
  const [selectedClassArmId, setSelectedClassArmId] = React.useState("");

  // Teacher contextual modals
  const [teacherModalOpen, setTeacherModalOpen] = React.useState(false);
  const [teacherForm, setTeacherForm] = React.useState({
    id: "",
    firstName: "",
    lastName: "",
    displayPrefix: "Mr.",
    email: "",
    phone: "",
    staffId: "",
    department: "",
    password: "Teacher@2026",
    status: "active" as AccountStatus,
    assignedClasses: [] as string[],
    assignedSubjectIds: [] as string[],
  });
  const [assignTeacherTarget, setAssignTeacherTarget] =
    React.useState<TeacherProfile | null>(null);
  const [teacherClassesDraft, setTeacherClassesDraft] = React.useState<string[]>([]);
  const [teacherSubjectsDraft, setTeacherSubjectsDraft] = React.useState<string[]>([]);

  // Staff/Admin contextual modal
  const [staffModalOpen, setStaffModalOpen] = React.useState(false);
  const [staffForm, setStaffForm] = React.useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    roleTitle: "",
    adminScope: "kyc_moderator" as StaffProfile["adminScope"],
    permissions: "",
    password: "Admin@2026",
    status: "active" as AccountStatus,
  });

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = React.useState<{
    kind: UserDirectoryTab;
    id: string;
    label: string;
  } | null>(null);

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
  const openAddStudent = () => {
    setStudentForm({
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      admissionNo: `EXM/2026/${String(store.students.length + 45).padStart(3, "0")}`,
      classArmId: store.classArms[0]?.id ?? "arm_jss3a",
      password: "Student@2026",
      status: "active",
    });
    setStudentModalOpen(true);
  };

  const openEditStudent = (stu: StudentProfile) => {
    setStudentForm({
      id: stu.id,
      firstName: stu.firstName,
      lastName: stu.lastName,
      email: stu.email,
      phone: stu.phone,
      admissionNo: stu.admissionNo,
      classArmId: stu.classArmId,
      password: stu.password,
      status: stu.status,
    });
    setStudentModalOpen(true);
  };

  const handleSaveStudent = (event: React.FormEvent) => {
    event.preventDefault();
    if (!studentForm.firstName.trim() || !studentForm.email.trim()) return;
    const arm =
      store.classArms.find((a) => a.id === studentForm.classArmId) ??
      store.classArms[0];
    const fullName =
      `${studentForm.firstName.trim()} ${studentForm.lastName.trim()}`.trim();
    saveStudentAccount({
      id: studentForm.id || `stu_${Date.now()}`,
      firstName: studentForm.firstName.trim(),
      lastName: studentForm.lastName.trim(),
      name: fullName,
      email: studentForm.email.trim().toLowerCase(),
      phone: studentForm.phone.trim(),
      admissionNo: studentForm.admissionNo.trim(),
      classArmId: arm?.id ?? "arm_jss3a",
      classLevel: arm?.name ?? "JSS 3A",
      wing: arm?.arm ?? "General",
      termLabel,
      schoolName: store.student.schoolName,
      avatarUrl: "avatar-1",
      password: studentForm.password || "Student@2026",
      status: studentForm.status,
    });
    setStudentModalOpen(false);
  };

  // Teacher handlers
  const openAddTeacher = () => {
    setTeacherForm({
      id: "",
      firstName: "",
      lastName: "",
      displayPrefix: "Mr.",
      email: "",
      phone: "",
      staffId: `STF/TCH/${String(store.teachers.length + 31).padStart(3, "0")}`,
      department: "Sciences",
      password: "Teacher@2026",
      status: "active",
      assignedClasses: store.classArms[0] ? [store.classArms[0].name] : [],
      assignedSubjectIds: store.subjects[0] ? [store.subjects[0].id] : [],
    });
    setTeacherModalOpen(true);
  };

  const openEditTeacher = (tch: TeacherProfile) => {
    setTeacherForm({
      id: tch.id,
      firstName: tch.firstName,
      lastName: tch.lastName,
      displayPrefix: tch.name.startsWith("Mrs.")
        ? "Mrs."
        : tch.name.startsWith("Ms.")
          ? "Ms."
          : "Mr.",
      email: tch.email,
      phone: tch.phone,
      staffId: tch.staffId,
      department: tch.department,
      password: tch.password,
      status: tch.status,
      assignedClasses: tch.assignedClasses,
      assignedSubjectIds: tch.assignedSubjectIds,
    });
    setTeacherModalOpen(true);
  };

  const handleSaveTeacher = (event: React.FormEvent) => {
    event.preventDefault();
    if (!teacherForm.firstName.trim() || !teacherForm.email.trim()) return;
    const prefix = teacherForm.displayPrefix ? `${teacherForm.displayPrefix} ` : "";
    const fullName =
      `${prefix}${teacherForm.firstName.trim()} ${teacherForm.lastName.trim()}`.trim();
    saveTeacherAccount({
      id: teacherForm.id || `tch_${Date.now()}`,
      firstName: teacherForm.firstName.trim(),
      lastName: teacherForm.lastName.trim(),
      name: fullName,
      email: teacherForm.email.trim().toLowerCase(),
      phone: teacherForm.phone.trim(),
      staffId: teacherForm.staffId.trim(),
      department: teacherForm.department.trim(),
      assignedClasses: teacherForm.assignedClasses,
      assignedSubjectIds: teacherForm.assignedSubjectIds,
      termLabel,
      schoolName: store.teacher.schoolName,
      avatarUrl: "avatar-5",
      password: teacherForm.password || "Teacher@2026",
      status: teacherForm.status,
    });
    setTeacherModalOpen(false);
  };

  // Staff handlers
  const openAddStaff = () => {
    setStaffForm({
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      roleTitle: "Examinations Officer",
      adminScope: "kyc_moderator",
      permissions: "Exam scheduling, PIN management & result moderation",
      password: "Admin@2026",
      status: "active",
    });
    setStaffModalOpen(true);
  };

  const openEditStaff = (staff: StaffProfile) => {
    setStaffForm({
      id: staff.id,
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      phone: staff.phone,
      roleTitle: staff.roleTitle,
      adminScope: staff.adminScope,
      permissions: staff.permissions,
      password: staff.password,
      status: staff.status,
    });
    setStaffModalOpen(true);
  };

  const handleSaveStaff = (event: React.FormEvent) => {
    event.preventDefault();
    if (!staffForm.firstName.trim() || !staffForm.email.trim()) return;
    const fullName =
      `${staffForm.firstName.trim()} ${staffForm.lastName.trim()}`.trim();
    saveStaffAccount({
      id: staffForm.id || `adm_${Date.now()}`,
      firstName: staffForm.firstName.trim(),
      lastName: staffForm.lastName.trim(),
      name: fullName,
      email: staffForm.email.trim().toLowerCase(),
      phone: staffForm.phone.trim(),
      roleTitle: staffForm.roleTitle.trim() || "Staff Administrator",
      adminScope: staffForm.adminScope,
      permissions: staffForm.permissions.trim(),
      avatarUrl: "avatar-2",
      password: staffForm.password || "Admin@2026",
      status: staffForm.status,
      lastActive: "Updated now",
    });
    setStaffModalOpen(false);
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
        description="Register students, teachers, and staff; assign teachers to classes and subjects; assign class arms to students; and activate or deactivate portal access."
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

      <AdminSectionCard
        title={
          activeTab === "students"
            ? "Student Accounts & Class Assignment"
            : activeTab === "teachers"
              ? "Teacher Accounts & Subject/Class Allocations"
              : "Administrative & Support Staff"
        }
        description="Every registration, class assignment, subject link, and activation toggle runs in a focused contextual modal."
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
                  <tr key={stu.id} className="hover:bg-surface-mist/50 transition-colors">
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
                              setSelectedClassArmId(stu.classArmId);
                              setAssignClassTarget(stu);
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
                  <tr key={tch.id} className="hover:bg-surface-mist/50 transition-colors">
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
                              setTeacherClassesDraft(tch.assignedClasses);
                              setTeacherSubjectsDraft(tch.assignedSubjectIds);
                              setAssignTeacherTarget(tch);
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
                  <tr key={stf.id} className="hover:bg-surface-mist/50 transition-colors">
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

      {/* Contextual Student Registration / Edit Modal */}
      <AdminModal
        open={studentModalOpen}
        onOpenChange={setStudentModalOpen}
        eyebrow="Student Registration"
        title={studentForm.id ? "Edit Student Account" : "Register New Student"}
        size="md"
      >
        <form onSubmit={handleSaveStudent} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminTextField
              label="First Name"
              value={studentForm.firstName}
              onChange={(e) =>
                setStudentForm((p) => ({ ...p, firstName: e.target.value }))
              }
              required
            />
            <AdminTextField
              label="Last Name"
              value={studentForm.lastName}
              onChange={(e) =>
                setStudentForm((p) => ({ ...p, lastName: e.target.value }))
              }
              required
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminTextField
              label="Student Email"
              type="email"
              value={studentForm.email}
              onChange={(e) =>
                setStudentForm((p) => ({ ...p, email: e.target.value }))
              }
              required
            />
            <AdminTextField
              label="Admission Number"
              value={studentForm.admissionNo}
              onChange={(e) =>
                setStudentForm((p) => ({ ...p, admissionNo: e.target.value }))
              }
              required
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminSelectField
              label="Assign Class Arm"
              value={studentForm.classArmId}
              onChange={(val) =>
                setStudentForm((p) => ({ ...p, classArmId: val }))
              }
              options={store.classArms.map((arm) => ({
                id: arm.id,
                label: `${arm.name} (${arm.arm})`,
              }))}
            />
            <AdminTextField
              label="Portal Password"
              value={studentForm.password}
              onChange={(e) =>
                setStudentForm((p) => ({ ...p, password: e.target.value }))
              }
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStudentModalOpen(false)}
              className="rounded-xl border border-brand-200 px-4 py-2 text-xs font-bold text-brand-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cta-surface-primary rounded-pill px-5 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
            >
              {studentForm.id ? "Save Student" : "Register Student"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Contextual Assign Student to Class Arm Modal */}
      <AdminModal
        open={Boolean(assignClassTarget)}
        onOpenChange={(open) => {
          if (!open) setAssignClassTarget(null);
        }}
        eyebrow="Class Allocation"
        title={
          assignClassTarget
            ? `Assign Class · ${assignClassTarget.name}`
            : "Assign Class"
        }
        size="sm"
      >
        {assignClassTarget && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              assignStudentClass(assignClassTarget.id, selectedClassArmId);
              setAssignClassTarget(null);
            }}
            className="space-y-4"
          >
            <AdminSelectField
              label="Select Class Arm"
              value={selectedClassArmId}
              onChange={setSelectedClassArmId}
              options={store.classArms.map((arm) => ({
                id: arm.id,
                label: `${arm.name} · ${arm.arm}`,
              }))}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAssignClassTarget(null)}
                className="rounded-xl border border-brand-200 px-4 py-2 text-xs font-bold text-brand-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cta-surface-primary rounded-pill px-5 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
              >
                Confirm Class
              </button>
            </div>
          </form>
        )}
      </AdminModal>

      {/* Contextual Teacher Registration / Edit Modal */}
      <AdminModal
        open={teacherModalOpen}
        onOpenChange={setTeacherModalOpen}
        eyebrow="Faculty Registration"
        title={teacherForm.id ? "Edit Teacher Account" : "Register New Teacher"}
        size="md"
      >
        <form onSubmit={handleSaveTeacher} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <AdminSelectField
              label="Title"
              value={teacherForm.displayPrefix}
              onChange={(val) =>
                setTeacherForm((p) => ({
                  ...p,
                  displayPrefix: val,
                }))
              }
              options={[
                { id: "Mr.", label: "Mr." },
                { id: "Mrs.", label: "Mrs." },
                { id: "Ms.", label: "Ms." },
                { id: "Dr.", label: "Dr." },
              ]}
            />
            <AdminTextField
              label="First Name"
              value={teacherForm.firstName}
              onChange={(e) =>
                setTeacherForm((p) => ({ ...p, firstName: e.target.value }))
              }
              required
            />
            <AdminTextField
              label="Last Name"
              value={teacherForm.lastName}
              onChange={(e) =>
                setTeacherForm((p) => ({ ...p, lastName: e.target.value }))
              }
              required
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <AdminTextField
              label="Teacher Email"
              type="email"
              value={teacherForm.email}
              onChange={(e) =>
                setTeacherForm((p) => ({ ...p, email: e.target.value }))
              }
              required
            />
            <AdminTextField
              label="Staff ID"
              value={teacherForm.staffId}
              onChange={(e) =>
                setTeacherForm((p) => ({ ...p, staffId: e.target.value }))
              }
              required
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <AdminTextField
              label="Department"
              value={teacherForm.department}
              onChange={(e) =>
                setTeacherForm((p) => ({ ...p, department: e.target.value }))
              }
              required
            />
            <AdminTextField
              label="Portal Password"
              value={teacherForm.password}
              onChange={(e) =>
                setTeacherForm((p) => ({ ...p, password: e.target.value }))
              }
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setTeacherModalOpen(false)}
              className="rounded-xl border border-brand-200 px-4 py-2 text-xs font-bold text-brand-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cta-surface-primary rounded-pill px-5 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
            >
              {teacherForm.id ? "Save Teacher" : "Register Teacher"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Contextual Assign Teacher Classes & Subjects Modal */}
      <AdminModal
        open={Boolean(assignTeacherTarget)}
        onOpenChange={(open) => {
          if (!open) setAssignTeacherTarget(null);
        }}
        eyebrow="Teaching Assignments"
        title={
          assignTeacherTarget
            ? `Assign Classes & Subjects · ${assignTeacherTarget.name}`
            : "Teaching Assignments"
        }
        size="md"
      >
        {assignTeacherTarget && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              assignTeacherAssignments(
                assignTeacherTarget.id,
                teacherClassesDraft,
                teacherSubjectsDraft
              );
              setAssignTeacherTarget(null);
            }}
            className="space-y-5"
          >
            <div>
              <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-brand-900">
                Assign Class Arms
              </p>
              <div className="flex flex-wrap gap-2">
                {store.classArms.map((arm) => {
                  const selected = teacherClassesDraft.includes(arm.name);
                  return (
                    <button
                      key={arm.id}
                      type="button"
                      onClick={() =>
                        setTeacherClassesDraft((prev) =>
                          selected
                            ? prev.filter((item) => item !== arm.name)
                            : [...prev, arm.name]
                        )
                      }
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 font-display text-xs font-extrabold transition-colors cursor-pointer",
                        selected
                          ? "cta-surface-primary text-ink-on-blue"
                          : "border-2 border-brand-100 bg-surface-porcelain text-brand-800 hover:bg-surface-mist"
                      )}
                    >
                      {selected && <CheckCircle2 className="h-3 w-3" />}
                      {arm.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-brand-900">
                Assign Subjects
              </p>
              <div className="flex flex-wrap gap-2">
                {store.subjects.map((sub) => {
                  const selected = teacherSubjectsDraft.includes(sub.id);
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() =>
                        setTeacherSubjectsDraft((prev) =>
                          selected
                            ? prev.filter((item) => item !== sub.id)
                            : [...prev, sub.id]
                        )
                      }
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold transition-colors cursor-pointer",
                        selected
                          ? "bg-emerald-700 text-white"
                          : "border border-brand-200 bg-white text-brand-800"
                      )}
                    >
                      {selected && <CheckCircle2 className="h-3 w-3" />}
                      {sub.title} ({sub.code})
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAssignTeacherTarget(null)}
                className="rounded-xl border border-brand-200 px-4 py-2 text-xs font-bold text-brand-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cta-surface-primary rounded-pill px-5 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
              >
                Save Assignments
              </button>
            </div>
          </form>
        )}
      </AdminModal>

      {/* Contextual Staff / Admin Modal */}
      <AdminModal
        open={staffModalOpen}
        onOpenChange={setStaffModalOpen}
        eyebrow="Staff Administration"
        title={staffForm.id ? "Edit Staff Account" : "Register New Staff / Admin"}
        size="md"
      >
        <form onSubmit={handleSaveStaff} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminTextField
              label="First Name"
              value={staffForm.firstName}
              onChange={(e) =>
                setStaffForm((p) => ({ ...p, firstName: e.target.value }))
              }
              required
            />
            <AdminTextField
              label="Last Name"
              value={staffForm.lastName}
              onChange={(e) =>
                setStaffForm((p) => ({ ...p, lastName: e.target.value }))
              }
              required
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminTextField
              label="Staff Email"
              type="email"
              value={staffForm.email}
              onChange={(e) =>
                setStaffForm((p) => ({ ...p, email: e.target.value }))
              }
              required
            />
            <AdminTextField
              label="Role Title"
              value={staffForm.roleTitle}
              onChange={(e) =>
                setStaffForm((p) => ({ ...p, roleTitle: e.target.value }))
              }
              required
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminTextField
              label="Permissions Summary"
              value={staffForm.permissions}
              onChange={(e) =>
                setStaffForm((p) => ({ ...p, permissions: e.target.value }))
              }
            />
            <AdminTextField
              label="Portal Password"
              value={staffForm.password}
              onChange={(e) =>
                setStaffForm((p) => ({ ...p, password: e.target.value }))
              }
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStaffModalOpen(false)}
              className="rounded-xl border border-brand-200 px-4 py-2 text-xs font-bold text-brand-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cta-surface-primary inline-flex items-center gap-1.5 rounded-pill px-5 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
            >
              <KeyRound className="h-3.5 w-3.5" />
              {staffForm.id ? "Save Staff" : "Register Staff"}
            </button>
          </div>
        </form>
      </AdminModal>

      <AdminDialogModal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        variant="danger"
        title="Remove User Account?"
        description={
          deleteTarget
            ? `Permanently delete ${deleteTarget.label} from the school portal.`
            : undefined
        }
        confirmLabel="Remove User"
        onConfirm={() => {
          if (!deleteTarget) return;
          if (deleteTarget.kind === "students")
            deleteStudentAccount(deleteTarget.id);
          else if (deleteTarget.kind === "teachers")
            deleteTeacherAccount(deleteTarget.id);
          else deleteStaffAccount(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
