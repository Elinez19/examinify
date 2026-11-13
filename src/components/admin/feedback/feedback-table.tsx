"use client";

import {
  CheckCircle2,
  Clock,
  Pencil,
  Plus,
  Star,
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
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import { CtaButton } from "@/components/landing/ui/cta-button";
import type { ReviewModerationStatus, ReviewRecord } from "./types";

export interface ReviewsTableProps {
  items: ReviewRecord[];
  selectedIds: string[];
  onToggleSelectAll: (checked: boolean) => void;
  onToggleSelectOne: (id: string) => void;
  onClearSelection: () => void;
  onVerifySelected: () => void;
  onDeleteSelected: () => void;
  onOpenCreate: () => void;
  onLoadIntoForm: (rev: ReviewRecord) => void;
  onUpdateStatus: (id: string, status: ReviewModerationStatus) => void;
  onDelete: (id: string) => void;
}

export function ReviewsTable({
  items,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectOne,
  onClearSelection,
  onVerifySelected,
  onDeleteSelected,
  onOpenCreate,
  onLoadIntoForm,
  onUpdateStatus,
  onDelete,
}: ReviewsTableProps) {
  const allSelected =
    items.length > 0 && items.every((r) => selectedIds.includes(r.id));
  const someSelected =
    items.some((r) => selectedIds.includes(r.id)) && !allSelected;

  return (
    <div className="mt-4">
      <AdminDataTable
        title="Student & Teacher CBT Feedback Ledger"
        subtitle="Verify post-exam feedback from CBT candidates and invigilators, and moderate visibility below."
        badge={`${items.length} Showing`}
        selectedCount={selectedIds.length}
        bulkActions={
          <>
            <CtaButton
              variant="secondary"
              size="xs"
              onClick={onVerifySelected}
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-accent-success" />
              <span>Verify Selected</span>
            </CtaButton>
            <CtaButton
              variant="secondary"
              size="xs"
              className="text-accent-error hover:border-accent-error/40 hover:text-accent-error"
              onClick={onDeleteSelected}
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
          <CtaButton variant="primary" size="xs" onClick={onOpenCreate}>
            <Plus className="h-3.5 w-3.5" />
            <span>Add Feedback</span>
          </CtaButton>
        }
      >
        {items.length === 0 ? (
          <AdminEmptyState
            title="No Matching Feedback"
            description="Try clearing your search query or add feedback in the inline form above."
            icon={<Star className="h-5 w-5 text-accent-gold" />}
          />
        ) : (
          <AdminTable>
            <AdminTableHeader>
              <AdminTableRow>
                <AdminTableHead className="w-10">
                  <AdminCheckbox
                    aria-label="Select all feedback"
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={(e) => onToggleSelectAll(e.target.checked)}
                  />
                </AdminTableHead>
                <AdminTableHead>Student &amp; Teacher</AdminTableHead>
                <AdminTableHead>Exam Paper</AdminTableHead>
                <AdminTableHead>Rating</AdminTableHead>
                <AdminTableHead>Status</AdminTableHead>
                <AdminTableHead className="text-right">Actions</AdminTableHead>
              </AdminTableRow>
            </AdminTableHeader>
            <AdminTableBody>
              {items.map((rev) => (
                <AdminTableRow
                  key={rev.id}
                  isSelected={selectedIds.includes(rev.id)}
                >
                  <AdminTableCell className="w-10">
                    <AdminCheckbox
                      aria-label={`Select feedback by ${rev.clientName}`}
                      checked={selectedIds.includes(rev.id)}
                      onChange={() => onToggleSelectOne(rev.id)}
                    />
                  </AdminTableCell>

                  <AdminTableCell className="whitespace-nowrap">
                    <div className="font-display text-xs font-extrabold text-brand-950">
                      {rev.clientName}
                    </div>
                    <div className="text-[11px] font-semibold text-brand-600">
                      Teacher: {rev.artisanName}
                    </div>
                  </AdminTableCell>

                  <AdminTableCell className="max-w-[240px]">
                    <div className="truncate font-display text-xs font-extrabold text-brand-950">
                      {rev.serviceTitle}
                    </div>
                  </AdminTableCell>

                  <AdminTableCell className="whitespace-nowrap">
                    <div className="inline-flex items-center gap-1 rounded-pill border border-brand-100 bg-surface-porcelain px-2.5 py-0.5 font-display text-xs font-extrabold text-brand-950 shadow-gloss-card">
                      <Star className="h-3 w-3 fill-accent-gold text-accent-gold" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </AdminTableCell>

                  <AdminTableCell>
                    <AdminStatusPill status={rev.status} />
                  </AdminTableCell>

                  <AdminTableCell className="text-right whitespace-nowrap">
                    <AdminActionMenu
                      label={`Feedback by ${rev.clientName}`}
                      ariaLabel={`Actions for feedback by ${rev.clientName}`}
                      items={[
                        {
                          id: "edit",
                          label: "Edit Feedback in Form",
                          description: "Modify rating, comment, or status",
                          icon: <Pencil className="h-3.5 w-3.5" />,
                          variant: "primary",
                          onClick: () => onLoadIntoForm(rev),
                        },
                        {
                          id: "publish",
                          label: "Verify & Approve",
                          description: "Mark feedback as verified",
                          icon: <CheckCircle2 className="h-3.5 w-3.5" />,
                          disabled: rev.status === "verified",
                          onClick: () => onUpdateStatus(rev.id, "verified"),
                        },
                        {
                          id: "pending",
                          label: "Move to Moderation",
                          description: "Hold for quality review",
                          icon: <Clock className="h-3.5 w-3.5" />,
                          disabled: rev.status === "pending",
                          onClick: () => onUpdateStatus(rev.id, "pending"),
                        },
                        {
                          id: "reject",
                          label: "Flag & Hide Feedback",
                          description: "Archive from exam report",
                          icon: <XCircle className="h-3.5 w-3.5" />,
                          variant: "danger",
                          dividerBefore: true,
                          disabled: rev.status === "rejected",
                          onClick: () => onUpdateStatus(rev.id, "rejected"),
                        },
                        {
                          id: "delete",
                          label: "Delete Feedback",
                          description: "Remove feedback permanently",
                          icon: <Trash2 className="h-3.5 w-3.5" />,
                          variant: "danger",
                          onClick: () => onDelete(rev.id),
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
  );
}

