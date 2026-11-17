"use client";

import * as React from "react";
import { CheckCircle2, Shield, UserCheck } from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import {
  AdminSearchInput,
  AdminSelectField,
} from "@/components/admin/ui/admin-form-controls";
import { AdminSectionCard } from "@/components/admin/ui/admin-section-card";
import {
  AdminDataTable,
  AdminEmptyState,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin/ui/admin-data-table";
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import {
  AdminDialogModal,
  type ModalVariant,
} from "@/components/admin/ui/admin-dialog-modal";
import { AvatarBadge } from "@/components/portal/avatar-badge";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import {
  ASSIGNABLE_STAFF_ROLE_OPTIONS,
  STAFF_TYPE_OPTIONS,
} from "@/components/forms";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type { StaffRoleOption, StaffType } from "@/data/portal-mock-data";

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

  const [selectedStaffId, setSelectedStaffId] = React.useState<string>("");
  const [roleDraft, setRoleDraft] = React.useState<{
    staffId: string;
    role: StaffRoleOption;
  } | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [staffTypeFilter, setStaffTypeFilter] = React.useState("ALL");
  const formCardRef = React.useRef<HTMLDivElement | null>(null);

  const [feedbackModal, setFeedbackModal] = React.useState<{
    variant: ModalVariant;
    eyebrow: string;
    title: string;
    description: string;
  } | null>(null);

  const selectedStaff =
    allStaff.find((item) => item.id === selectedStaffId) ?? allStaff[0];
  const effectiveStaffId = selectedStaff?.id ?? "";
  const effectiveRole: StaffRoleOption =
    roleDraft && roleDraft.staffId === effectiveStaffId
      ? roleDraft.role
      : (selectedStaff?.role ?? "Teacher");

  const handleSelectStaff = (staffId: string) => {
    setSelectedStaffId(staffId);
    const match = allStaff.find((item) => item.id === staffId);
    if (match) {
      setRoleDraft({ staffId, role: match.role });
    }
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

    assignStaffRole(selectedStaff.id, effectiveRole);
    setRoleDraft({ staffId: selectedStaff.id, role: effectiveRole });
    setFeedbackModal({
      variant: "success",
      eyebrow: "Role Updated",
      title: "Staff Role Assigned",
      description: `${selectedStaff.name} (${selectedStaff.staffCode}) is now assigned the role of ${effectiveRole}.`,
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

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Users · ${termLabel}`}
        eyebrowIcon="dot"
        headline="Assign Staff Role."
        highlightWords={["Assign", "Role."]}
        subtitle="Select any registered staff member and assign or change their school role."
        secondaryCta={{
          label: "Back to Staff Directory",
          href: "/admin/users/staff",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <div ref={formCardRef}>
          <AdminSectionCard
            title="Assign Role to Registered Staff"
            description="Choose a staff member from the list and select the role they hold in the school."
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AdminSelectField
                  label="Select Staff *"
                  value={effectiveStaffId}
                  onChange={handleSelectStaff}
                  options={
                    allStaff.length > 0
                      ? allStaff.map((item) => ({
                          id: item.id,
                          label: `${item.name} · ${item.staffCode} (${item.staffType})`,
                        }))
                      : [{ id: "", label: "No registered staff found" }]
                  }
                />

                <AdminSelectField<StaffRoleOption>
                  label="Assign Role *"
                  value={effectiveRole}
                  onChange={(role) =>
                    setRoleDraft({ staffId: effectiveStaffId, role })
                  }
                  options={ASSIGNABLE_STAFF_ROLE_OPTIONS}
                />
              </div>

              {selectedStaff && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-surface-pearl px-4 py-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <AvatarBadge
                      name={selectedStaff.name}
                      avatarUrl={selectedStaff.avatarUrl}
                      size="sm"
                    />
                    <div>
                      <p className="font-display font-extrabold text-brand-950">
                        {selectedStaff.name}
                      </p>
                      <p className="text-[11px] font-medium text-ink-secondary">
                        {selectedStaff.staffCode} · {selectedStaff.staffType} · Current Role:{" "}
                        <span className="font-bold text-brand-800">
                          {selectedStaff.role}
                        </span>
                      </p>
                    </div>
                  </div>

                  <CtaButton
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={!effectiveStaffId}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Save Staff Role</span>
                  </CtaButton>
                </div>
              )}
            </form>
          </AdminSectionCard>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
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
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Current Staff Roles"
            subtitle="Overview of all registered staff and their assigned roles."
            badge={`${filteredStaff.length} staff`}
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
                    <AdminTableHead>Staff Member</AdminTableHead>
                    <AdminTableHead>Staff Type</AdminTableHead>
                    <AdminTableHead>Assigned Role</AdminTableHead>
                    <AdminTableHead>Status</AdminTableHead>
                    <AdminTableHead className="text-right">Action</AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredStaff.map((item) => (
                    <AdminTableRow key={item.id}>
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
                        <CtaButton
                          type="button"
                          variant="secondary"
                          size="xs"
                          onClick={() => {
                            handleSelectStaff(item.id);
                            formCardRef.current?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }}
                        >
                          Change Role
                        </CtaButton>
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
    </div>
  );
}
