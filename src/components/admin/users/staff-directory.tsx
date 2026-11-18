"use client";

import * as React from "react";
import { Edit3, Plus, Power, Shield, Trash2, UserCheck } from "lucide-react";
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
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { STAFF_TYPE_OPTIONS } from "@/components/forms";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import { useTableSelection } from "@/hooks/portal/use-table-selection";
import {
  isTeachingStaffRole,
  type AccountStatus,
  type StaffProfile,
  type StaffRoleOption,
  type StaffType,
  type TeacherProfile,
} from "@/data/portal-mock-data";
import {
  createInitialStaffFormState,
  StaffRegistrationForm,
  staffRecordToFormState,
  type StaffRegistrationFormState,
} from "./staff-registration-form";
import { AssignTeacherModal } from "./assign-teacher-modal";

type StaffSortKey = "name" | "email" | "detail" | "status";

interface UnifiedStaffRow {
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

export function StaffDirectory() {
  const {
    store,
    activeSessionTerm,
    saveUnifiedStaff,
    setAnyStaffStatus,
    assignTeacherAssignments,
    deleteAnyStaffAccount,
  } = usePortalStore();

  const totalStaffCount = store.teachers.length + store.staff.length;

  const [searchQuery, setSearchQuery] = React.useState("");
  const [staffTypeFilter, setStaffTypeFilter] = React.useState("ALL");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [sortKey, setSortKey] = React.useState<StaffSortKey>("name");
  const [sortDir, setSortDir] = React.useState<SortDirection>("asc");

  const staffFormRef = React.useRef<HTMLDivElement | null>(null);
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
  const [deleteTarget, setDeleteTarget] =
    React.useState<UnifiedStaffRow | null>(null);

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : "Staff Records";

  const scrollFormIntoView = () => {
    setTimeout(() => {
      staffFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 60);
  };

  const resetStaffForm = () => {
    setStaffForm(createInitialStaffFormState(totalStaffCount));
  };

  const openAddStaff = () => {
    resetStaffForm();
    setStaffFormOpen(true);
    scrollFormIntoView();
  };

  const openEditStaff = (row: UnifiedStaffRow) => {
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
      description: `${fullName} (${staffForm.staffCode}) has been saved to the staff directory.`,
    });
  };

  const toggleSort = (key: StaffSortKey) => {
    if (sortKey === key) setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const allStaffRows = React.useMemo<UnifiedStaffRow[]>(() => {
    const teacherRows: UnifiedStaffRow[] = store.teachers.map((t) => ({
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
    const staffRows: UnifiedStaffRow[] = store.staff.map((s) => ({
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

  const q = searchQuery.trim().toLowerCase();
  const filteredStaff = React.useMemo(() => {
    const list = allStaffRows.filter((item) => {
      if (staffTypeFilter !== "ALL" && item.staffType !== staffTypeFilter) {
        return false;
      }
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
  }, [allStaffRows, q, sortDir, sortKey, staffTypeFilter, statusFilter]);

  const selection = useTableSelection(filteredStaff.map((row) => row.id));

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Users · ${termLabel}`}
        eyebrowIcon="dot"
        headline="School Staff Directory."
        highlightWords={["Staff", "Directory."]}
        subtitle="Register and manage all school staff — teachers, administrators, and support staff — using one simple registration form."
        primaryCta={{
          label: "Register Staff",
          onClick: openAddStaff,
          variant: "primary",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "Assign Staff Role",
          href: "/admin/users/assign-role",
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
              placeholder="Search staff name, ID, email, or role..."
            />
            <AdminSelectField
              variant="filter"
              aria-label="Filter staff type"
              value={staffTypeFilter}
              onChange={setStaffTypeFilter}
              options={[
                { id: "ALL", label: "All Staff Types" },
                ...STAFF_TYPE_OPTIONS,
              ]}
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
            onClick={openAddStaff}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Register Staff</span>
          </CtaButton>
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="All Registered Staff"
            subtitle="Academic and Non-Academic school staff accounts."
            badge={`${filteredStaff.length} staff`}
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
            {filteredStaff.length === 0 ? (
              <AdminEmptyState
                title="No Staff Accounts Found"
                description="Register a new staff member or clear your search filters."
                icon={<Shield className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminTableHead className="w-10">
                      <AdminCheckbox
                        aria-label="Select all staff"
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
                      label="Staff Type & Role"
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
                  {filteredStaff.map((row) => (
                    <AdminTableRow
                      key={row.id}
                      isSelected={selection.isSelected(row.id)}
                    >
                      <AdminTableCell className="w-10">
                        <AdminCheckbox
                          aria-label={`Select ${row.name}`}
                          checked={selection.isSelected(row.id)}
                          onChange={() => selection.toggleOne(row.id)}
                        />
                      </AdminTableCell>
                      <AdminTableCell>
                        <div className="flex items-center gap-2.5">
                          <AvatarBadge
                            name={row.name}
                            avatarUrl={row.avatarUrl}
                            size="sm"
                          />
                          <div>
                            <p className="font-display font-extrabold text-brand-950">
                              {row.name}
                            </p>
                            <p className="font-mono text-[11px] font-medium text-ink-secondary">
                              {row.staffCode}
                            </p>
                          </div>
                        </div>
                      </AdminTableCell>
                      <AdminTableCell className="font-medium text-brand-800">
                        {row.email}
                      </AdminTableCell>
                      <AdminTableCell>
                        <div className="flex flex-wrap items-center gap-2">
                          <PillBadge
                            tone={row.staffType === "Academic" ? "sky" : "porcelain"}
                            className="px-2.5 py-0.5 text-[11px]"
                          >
                            {row.staffType}
                          </PillBadge>
                          <span className="font-display text-xs font-extrabold text-brand-950">
                            {row.role}
                          </span>
                        </div>
                        {row.teacherData &&
                          row.teacherData.assignedClasses.length > 0 && (
                            <p className="mt-1 text-[11px] font-medium text-ink-secondary">
                              Classes: {row.teacherData.assignedClasses.join(", ")}
                            </p>
                          )}
                      </AdminTableCell>
                      <AdminTableCell>
                        <AdminStatusPill
                          status={row.status}
                          variant={
                            row.status === "active" ? "success" : "danger"
                          }
                        />
                      </AdminTableCell>
                      <AdminTableCell className="text-right">
                        <AdminActionMenu
                          ariaLabel={`Actions for ${row.name}`}
                          items={[
                            ...(row.teacherData && isTeachingStaffRole(row.role)
                              ? [
                                  {
                                    id: "assign-cls-sub",
                                    label: "Assign Classes & Subjects",
                                    icon: <UserCheck className="h-3.5 w-3.5" />,
                                    variant: "primary" as const,
                                    onClick: () => {
                                      setTeacherClassesDraft(
                                        row.teacherData!.assignedClasses
                                      );
                                      setTeacherSubjectsDraft(
                                        row.teacherData!.assignedSubjectIds
                                      );
                                      setAssignTeacherTarget(row.teacherData!);
                                    },
                                  },
                                ]
                              : []),
                            {
                              id: "edit-stf",
                              label: "Edit Staff Details",
                              icon: <Edit3 className="h-3.5 w-3.5" />,
                              onClick: () => openEditStaff(row),
                            },
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
                                  row.status === "active"
                                    ? "inactive"
                                    : "active"
                                ),
                            },
                            {
                              id: "del-stf",
                              label: "Remove Staff",
                              icon: <Trash2 className="h-3.5 w-3.5" />,
                              variant: "danger",
                              dividerBefore: true,
                              onClick: () => setDeleteTarget(row),
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
            deleteAnyStaffAccount(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
