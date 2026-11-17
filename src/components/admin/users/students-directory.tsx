"use client";

import * as React from "react";
import { Edit3, GraduationCap, Plus, Power, Trash2 } from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import {
  AdminSearchInput,
  AdminSelectField,
} from "@/components/admin/ui/admin-form-controls";
import {
  AdminDataTable,
  AdminEmptyState,
  AdminSortableTableHead,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
  type SortDirection,
} from "@/components/admin/ui/admin-data-table";
import { AdminActionMenu } from "@/components/admin/ui/admin-action-menu";
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import {
  AdminDialogModal,
  type ModalVariant,
} from "@/components/admin/ui/admin-dialog-modal";
import { AvatarBadge } from "@/components/portal/avatar-badge";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type { StudentProfile } from "@/data/portal-mock-data";
import {
  createInitialStudentFormState,
  StudentRegistrationForm,
  type StudentRegistrationFormState,
} from "./student-registration-form";
import { AssignStudentClassModal } from "./assign-student-class-modal";

type StudentSortKey = "name" | "email" | "detail" | "status";

export function StudentsDirectory() {
  const {
    store,
    activeSessionTerm,
    saveStudentAccount,
    setStudentStatus,
    assignStudentClass,
    deleteStudentAccount,
  } = usePortalStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [sortKey, setSortKey] = React.useState<StudentSortKey>("name");
  const [sortDir, setSortDir] = React.useState<SortDirection>("asc");

  const studentFormRef = React.useRef<HTMLDivElement | null>(null);
  const [studentFormOpen, setStudentFormOpen] = React.useState(false);
  const [studentForm, setStudentForm] =
    React.useState<StudentRegistrationFormState>(() =>
      createInitialStudentFormState(
        store.classArms,
        store.academicTerms,
        store.students.length
      )
    );

  // Modal for simple Assign Class Arm action
  const [assignClassTarget, setAssignClassTarget] =
    React.useState<StudentProfile | null>(null);
  const [selectedClassArmId, setSelectedClassArmId] = React.useState("");

  const [feedbackModal, setFeedbackModal] = React.useState<{
    variant: ModalVariant;
    eyebrow: string;
    title: string;
    description: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] =
    React.useState<StudentProfile | null>(null);

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : store.student.termLabel;

  const scrollFormIntoView = () => {
    setTimeout(() => {
      studentFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 60);
  };

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
    resetStudentForm();
    setStudentFormOpen(true);
    scrollFormIntoView();
  };

  const openEditStudent = (stu: StudentProfile) => {
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
    scrollFormIntoView();
  };

  const handleSaveStudent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!studentForm.firstName.trim() || !studentForm.email.trim()) {
      setFeedbackModal({
        variant: "danger",
        eyebrow: "Validation Error",
        title: "Missing Required Student Fields",
        description:
          "Please provide the student's first name, surname, and email address before submitting.",
      });
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
    const wasEditing = Boolean(studentForm.id);

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

    setStudentFormOpen(false);
    resetStudentForm();
    setFeedbackModal({
      variant: "success",
      eyebrow: "Saved",
      title: wasEditing ? "Student Record Updated" : "Student Registered",
      description: `${fullName} (${studentForm.admissionNo}) has been saved to ${arm?.name ?? "the class directory"}.`,
    });
  };

  const toggleSort = (key: StudentSortKey) => {
    if (sortKey === key) setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
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

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Users · ${termLabel}`}
        eyebrowIcon="dot"
        headline="Students Directory."
        highlightWords={["Students"]}
        subtitle="Register or edit student profiles using the form below, and assign class arms from the row menu."
        primaryCta={{
          label: "Register Student",
          onClick: openAddStudent,
          variant: "primary",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "Staff Directory",
          href: "/admin/users/staff",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
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
          onPhotoError={(msg) =>
            setFeedbackModal({
              variant: "danger",
              eyebrow: "Photo Upload Error",
              title: "Invalid Image",
              description: msg,
            })
          }
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <AdminSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search student name, email, or ID..."
            />
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

          <CtaButton
            type="button"
            variant="primary"
            size="sm"
            onClick={openAddStudent}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Student</span>
          </CtaButton>
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Student Accounts & Class Assignment"
            subtitle="Edit student records or move a student to another class arm."
            badge={`${filteredStudents.length} students`}
          >
            {filteredStudents.length === 0 ? (
              <AdminEmptyState
                title="No Students Found"
                description="Register a new student or clear your search filters."
                icon={<GraduationCap className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminSortableTableHead
                      label="Student"
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
                      label="Class Arm"
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
                    <AdminTableHead className="text-right">
                      Actions
                    </AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredStudents.map((stu) => (
                    <AdminTableRow key={stu.id}>
                      <AdminTableCell>
                        <div className="flex items-center gap-2.5">
                          <AvatarBadge
                            name={stu.name}
                            avatarUrl={stu.avatarUrl}
                            size="sm"
                          />
                          <div>
                            <p className="font-display font-extrabold text-brand-950">
                              {stu.name}
                            </p>
                            <p className="font-mono text-[11px] text-ink-secondary">
                              {stu.admissionNo}
                            </p>
                          </div>
                        </div>
                      </AdminTableCell>
                      <AdminTableCell className="font-medium text-brand-800">
                        {stu.email}
                      </AdminTableCell>
                      <AdminTableCell>
                        <PillBadge
                          tone="sky"
                          className="px-2.5 py-0.5 text-[11px]"
                        >
                          {stu.classLevel}
                        </PillBadge>
                      </AdminTableCell>
                      <AdminTableCell>
                        <AdminStatusPill
                          status={stu.status}
                          variant={
                            stu.status === "active" ? "success" : "danger"
                          }
                        />
                      </AdminTableCell>
                      <AdminTableCell className="text-right">
                        <AdminActionMenu
                          ariaLabel={`Actions for ${stu.name}`}
                          items={[
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
                              id: "edit-stu",
                              label: "Edit Student Details",
                              icon: <Edit3 className="h-3.5 w-3.5" />,
                              onClick: () => openEditStudent(stu),
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
                                  stu.status === "active"
                                    ? "inactive"
                                    : "active"
                                ),
                            },
                            {
                              id: "del-stu",
                              label: "Remove Student",
                              icon: <Trash2 className="h-3.5 w-3.5" />,
                              variant: "danger",
                              dividerBefore: true,
                              onClick: () => setDeleteTarget(stu),
                            },
                          ]}
                        />
                      </AdminTableCell>
                    </AdminTableRow>
                  ))}
                </AdminTableBody>
              </AdminTable>
            )}
          </AdminDataTable>
        </div>
      </AdminWorkspaceSlab>

      <AssignStudentClassModal
        target={assignClassTarget}
        selectedClassArmId={selectedClassArmId}
        onChangeClassArmId={setSelectedClassArmId}
        classArms={store.classArms}
        onClose={() => setAssignClassTarget(null)}
        onConfirm={() => {
          if (!assignClassTarget) return;
          assignStudentClass(assignClassTarget.id, selectedClassArmId);
          const assignedName = assignClassTarget.name;
          setAssignClassTarget(null);
          setFeedbackModal({
            variant: "success",
            eyebrow: "Saved",
            title: "Class Assigned",
            description: `${assignedName} has been moved to the selected class arm.`,
          });
        }}
      />

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
        title="Remove Student Account?"
        description={
          deleteTarget
            ? `Permanently remove "${deleteTarget.name}" from the student directory?`
            : undefined
        }
        confirmLabel="Confirm Delete"
        onConfirm={() => {
          if (deleteTarget) {
            deleteStudentAccount(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
