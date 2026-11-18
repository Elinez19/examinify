"use client";

import * as React from "react";
import { Plus, Shield, UserCheck } from "lucide-react";
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
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
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
import type { StaffRoleOption, StaffType } from "@/data/portal-mock-data";
import { AssignStaffRoleModal } from "./assign-staff-role-modal";

interface UnifiedStaffItem {
  id: string;
  name: string;
  staffCode: string;
  email: string;
  staffType: StaffType;
  role: StaffRoleOption;
  avatarUrl?: string;
  status: "active" | "inactive" | "pending";
}

export function AssignStaffRoleView() {
  const { store, activeSessionTerm, assignStaffRole } = usePortalStore();

  const allStaff = React.useMemo<UnifiedStaffItem[]>(() => {
    const teacherItems: UnifiedStaffItem[] = store.teachers.map((t) => ({
      id: t.id,
      name: t.name,
      staffCode: t.staffId,
      email: t.email,
      staffType: t.staffType ?? "Academic",
      role: t.assignedRole ?? "Teacher",
      avatarUrl: t.avatarUrl,
      status: t.status,
    }));
    const staffItems: UnifiedStaffItem[] = store.staff.map((s) => ({
      id: s.id,
      name: s.name,
      staffCode: s.staffCode ?? `STF/${s.id.slice(-3).toUpperCase()}`,
      email: s.email,
      staffType: s.staffType ?? "Non-Academic",
      role: s.assignedRole ?? "Staff",
      avatarUrl: s.avatarUrl,
      status: s.status,
    }));
    return [...teacherItems, ...staffItems].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [store.staff, store.teachers]);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedStaffId, setSelectedStaffId] = React.useState<string>("");
  const [selectedRole, setSelectedRole] = React.useState<StaffRoleOption | "">("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [staffTypeFilter, setStaffTypeFilter] = React.useState("ALL");

  const [feedbackModal, setFeedbackModal] = React.useState<{
    variant: ModalVariant;
    eyebrow: string;
    title: string;
    description: string;
  } | null>(null);

  const selectedStaff =
    allStaff.find((item) => item.id === selectedStaffId) ?? null;

  const handleSelectStaff = (staffId: string) => {
    setSelectedStaffId(staffId);
    const match = allStaff.find((item) => item.id === staffId);
    setSelectedRole(match ? match.role : "");
  };

  const openAssignModal = (staffId?: string) => {
    if (staffId) {
      handleSelectStaff(staffId);
    } else {
      setSelectedStaffId("");
      setSelectedRole("");
    }
    setModalOpen(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedStaff) {
      setFeedbackModal({
        variant: "danger",
        eyebrow: "No Staff Selected",
        title: "Please Select a Staff Member",
        description: "Choose a registered staff member before assigning a role.",
      });
      return;
    }

    if (!selectedRole) {
      setFeedbackModal({
        variant: "danger",
        eyebrow: "No Role Selected",
        title: "Please Select a Role",
        description: "Choose a role before saving.",
      });
      return;
    }

    assignStaffRole(selectedStaff.id, selectedRole);
    setModalOpen(false);
    setFeedbackModal({
      variant: "success",
      eyebrow: "Role Updated",
      title: "Staff Role Assigned",
      description: `${selectedStaff.name} (${selectedStaff.staffCode}) is now assigned the role of ${selectedRole}.`,
    });
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredStaff = React.useMemo(() => {
    return allStaff.filter((item) => {
      if (staffTypeFilter !== "ALL" && item.staffType !== staffTypeFilter) {
        return false;
      }
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.staffCode.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q)
      );
    });
  }, [allStaff, q, staffTypeFilter]);

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : "Staff Directory";

  const selection = useTableSelection(filteredStaff.map((item) => item.id));

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Users · ${termLabel}`}
        eyebrowIcon="dot"
        headline="Assign Staff Role."
        highlightWords={["Assign", "Role."]}
        subtitle="Select any registered staff member and assign or change their school role."
        primaryCta={{
          label: "Assign Staff Role",
          onClick: () => openAssignModal(),
          variant: "primary",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "Back to Staff Directory",
          href: "/admin/users/staff",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <div className="flex flex-wrap items-center justify-between gap-3">
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
          </div>
          <CtaButton
            type="button"
            variant="primary"
            size="sm"
            onClick={() => openAssignModal()}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Assign Role</span>
          </CtaButton>
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Current Staff Roles"
            subtitle="Overview of all registered staff and their assigned roles."
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
                title="No Staff Found"
                description="Register staff in the Staff Directory or clear your search filters."
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
                    <AdminTableHead>Staff Member</AdminTableHead>
                    <AdminTableHead>Staff Type</AdminTableHead>
                    <AdminTableHead>Assigned Role</AdminTableHead>
                    <AdminTableHead>Status</AdminTableHead>
                    <AdminTableHead className="text-right">
                      Actions
                    </AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredStaff.map((item) => (
                    <AdminTableRow
                      key={item.id}
                      isSelected={selection.isSelected(item.id)}
                    >
                      <AdminTableCell className="w-10">
                        <AdminCheckbox
                          aria-label={`Select ${item.name}`}
                          checked={selection.isSelected(item.id)}
                          onChange={() => selection.toggleOne(item.id)}
                        />
                      </AdminTableCell>
                      <AdminTableCell>
                        <div className="flex items-center gap-2.5">
                          <AvatarBadge
                            name={item.name}
                            avatarUrl={item.avatarUrl}
                            size="sm"
                          />
                          <div>
                            <p className="font-display font-extrabold text-brand-950">
                              {item.name}
                            </p>
                            <p className="text-[11px] font-medium text-ink-secondary">
                              {item.staffCode} · {item.email}
                            </p>
                          </div>
                        </div>
                      </AdminTableCell>
                      <AdminTableCell>
                        <PillBadge
                          tone={item.staffType === "Academic" ? "sky" : "porcelain"}
                          className="px-2.5 py-0.5 text-[11px]"
                        >
                          {item.staffType}
                        </PillBadge>
                      </AdminTableCell>
                      <AdminTableCell>
                        <span className="inline-flex items-center gap-1.5 font-display text-xs font-extrabold text-brand-900">
                          <UserCheck className="h-3.5 w-3.5 text-brand-600" />
                          {item.role}
                        </span>
                      </AdminTableCell>
                      <AdminTableCell>
                        <AdminStatusPill
                          status={item.status}
                          variant={
                            item.status === "active" ? "success" : "danger"
                          }
                        />
                      </AdminTableCell>
                      <AdminTableCell className="text-right">
                        <AdminActionMenu
                          ariaLabel={`Actions for ${item.name}`}
                          items={[
                            {
                              id: "change-role",
                              label: "Change Role",
                              icon: <UserCheck className="h-3.5 w-3.5" />,
                              variant: "primary",
                              onClick: () => openAssignModal(item.id),
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

      <AssignStaffRoleModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        staffOptions={allStaff}
        selectedStaffId={selectedStaffId}
        onChangeStaff={handleSelectStaff}
        selectedRole={selectedRole}
        onChangeRole={setSelectedRole}
        onSubmit={handleSubmit}
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
    </div>
  );
}
