"use client";

import * as React from "react";
import { Edit3, Plus, Power, Shield, Trash2 } from "lucide-react";
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
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type { StaffProfile } from "@/data/portal-mock-data";
import {
  createInitialStaffFormState,
  StaffRegistrationForm,
  type StaffRegistrationFormState,
} from "./staff-registration-form";

type StaffSortKey = "name" | "email" | "detail" | "status";

export function StaffWorkspace() {
  const {
    store,
    activeSessionTerm,
    saveStaffAccount,
    setStaffStatus,
    deleteStaffAccount,
  } = usePortalStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [sortKey, setSortKey] = React.useState<StaffSortKey>("name");
  const [sortDir, setSortDir] = React.useState<SortDirection>("asc");

  const staffFormRef = React.useRef<HTMLDivElement | null>(null);
  const [staffFormOpen, setStaffFormOpen] = React.useState(false);
  const [staffForm, setStaffForm] = React.useState<StaffRegistrationFormState>(
    () => createInitialStaffFormState(store.staff.length)
  );

  const [feedbackModal, setFeedbackModal] = React.useState<{
    variant: ModalVariant;
    eyebrow: string;
    title: string;
    description: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<StaffProfile | null>(
    null
  );

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : "Admin Governance";

  const scrollFormIntoView = () => {
    setTimeout(() => {
      staffFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 60);
  };

  const resetStaffForm = () => {
    setStaffForm(createInitialStaffFormState(store.staff.length));
  };

  const openAddStaff = () => {
    resetStaffForm();
    setStaffFormOpen(true);
    scrollFormIntoView();
  };

  const openEditStaff = (staff: StaffProfile) => {
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
    scrollFormIntoView();
  };

  const handleSaveStaff = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!staffForm.firstName.trim() || !staffForm.email.trim()) {
      setFeedbackModal({
        variant: "danger",
        eyebrow: "Validation Error",
        title: "Missing Required Staff Fields",
        description:
          "Please provide the staff member's first name, surname, and email address before submitting.",
      });
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
    const wasEditing = Boolean(staffForm.id);

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

    setStaffFormOpen(false);
    resetStaffForm();
    setFeedbackModal({
      variant: "success",
      eyebrow: "Operation Completed",
      title: wasEditing ? "Staff Record Updated" : "Staff Account Created",
      description: `${fullName} (${staffForm.staffCode}) has been saved to the staff & admin directory.`,
    });
  };

  const toggleSort = (key: StaffSortKey) => {
    if (sortKey === key) setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredStaff = React.useMemo(() => {
    const list = store.staff.filter((item) => {
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        (item.name ?? "").toLowerCase().includes(q) ||
        (item.email ?? "").toLowerCase().includes(q) ||
        (item.roleTitle ?? "").toLowerCase().includes(q) ||
        (item.staffCode ?? "").toLowerCase().includes(q)
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
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Users · ${termLabel}`}
        eyebrowIcon="dot"
        headline="Staff & Administrators."
        highlightWords={["Staff", "Administrators."]}
        subtitle="Create and manage administrative and support staff accounts, permission scopes, and access status."
        primaryCta={{
          label: "Add Staff / Admin",
          onClick: openAddStaff,
          variant: "primary",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "Platform Settings",
          href: "/admin/settings",
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
          staffCount={store.staff.length}
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
              placeholder="Search staff name, email, or role..."
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
            <span>Add Staff</span>
          </CtaButton>
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Administrative & Support Staff"
            subtitle="Manage staff accounts, roles, and access scopes."
            badge={`${filteredStaff.length} staff`}
          >
            {filteredStaff.length === 0 ? (
              <AdminEmptyState
                title="No Staff Accounts Found"
                description="Create a staff account or adjust your search/status filters."
                icon={<Shield className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
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
                      label="Role Title"
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
                  {filteredStaff.map((stf) => (
                    <AdminTableRow key={stf.id}>
                      <AdminTableCell>
                        <div className="flex items-center gap-2.5">
                          <AvatarBadge
                            name={stf.name}
                            avatarUrl={stf.avatarUrl}
                            size="sm"
                          />
                          <div>
                            <p className="font-display font-extrabold text-brand-950">
                              {stf.name}
                            </p>
                            <p className="text-[11px] font-medium text-ink-secondary">
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
                        <p className="font-display font-bold text-brand-950">
                          {stf.roleTitle}
                        </p>
                        <p className="line-clamp-1 text-[11px] font-medium text-ink-secondary">
                          {stf.permissions}
                        </p>
                      </AdminTableCell>
                      <AdminTableCell>
                        <AdminStatusPill
                          status={stf.status}
                          variant={
                            stf.status === "active" ? "success" : "danger"
                          }
                        />
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
                                  stf.status === "active"
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
                              onClick: () => setDeleteTarget(stf),
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
            deleteStaffAccount(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
