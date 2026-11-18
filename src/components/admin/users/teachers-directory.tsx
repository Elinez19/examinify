"use client";

import * as React from "react";
import { Edit3, Plus, Power, Trash2, UserCheck, Users } from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import {
  AdminSearchInput,
  AdminSelectField,
} from "@/components/admin/ui/admin-form-controls";
import {
  AdminCheckbox,
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
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import { useTableSelection } from "@/hooks/portal/use-table-selection";
import type { TeacherProfile } from "@/data/portal-mock-data";
import {
  createInitialStaffFormState,
  StaffRegistrationForm,
  staffRecordToFormState,
  type StaffRegistrationFormState,
} from "./staff-registration-form";
import { AssignTeacherModal } from "./assign-teacher-modal";

type TeacherSortKey = "name" | "email" | "detail" | "status";

export function TeachersDirectory() {
  const {
    store,
    activeSessionTerm,
    saveUnifiedStaff,
    setTeacherStatus,
    assignTeacherAssignments,
    deleteTeacherAccount,
  } = usePortalStore();

  const totalStaffCount = store.teachers.length + store.staff.length;

  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [sortKey, setSortKey] = React.useState<TeacherSortKey>("name");
  const [sortDir, setSortDir] = React.useState<SortDirection>("asc");

  const staffFormRef = React.useRef<HTMLDivElement | null>(null);
  const [staffFormOpen, setStaffFormOpen] = React.useState(false);
  const [staffForm, setStaffForm] = React.useState<StaffRegistrationFormState>(
    () =>
      createInitialStaffFormState(totalStaffCount, {
        staffType: "Academic",
        role: "Teacher",
      })
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
  const [deleteTarget, setDeleteTarget] =
    React.useState<TeacherProfile | null>(null);

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : store.teacher.termLabel;

  const scrollFormIntoView = () => {
    setTimeout(() => {
      staffFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 60);
  };

  const resetStaffForm = () => {
    setStaffForm(
      createInitialStaffFormState(totalStaffCount, {
        staffType: "Academic",
        role: "Teacher",
      })
    );
  };

  const openAddTeacher = () => {
    resetStaffForm();
    setStaffFormOpen(true);
    scrollFormIntoView();
  };

  const openEditTeacher = (tch: TeacherProfile) => {
    setStaffForm(
      staffRecordToFormState({ kind: "teacher", data: tch }, totalStaffCount)
    );
    setStaffFormOpen(true);
    scrollFormIntoView();
  };

  const handleSaveStaff = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !staffForm.firstName.trim() ||
      !staffForm.lastName.trim() ||
      !staffForm.email.trim()
    ) {
      setFeedbackModal({
        variant: "danger",
        eyebrow: "Missing Information",
        title: "Please Complete Required Fields",
        description:
          "Please enter the staff member's first name, surname, and email address before submitting.",
      });
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
    setFeedbackModal({
      variant: "success",
      eyebrow: "Saved",
      title: wasEditing ? "Staff Record Updated" : "Staff Registered",
      description: `${fullName} (${staffForm.staffCode}) has been saved.`,
    });
  };

  const toggleSort = (key: TeacherSortKey) => {
    if (sortKey === key) setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredTeachers = React.useMemo(() => {
    const list = store.teachers.filter((item) => {
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        (item.name ?? "").toLowerCase().includes(q) ||
        (item.email ?? "").toLowerCase().includes(q) ||
        (item.assignedRole ?? "").toLowerCase().includes(q) ||
        (item.staffId ?? "").toLowerCase().includes(q)
      );
    });
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = (a.name ?? "").localeCompare(b.name ?? "");
      else if (sortKey === "email")
        cmp = (a.email ?? "").localeCompare(b.email ?? "");
      else if (sortKey === "detail")
        cmp = (a.assignedRole ?? "Teacher").localeCompare(
          b.assignedRole ?? "Teacher"
        );
      else if (sortKey === "status")
        cmp = (a.status ?? "").localeCompare(b.status ?? "");
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [q, sortDir, sortKey, statusFilter, store.teachers]);

  const selection = useTableSelection(filteredTeachers.map((tch) => tch.id));

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Users · ${termLabel}`}
        eyebrowIcon="dot"
        headline="Teaching Staff Directory."
        highlightWords={["Teaching", "Staff"]}
        subtitle="Register staff using the single Staff Registration form and assign classes or subjects to teaching staff."
        primaryCta={{
          label: "Register Staff",
          onClick: openAddTeacher,
          variant: "primary",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "All Staff Directory",
          href: "/admin/users/staff",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <StaffRegistrationForm
          formRef={staffFormRef}
          open={staffFormOpen}
          onOpenChange={setStaffFormOpen}
          formState={staffForm}
          setFormState={setStaffForm}
          staffCount={totalStaffCount}
          onReset={resetStaffForm}
          onSubmit={handleSaveStaff}
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
              placeholder="Search name, email, ID, or role..."
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
            onClick={openAddTeacher}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Register Staff</span>
          </CtaButton>
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Teaching Staff & Class Allocations"
            subtitle="Edit staff details or assign classes and subjects."
            badge={`${filteredTeachers.length} teaching staff`}
            selectedCount={selection.selectedCount}
            bulkActions={
              <button
                type="button"
                onClick={selection.clearSelection}
                className="text-xs font-bold text-ink-secondary hover:text-brand-900 transition-colors px-1 cursor-pointer"
              >
                Clear
              </button>
            }
          >
            {filteredTeachers.length === 0 ? (
              <AdminEmptyState
                title="No Teaching Staff Found"
                description="Register a staff member or clear your search filters."
                icon={<Users className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminTableHead className="w-10">
                      <AdminCheckbox
                        aria-label="Select all teachers"
                        checked={selection.allSelected}
                        indeterminate={selection.someSelected}
                        onChange={(e) => selection.toggleAll(e.target.checked)}
                      />
                    </AdminTableHead>
                    <AdminSortableTableHead
                      label="Staff Member"
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
                      label="Role, Classes & Subjects"
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
                  {filteredTeachers.map((tch) => (
                    <AdminTableRow
                      key={tch.id}
                      isSelected={selection.isSelected(tch.id)}
                    >
                      <AdminTableCell className="w-10">
                        <AdminCheckbox
                          aria-label={`Select ${tch.name}`}
                          checked={selection.isSelected(tch.id)}
                          onChange={() => selection.toggleOne(tch.id)}
                        />
                      </AdminTableCell>
                      <AdminTableCell>
                        <div className="flex items-center gap-2.5">
                          <AvatarBadge
                            name={tch.name}
                            avatarUrl={tch.avatarUrl}
                            size="sm"
                          />
                          <div>
                            <p className="font-display font-extrabold text-brand-950">
                              {tch.name}
                            </p>
                            <p className="text-[11px] font-medium text-ink-secondary">
                              {tch.staffId} · {tch.assignedRole ?? "Teacher"}
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
                                  store.subjects.find((s) => s.id === sid)
                                    ?.title ?? sid
                              )
                              .join(", ") || "None"}
                          </p>
                        </div>
                      </AdminTableCell>
                      <AdminTableCell>
                        <AdminStatusPill
                          status={tch.status}
                          variant={
                            tch.status === "active" ? "success" : "danger"
                          }
                        />
                      </AdminTableCell>
                      <AdminTableCell className="text-right">
                        <AdminActionMenu
                          ariaLabel={`Actions for ${tch.name}`}
                          items={[
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
                              id: "edit-tch",
                              label: "Edit Staff Details",
                              icon: <Edit3 className="h-3.5 w-3.5" />,
                              onClick: () => openEditTeacher(tch),
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
                                  tch.status === "active"
                                    ? "inactive"
                                    : "active"
                                ),
                            },
                            {
                              id: "del-tch",
                              label: "Remove Staff",
                              icon: <Trash2 className="h-3.5 w-3.5" />,
                              variant: "danger",
                              dividerBefore: true,
                              onClick: () => setDeleteTarget(tch),
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

      <AssignTeacherModal
        target={assignTeacherTarget}
        classesDraft={teacherClassesDraft}
        setClassesDraft={setTeacherClassesDraft}
        subjectsDraft={teacherSubjectsDraft}
        setSubjectsDraft={setTeacherSubjectsDraft}
        classArms={store.classArms}
        subjects={store.subjects}
        onClose={() => setAssignTeacherTarget(null)}
        onConfirm={() => {
          if (!assignTeacherTarget) return;
          assignTeacherAssignments(
            assignTeacherTarget.id,
            teacherClassesDraft,
            teacherSubjectsDraft
          );
          const teacherName = assignTeacherTarget.name;
          setAssignTeacherTarget(null);
          setFeedbackModal({
            variant: "success",
            eyebrow: "Saved",
            title: "Teaching Assignments Updated",
            description: `Updated class arms and subjects for ${teacherName}.`,
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
        title="Remove Staff Account?"
        description={
          deleteTarget
            ? `Permanently remove "${deleteTarget.name}" from the staff directory?`
            : undefined
        }
        confirmLabel="Confirm Delete"
        onConfirm={() => {
          if (deleteTarget) {
            deleteTeacherAccount(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
