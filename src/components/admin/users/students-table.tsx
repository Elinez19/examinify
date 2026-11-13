"use client";

import * as React from "react";
import {
  CheckCircle2,
  LogOut,
  Mail,
  Pencil,
  Plus,
  ShieldAlert,
  Trash2,
  Users,
} from "lucide-react";
import { AdminActionMenu } from "@/components/admin/ui/admin-action-menu";
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
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import type { CustomerRecord } from "./types";

export interface CustomersTableProps {
  filteredCustomers: CustomerRecord[];
  selectedIds: string[];
  onToggleSelectAll: (checked: boolean) => void;
  onToggleSelectOne: (id: string) => void;
  onClearSelection: () => void;
  onBatchDelete: () => void;
  onAddNewCustomer: () => void;
  onEditCustomer: (customer: CustomerRecord) => void;
  onToggleStatus: (id: string) => void;
  onRevokeSessions?: (id: string) => void;
  onResetPassword?: (id: string) => void;
  onDeleteCustomer: (id: string) => void;
}

export function CustomersTable({
  filteredCustomers,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectOne,
  onClearSelection,
  onBatchDelete,
  onAddNewCustomer,
  onEditCustomer,
  onToggleStatus,
  onRevokeSessions,
  onResetPassword,
  onDeleteCustomer,
}: CustomersTableProps) {
  const allSelected =
    filteredCustomers.length > 0 &&
    filteredCustomers.every((c) => selectedIds.includes(c.id));

  const someSelected =
    filteredCustomers.some((c) => selectedIds.includes(c.id)) && !allSelected;

  return (
    <AdminDataTable
      title="Student Accounts Directory"
      subtitle="Manage enrolled students, monitor exam history, and use the menu to edit profiles or update account standing."
      badge={`${filteredCustomers.length} Students`}
      selectedCount={selectedIds.length}
      bulkActions={
        <>
          <CtaButton
            variant="secondary"
            size="xs"
            className="text-accent-error hover:border-accent-error/40 hover:text-accent-error"
            onClick={onBatchDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Remove Selected</span>
          </CtaButton>
          <button
            type="button"
            onClick={onClearSelection}
            className="text-xs font-bold text-ink-secondary hover:text-brand-900 transition-colors px-1 cursor-pointer"
          >
            Clear
          </button>
        </>
      }
      headerAction={
        <CtaButton variant="primary" size="xs" onClick={onAddNewCustomer}>
          <Plus className="h-3.5 w-3.5" />
          <span>Enroll Student</span>
        </CtaButton>
      }
    >
      {filteredCustomers.length === 0 ? (
        <AdminEmptyState
          title="No Matching Students"
          description="Try clearing your search query or enroll a new student using the inline form above."
          icon={<Users className="h-5 w-5 text-accent-sky" />}
        />
      ) : (
        <AdminTable>
          <AdminTableHeader>
            <AdminTableRow>
              <AdminTableHead className="w-10">
                <AdminCheckbox
                  aria-label="Select all students"
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(e) => onToggleSelectAll(e.target.checked)}
                />
              </AdminTableHead>
              <AdminTableHead>Student</AdminTableHead>
              <AdminTableHead>Class / Wing</AdminTableHead>
              <AdminTableHead>Exam History</AdminTableHead>
              <AdminTableHead>Account Standing</AdminTableHead>
              <AdminTableHead className="text-right">Actions</AdminTableHead>
            </AdminTableRow>
          </AdminTableHeader>
          <AdminTableBody>
            {filteredCustomers.map((cust) => {
              const isSuspended = cust.status === "suspended" || cust.banned;
              return (
                <AdminTableRow
                  key={cust.id}
                  isSelected={selectedIds.includes(cust.id)}
                >
                  <AdminTableCell className="w-10">
                    <AdminCheckbox
                      aria-label={`Select student ${cust.name}`}
                      checked={selectedIds.includes(cust.id)}
                      onChange={() => onToggleSelectOne(cust.id)}
                    />
                  </AdminTableCell>

                  <AdminTableCell className="whitespace-nowrap">
                    <div className="font-display text-xs sm:text-sm font-extrabold text-brand-950">
                      {cust.name}
                    </div>
                    <div className="text-[11px] font-semibold text-brand-700">
                      {cust.email} · {cust.phone}
                    </div>
                  </AdminTableCell>

                  <AdminTableCell className="font-display text-xs font-bold text-brand-950 whitespace-nowrap">
                    {cust.city}
                  </AdminTableCell>

                  <AdminTableCell className="whitespace-nowrap">
                    <PillBadge
                      tone="sky"
                      className="px-2.5 py-0.5 text-[10px]"
                    >
                      {cust.bookingsCount} Exams
                    </PillBadge>
                  </AdminTableCell>

                  <AdminTableCell>
                    <AdminStatusPill status={cust.status} />
                  </AdminTableCell>

                  <AdminTableCell className="text-right whitespace-nowrap">
                    <AdminActionMenu
                      label={`Manage ${cust.name}`}
                      ariaLabel={`Actions for student ${cust.name}`}
                      items={[
                        {
                          id: "edit",
                          label: "Edit Student in Form",
                          description: "Load profile into inline form",
                          icon: <Pencil className="h-3.5 w-3.5" />,
                          variant: "primary",
                          onClick: () => onEditCustomer(cust),
                        },
                        {
                          id: "toggle-status",
                          label: isSuspended
                            ? "Reactivate Student"
                            : "Suspend Account",
                          description: isSuspended
                            ? "Restore CBT exam access"
                            : "Revoke sessions & pause exam access",
                          icon: isSuspended ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-accent-success" />
                          ) : (
                            <ShieldAlert className="h-3.5 w-3.5 text-accent-warm" />
                          ),
                          onClick: () => onToggleStatus(cust.id),
                        },
                        ...(onRevokeSessions
                          ? [
                              {
                                id: "revoke-sessions",
                                label: "Force Sign-Out",
                                description: "Invalidate mobile & web sessions",
                                icon: <LogOut className="h-3.5 w-3.5" />,
                                onClick: () => onRevokeSessions(cust.id),
                              },
                            ]
                          : []),
                        ...(onResetPassword
                          ? [
                              {
                                id: "reset-password",
                                label: "Send Password Reset Link",
                                description: "Email recovery link",
                                icon: <Mail className="h-3.5 w-3.5" />,
                                onClick: () => onResetPassword(cust.id),
                              },
                            ]
                          : []),
                        {
                          id: "delete",
                          label: "Remove Student Record",
                          description: "Delete student profile",
                          icon: <Trash2 className="h-3.5 w-3.5" />,
                          variant: "danger",
                          dividerBefore: true,
                          onClick: () => onDeleteCustomer(cust.id),
                        },
                      ]}
                    />
                  </AdminTableCell>
                </AdminTableRow>
              );
            })}
          </AdminTableBody>
        </AdminTable>
      )}
    </AdminDataTable>
  );
}
