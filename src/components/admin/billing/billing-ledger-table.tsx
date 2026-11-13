"use client";

import * as React from "react";
import {
  CheckCircle2,
  CreditCard,
  Lock,
  Pencil,
  Plus,
  RotateCcw,
  Send,
  Trash2,
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
import { AdminSearchInput } from "@/components/admin/ui/admin-form-controls";
import {
  AdminSegmentedTabs,
  type AdminTabOption,
} from "@/components/admin/ui/admin-segmented-tabs";
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import type { PaymentRow } from "@/components/admin/mock-data";
import { formatCurrency } from "@/lib/utils";
import type { EscrowFilter, EscrowStateOption } from "./types";

export interface PaymentsEscrowTableProps {
  filteredPayments: PaymentRow[];
  totalFilteredCount: number;
  selectedIds: string[];
  tabOptions: ReadonlyArray<AdminTabOption<EscrowFilter>>;
  filter: EscrowFilter;
  onFilterChange: (f: EscrowFilter) => void;
  search: string;
  onSearchChange: (s: string) => void;
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
  onClearSelection: () => void;
  onBatchRelease: () => void;
  onBatchDelete: () => void;
  onAddNewPayment: () => void;
  onEditPayment: (pay: PaymentRow) => void;
  onReleaseEscrow: (paymentId: string) => void;
  onUpdateEscrowState: (paymentId: string, state: EscrowStateOption) => void;
  onDeletePayment: (paymentId: string) => void;
  releasingId: string | null;
}

export function PaymentsEscrowTable({
  filteredPayments,
  totalFilteredCount,
  selectedIds,
  tabOptions,
  filter,
  onFilterChange,
  search,
  onSearchChange,
  onToggleSelectAll,
  onToggleSelectOne,
  onClearSelection,
  onBatchRelease,
  onBatchDelete,
  onAddNewPayment,
  onEditPayment,
  onReleaseEscrow,
  onUpdateEscrowState,
  onDeletePayment,
  releasingId,
}: PaymentsEscrowTableProps) {
  const allSelected =
    filteredPayments.length > 0 &&
    filteredPayments.every((p) => selectedIds.includes(p.id));

  const someSelected =
    filteredPayments.some((p) => selectedIds.includes(p.id)) && !allSelected;

  return (
    <>
      {/* Segmented Filter Tabs & Search */}
      <div className="mt-6 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <AdminSegmentedTabs
          options={tabOptions}
          value={filter}
          onChange={onFilterChange}
          ariaLabel="Filter invoices by settlement state"
          layoutId="billing-invoices-tab-pill"
        />

        <AdminSearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search invoice ref, school, or plan..."
        />
      </div>

      {/* Billing Ledger Table with Checkboxes & Essential Columns */}
      <div className="mt-4">
        <AdminDataTable
          title="School License & Invoice Settlement Ledger"
          subtitle="Track school term license invoices, campus allocations, and confirm settlements from the menu."
          badge={`${totalFilteredCount} Showing`}
          selectedCount={selectedIds.length}
          bulkActions={
            <>
              <CtaButton
                variant="secondary"
                size="xs"
                onClick={onBatchRelease}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-accent-success" />
                <span>Activate Selected</span>
              </CtaButton>
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
                className="text-xs font-bold text-ink-secondary hover:text-brand-900 transition-colors px-1"
              >
                Clear
              </button>
            </>
          }
          headerAction={
            <CtaButton
              variant="primary"
              size="xs"
              onClick={onAddNewPayment}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Invoice</span>
            </CtaButton>
          }
        >
          {filteredPayments.length === 0 ? (
            <AdminEmptyState
              title="No License Invoices Found"
              description="Record a new school license invoice in the inline form above or clear your active search filter."
              icon={<CreditCard className="h-5 w-5 text-accent-sky" />}
              action={
                <CtaButton
                  variant="primary"
                  size="xs"
                  onClick={onAddNewPayment}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Record License Invoice</span>
                </CtaButton>
              }
            />
          ) : (
            <AdminTable>
              <AdminTableHeader>
                <AdminTableRow>
                  <AdminTableHead className="w-10">
                    <AdminCheckbox
                      aria-label="Select all invoices"
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={onToggleSelectAll}
                    />
                  </AdminTableHead>
                  <AdminTableHead>Invoice Reference</AdminTableHead>
                  <AdminTableHead>School &amp; License Plan</AdminTableHead>
                  <AdminTableHead>Invoice Amount</AdminTableHead>
                  <AdminTableHead>Settlement</AdminTableHead>
                  <AdminTableHead className="text-right">
                    Actions
                  </AdminTableHead>
                </AdminTableRow>
              </AdminTableHeader>
              <AdminTableBody>
                {filteredPayments.map((pay) => (
                  <AdminTableRow
                    key={pay.id}
                    isSelected={selectedIds.includes(pay.id)}
                  >
                    <AdminTableCell className="w-10">
                      <AdminCheckbox
                        aria-label={`Select invoice ${pay.reference}`}
                        checked={selectedIds.includes(pay.id)}
                        onChange={() => onToggleSelectOne(pay.id)}
                      />
                    </AdminTableCell>

                    <AdminTableCell className="whitespace-nowrap">
                      <div className="font-mono text-[11px] font-extrabold text-brand-700">
                        {pay.reference}
                      </div>
                      <div className="mt-0.5 inline-flex items-center gap-1">
                        <PillBadge
                          tone="sky"
                          className="px-1.5 py-0.2 text-[9px] uppercase font-bold"
                        >
                          {pay.paymentMethod.replace("_", " ")}
                        </PillBadge>
                        <span className="font-mono text-[10px] text-ink-muted">
                          {pay.bachsTransactionId
                            ? `· ${pay.bachsTransactionId}`
                            : ""}
                        </span>
                      </div>
                    </AdminTableCell>

                    <AdminTableCell className="whitespace-nowrap">
                      <div className="font-display text-xs font-extrabold text-brand-950">
                        {pay.clientName}
                      </div>
                      <div className="text-[11px] font-semibold text-brand-600">
                        Plan: {pay.artisanName}
                      </div>
                    </AdminTableCell>

                    <AdminTableCell className="whitespace-nowrap">
                      <div className="font-display text-xs sm:text-sm font-extrabold text-brand-950">
                        {formatCurrency(pay.amount, pay.currency)}
                      </div>
                      <div className="text-[10px] font-semibold text-ink-muted">
                        Deployment 90%: {formatCurrency(pay.artisanPayout, pay.currency)}
                      </div>
                    </AdminTableCell>

                    <AdminTableCell>
                      <AdminStatusPill status={pay.escrowStatus} />
                    </AdminTableCell>

                    <AdminTableCell className="text-right whitespace-nowrap">
                      <AdminActionMenu
                        label={`Ref ${pay.reference}`}
                        ariaLabel={`Actions for invoice ${pay.reference}`}
                        items={[
                          {
                            id: "edit",
                            label: "Edit Invoice in Form",
                            description: "Adjust amount, channel, or state",
                            icon: <Pencil className="h-3.5 w-3.5" />,
                            variant: "primary",
                            onClick: () => onEditPayment(pay),
                          },
                          {
                            id: "release",
                            label: "Activate License Settlement",
                            description: "Confirm term license activation",
                            icon: <Send className="h-3.5 w-3.5" />,
                            disabled:
                              releasingId === pay.id ||
                              pay.escrowStatus === "released",
                            onClick: () => onReleaseEscrow(pay.id),
                          },
                          {
                            id: "hold",
                            label: "Mark Pending Settlement",
                            description: "Hold activation pending verification",
                            icon: <Lock className="h-3.5 w-3.5" />,
                            disabled: pay.escrowStatus === "held",
                            onClick: () =>
                              onUpdateEscrowState(pay.id, "held"),
                          },
                          {
                            id: "refund",
                            label: "Issue Credit / Refund",
                            description: "Return invoice credit to school",
                            icon: <RotateCcw className="h-3.5 w-3.5" />,
                            disabled: pay.escrowStatus === "refunded",
                            onClick: () =>
                              onUpdateEscrowState(pay.id, "refunded"),
                          },
                          {
                            id: "delete",
                            label: "Delete Record",
                            description: "Remove from billing ledger",
                            icon: <Trash2 className="h-3.5 w-3.5" />,
                            variant: "danger",
                            dividerBefore: true,
                            onClick: () => onDeletePayment(pay.id),
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
    </>
  );
}

