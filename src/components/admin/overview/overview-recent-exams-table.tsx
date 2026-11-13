"use client";

import {
  ArrowUpRight,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  Pencil,
  Play,
  Scale,
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
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import { CtaButton } from "@/components/landing/ui/cta-button";
import type { BookingRow } from "@/components/admin/mock-data";
import { formatCurrency } from "@/lib/utils";

export interface OverviewRecentBookingsTableProps {
  bookings: BookingRow[];
  selectedIds: string[];
  onToggleSelectAll: (checked: boolean, visibleItems: BookingRow[]) => void;
  onToggleSelectOne: (id: string) => void;
  onClearSelection: () => void;
  onMarkSelectedCompleted: () => void;
  onRemoveSelected: () => void;
  onUpdateBookingStatus: (id: string, status: string) => Promise<void>;
}

export function OverviewRecentBookingsTable({
  bookings,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectOne,
  onClearSelection,
  onMarkSelectedCompleted,
  onRemoveSelected,
  onUpdateBookingStatus,
}: OverviewRecentBookingsTableProps) {
  const visibleBookings = bookings.slice(0, 6);
  const allSelected =
    visibleBookings.length > 0 &&
    visibleBookings.every((b) => selectedIds.includes(b.id));
  const someSelected =
    visibleBookings.some((b) => selectedIds.includes(b.id)) && !allSelected;

  return (
    <AdminDataTable
      title="Recent CBT Exam Sessions"
      subtitle="Live exam sittings synced from Examinify student & lab terminals."
      badge={`${bookings.length} Total`}
      selectedCount={selectedIds.length}
      bulkActions={
        <>
          <CtaButton
            variant="secondary"
            size="xs"
            onClick={onMarkSelectedCompleted}
          >
            <span>Mark Submitted</span>
          </CtaButton>
          <CtaButton
            variant="secondary"
            size="xs"
            className="text-accent-error hover:border-accent-error/40 hover:text-accent-error"
            onClick={onRemoveSelected}
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
        <CtaButton variant="secondary" size="xs" href="/admin/exams">
          <span>View All</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </CtaButton>
      }
    >
      {bookings.length === 0 ? (
        <AdminEmptyState
          title="No CBT Exam Sessions Yet"
          description="New student exam sittings from school labs and portals will sync here automatically."
          icon={<CalendarCheck className="h-5 w-5 text-accent-sky" />}
          action={
            <CtaButton variant="primary" size="xs" href="/admin/exams">
              Open Exams Console
            </CtaButton>
          }
        />
      ) : (
        <AdminTable>
          <AdminTableHeader>
            <AdminTableRow>
              <AdminTableHead className="w-10">
                <AdminCheckbox
                  aria-label="Select all exam sessions"
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(e) =>
                    onToggleSelectAll(e.target.checked, visibleBookings)
                  }
                />
              </AdminTableHead>
              <AdminTableHead>Exam Code</AdminTableHead>
              <AdminTableHead>Student &amp; Paper</AdminTableHead>
              <AdminTableHead>Teacher / Invigilator</AdminTableHead>
              <AdminTableHead>Term Fee</AdminTableHead>
              <AdminTableHead>Status</AdminTableHead>
              <AdminTableHead className="text-right">Actions</AdminTableHead>
            </AdminTableRow>
          </AdminTableHeader>
          <AdminTableBody>
            {visibleBookings.map((bk) => (
              <AdminTableRow
                key={bk.id}
                isSelected={selectedIds.includes(bk.id)}
              >
                <AdminTableCell className="w-10">
                  <AdminCheckbox
                    aria-label={`Select exam ${bk.bookingCode}`}
                    checked={selectedIds.includes(bk.id)}
                    onChange={() => onToggleSelectOne(bk.id)}
                  />
                </AdminTableCell>
                <AdminTableCell className="font-mono text-[11px] font-extrabold text-brand-700 whitespace-nowrap">
                  {bk.bookingCode}
                </AdminTableCell>
                <AdminTableCell className="max-w-[200px]">
                  <div className="truncate font-display text-xs font-extrabold text-brand-950">
                    {bk.clientName}
                  </div>
                  <div className="truncate text-[11px] font-semibold text-ink-secondary">
                    {bk.serviceTitle}
                  </div>
                </AdminTableCell>
                <AdminTableCell className="font-display text-xs font-bold text-ink-primary whitespace-nowrap">
                  {bk.artisanName}
                </AdminTableCell>
                <AdminTableCell className="font-display text-xs font-extrabold text-brand-600 whitespace-nowrap">
                  {formatCurrency(bk.agreedAmount)}
                </AdminTableCell>
                <AdminTableCell>
                  <AdminStatusPill status={bk.status} />
                </AdminTableCell>
                <AdminTableCell className="text-right whitespace-nowrap">
                  <AdminActionMenu
                    label={`Exam ${bk.bookingCode}`}
                    ariaLabel={`Actions for exam ${bk.bookingCode}`}
                    items={[
                      {
                        id: "manage",
                        label: "Edit & Manage in Form",
                        description: "Open in Exams Console",
                        icon: <Pencil className="h-3.5 w-3.5" />,
                        variant: "primary",
                        href: "/admin/exams",
                      },
                      {
                        id: "accept",
                        label: "Authorize Sitting",
                        description: "Approve exam room & timer",
                        icon: <CalendarCheck className="h-3.5 w-3.5" />,
                        disabled: bk.status === "accepted",
                        onClick: () => onUpdateBookingStatus(bk.id, "accepted"),
                      },
                      {
                        id: "in-progress",
                        label: "Mark In Progress",
                        description: "Candidate actively taking exam",
                        icon: <Play className="h-3.5 w-3.5" />,
                        disabled: bk.status === "in_progress",
                        onClick: () =>
                          onUpdateBookingStatus(bk.id, "in_progress"),
                      },
                      {
                        id: "complete",
                        label: "Mark Submitted",
                        description: "Finalize script & lock responses",
                        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
                        disabled: bk.status === "completed",
                        onClick: () =>
                          onUpdateBookingStatus(bk.id, "completed"),
                      },
                      {
                        id: "financials",
                        label: "Open Term Billing",
                        description: "View license fee settlement",
                        icon: <CreditCard className="h-3.5 w-3.5" />,
                        dividerBefore: true,
                        href: "/admin/billing",
                      },
                      {
                        id: "dispute",
                        label: "Open Script Appeal",
                        description: "Escalate for remark or audit",
                        icon: <Scale className="h-3.5 w-3.5" />,
                        href: "/admin/appeals",
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
  );
}

