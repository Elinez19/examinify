"use client";

import * as React from "react";
import {
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Lock,
  Pencil,
  Play,
  Plus,
  Trash2,
  XCircle,
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
import type { BookingRow } from "@/components/admin/mock-data";
import { formatCurrency } from "@/lib/utils";
import type { BookingStatusFilter } from "./types";

export interface BookingDispatchTableProps {
  filteredBookings: BookingRow[];
  totalFilteredCount: number;
  selectedIds: string[];
  tabOptions: ReadonlyArray<AdminTabOption<BookingStatusFilter>>;
  statusFilter: BookingStatusFilter;
  onStatusFilterChange: (status: BookingStatusFilter) => void;
  search: string;
  onSearchChange: (search: string) => void;
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
  onClearSelection: () => void;
  onBatchComplete: () => void;
  onBatchDelete: () => void;
  onAddNewBooking: () => void;
  onEditBooking: (bk: BookingRow) => void;
  onUpdateBookingStatus: (
    id: string,
    patch: { status?: string; paymentStatus?: string }
  ) => void;
  onDeleteBooking: (id: string) => void;
  busyId: string | null;
}

export function BookingDispatchTable({
  filteredBookings,
  totalFilteredCount,
  selectedIds,
  tabOptions,
  statusFilter,
  onStatusFilterChange,
  search,
  onSearchChange,
  onToggleSelectAll,
  onToggleSelectOne,
  onClearSelection,
  onBatchComplete,
  onBatchDelete,
  onAddNewBooking,
  onEditBooking,
  onUpdateBookingStatus,
  onDeleteBooking,
  busyId,
}: BookingDispatchTableProps) {
  const allSelected =
    filteredBookings.length > 0 &&
    filteredBookings.every((b) => selectedIds.includes(b.id));

  const someSelected =
    filteredBookings.some((b) => selectedIds.includes(b.id)) && !allSelected;

  return (
    <>
      {/* Segmented Filter Tabs & Search Input */}
      <div className="mt-6 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <AdminSegmentedTabs
          options={tabOptions}
          value={statusFilter}
          onChange={onStatusFilterChange}
          ariaLabel="Filter exam sessions by status"
          layoutId="exams-status-tab-pill"
        />

        <AdminSearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search exam code, student, or invigilator..."
        />
      </div>

      {/* Exam Sessions Queue Table with Checkboxes & Essential Columns */}
      <div className="mt-4">
        <AdminDataTable
          title="CBT Exam Sessions & Invigilation Queue"
          subtitle="Monitor scheduled CBT papers, student readiness, and use the menu to update delivery status or pause exams."
          badge={`${totalFilteredCount} Showing`}
          selectedCount={selectedIds.length}
          bulkActions={
            <>
              <CtaButton
                variant="secondary"
                size="xs"
                onClick={onBatchComplete}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-accent-success" />
                <span>Mark Submitted</span>
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
              onClick={onAddNewBooking}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Schedule Exam</span>
            </CtaButton>
          }
        >
          {filteredBookings.length === 0 ? (
            <AdminEmptyState
              title="No Exam Sessions Found"
              description="Schedule a new CBT session in the inline form above or clear your active status filter."
              icon={<CalendarCheck className="h-5 w-5 text-accent-sky" />}
              action={
                <CtaButton
                  variant="primary"
                  size="xs"
                  onClick={onAddNewBooking}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>New Exam Session</span>
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
                      onChange={onToggleSelectAll}
                    />
                  </AdminTableHead>
                  <AdminTableHead>Session Code</AdminTableHead>
                  <AdminTableHead>Candidate &amp; Invigilator</AdminTableHead>
                  <AdminTableHead>Exam Paper</AdminTableHead>
                  <AdminTableHead>Schedule</AdminTableHead>
                  <AdminTableHead>Session Fee</AdminTableHead>
                  <AdminTableHead>Status</AdminTableHead>
                  <AdminTableHead className="text-right">
                    Actions
                  </AdminTableHead>
                </AdminTableRow>
              </AdminTableHeader>
              <AdminTableBody>
                {filteredBookings.map((bk) => (
                  <AdminTableRow
                    key={bk.id}
                    isSelected={selectedIds.includes(bk.id)}
                  >
                    <AdminTableCell className="w-10">
                      <AdminCheckbox
                        aria-label={`Select exam session ${bk.bookingCode}`}
                        checked={selectedIds.includes(bk.id)}
                        onChange={() => onToggleSelectOne(bk.id)}
                      />
                    </AdminTableCell>

                    <AdminTableCell className="font-mono text-[11px] font-extrabold text-brand-700 whitespace-nowrap">
                      {bk.bookingCode}
                    </AdminTableCell>

                    <AdminTableCell className="whitespace-nowrap">
                      <div className="font-display text-xs font-extrabold text-brand-950">
                        {bk.clientName}
                      </div>
                      <div className="text-[11px] font-semibold text-brand-600">
                        Invigilator: {bk.artisanName}
                      </div>
                    </AdminTableCell>

                    <AdminTableCell>
                      <div className="font-display text-xs font-extrabold text-brand-950 max-w-[200px] truncate">
                        {bk.serviceTitle}
                      </div>
                    </AdminTableCell>

                    <AdminTableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-brand-950">
                        <Calendar className="h-3 w-3 text-brand-600" />
                        <span>{bk.scheduledDate}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-ink-secondary">
                        <Clock className="h-3 w-3 text-brand-500" />
                        <span>{bk.scheduledTime}</span>
                      </div>
                    </AdminTableCell>

                    <AdminTableCell className="whitespace-nowrap">
                      <div className="font-display text-xs sm:text-sm font-extrabold text-brand-950">
                        {formatCurrency(bk.agreedAmount)}
                      </div>
                    </AdminTableCell>

                    <AdminTableCell>
                      <AdminStatusPill status={bk.status} />
                    </AdminTableCell>

                    <AdminTableCell className="text-right whitespace-nowrap">
                      <AdminActionMenu
                        label={`Session ${bk.bookingCode}`}
                        ariaLabel={`Actions for exam session ${bk.bookingCode}`}
                        items={[
                          {
                            id: "edit",
                            label: "Edit Session in Form",
                            description: "Modify schedule, lab, or paper",
                            icon: <Pencil className="h-3.5 w-3.5" />,
                            variant: "primary",
                            onClick: () => onEditBooking(bk),
                          },
                          {
                            id: "accept",
                            label: "Mark Exam Ready",
                            description: "Confirm invigilator & hall setup",
                            icon: <CalendarCheck className="h-3.5 w-3.5" />,
                            disabled:
                              busyId === bk.id || bk.status === "accepted",
                            onClick: () =>
                              onUpdateBookingStatus(bk.id, {
                                status: "accepted",
                              }),
                          },
                          {
                            id: "in-progress",
                            label: "Start CBT Session",
                            description: "Candidates actively testing",
                            icon: <Play className="h-3.5 w-3.5" />,
                            disabled:
                              busyId === bk.id || bk.status === "in_progress",
                            onClick: () =>
                              onUpdateBookingStatus(bk.id, {
                                status: "in_progress",
                              }),
                          },
                          {
                            id: "complete",
                            label: "Mark Scripts Submitted",
                            description: "Finalize CBT attempt & sync scripts",
                            icon: <CheckCircle2 className="h-3.5 w-3.5" />,
                            disabled:
                              busyId === bk.id || bk.status === "completed",
                            onClick: () =>
                              onUpdateBookingStatus(bk.id, {
                                status: "completed",
                              }),
                          },
                          {
                            id: "escrow-funded",
                            label: "Mark Offline Cache Synced",
                            description: "Confirm local script backup",
                            icon: <Lock className="h-3.5 w-3.5" />,
                            disabled:
                              busyId === bk.id ||
                              bk.paymentStatus === "escrowed",
                            onClick: () =>
                              onUpdateBookingStatus(bk.id, {
                                paymentStatus: "escrowed",
                              }),
                          },
                          {
                            id: "cancel",
                            label: "Pause / Cancel Session",
                            description: "Halt active exam schedule",
                            icon: <XCircle className="h-3.5 w-3.5" />,
                            variant: "danger",
                            dividerBefore: true,
                            disabled:
                              busyId === bk.id || bk.status === "cancelled",
                            onClick: () =>
                              onUpdateBookingStatus(bk.id, {
                                status: "cancelled",
                              }),
                          },
                          {
                            id: "delete",
                            label: "Delete Exam Session",
                            description: "Remove session record",
                            icon: <Trash2 className="h-3.5 w-3.5" />,
                            variant: "danger",
                            onClick: () => onDeleteBooking(bk.id),
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

